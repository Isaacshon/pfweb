'use client'

import React from 'react'

type HeadingTag = 'h1' | 'h2' | 'h3'

type BrandHeadingProps = {
  tag?: HeadingTag
  text?: string
  lines?: string[]
  stackWords?: boolean
  className?: string
  lineClassName?: string
  accentLimit?: number
}

const accentClasses = ['text-brand-purple', 'text-brand-yellow']
const connectorWords = new Set(['&', 'and', 'with', 'to', 'of', '与', '和', '及', '的'])

const splitWords = (value: string) => value.trim().split(/[\s\u200B]+/u).filter(Boolean)

const isAccentable = (char: string) => /\p{L}/u.test(char)

const isSeparator = (value: string) => /^[\s\u200B]+$/u.test(value)

const renderSeparator = (value: string) => (/\s/u.test(value.replace(/\u200B/g, '')) ? ' ' : null)

const normalizeConnector = (value: string) => value.replace(/[^\p{L}&]/gu, '').toLowerCase()

const isConnectorWord = (value: string) => connectorWords.has(normalizeConnector(value))

const getMeaningfulWords = (line: string) =>
  line.trim().split(/[\s\u200B]+/u).filter((word) => {
    const chars = Array.from(word)
    return chars.some(isAccentable) && !isConnectorWord(word)
  })

const renderLine = (
  line: string,
  lineIndex: number,
  accentState: { count: number; limit: number },
) => {
  return line.trim().split(/([\s\u200B]+)/u).filter(Boolean).map((word, wordIndex) => {
    if (isSeparator(word)) {
      return <React.Fragment key={`${lineIndex}-${wordIndex}-separator`}>{renderSeparator(word)}</React.Fragment>
    }

    const chars = Array.from(word)
    const accentCharIndex = chars.findIndex(isAccentable)
    const shouldAccent = accentCharIndex >= 0
    const canAccent = shouldAccent && !isConnectorWord(word) && accentState.count < accentState.limit
    const accentClass = accentClasses[accentState.count % accentClasses.length]
    const prefix = shouldAccent ? chars.slice(0, accentCharIndex).join('') : word
    const accentedChar = shouldAccent ? chars[accentCharIndex] : ''
    const suffix = shouldAccent ? chars.slice(accentCharIndex + 1).join('') : ''

    if (canAccent) {
      accentState.count += 1
    }

    return (
      <React.Fragment key={`${lineIndex}-${wordIndex}-${word}`}>
        {prefix}
        {canAccent ? <span className={accentClass}>{accentedChar}</span> : accentedChar}
        {suffix}
      </React.Fragment>
    )
  })
}

export const BrandHeading = ({
  tag = 'h2',
  text = '',
  lines,
  stackWords = false,
  className = '',
  lineClassName = '',
  accentLimit = 2,
}: BrandHeadingProps) => {
  const sourceLines = lines ?? (stackWords ? splitWords(text) : text.split('\n'))
  const visibleLines = sourceLines.map((line) => line.trim()).filter(Boolean)
  const meaningfulWordCount = visibleLines.flatMap(getMeaningfulWords).length
  const effectiveAccentLimit = meaningfulWordCount >= 2 ? accentLimit : 0
  const accentState = { count: 0, limit: Math.max(0, effectiveAccentLimit) }

  return React.createElement(
    tag,
    { className },
    visibleLines.map((line, index) => (
      <React.Fragment key={`${index}-${line}`}>
        {index > 0 && <br />}
        <span className={lineClassName}>{renderLine(line, index, accentState)}</span>
      </React.Fragment>
    )),
  )
}
