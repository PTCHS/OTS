'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, MapPin, User, FileText } from 'lucide-react'
import { Schedule } from '@/lib/supabase'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (schedule: Partial<Schedule>) => Promise<void>
  onDelete?: (scheduleId: string) => Promise<void>
  schedule?: Schedule | null
  selectedDate?: string
  mode: 'add' | 'edit'
}

export function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  schedule,
  selectedDate,
  mode
}: ScheduleModalProps) {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    description: '',
    date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    time: '',
    location: '',
    leader: '',
    detail_info: ''
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 모달이 열릴 때 폼 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && schedule) {
        setFormData({
          description: schedule.description || '',
          date: schedule.date || '',
          time: schedule.time || '',
          location: schedule.location || '',
          leader: schedule.leader || '',
          detail_info: schedule.detail_info || ''
        })
      } else if (mode === 'add') {
        setFormData({
          description: '',
          date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
          time: '',
          location: '',
          leader: '',
          detail_info: ''
        })
      }
      setShowDeleteConfirm(false)
    }
  }, [isOpen, mode, schedule, selectedDate])

  // 폼 입력 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 저장 핸들러
  const handleSave = async () => {
    if (!formData.description.trim()) {
      alert('일정 제목을 입력해주세요.')
      return
    }

    if (!formData.date) {
      alert('날짜를 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      const scheduleData = {
        ...formData,
        id: mode === 'edit' ? schedule?.id : undefined
      }
      
      await onSave(scheduleData)
      onClose()
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('일정 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!schedule?.id || !onDelete) return

    setLoading(true)
    try {
      await onDelete(schedule.id)
      onClose()
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('일정 삭제 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? '새 일정 추가' : '일정 편집'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 폼 내용 */}
        <div className="p-6 space-y-4">
          {/* 일정 제목 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>일정 제목 *</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="일정 제목을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>날짜 *</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* 시간 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              <span>시간</span>
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* 장소 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              <span>장소</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="장소를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* 담당자 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              <span>담당자</span>
            </label>
            <input
              type="text"
              value={formData.leader}
              onChange={(e) => handleInputChange('leader', e.target.value)}
              placeholder="담당자를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* 상세 정보 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 정보
            </label>
            <textarea
              value={formData.detail_info}
              onChange={(e) => handleInputChange('detail_info', e.target.value)}
              placeholder="상세 정보를 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          {/* 삭제 버튼 (편집 모드일 때만) */}
          <div>
            {mode === 'edit' && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                삭제
              </button>
            )}
          </div>

          {/* 취소/저장 버튼 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={cn(
                "px-6 py-2 bg-primary text-white rounded-lg font-medium transition-colors",
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-hover"
              )}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">일정 삭제</h3>
            <p className="text-gray-700 mb-6">
              이 일정을 삭제하시겠습니까? 삭제된 일정은 복구할 수 없습니다.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={cn(
                  "px-4 py-2 bg-red-600 text-white rounded-lg transition-colors",
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                )}
              >
                {loading ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
