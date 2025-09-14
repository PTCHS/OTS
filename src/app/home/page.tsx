'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts'
import { AuthScreen } from '@/components/auth/AuthScreen'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Bell, ChevronRight, Clock, Calendar, MapPin, Users } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  if (!user) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">로딩 중...</p>
          </div>
        </div>
      }>
        <AuthScreen />
      </Suspense>
    )
  }

  // 오늘 날짜 포맷팅
  const today = new Date()
  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  // 공지사항 데이터
  const notices = [
    {
      id: '1',
      title: '12월 특별 집회 안내',
      content: '12월 25일 특별 집회가 있습니다. 많은 참석 부탁드립니다.',
      date: '2024-12-20',
      isNew: true,
      priority: 'high' as const
    },
    {
      id: '2', 
      title: '봉사 시간 변경 안내',
      content: '겨울철 봉사 시간이 오전 10시로 변경되었습니다.',
      date: '2024-12-18',
      isNew: true,
      priority: 'normal' as const
    },
    {
      id: '3',
      title: '회중 서적 연구 교재 안내',
      content: '새로운 교재가 배포되었습니다. 사무실에서 수령하세요.',
      date: '2024-12-15',
      isNew: false,
      priority: 'normal' as const
    }
  ]

  // 오늘의 봉사 데이터
  const todayServices = [
    {
      id: '1',
      time: '10:00',
      location: '강남역 광장',
      address: '서울시 강남구 강남대로 396',
      participants: 4,
      maxParticipants: 6,
      type: 'public_witnessing' as const,
      status: 'scheduled' as const,
      notes: '공개 증거 봉사'
    },
    {
      id: '2',
      time: '14:00',
      location: '아파트 단지',
      address: '서울시 강남구 역삼동 123-45',
      participants: 2,
      maxParticipants: 4,
      type: 'field_service' as const,
      status: 'scheduled' as const,
      notes: '야외 봉사'
    },
    {
      id: '3',
      time: '16:00',
      location: '재방문',
      address: '서울시 강남구 논현동 567-89',
      participants: 1,
      maxParticipants: 2,
      type: 'return_visit' as const,
      status: 'in_progress' as const,
      notes: '김○○님 재방문'
    }
  ]

  const getPriorityColor = (priority: 'high' | 'normal' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'low':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-primary bg-primary/10'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    })
  }

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'field_service':
        return '야외 봉사'
      case 'public_witnessing':
        return '공개 증거'
      case 'return_visit':
        return '재방문'
      case 'bible_study':
        return '성서 연구'
      default:
        return '봉사'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50'
      case 'in_progress':
        return 'text-green-600 bg-green-50'
      case 'completed':
        return 'text-gray-600 bg-gray-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-primary bg-primary/10'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '예정'
      case 'in_progress':
        return '진행중'
      case 'completed':
        return '완료'
      case 'cancelled':
        return '취소'
      default:
        return '예정'
    }
  }

  return (
    <DashboardLayout>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Date Section */}
        <div className="bg-primary/10 rounded-2xl p-4 mb-6 text-center max-w-md mx-auto">
          <p className="text-primary font-semibold text-lg">{formattedDate}</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notice */}
          <div className="w-full">
            <div>
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-black">공지사항</h2>
                </div>
                <button
                  onClick={() => router.push('/notifications')}
                  className="flex items-center text-primary font-medium hover:text-primary-hover transition-colors"
                >
                  <span className="text-sm">전체보기</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {/* 공지사항 목록 */}
              <div>
                {notices.slice(0, 3).map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => console.log('Notice clicked:', notice)}
                    className="bg-white rounded-2xl shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* 제목과 새 알림 표시 */}
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-black text-sm leading-tight">
                            {notice.title}
                          </h3>
                          {notice.isNew && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        
                        {/* 내용 미리보기 */}
                        <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">
                          {notice.content}
                        </p>
                        
                        {/* 날짜 */}
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="text-xs">{formatDate(notice.date)}</span>
                        </div>
                      </div>
                      
                      {/* 우선순위 표시 */}
                      <div className={`rounded-full px-2 py-1 ml-3 ${getPriorityColor(notice.priority)}`}>
                        <Bell className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Service */}
          <div className="w-full">
            <div>
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-black">오늘의 봉사</h2>
                </div>
                <button
                  onClick={() => router.push('/territory')}
                  className="flex items-center text-primary font-medium hover:text-primary-hover transition-colors"
                >
                  <span className="text-sm">전체보기</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {/* 봉사 목록 */}
              <div>
                {todayServices.slice(0, 3).map((service) => (
                  <div
                    key={service.id}
                    onClick={() => console.log('Service clicked:', service)}
                    className="bg-white rounded-2xl shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* 시간과 상태 */}
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="bg-primary/10 rounded-xl px-3 py-1">
                            <span className="text-primary font-semibold text-sm">{service.time}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                            {getStatusLabel(service.status)}
                          </span>
                        </div>
                        
                        {/* 봉사 정보 */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <h3 className="font-medium text-black text-sm">{service.location}</h3>
                          </div>
                          <p className="text-gray-600 text-xs ml-6">{service.address}</p>
                          {service.notes && (
                            <p className="text-gray-500 text-xs ml-6 italic">{service.notes}</p>
                          )}
                        </div>
                        
                        {/* 참여자 정보 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Users className="w-4 h-4" />
                            <span className="text-xs">
                              {service.participants}
                              {service.maxParticipants && `/${service.maxParticipants}`}명
                            </span>
                          </div>
                          
                          {/* 참여 버튼 */}
                          {service.status === 'scheduled' && service.participants < (service.maxParticipants || 999) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('Join service:', service.id)
                              }}
                              className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-primary-hover transition-colors"
                            >
                              참여
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* 봉사 유형 아이콘 */}
                      <div className="bg-primary/10 rounded-xl p-2 ml-3">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 오늘의 봉사 요약 */}
              <div className="bg-primary/5 rounded-2xl p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-primary font-bold text-lg">{todayServices.length}</p>
                      <p className="text-primary text-xs">총 봉사</p>
                    </div>
                    <div className="text-center">
                      <p className="text-primary font-bold text-lg">
                        {todayServices.reduce((sum, service) => sum + service.participants, 0)}
                      </p>
                      <p className="text-primary text-xs">참여자</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-sm font-medium">
                      {getServiceTypeLabel(todayServices[0]?.type || 'field_service')} 등
                    </p>
                    <p className="text-primary text-xs">다양한 봉사 활동</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}