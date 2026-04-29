"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

export default function ProfilePage() {
  const { isDarkMode } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  
  // Signup States
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [nicknameStatus, setNicknameStatus] = useState<{ loading: boolean, available: boolean | null, message: string }>({ loading: false, available: null, message: '' })
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null)
  const [signupPath, setSignupPath] = useState('Invitation')
  const [signupPathOther, setSignupPathOther] = useState('')
  const [denomination, setDenomination] = useState('None')
  const [denominationOther, setDenominationOther] = useState('')

  // Login States
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPw, setLoginPw] = useState('')

  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly')

  // Attendance States
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [myAttendances, setMyAttendances] = useState<any[]>([])
  const [lobbyUsers, setLobbyUsers] = useState<{id: string, nickname: string}[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const todayDateString = mounted ? new Date().toISOString().split('T')[0] : ''
  const qrUrl = mounted ? `${window.location.origin}/app/attendance?date=${todayDateString}` : ''

  const PROFANITY_LIST = ['씨발', '병신', '존나', 'fuck', 'shit', 'bitch', 'ㅅㅂ', 'ㅄ', 'ㅈㄴ']

  useEffect(() => {
    // Clear legacy mock data
    localStorage.removeItem('pf_users')
    localStorage.removeItem('pf_db_posts_v3')

    // Load remembered credentials
    const remEmail = localStorage.getItem('pf_rem_email')
    const remPw = localStorage.getItem('pf_rem_pw')
    if (remEmail) setLoginEmail(remEmail)
    if (remPw) setLoginPw(remPw)

    // Step 1: INSTANT load from localStorage (no async wait)
    const savedUser = localStorage.getItem('pf_current_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('pf_current_user')
      }
    }
    // Show UI immediately - no waiting for server
    setIsLoaded(true)
    setMounted(true)

    // Step 2: BACKGROUND verify session with Supabase
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          const combinedUser = { ...session.user, ...(profile || {}) }
          setUser(combinedUser)
          localStorage.setItem('pf_current_user', JSON.stringify(combinedUser))
        } else if (!savedUser) {
          // Only clear user if we didn't have one cached AND server says no session
          setUser(null)
          localStorage.removeItem('pf_current_user')
        }
      } catch (err) {
        console.error("Auth verify error:", err)
        // Keep cached user on network error - don't kick them out
      }
    }

    verifySession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== 'INITIAL_SESSION') {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
          const combinedUser = { ...session.user, ...(profile || {}) }
          setUser(combinedUser)
          localStorage.setItem('pf_current_user', JSON.stringify(combinedUser))
        } else {
          setUser(null)
          localStorage.removeItem('pf_current_user')
        }
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch Attendance
  useEffect(() => {
    if (user) {
      const fetchAttendance = async () => {
        const { data } = await supabase
          .from('attendance')
          .select('*')
          .eq('user_id', user.id)
          .order('service_date', { ascending: false })
        if (data) setMyAttendances(data)
      }
      fetchAttendance()
    }
  }, [user])

  // Live QR Lobby Realtime
  useEffect(() => {
    if (!isQrModalOpen || !todayDateString) {
      setLobbyUsers([])
      return
    }

    let isMountedLobby = true

    const fetchInitialLobby = async () => {
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('user_id')
        .eq('service_date', todayDateString)

      if (attendanceData && attendanceData.length > 0) {
        const userIds = attendanceData.map(a => a?.user_id).filter(Boolean)
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, nickname')
            .in('id', userIds)
          if (profiles && isMountedLobby) {
            setLobbyUsers(profiles)
          }
        }
      }
    }

    fetchInitialLobby()

    const channel = supabase.channel('lobby-updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'attendance', 
        filter: `service_date=eq.${todayDateString}` 
      }, async (payload) => {
        const newUserId = payload.new.user_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, nickname')
          .eq('id', newUserId)
          .single()
        
        if (profile && isMountedLobby) {
          setLobbyUsers(prev => {
            if (prev.some(u => u.id === profile.id)) return prev;
            return [...prev, profile]
          })
        }
      })
      .subscribe()

    return () => {
      isMountedLobby = false
      supabase.removeChannel(channel)
    }
  }, [isQrModalOpen, todayDateString])

  // Real-time Password Match Check
  useEffect(() => {
    if (!password && !confirmPassword) {
      setPasswordMatch(null)
    } else {
      setPasswordMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  // Real-time Nickname Availability Check
  useEffect(() => {
    if (nickname.length < 2) {
      setNicknameStatus({ loading: false, available: null, message: '' })
      return
    }

    if (PROFANITY_LIST.some(word => nickname.toLowerCase().includes(word))) {
      setNicknameStatus({ loading: false, available: false, message: 'Inappropriate nickname.' })
      return
    }

    const timer = setTimeout(async () => {
      setNicknameStatus(prev => ({ ...prev, loading: true }))
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle()

      if (error) {
        setNicknameStatus({ loading: false, available: null, message: 'Check failed' })
      } else if (data) {
        setNicknameStatus({ loading: false, available: false, message: 'Already taken' })
      } else {
        setNicknameStatus({ loading: false, available: true, message: 'Available!' })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [nickname])

  const handleSignup = async () => {
    if (!email || !password || !passwordMatch || !nicknameStatus.available) {
      alert("Please check all fields and ensure nickname is available.")
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: email.split('@')[0], 
            nickname: nickname,
            first_name: firstName,
            last_name: lastName,
            signup_path: signupPath === 'Other' ? signupPathOther : signupPath,
            denomination: denomination === 'Other' ? denominationOther : denomination,
          }
        }
      })

      if (error) {
        alert(error.message)
      } else if (data.user) {
        // Automatic Login & Save credentials
        localStorage.setItem('pf_rem_email', email)
        localStorage.setItem('pf_rem_pw', password)
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()
        
        setUser({ ...data.user, ...(profile || {}) })
        alert("Welcome to PassionFruits!")
      }
    } catch (err: any) {
      alert("Signup failed: " + err.message)
    }
  }

  const handleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPw
      })

      if (error) {
        alert(error.message)
      } else if (data.user) {
        // Remember credentials
        localStorage.setItem('pf_rem_email', loginEmail)
        localStorage.setItem('pf_rem_pw', loginPw)

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()
        
        const combinedUser = { ...data.user, ...(profile || {}) }
        setUser(combinedUser)
        localStorage.setItem('pf_current_user', JSON.stringify(combinedUser))
      }
    } catch (err: any) {
      alert("Login failed: " + err.message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('pf_rem_pw') // Clear password on logout for security if you prefer
    setUser(null)
  }

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'
  const inputBg = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'

  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center p-8 text-center`}>
        <div className="w-12 h-12 border-4 border-[#9a78b4] border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Loading Profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} px-8 pt-24 pb-48 flex flex-col animate-in fade-in duration-700 overflow-y-auto no-scrollbar`}>
        <div className="flex flex-col items-center mb-12">
          <img src="/images/PF app logo iphone.png" className="w-24 h-24 mb-6" alt="PF" />
          <h1 className="text-3xl font-black tracking-tighter mb-2">PASSIONFRUITS</h1>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Connect with your faith</p>
        </div>

        <div className="flex gap-4 mb-10">
          <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${authMode === 'login' ? accentBg : 'opacity-30'}`}>Login</button>
          <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? accentBg : 'opacity-30'}`}>Signup</button>
        </div>

        {authMode === 'login' ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <input type="email" placeholder="EMAIL" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border`} />
            <input type="password" placeholder="PASSWORD" value={loginPw} onChange={(e)=>setLoginPw(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border`} />
            <button onClick={handleLogin} disabled={isLoggingIn} className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-widest ${accentBg} shadow-xl shadow-current/20 active:scale-95 transition-all mt-6 flex items-center justify-center gap-2 ${isLoggingIn ? 'opacity-70' : ''}`}>
              {isLoggingIn && <span className="material-icons text-sm animate-spin">sync</span>}
              {isLoggingIn ? 'Logging In...' : 'Log In'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] px-2 no-scrollbar animate-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="FIRST NAME" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold text-sm ${inputBg} border`} />
              <input type="text" placeholder="LAST NAME" value={lastName} onChange={(e)=>setLastName(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold text-sm ${inputBg} border`} />
            </div>
            <input type="email" placeholder="EMAIL" value={email} onChange={(e)=>setEmail(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold text-sm ${inputBg} border`} />
            <div className="space-y-2">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest pl-2">Password</p>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border border-zinc-500/10`} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest pl-2">Confirm Password</p>
              <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border ${passwordMatch === null ? 'border-zinc-500/10' : (passwordMatch ? 'border-emerald-500/50' : 'border-red-500/50')}`} />
              {passwordMatch !== null && (
                <p className={`text-[9px] font-bold uppercase tracking-wider pl-4 ${passwordMatch ? 'text-emerald-500' : 'text-red-500'}`}>
                  {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest pl-2">Nickname</p>
              <input type="text" placeholder="Display name" value={nickname} onChange={(e)=>setNickname(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border ${nicknameStatus.available === null ? 'border-zinc-500/10' : (nicknameStatus.available ? 'border-emerald-500/50' : 'border-red-500/50')}`} />
              {nicknameStatus.message && (
                <p className={`text-[9px] font-bold uppercase tracking-wider pl-4 ${nicknameStatus.available ? 'text-emerald-500' : 'text-red-500'}`}>
                  {nicknameStatus.message}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest pl-2">Signup Path</p>
              <div className="flex flex-wrap gap-2">
                {['Invitation', 'Worship', 'YouTube', 'Instagram', 'Other'].map(p => (
                  <button key={p} onClick={()=>setSignupPath(p)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${signupPath === p ? accentBg : inputBg + ' border opacity-40'}`}>{p}</button>
                ))}
              </div>
              {signupPath === 'Other' && (
                <input type="text" placeholder="Specify Path" value={signupPathOther} onChange={(e)=>setSignupPathOther(e.target.value)} className={`w-full p-4 rounded-xl outline-none font-bold text-sm ${inputBg} border animate-in zoom-in-95 duration-300`} />
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest pl-2">Denomination</p>
              <div className="flex flex-wrap gap-2">
                {['Presbyterian', 'Methodist', 'Baptist', 'Pentecostal', 'Holiness', 'Anglican', 'Reformed', 'None', 'Private', 'Other'].map(d => (
                  <button key={d} onClick={()=>setDenomination(d)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${denomination === d ? accentBg : inputBg + ' border opacity-40'}`}>{d}</button>
                ))}
              </div>
              {denomination === 'Other' && (
                <input type="text" placeholder="Specify Denomination" value={denominationOther} onChange={(e)=>setDenominationOther(e.target.value)} className={`w-full p-4 rounded-xl outline-none font-bold text-sm ${inputBg} border animate-in zoom-in-95 duration-300`} />
              )}
            </div>
            
            <button onClick={handleSignup} className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-widest ${accentBg} shadow-xl shadow-current/20 active:scale-95 transition-all mt-6 mb-10`}>Create Account</button>
          </div>
        )}
      </div>
    )
  }

  // Calendar setup - ensure currentDate is always valid
  let currentDate: Date;
  try {
    currentDate = mounted ? new Date() : new Date('2024-01-01T12:00:00Z')
    if (isNaN(currentDate.getTime())) {
      currentDate = new Date()
    }
  } catch (e) {
    currentDate = new Date()
  }
  const firstDay = startOfMonth(currentDate)
  const lastDay = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay })
  const startOffset = firstDay.getDay() // 0 = Sunday
  const calendarPadding = Array.from({ length: startOffset }).map((_, i) => i)

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-52 transition-colors duration-500 animate-in fade-in duration-700`}>
      {/* Profile Header */}
      <section className="px-8 pt-20 pb-12 flex flex-col items-center text-center">
        <div className={`relative w-32 h-32 rounded-[56px] overflow-hidden border-4 ${isDarkMode ? 'border-zinc-900 shadow-brand-yellow/5' : 'border-slate-50 shadow-brand-purple/5'} shadow-2xl mb-8`}>
          <img src="/images/PF app logo iphone.png" alt="PF" className="w-full h-full object-contain scale-110" />
        </div>
        <h1 className="text-4xl font-black font-plus-jakarta tracking-tighter mb-2">{(user?.nickname || user?.username || user?.email?.split('@')[0] || 'Member')}</h1>
        <div className="flex flex-col items-center gap-2">
          {user.role === 'leader' && (
            <div className={`px-4 py-1 rounded-full ${isDarkMode ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple'} border flex items-center gap-2 shadow-lg`}>
              <span className="material-icons text-[12px]">verified</span>
              <span className="text-[10px] font-black uppercase tracking-widest">PF Leader</span>
            </div>
          )}
          {user.role === 'worship_team' && (
            <div className={`px-4 py-1 rounded-full ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'} border flex items-center gap-2`}>
              <span className="material-icons text-[12px]">music_note</span>
              <span className="text-[10px] font-black uppercase tracking-widest">PF Worship Team</span>
            </div>
          )}
          {user.role === 'user' && (
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-brand-yellow' : 'bg-brand-purple'}`}></span>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">PassionFruits Member</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="mt-6 text-[10px] font-black opacity-20 uppercase tracking-[0.4em] hover:opacity-100 transition-opacity">Logout Session</button>
      </section>

      {/* Worship Team Mode Status - Automatically active for Leader & Worship Team */}
      {(user.role === 'leader' || user.role === 'worship_team') && (
        <section className="px-8 mb-12">
          <div className={`w-full py-6 rounded-[32px] border flex flex-col items-center gap-2 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'} relative overflow-hidden`}>
            {user.role === 'leader' && (
              <button 
                onClick={() => setIsQrModalOpen(true)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#9a78b4] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all z-10"
                title="Generate Attendance QR"
              >
                <span className="material-icons text-sm">qr_code_scanner</span>
              </button>
            )}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accentBg} mb-1`}>
              <span className="material-icons">music_note</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Worship Team Mode</h3>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Successfully Activated
            </p>
          </div>
        </section>
      )}

      {/* Invite Action */}
      <section className="px-8 mb-12">
        <Link 
          href="/app/download"
          className={`w-full py-6 rounded-[32px] flex items-center justify-between px-8 transition-all active:scale-[0.98] ${isDarkMode ? 'bg-zinc-900 border-brand-yellow/20 shadow-brand-yellow/5' : 'bg-brand-purple/5 border-brand-purple/10 shadow-brand-purple/5'} border shadow-xl`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accentBg}`}>
              <span className="material-icons text-xl">qr_code_2</span>
            </div>
            <p className="text-sm font-black tracking-tight">Invite Friends to PassionFruits</p>
          </div>
          <span className={`material-icons ${accentColor}`}>arrow_forward</span>
        </Link>
      </section>

      {/* Activity Analytics */}
      <section className="px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black font-plus-jakarta tracking-tight">Activity Analysis</h2>
          <div className="flex gap-2">
            {['Weekly', 'Monthly', 'Yearly'].map((p) => (
              <button key={p} onClick={() => setPeriod(p as any)} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${period === p ? accentColor : 'text-slate-300'}`}>{p}</button>
            ))}
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-white'} border rounded-[48px] p-8`}>
          <div className="flex items-end justify-between h-32 gap-2 mb-6">
            {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className={`w-full rounded-2xl transition-all duration-700 ${period === 'Weekly' ? (i === 3 ? accentBg : (isDarkMode ? 'bg-zinc-800' : 'bg-white')) : accentBg} opacity-80`} style={{ height: `${h}%` }}></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-slate-100/10">
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Time</p><p className="text-xl font-black font-space-grotesk tracking-tight">24h 15m</p></div>
            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Growth</p><p className={`text-xl font-black font-space-grotesk tracking-tight ${isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'}`}>+12%</p></div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="px-8 grid grid-cols-2 gap-4 mb-12">
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border p-8 rounded-[48px] flex flex-col gap-1`}><p className="text-3xl font-black font-space-grotesk tracking-tighter">{myAttendances.length}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Badges<br/>Collected</p></div>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border p-8 rounded-[48px] flex flex-col gap-1`}><p className="text-3xl font-black font-space-grotesk tracking-tighter">85%</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Worship<br/>Attendance</p></div>
      </section>

      {/* Attendance & Badges Section */}
      <section className="px-8 mb-12">
        <h2 className="text-xl font-black font-plus-jakarta tracking-tight mb-6">Attendance & Badges</h2>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-white'} border rounded-[48px] p-8 flex flex-col gap-8`}>
          
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-widest opacity-50">{format(currentDate, 'MMMM yyyy')}</p>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[9px] font-black uppercase tracking-widest opacity-30">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarPadding.map(p => <div key={`pad-${p}`} />)}
              {daysInMonth.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const hasAttended = myAttendances.some(a => a?.service_date === dateStr)
                return (
                  <div key={dateStr} className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold ${hasAttended ? 'bg-gradient-to-tr from-yellow-500 to-[#9a78b4] text-white shadow-md' : 'text-slate-400 opacity-60'}`}>
                    {format(day, 'd')}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Badges Collection */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">My Collection</p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {myAttendances.length === 0 ? (
                <div className="w-full text-center py-6 border-2 border-dashed border-zinc-500/20 rounded-[24px]">
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest">No Badges Yet</p>
                </div>
              ) : (
                myAttendances.map(record => (
                  <div key={record.id} className="min-w-[100px] flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 to-[#9a78b4] flex items-center justify-center shadow-lg relative border-2 border-white/10">
                      <span className="material-icons text-3xl text-white drop-shadow-md">workspace_premium</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-50">{record.service_date ? record.service_date.substring(5) : 'Unknown'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Modal for Leaders */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsQrModalOpen(false)}>
          <div className={`p-8 rounded-[40px] max-w-sm w-full border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} flex flex-col items-center gap-6 shadow-2xl relative`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-500/10 flex items-center justify-center"><span className="material-icons text-sm">close</span></button>
            
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black tracking-tight">Today's Attendance</h2>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a78b4]">{todayDateString}</p>
            </div>

            <div className="p-3 bg-white rounded-3xl shadow-inner border-4 border-slate-100 flex-shrink-0">
              <QRCodeSVG value={qrUrl} size={160} level="H" includeMargin={false} />
            </div>
            
            {/* Live Lobby Section */}
            <div className={`w-full rounded-[24px] p-4 min-h-[140px] flex flex-wrap gap-2 content-start border-2 border-dashed ${isDarkMode ? 'bg-zinc-800/30 border-zinc-700/50' : 'bg-slate-50 border-slate-200'} relative`}>
              <p className="w-full text-center text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Lobby ({lobbyUsers.length})
              </p>
              {lobbyUsers.length === 0 ? (
                <p className="w-full text-center text-xs opacity-40 font-bold py-6">Waiting for scans...</p>
              ) : (
                lobbyUsers.map((user) => (
                  <div key={user.id} className="animate-in zoom-in duration-500 fade-in slide-in-from-bottom-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-yellow to-[#9a78b4] text-white text-xs font-black tracking-tight shadow-md">
                    {user.nickname || 'Unknown'}
                  </div>
                ))
              )}
            </div>

            <div className="w-full flex gap-2">
              <button onClick={() => {
                navigator.clipboard.writeText(qrUrl)
                alert("Link copied!")
              }} className={`flex-1 py-3 px-4 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-plus-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; } .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; } `}</style>
    </div>
  )
}
