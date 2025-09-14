import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
}

export function Select({
  className,
  label,
  error,
  helperText,
  options,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id || generatedId

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
      <select
        id={selectId}
        className={cn(
          'w-full px-3 py-3 border border-gray-200 rounded-xl text-sm transition-all duration-200',
          'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          'bg-white hover:border-gray-300 text-black',
          error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
          className
        )}
        {...props}
      >
        {options.map((option, index) => (
          <option 
            key={option.value} 
            value={option.value}
            style={index === 0 && option.value === '' ? { color: '#9ca3af' } : {}}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-black mt-1">{helperText}</p>
      )}
    </div>
  )
}
