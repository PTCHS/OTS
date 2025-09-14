'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Language, useTranslation } from './i18n'
import { User } from './supabase'

// Language Context
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  getMonths: () => string[]
  getDays: () => string[]
  getYearSuffix: () => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko')
  const [isClient, setIsClient] = useState(false)
  const { t, getMonths, getDays, getYearSuffix } = useTranslation(language)

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['ko', 'zh', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (isClient) {
      localStorage.setItem('language', lang)
    }
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      getMonths,
      getDays,
      getYearSuffix
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Auth Context
interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('currentUser')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    if (isClient) {
      localStorage.setItem('currentUser', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    if (isClient) {
      localStorage.removeItem('currentUser')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
