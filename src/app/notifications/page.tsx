'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">알림</h2>
          <p className="text-gray-600">최근 30일간의 알림이 표시됩니다.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-black">새로운 일정이 등록되었습니다</h4>
                <p className="text-gray-600 text-sm">팀 미팅이 추가되었습니다.</p>
                <p className="text-primary text-xs mt-1">2024-03-21 14:30</p>
              </div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-black">일정 알림</h4>
                <p className="text-gray-600 text-sm">내일 오전 10시 회의가 있습니다.</p>
                <p className="text-primary text-xs mt-1">2024-03-21 12:00</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-black">봉사 참여 확인</h4>
                <p className="text-gray-600 text-sm">강남역 공개 증거 봉사에 참여하시겠습니까?</p>
                <p className="text-primary text-xs mt-1">2024-03-20 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
