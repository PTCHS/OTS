'use client'

import React, { useEffect } from 'react'
import { useLanguage } from '@/lib/contexts'

interface FontProviderProps {
  children: React.ReactNode
}

export function FontProvider({ children }: FontProviderProps) {
  const { language } = useLanguage()

  useEffect(() => {
    // 기존 글꼴 클래스 제거
    document.body.classList.remove('font-korean', 'font-chinese', 'font-english')
    
    // 언어에 따른 글꼴 클래스 추가
    switch (language) {
      case 'ko':
        document.body.classList.add('font-korean')
        break
      case 'zh':
        document.body.classList.add('font-chinese')
        break
      case 'en':
        document.body.classList.add('font-english')
        break
      default:
        document.body.classList.add('font-korean') // 기본값은 한국어
        break
    }
  }, [language])

  return <>{children}</>
}