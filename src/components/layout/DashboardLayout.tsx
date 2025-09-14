'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Calendar as CalendarIcon, User, Bell, Settings, Home, LogOut, Menu, X, MapPin } from 'lucide-react'
import { useAuth } from '@/lib/contexts'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [notificationCount] = useState(2)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const getActiveTab = () => {
    if (pathname === '/' || pathname.startsWith('/home')) return 'home'
    if (pathname.startsWith('/calendar')) return 'calendar'
    if (pathname.startsWith('/territory')) return 'territory'
    if (pathname.startsWith('/profile')) return 'profile'
    if (pathname.startsWith('/settings')) return 'settings'
    if (pathname.startsWith('/notifications')) return 'notifications'
    return 'home'
  }

  const activeTab = getActiveTab()

  const navigateToTab = (tab: string) => {
    setShowMobileMenu(false)
    switch (tab) {
      case 'home':
        router.push('/home')
        break
      case 'calendar':
        router.push('/calendar')
        break
      case 'territory':
        router.push('/territory')
        break
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'notifications':
        router.push('/notifications')
        break
      default:
        router.push('/home')
    }
  }

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigateToTab('profile')}
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-black text-sm">
                {user?.role === 'admin' ? '관리자' : '사용자'}
              </p>
              <h2 className="text-xl font-bold text-black">{user?.display_name || '사용자'}</h2>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => navigateToTab('home')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">홈</span>
            </button>

            <button
              onClick={() => navigateToTab('calendar')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'calendar' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">캘린더</span>
            </button>

            <button
              onClick={() => navigateToTab('territory')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'territory' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">구역</span>
            </button>

            <button
              onClick={() => navigateToTab('profile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">프로필</span>
            </button>

            <button
              onClick={() => navigateToTab('settings')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">설정</span>
            </button>

            <button
              onClick={() => navigateToTab('notifications')}
              className={`relative p-2 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => navigateToTab('notifications')}
              className={`relative p-2 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 z-20 lg:hidden" 
              onClick={() => setShowMobileMenu(false)}
            />
            
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200 relative z-30">
              <div className="space-y-2">
                <button
                  onClick={() => navigateToTab('home')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'home' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">홈</span>
                </button>

                <button
                  onClick={() => navigateToTab('calendar')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'calendar' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">캘린더</span>
                </button>

                <button
                  onClick={() => navigateToTab('territory')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'territory' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">구역</span>
                </button>

                <button
                  onClick={() => navigateToTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">프로필</span>
                </button>

                <button
                  onClick={() => navigateToTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-primary text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">설정</span>
                </button>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">로그아웃</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      {children}
    </div>
  )
}

