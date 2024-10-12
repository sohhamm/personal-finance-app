import * as React from 'react'
import classes from './button.module.css'
import {cx} from '@/utils/cx'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  children: React.ReactNode
  onClick?: () => void
  isIcon?: boolean
  disabled?: boolean
}

export default function Button({
  variant = 'primary',
  children,
  onClick,
  isIcon = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={cx(
        classes.button,
        classes[variant],
        isIcon && classes.iconButton,
        disabled && classes.disabled,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
