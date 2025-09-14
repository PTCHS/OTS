import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({
  className,
  label,
  error,
  helperText,
  icon,
  rightIcon,
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-black mb-1"
        >
          {icon && <span className="inline-flex items-center mr-1.5">{icon}</span>}
          {label}
        </label>
      )}
      <div className="relative" style={{ overflow: 'visible' }}>
        <input
          id={inputId}
          className={cn(
            'w-full py-3 border border-gray-200 rounded-xl text-sm transition-all duration-200 text-black bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            'placeholder:text-gray-400',
            'hover:border-primary/30 hover:shadow-sm',
            error && 'border-red-400 focus:ring-red-400/20 focus:border-red-400',
            icon && rightIcon ? 'pl-12 pr-14' : icon ? 'pl-12 pr-4' : rightIcon ? 'pl-4 pr-14' : 'px-4',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none flex items-center justify-center" style={{ zIndex: 10 }}>
            {icon}
          </div>
        )}
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center" style={{ zIndex: 10 }}>
            {rightIcon}
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
