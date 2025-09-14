'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts'
import { AuthScreen } from '@/components/auth/AuthScreen'

export default function RootPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 사용자가 로그인되어 있으면 /home으로 리다이렉트
    if (user && !loading) {
      router.replace('/home')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인하지 않은 사용자는 인증 화면 표시
  if (!user) {
    return <AuthScreen />
  }

  // 로그인된 사용자는 리다이렉트 중 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">홈으로 이동 중...</p>
      </div>
    </div>
  )
}