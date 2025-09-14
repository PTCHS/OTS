'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { ResetPasswordForm } from './ResetPasswordForm'
import { AddCongregationForm } from './AddCongregationForm'

type AuthMode = 'login' | 'signup' | 'reset' | 'addCongregation'

export function AuthScreen() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>('login')

  // URL 파라미터에서 모드 읽기
  useEffect(() => {
    const modeParam = searchParams.get('mode') as AuthMode
    if (modeParam && ['login', 'signup', 'reset', 'addCongregation'].includes(modeParam)) {
      setMode(modeParam)
    } else if (!modeParam) {
      setMode('login')
    }
  }, [searchParams])

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      const currentMode = searchParams.get('mode') as AuthMode
      if (currentMode && ['login', 'signup', 'reset', 'addCongregation'].includes(currentMode)) {
        setMode(currentMode)
      } else {
        setMode('login')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [searchParams])

  // 모드 변경 시 URL 업데이트
  const handleModeChange = (newMode: AuthMode) => {
    if (newMode === mode) return // 같은 모드면 아무것도 하지 않음
    
    setMode(newMode)
    const url = newMode === 'login' ? '/' : `/?mode=${newMode}`
    
    // pushState를 사용하여 히스토리에 추가
    window.history.pushState({ mode: newMode }, '', url)
  }

  const renderCurrentForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => handleModeChange('signup')}
            onSwitchToReset={() => handleModeChange('reset')}
            onSwitchToAddCongregation={() => handleModeChange('addCongregation')}
          />
        )
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => handleModeChange('login')}
          />
        )
      case 'reset':
        return (
          <ResetPasswordForm
            onBackToLogin={() => handleModeChange('login')}
          />
        )
      case 'addCongregation':
        return (
          <AddCongregationForm
            onBackToLogin={() => handleModeChange('login')}
          />
        )
      default:
        return (
          <LoginForm
            onSwitchToSignup={() => handleModeChange('signup')}
            onSwitchToReset={() => handleModeChange('reset')}
            onSwitchToAddCongregation={() => handleModeChange('addCongregation')}
          />
        )
    }
  }

  return renderCurrentForm()
}