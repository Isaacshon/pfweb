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
  isPinned?: boolean
  isAuthor?: boolean
}

interface CommentsSheetProps {
  isOpen: boolean
  onClose: () => void
  comments: Comment[]
  onAddComment: (text: string) => void
  authorName: string
}

export function CommentsSheet({ isOpen, onClose, comments, onAddComment, authorName }: CommentsSheetProps) {
  const { isDarkMode } = useTheme()
  const [inputText, setInputText] = useState('')

  const bgColor = isDarkMode ? 'bg-[#121212]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const subTextColor = isDarkMode ? 'text-zinc-500' : 'text-slate-400'
  const inputBg = isDarkMode ? 'bg-zinc-900' : 'bg-slate-100'

  if (!isOpen) return null

  const handleSend = () => {
    if (inputText.trim()) {
      onAddComment(inputText)
      setInputText('')
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center pointer-events-none">
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
          <h2 className="text-sm font-black tracking-tight">댓글</h2>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-4 group">
              <img 
                src={c.avatar || "/images/PF app logo iphone.png"} 
                className="w-10 h-10 rounded-full border border-zinc-500/10 object-cover" 
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
                  <button className={`text-[10px] font-black ${subTextColor} hover:opacity-100 transition-opacity`}>답글 달기</button>
                </div>
                
                {/* Nested Replies Mock */}
                {c.id === 101 && (
                  <div className="pt-4 flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-zinc-500/20"></div>
                    <button className={`text-[10px] font-black ${subTextColor}`}>답글 1개 더 보기</button>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className={`material-icons text-[18px] ${c.likes ? 'text-red-500' : subTextColor}`}>favorite_border</button>
                {c.likes && <span className={`text-[10px] font-bold ${subTextColor}`}>{c.likes}</span>}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
              <span className="material-icons text-5xl">chat_bubble_outline</span>
              <p className="text-xs font-black uppercase tracking-widest">첫 댓글을 남겨보세요</p>
            </div>
          )}
        </div>

        {/* Quick Stickers */}
        <div className="px-6 py-4 flex justify-around border-t border-zinc-500/5 overflow-x-auto no-scrollbar">
          {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map(s => (
            <button 
              key={s} 
              onClick={() => setInputText(prev => prev + s)}
              className="text-2xl hover:scale-125 transition-transform active:scale-90"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-6 pb-10 pt-2 border-t border-zinc-500/5">
          <div className="flex items-center gap-4">
            <img src="/images/PF app logo iphone.png" className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className={`flex-1 flex items-center gap-3 h-12 px-5 rounded-full ${inputBg}`}>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`${authorName}님에게 댓글 추가...`}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:opacity-40"
              />
              <button className={`material-icons text-[20px] ${subTextColor} border border-zinc-500/30 rounded px-1 text-[12px] font-bold`}>GIF</button>
            </div>
            {inputText.trim() && (
              <button 
                onClick={handleSend}
                className="text-brand-purple font-black text-sm pr-2 animate-in fade-in zoom-in duration-300"
              >
                보내기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
