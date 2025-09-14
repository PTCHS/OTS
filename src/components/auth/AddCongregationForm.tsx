'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLanguage } from '@/lib/contexts'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Building2, Hash } from 'lucide-react'

interface AddCongregationFormProps {
  onBackToLogin: () => void
}

export function AddCongregationForm({ onBackToLogin }: AddCongregationFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    congregationNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.congregationNumber.trim()) {
      setError(t('congregation.request.allFieldsRequired'))
      return
    }

    setLoading(true)
    setError('')

    try {
      // 중복 체크
      const duplicateError = await checkDuplicates()
      if (duplicateError) {
        throw new Error(duplicateError)
      }

      // 회중 등록 요청
      const { error: registrationError } = await supabase
        .from('congregation_request')
        .insert([{
          name: formData.name.trim(),
          congregation_number: formData.congregationNumber.trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        }])

      if (registrationError) {
        console.error('Congregation registration error:', registrationError)
        
        // PostgreSQL unique constraint 에러 처리
        if (registrationError.code === '23505') {
          if (registrationError.message.includes('congregation_number_key')) {
            throw new Error(t('congregation.request.numberExists'))
          } else if (registrationError.message.includes('name')) {
            throw new Error(t('congregation.request.nameExists'))
          } else {
            throw new Error(t('congregation.request.duplicateInfo'))
          }
        }
        
        throw new Error(registrationError.message || t('congregation.request.error'))
      }

      alert(t('congregation.request.success'))
      
      // 입력 필드 초기화
      setFormData({ name: '', congregationNumber: '' })
      
      // 로그인 화면으로 이동
      onBackToLogin()
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error.generic'))
    } finally {
      setLoading(false)
    }
  }

  const checkDuplicates = async () => {
    try {
      // 회중 이름 중복 체크
      const { data: nameCheck, error: nameError } = await supabase
        .from('congregation_request')
        .select('id')
        .eq('name', formData.name.trim())
        .single()

      if (nameError && nameError.code !== 'PGRST116') {
        throw new Error(t('congregation.request.nameCheckError'))
      }

      // 회중 번호 중복 체크
      const { data: numberCheck, error: numberError } = await supabase
        .from('congregation_request')
        .select('id')
        .eq('congregation_number', formData.congregationNumber.trim())
        .single()

      if (numberError && numberError.code !== 'PGRST116') {
        throw new Error(t('congregation.request.numberCheckError'))
      }

      // 중복 체크 결과에 따른 에러 메시지 반환
      if (nameCheck && numberCheck) {
        return t('congregation.request.duplicateNameAndNumber')
      } else if (nameCheck) {
        return t('congregation.request.nameExists')
      } else if (numberCheck) {
        return t('congregation.request.numberExists')
      }

      return null
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // 회중 번호는 숫자만 허용
    if (name === 'congregationNumber') {
      const numericRegex = /^[0-9]*$/
      if (!numericRegex.test(value)) return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
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
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="text-left pt-1">
              <h1 className="text-2xl font-bold text-primary">{t('congregation.request.title')}</h1>
            </div>
          </div>
          <p className="text-black text-sm mb-4">{t('congregation.request.description')}</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t('congregation.request.namePlaceholder')}
            required
            icon={<Building2 className="w-5 h-5 text-gray-500" />}
          />

          <Input
            name="congregationNumber"
            value={formData.congregationNumber}
            onChange={handleInputChange}
            placeholder={t('congregation.request.numberPlaceholder')}
            required
            icon={<Hash className="w-5 h-5 text-gray-500" />}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full py-4 text-lg font-semibold"
          >
            {loading ? t('congregation.request.submitting') : t('congregation.request.submitButton')}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <p className="text-black">
            {t('congregation.request.hasAccount')}{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-primary hover:text-primary-hover font-medium"
            >
              {t('congregation.request.loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
