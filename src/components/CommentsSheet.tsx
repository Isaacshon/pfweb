"use client"

import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface Comment {
  id: number
  user: string
  avatar?: string
  text: string
  date: string
  likes?: number
  userLiked?: boolean
  isPinned?: boolean
  isAuthor?: boolean
}

interface CommentsSheetProps {
  isOpen: boolean
  onClose: () => void
  comments: Comment[]
  onAddComment: (text: string) => void
  onToggleLike: (commentId: number) => void
  authorName: string
}

export function CommentsSheet({ isOpen, onClose, comments, onAddComment, onToggleLike, authorName }: CommentsSheetProps) {
  const { isDarkMode } = useTheme()
  const [inputText, setInputText] = useState('')

  const bgColor = isDarkMode ? 'bg-[#121212]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const subTextColor = isDarkMode ? 'text-zinc-500' : 'text-slate-400'
  const inputBg = isDarkMode ? 'bg-zinc-900' : 'bg-slate-100'

  if (!isOpen) return null

  const handleSend = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (inputText.trim()) {
      onAddComment(inputText)
      setInputText('')
    }
  }

  const handleReply = (userName: string) => {
    setInputText(`@${userName} `)
    // In a real app, we might focus the input here
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center pointer-events-none font-pretendard">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={`relative w-full max-w-md h-[85vh] ${bgColor} rounded-t-[32px] shadow-2xl pointer-events-auto animate-in slide-in-from-bottom duration-500 flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-full flex justify-center py-3">
          <div className={`w-9 h-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}></div>
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-zinc-500/5 flex items-center justify-center">
          <h2 className="text-sm font-black tracking-tight uppercase">Comments</h2>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-4 group">
              <img 
                src={c.avatar || "/images/PF app logo iphone.png"} 
                className="w-12 h-12 rounded-full border border-zinc-500/10 object-cover" 
                alt="" 
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black">{c.user}</span>
                  <span className={`text-[10px] ${subTextColor}`}>
                    {c.date} {c.isAuthor && <span className="ml-1 opacity-60">• 작성자</span>}
                  </span>
                  {c.isPinned && <span className="material-icons text-[14px] text-zinc-500 rotate-45">push_pin</span>}
                </div>
                <p className="text-sm leading-relaxed">{c.text}</p>
                <div className="pt-1">
                  <button 
                    type="button"
                    onClick={() => handleReply(c.user)}
                    className={`text-[10px] font-black ${subTextColor} hover:opacity-100 transition-opacity uppercase tracking-widest`}
                  >
                    답글 달기
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 min-w-[30px] pt-1">
                <button 
                  type="button"
                  onClick={() => onToggleLike(c.id)}
                  className={`material-icons text-[20px] transition-all active:scale-125 ${c.userLiked ? 'text-red-500' : subTextColor}`}
                >
                  {c.userLiked ? 'favorite' : 'favorite_border'}
                </button>
                {(c.likes ?? 0) > 0 && <span className={`text-[10px] font-bold ${subTextColor}`}>{c.likes}</span>}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
              <span className="material-icons text-5xl">chat_bubble_outline</span>
              <p className="text-xs font-black uppercase tracking-widest">Share your first light</p>
            </div>
          )}
        </div>

        {/* Quick Stickers */}
        <div className="px-6 py-4 flex justify-around border-t border-zinc-500/5 overflow-x-auto no-scrollbar">
          {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map(s => (
            <button 
              key={s} 
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInputText(prev => prev + s); }}
              className="text-2xl hover:scale-125 transition-transform active:scale-90 p-2"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Area - Instagram Reference Style */}
        <div className="px-6 pb-12 pt-4 border-t border-zinc-500/5">
          <div className="flex items-center gap-4">
            <div className={`flex-1 flex items-center gap-3 h-14 px-6 rounded-full border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`${authorName}님에게 댓글 추가...`}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:opacity-30"
              />
              {inputText.trim() && (
                <button 
                  type="button"
                  onClick={(e) => handleSend(e)}
                  className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg active:scale-90 transition-all animate-in fade-in zoom-in duration-300"
                >
                  <span className="material-icons text-2xl">arrow_upward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
