"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { isDarkMode } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  
  // Signup States
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
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
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')

  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly')
  const [isPraiseTeamMode, setIsPraiseTeamMode] = useState(false)

  const PROFANITY_LIST = ['씨발', '병신', '존나', 'fuck', 'shit', 'bitch', 'ㅅㅂ', 'ㅄ', 'ㅈㄴ']

  useEffect(() => {
    // Clear legacy mock data for clean start
    localStorage.removeItem('pf_users')
    localStorage.removeItem('pf_db_posts_v3')
    localStorage.removeItem('pf_auth_user')

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Fetch profile to get role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser({ ...session.user, ...profile })
        } else {
          setUser(session.user)
        }
      }
      setIsLoaded(true)
    }
    checkUser()
  }, [])

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
    if (!username || !password || !passwordMatch || !nicknameStatus.available) {
      alert("Please check all fields and ensure nickname is available.")
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: `${username}@pf.com`, // Mocking email with username
      password: password,
      options: {
        data: {
          username: username,
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
    } else {
      alert("Signup successful! Please login.")
      setAuthMode('login')
    }
  }

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${loginId}@pf.com`,
      password: loginPw
    })

    if (error) {
      alert(error.message)
    } else if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      setUser({ ...data.user, ...profile })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'
  const inputBg = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'

  if (!isLoaded) return null

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
            <input type="text" placeholder="ID" value={loginId} onChange={(e)=>setLoginId(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border`} />
            <input type="password" placeholder="PASSWORD" value={loginPw} onChange={(e)=>setLoginPw(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${inputBg} border`} />
            <button onClick={handleLogin} className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-widest ${accentBg} shadow-xl shadow-current/20 active:scale-95 transition-all mt-6`}>Log In</button>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] px-2 no-scrollbar animate-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="FIRST NAME" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold text-sm ${inputBg} border`} />
              <input type="text" placeholder="LAST NAME" value={lastName} onChange={(e)=>setLastName(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold text-sm ${inputBg} border`} />
            </div>
            <input type="text" placeholder="ID" value={username} onChange={(e)=>setUsername(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold text-sm ${inputBg} border`} />
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

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-52 transition-colors duration-500 animate-in fade-in duration-700`}>
      {/* Profile Header */}
      <section className="px-8 pt-20 pb-12 flex flex-col items-center text-center">
        <div className={`relative w-32 h-32 rounded-[56px] overflow-hidden border-4 ${isDarkMode ? 'border-zinc-900 shadow-brand-yellow/5' : 'border-slate-50 shadow-brand-purple/5'} shadow-2xl mb-8`}>
          <img src="/images/PF app logo iphone.png" alt="PF" className="w-full h-full object-contain scale-110" />
        </div>
        <h1 className="text-4xl font-black font-plus-jakarta tracking-tighter mb-2">{user.nickname || user.username}</h1>
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

      {/* Praise Team Mode Toggle - Only for authorized users (Leader & Worship Team) */}
      {(user.role === 'leader' || user.role === 'worship_team') && (
        <section className="px-8 mb-12">
          <button 
            onClick={() => setIsPraiseTeamMode(!isPraiseTeamMode)}
            className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              isPraiseTeamMode 
                ? `${accentBg} shadow-xl shadow-current/20 scale-[0.98]` 
                : `${isDarkMode ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-slate-50 text-slate-400 border-slate-100'} border`
            }`}
          >
            <span className="material-icons text-lg">{isPraiseTeamMode ? 'music_video' : 'queue_music'}</span>
            {isPraiseTeamMode ? 'Praise Team Mode Active' : 'Activate Praise Team Mode'}
          </button>
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
      <section className="px-8 grid grid-cols-2 gap-4">
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border p-8 rounded-[48px] flex flex-col gap-1`}><p className="text-3xl font-black font-space-grotesk tracking-tighter">12</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Shared<br/>Meditations</p></div>
        <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border p-8 rounded-[48px] flex flex-col gap-1`}><p className="text-3xl font-black font-space-grotesk tracking-tighter">85%</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Worship<br/>Attendance</p></div>
      </section>

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-plus-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; } .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; } `}</style>
    </div>
  )
}
