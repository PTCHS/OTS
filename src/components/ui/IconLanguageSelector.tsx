'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/lib/contexts'
import { Language } from '@/lib/i18n'
import { Globe, ChevronDown } from 'lucide-react'

export function IconLanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { 
      code: 'ko' as Language, 
      name: '한국어',
      flag: '🇰🇷'
    },
    { 
      code: 'zh' as Language, 
      name: '中文',
      flag: '🇨🇳'
    },
    { 
      code: 'en' as Language, 
      name: 'English',
      flag: '🇺🇸'
    }
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 min-w-[140px] overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  language === lang.code ? 'bg-primary/5 text-primary' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-gray-500">{lang.code.toUpperCase()}</span>
                </div>
                {language === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
