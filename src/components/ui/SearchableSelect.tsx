'use client'

import React, { useState, useRef, useEffect, useId } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'
import { useLanguage } from '@/lib/contexts'

interface SearchableSelectProps {
  name?: string
  value: string
  onChange: (e: { target: { name: string; value: string } }) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  label?: string
  error?: string
  helperText?: string
  className?: string
  id?: string
  icon?: React.ReactNode
}

export function SearchableSelect({
  name = '',
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  // required,
  label,
  error,
  helperText,
  className,
  id,
  icon,
}: SearchableSelectProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const selectId = id || generatedId

  // 검색어로 필터링된 옵션들
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === value)

  // 드롭다운 외부 클릭/터치 감지
  useEffect(() => {
    function handleOutsideInteraction(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    // 마우스와 터치 이벤트 모두 감지
    document.addEventListener('mousedown', handleOutsideInteraction)
    document.addEventListener('touchstart', handleOutsideInteraction, { passive: true })
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction)
      document.removeEventListener('touchstart', handleOutsideInteraction)
    }
  }, [])

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        setHighlightedIndex(0)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex])
        }
        break
    }
  }

  const handleOptionSelect = (option: { value: string; label: string }) => {
    onChange({
      target: {
        name: name || '',
        value: option.value
      }
    })
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  const handleToggle = (e?: React.MouseEvent) => {
    if (disabled) return
    // clear 버튼 클릭 시에는 드롭다운을 열지 않음
    if (e && (e.target as HTMLElement).closest('button')) {
      return
    }
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange({
      target: {
        name: name || '',
        value: ''
      }
    })
  }

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-black mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        {/* 선택된 값 표시 컨테이너 */}
        <div
          id={selectId}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full border border-gray-200 rounded-xl text-sm transition-all duration-200 relative cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            'bg-white hover:border-primary/30 hover:shadow-sm text-left flex items-center justify-between',
            'shadow-sm hover:shadow-md',
            error && 'border-red-400 focus:ring-red-400/20 focus:border-red-400',
            disabled && 'cursor-not-allowed hover:border-gray-200 hover:shadow-sm',
            icon ? 'pl-10 pr-3 py-3.5' : 'px-3 py-3.5',
            className
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            {icon && (
              <div className="absolute left-3 pointer-events-none flex items-center justify-center h-full">
                {icon}
              </div>
            )}
            <span className={cn(
              'truncate',
              selectedOption ? 'text-black' : 'text-gray-400'
            )}>
              {selectedOption ? selectedOption.label : (placeholder || t('searchable.placeholder'))}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {selectedOption && value && !disabled && (
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                tabIndex={-1}
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <ChevronDown className={cn(
              'w-4 h-4 text-gray-400 transition-all duration-300 ease-in-out',
              isOpen && 'rotate-180 text-primary'
            )} />
          </div>
        </div>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-2xl max-h-80 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200" style={{ borderRadius: '26px' }}>
            {/* 검색 입력 */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setHighlightedIndex(0)
                  }}
                  placeholder={t('searchable.search')}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-black placeholder:text-gray-400 transition-all duration-200"
                  style={{ borderRadius: '16px' }}
                />
              </div>
            </div>

            {/* 옵션 목록 */}
            <div 
              className="max-h-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" 
              style={{ 
                WebkitOverflowScrolling: 'touch', 
                touchAction: 'pan-y',
                transform: 'translateZ(0)',
                willChange: 'scroll-position',
                overscrollBehavior: 'contain'
              }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Search className="w-6 h-6 text-gray-300" />
                    <span className="text-gray-400">{t('searchable.noResults')}</span>
                  </div>
                </div>
              ) : (
                <div className="py-1">
                  {filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      className={cn(
                        'w-full px-4 py-2.5 text-left text-sm transition-all duration-150 text-black relative',
                        'hover:bg-gray-50 hover:text-primary',
                        value === option.value && 'bg-primary/8 text-primary font-medium',
                        index === highlightedIndex && 'bg-gray-100 text-primary',
                        index === filteredOptions.length - 1 && 'rounded-b-[24px]'
                      )}
                    >
                      <span className="block truncate pr-6">{option.label}</span>
                      {value === option.value && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-black mt-1">{helperText}</p>
      )}
    </div>
  )
}
