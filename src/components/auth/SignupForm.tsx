'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useLanguage } from '@/lib/contexts'
import { supabase } from '@/lib/supabase'
import { UserPlus, User, Lock, Eye, EyeOff, UserCircle, Building2, ArrowLeft } from 'lucide-react'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

interface Congregation {
  id: string
  name: string
  congregation_number: string
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    displayName: '',
    userId: '',
    password: '',
    confirmPassword: '',
    congregationId: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
      console.error('회중 목록 로드 오류:', error)
    } finally {
      setLoadingCongregations(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 입력 검증
    if (!formData.congregationId) {
      setError(t('signup.selectCongregationFirst'))
      setLoading(false)
      return
    }

    if (!formData.displayName.trim() || !formData.userId.trim() || !formData.password) {
      setError(t('signup.allFieldsRequired'))
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.passwordMismatch'))
      setLoading(false)
      return
    }

    // 사용자 ID 형식 검증 (영문자와 숫자만)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/
    if (!alphanumericRegex.test(formData.userId)) {
      setError(t('signup.userIdValidation'))
      setLoading(false)
      return
    }

    // 비밀번호 형식 검증
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
    if (!passwordRegex.test(formData.password)) {
      setError(t('signup.passwordFormatError'))
      setLoading(false)
      return
    }

    try {
      // 중복 사용자 ID 확인
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', formData.userId.trim())
        .single()

      if (existingUser) {
        throw new Error(t('signup.userIdExists'))
      }

      // 새 사용자 생성
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          user_id: formData.userId.trim(),
          display_name: formData.displayName.trim(),
          password_hash: formData.password, // 실제로는 bcrypt로 해시화해야 함
          congregation_id: formData.congregationId,
          role: 'user',
          is_active: true,
          created_at: new Date().toISOString()
        }])

      if (insertError) throw insertError

      // 성공 알림
      alert(t('signup.success'))
      
      // 입력 필드 초기화
      setFormData({
        displayName: '',
        userId: '',
        password: '',
        confirmPassword: '',
        congregationId: ''
      })
      
      // 로그인 화면으로 이동
      onSwitchToLogin()
    } catch (error) {
      setError(error instanceof Error ? error.message : t('signup.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // t('signup.userIdComment')
    if (name === 'userId') {
      const alphanumericRegex = /^[a-zA-Z0-9]*$/
      if (!alphanumericRegex.test(value)) return
    }
    
    // 비밀번호는 영문자, 숫자, 특수문자만 허용
    if (name === 'password' || name === 'confirmPassword') {
      const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
      if (!passwordRegex.test(value)) return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
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
      <div className="w-full max-w-xs relative">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onSwitchToLogin}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-start justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
            <div className="text-left pt-1">
              <h1 className="text-2xl font-bold text-primary">{t('signup.title')}</h1>
            </div>
          </div>
          <p className="text-black text-sm mb-4">{t('signup.createAccountDescription')}</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder={t('signup.displayNamePlaceholder')}
            required
            icon={<UserCircle className="w-5 h-5 text-gray-500" />}
          />

          <Input
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            placeholder={t('signup.userIdPlaceholder2')}
            required
            maxLength={20}
            icon={<User className="w-5 h-5 text-gray-500" />}
          />

          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('signup.passwordPlaceholder')}
            required
            minLength={6}
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

          <Input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('signup.confirmPasswordPlaceholder')}
            required
            icon={<Lock className="w-5 h-5 text-gray-500" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 text-gray-500 hover:text-black"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full py-4 text-lg font-semibold"
          >
            {t('signup.signupButton')}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <p className="text-black">
            {t('signup.hasAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-hover font-medium"
            >
              {t('signup.loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}