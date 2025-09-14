'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { useLanguage, useAuth } from '@/lib/contexts'
import { supabase } from '@/lib/supabase'
import { Calendar, User, Lock, Eye, EyeOff, Building2 } from 'lucide-react'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onSwitchToReset: () => void
  onSwitchToAddCongregation: () => void
}

interface Congregation {
  id: string
  name: string
  congregation_number: string
}

export function LoginForm({ onSwitchToSignup, onSwitchToReset, onSwitchToAddCongregation }: LoginFormProps) {
  const { t } = useLanguage()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    congregationId: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [congregations, setCongregations] = useState<Congregation[]>([])
  const [loadingCongregations, setLoadingCongregations] = useState(true)

  // 회중 목록 로드
  useEffect(() => {
    loadCongregations()
  }, [])

  const loadCongregations = async () => {
    try {
      setLoadingCongregations(true)
      const { data, error } = await supabase
        .from('congregation_request')
        .select('id, name, congregation_number')
        .eq('status', 'approved')
        .order('name', { ascending: true })

      if (error) throw error
      setCongregations(data || [])
    } catch (error) {
      console.error('Congregation list load error:', error)
    } finally {
      setLoadingCongregations(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.congregationId) {
      setError(t('login.selectCongregationRequired'))
      setLoading(false)
      return
    }

    if (!formData.userId.trim() || !formData.password.trim()) {
      setError(t('login.userIdPasswordRequired'))
      setLoading(false)
      return
    }

    try {
      // 사용자 인증 (커스텀 사용자 테이블 사용)
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', formData.userId.trim())
        .eq('congregation_id', formData.congregationId)
        .eq('is_active', true)
        .single()

      if (error || !users) {
        throw new Error(t('login.userNotFound'))
      }

      // 실제 운영환경에서는 bcrypt로 비밀번호를 해시화해서 비교해야 합니다.
      if (users.password_hash !== formData.password) {
        throw new Error(t('login.passwordMismatch'))
      }

      // 마지막 로그인 시간 업데이트
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', users.id)

      // 로그인 성공
      login(users)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const congregationOptions = congregations.map(cong => ({
    value: cong.id,
    label: `${cong.name} (${cong.congregation_number})`
  }))

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-xl text-gray-800 leading-tight">
                <div><span className="text-primary font-bold text-2xl">O</span>verseering</div>
                <div><span className="text-primary font-bold text-2xl">T</span>he</div>
                <div><span className="text-primary font-bold text-2xl">S</span>ervice</div>
              </h1>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Selector */}
          <div className="mb-4 flex justify-end">
            <LanguageSelector />
          </div>
          <SearchableSelect
            name="congregationId"
            value={formData.congregationId}
            onChange={handleSelectChange}
            options={congregationOptions}
            placeholder={loadingCongregations ? t('loading.text') : t('congregation.selectPlaceholder')}
            disabled={loadingCongregations}
            required
            icon={<Building2 className="w-5 h-5 text-gray-500" />}
          />

          <Input
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            placeholder={t('login.userIdPlaceholder2')}
            required
            icon={<User className="w-5 h-5 text-gray-500" />}
          />

          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('login.passwordPlaceholder')}
            required
            icon={<Lock className="w-5 h-5 text-gray-500" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={onSwitchToReset}
              className="text-primary hover:text-primary-hover font-medium text-sm"
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full py-4 text-lg font-semibold"
          >
            {t('login.loginButton')}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </form>

        {/* 회중 등록 안내 */}
        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <p className="text-black text-sm mb-3">
            {t('login.congregationMissing')}{' '}
            <button
              type="button"
              onClick={onSwitchToAddCongregation}
              className="text-primary hover:text-primary-hover font-medium"
            >
              {t('login.requestCongregation')}
            </button>
          </p>
        </div>

        {/* Switch to Signup */}
        <div className="text-center">
          <p className="text-black text-sm">
            {t('login.noAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary hover:text-primary-hover font-medium"
            >
              {t('login.signupLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}