'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/lib/contexts'
import { LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { logout } = useAuth()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">설정</h2>
          <p className="text-gray-600">앱 설정을 관리하세요.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-4 p-6 text-left hover:bg-gray-50 rounded-2xl"
          >
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-red-500 font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
