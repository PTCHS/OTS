'use client'

import React from 'react'
import { useLanguage } from '@/lib/contexts'
import { Language } from '@/lib/i18n'
import { Select } from './Select'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' }
  ]

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
  }

  return (
    <div className="z-50">
      <Select
        value={language}
        onChange={handleLanguageChange}
        options={languageOptions}
        className="w-26"
      />
    </div>
  )
}
