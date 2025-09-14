'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ScheduleModal } from '@/components/ui/ScheduleModal'
import { useLanguage } from '@/lib/contexts'
import { supabase, Schedule } from '@/lib/supabase'
import { Calendar as CalendarIcon, MapPin, User, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns'
import { cn } from '@/lib/utils'

export default function CalendarPage() {
  const { getMonths, getDays, getYearSuffix } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null)
  // 모달 상태 관리
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [modalSelectedDate, setModalSelectedDate] = useState<string>('')

  const loadSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('calendar_schedules')
        .select('*')
        .gte('date', format(startOfMonth(currentDate), 'yyyy-MM-dd'))
        .lte('date', format(endOfMonth(currentDate), 'yyyy-MM-dd'))
        .order('date', { ascending: true })

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error('Error loading schedules:', error)
    } finally {
      setLoading(false)
    }
  }, [currentDate])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  // 일정 추가 모달 열기
  const handleAddSchedule = (date?: string) => {
    setModalMode('add')
    setModalSelectedDate(date || format(selectedDate, 'yyyy-MM-dd'))
    setSelectedSchedule(null)
    setModalOpen(true)
  }

  // 일정 편집 모달 열기
  const handleEditSchedule = (schedule: Schedule) => {
    setModalMode('edit')
    setSelectedSchedule(schedule)
    setModalSelectedDate(schedule.date)
    setModalOpen(true)
  }

  // 일정 저장 (추가/편집)
  const handleSaveSchedule = async (scheduleData: Partial<Schedule>) => {
    console.log('Saving schedule data:', scheduleData) // 디버깅용
    
    try {
      if (modalMode === 'add') {
        // 새 일정 추가
        const insertData = {
          description: scheduleData.description,
          date: scheduleData.date,
          time: scheduleData.time || '00:00:00', // 기본값 설정
          location: scheduleData.location || null,
          leader: scheduleData.leader || null,
          detail_info: scheduleData.detail_info || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('Insert data:', insertData) // 디버깅용

        const { data, error } = await supabase
          .from('calendar_schedules')
          .insert([insertData])
          .select()

        if (error) {
          console.error('Supabase insert error:', error)
          throw new Error(`일정 추가 실패: ${error.message}`)
        }
        
        console.log('Insert result:', data) // 디버깅용
        
        // 새로 추가된 일정을 상태에 반영
        if (data && data.length > 0) {
          setSchedules(prev => [...prev, data[0]])
        }
      } else if (modalMode === 'edit' && selectedSchedule) {
        // 기존 일정 편집
        const updateData = {
          description: scheduleData.description,
          date: scheduleData.date,
          time: scheduleData.time || '00:00:00', // 기본값 설정
          location: scheduleData.location || null,
          leader: scheduleData.leader || null,
          detail_info: scheduleData.detail_info || null,
          updated_at: new Date().toISOString()
        }

        console.log('Update data:', updateData) // 디버깅용

        const { data, error } = await supabase
          .from('calendar_schedules')
          .update(updateData)
          .eq('id', selectedSchedule.id)
          .select()

        if (error) {
          console.error('Supabase update error:', error)
          throw new Error(`일정 수정 실패: ${error.message}`)
        }

        console.log('Update result:', data) // 디버깅용

        // 편집된 일정을 상태에 반영
        if (data && data.length > 0) {
          setSchedules(prev => 
            prev.map(schedule => 
              schedule.id === selectedSchedule.id ? data[0] : schedule
            )
          )
        }
      }

      // 모달 닫기
      setModalOpen(false)
      setSelectedSchedule(null)
    } catch (error) {
      console.error('Error saving schedule:', error)
      // 사용자에게 더 자세한 에러 메시지 표시
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('일정 저장 중 알 수 없는 오류가 발생했습니다.')
      }
      throw error
    }
  }

  // 일정 삭제
  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_schedules')
        .delete()
        .eq('id', scheduleId)

      if (error) throw error

      // 삭제된 일정을 상태에서 제거
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId))
      
      // 모달 닫기
      setModalOpen(false)
      setSelectedSchedule(null)
    } catch (error) {
      console.error('Error deleting schedule:', error)
      throw error
    }
  }

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedSchedule(null)
    setModalSelectedDate('')
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getSchedulesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    return schedules.filter(schedule => schedule.date === dateString)
  }

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    const dayNames = getDays()

    return (
      <div className="min-w-[280px] sm:min-w-[320px] overflow-x-auto mx-2 sm:mx-4">
        <div 
          className="bg-white border-2 border-gray-300 shadow-sm"
          style={{
            borderRadius: '16px'
          }}
        >
          {/* 요일 헤더 */}
          <div 
            className="grid grid-cols-7 bg-gray-50 border-b-2 border-gray-300"
            style={{
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              overflow: 'hidden'
            }}
          >
            {dayNames.map((day, index) => (
              <div 
                key={day} 
                className={cn(
                  "p-1.5 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-700",
                  index < 6 && "border-r border-gray-300"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div 
            className="grid grid-cols-7"
            style={{
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              overflow: 'hidden'
            }}
          >
          {days.map((day, index) => {
            const daySchedules = getSchedulesForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            const isCurrentDay = isToday(day)
            const isLastWeek = Math.floor(index / 7) === Math.floor((days.length - 1) / 7)
            const isLastColumn = (index % 7) === 6
            const isFirstWeek = Math.floor(index / 7) === 0
            const isFirstColumn = (index % 7) === 0

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[60px] sm:min-h-[80px] md:min-h-[100px] min-w-[40px] p-1.5 sm:p-2 cursor-pointer transition-all duration-200 relative",
                  // 기본 배경색과 호버 효과
                  "hover:bg-gray-50",
                  !isCurrentMonth && "bg-gray-50/50 hover:bg-gray-100/50",
                  isCurrentDay && "bg-blue-50 hover:bg-blue-100/50",
                  // 테두리 처리
                  !isLastColumn && "border-r border-gray-300",
                  !isLastWeek && "border-b border-gray-300",
                  // 선택된 날짜의 특별한 테두리
                  isSelected && "border-2 border-primary/60"
                )}
                style={isSelected ? {
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: isLastWeek && isFirstColumn ? '0 0 0 16px' : 
                               isLastWeek && isLastColumn ? '0 0 16px 0' : '0'
                } : {}}
              >
                <div className={cn(
                  "flex items-center justify-between mb-0.5"
                )}>
                  <span className={cn(
                    "text-xs sm:text-sm",
                    isCurrentDay ? "font-bold text-blue-600" : "text-gray-900",
                    !isCurrentMonth && "text-gray-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>

                {/* 일정 개수에 따른 점 표시 */}
                {daySchedules.length > 0 && (
                  <div className="flex justify-center space-x-0.5 mt-0.5">
                    {Array.from({ length: Math.min(daySchedules.length, 5) }, (_, index) => (
                      <div
                        key={index}
                        className="w-1 h-1 bg-primary rounded-full"
                      />
                    ))}
                    {daySchedules.length > 5 && (
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        </div>
      </div>
    )
  }

  const renderScheduleDetails = () => {
    const daySchedules = getSchedulesForDate(selectedDate)
    
    if (daySchedules.length === 0) {
      return (
        <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6 text-center">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {format(selectedDate, 'M월 d일')} 일정이 없습니다
          </h3>
          <p className="text-gray-500 text-sm mb-4">새로운 일정을 추가해보세요</p>
          <button
            onClick={() => handleAddSchedule(format(selectedDate, 'yyyy-MM-dd'))}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>일정 추가</span>
          </button>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm">
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(selectedDate, 'M월 d일')} 일정
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {daySchedules.map((schedule) => (
            <div
              key={schedule.id}
              className={cn(
                "border-2 border-gray-300 rounded-xl p-4 cursor-pointer hover:border-gray-400 transition-all duration-200",
                expandedSchedule === schedule.id && "border-primary/50 bg-primary/5"
              )}
              onClick={() => setExpandedSchedule(expandedSchedule === schedule.id ? null : schedule.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{schedule.description}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    {schedule.time && schedule.time !== '00:00:00' && (
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{schedule.time}</span>
                      </div>
                    )}
                    {schedule.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                    )}
                    {schedule.leader && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{schedule.leader}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditSchedule(schedule)
                  }}
                  className="text-primary hover:text-primary-hover transition-colors text-sm font-medium"
                >
                  편집
                </button>
              </div>
              
              {expandedSchedule === schedule.id && schedule.detail_info && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-700 text-sm">{schedule.detail_info}</p>
                </div>
              )}
            </div>
          ))}
          
          {/* 일정 추가 버튼 */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => handleAddSchedule(format(selectedDate, 'yyyy-MM-dd'))}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>일정 추가</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-700">일정을 불러오는 중...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
          {/* 캘린더 그리드 */}
          <div className="xl:col-span-2">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h1>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20 hover:border-primary/30"
                >
                  오늘
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {renderCalendarGrid()}
          </div>

          {/* 일정 상세 */}
          <div className="mx-2 sm:mx-4">
            {renderScheduleDetails()}
          </div>
        </div>
      </div>

      {/* 일정 추가/편집 모달 */}
      <ScheduleModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
        schedule={selectedSchedule}
        selectedDate={modalSelectedDate}
        mode={modalMode}
      />
    </DashboardLayout>
  )
}
