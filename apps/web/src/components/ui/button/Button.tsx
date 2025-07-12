import * as React from 'react'
import classes from './button.module.css'
import {cx} from '@/utils/cx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destroy'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
  isIcon?: boolean
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  className?: string
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  isIcon = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cx(
        classes.button,
        classes[variant],
        size !== 'medium' && classes[size],
        isIcon && classes.iconButton,
        fullWidth && classes.fullWidth,
        loading && classes.loading,
        isDisabled && classes.disabled,
        'fin-text-preset-4-bold',
        className
      )}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}