'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MapPin, ChevronRight, Bell } from 'lucide-react'

interface AssignedTerritory {
  id: string
  name: string
  address: string
  dueDate: string
}

export default function TerritoryPage() {
  // 임시 구역 데이터
  const assignedTerritories: AssignedTerritory[] = [
    {
      id: '1',
      name: '강남구 A구역',
      address: '서울시 강남구 역삼동',
      dueDate: '2024.03.25',
    },
    {
      id: '2',
      name: '서초구 B구역',
      address: '서울시 서초구 서초동',
      dueDate: '2024.03.28',
    },
    {
      id: '3',
      name: '송파구 C구역',
      address: '서울시 송파구 잠실동',
      dueDate: '2024.03.30',
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">구역 관리</h2>
          <p className="text-gray-600">할당된 구역과 관련 정보를 확인하세요.</p>
        </div>

        {/* 할당된 구역 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {assignedTerritories.map((territory) => (
            <div key={territory.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{territory.name}</h3>
                    <p className="text-sm text-gray-600">{territory.address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">마감일</span>
                  <span className="text-sm font-medium text-black">{territory.dueDate}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">진행률</span>
                  <span className="text-xs font-medium text-primary">65%</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                세부사항 보기
              </button>
            </div>
          ))}
        </div>

        {/* 구역 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">총 구역</h3>
                <p className="text-2xl font-bold text-blue-600">{assignedTerritories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">완료된 구역</h3>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">진행 중</h3>
                <p className="text-2xl font-bold text-orange-600">{assignedTerritories.length - 2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
