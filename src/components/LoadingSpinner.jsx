import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  text = 'Loading...',
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-neutral-600',
    white: 'text-white',
    success: 'text-medical-600',
    warning: 'text-warning-600',
    danger: 'text-danger-600'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`} 
        aria-label="Loading"
      />
      {showText && text && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner