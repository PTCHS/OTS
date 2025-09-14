'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/contexts'
import { ArrowLeft, User } from 'lucide-react'

interface ResetPasswordFormProps {
  onBackToLogin: () => void
}

export function ResetPasswordForm({ onBackToLogin }: ResetPasswordFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    userId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId.trim()) {
      setError(t('reset.userIdRequired'))
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // 사용자 ID가 존재하는지 확인
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', formData.userId.trim())
        .eq('is_active', true)
        .single()

      if (userError || !userData) {
        throw new Error(t('reset.userIdNotFound'))
      }

      // 이미 처리 중인 요청이 있는지 확인
      const { data: existingRequest } = await supabase
        .from('password_reset_requests')
        .select('status')
        .eq('user_id', formData.userId.trim())
        .eq('status', 'pending')
        .single()

      if (existingRequest) {
        throw new Error(t('reset.pendingRequest'))
      }

      // 새로운 비밀번호 재설정 요청 생성
      const { error: insertError } = await supabase
        .from('password_reset_requests')
        .insert([{ user_id: formData.userId.trim() }])

      if (insertError) throw insertError

      setSuccess(t('reset.success'))
      setFormData({ userId: '' })
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error.generic'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-xs relative">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBackToLogin}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-start justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="text-left pt-1">
              <h1 className="text-2xl font-bold text-primary">{t('reset.title')}</h1>
            </div>
          </div>
          <p className="text-black text-sm mb-4">{t('reset.description')}</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            placeholder={t('reset.userIdPlaceholder')}
            required
            icon={<User className="w-5 h-5 text-gray-500" />}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full py-4 text-lg font-semibold"
          >
            {t('reset.requestButton')}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <p className="text-black">
            {t('reset.hasAccount')}{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-primary hover:text-primary-hover font-medium"
            >
              {t('reset.loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
