'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth, useLanguage } from '@/lib/contexts'
import { Calendar as CalendarIcon, User } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black">{user?.display_name || '이름 없음'}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-600 text-sm">{t('dashboard.userId')}</p>
                <p className="font-medium text-black">{user?.user_id || t('dashboard.noId')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-600 text-sm">가입일</p>
                <p className="font-medium text-black">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-600 text-sm">마지막 로그인</p>
                <p className="font-medium text-black">
                  {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString('ko-KR') : '정보 없음'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
