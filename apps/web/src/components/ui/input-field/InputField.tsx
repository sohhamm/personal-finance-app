import * as React from 'react'
import {FieldApi} from '@tanstack/react-form'
import { Eye, EyeSlash, MagnifyingGlass } from '@phosphor-icons/react'
import classes from './input-field.module.css'
import {cx} from '@/utils/cx'

interface InputFieldProps<TFieldValues> {
  field: FieldApi<TFieldValues, any, any, any>
  label?: string
  placeholder?: string
  helperText?: string
  icon?: React.ReactNode
  prefix?: React.ReactNode
  colorTag?: React.ReactNode
  type?: string
  showPasswordToggle?: boolean
}

export function InputField<TFieldValues>({
  field,
  label,
  placeholder = 'Enter value',
  helperText,
  icon,
  prefix,
  colorTag,
  type = 'text',
  showPasswordToggle = false,
}: InputFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = React.useState(false)
  
  const inputType = type === 'password' && showPassword ? 'text' : type
  const hasError = field.state.meta.errors && field.state.meta.errors.length > 0

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={classes.container}>
      {label && (
        <label className={cx(classes.label, 'fin-text-preset-5')}>
          {label}
        </label>
      )}
      
      <div className={cx(
        classes.inputWrapper,
        hasError && classes.inputWrapperError
      )}>
        {prefix && <span className={classes.prefix}>{prefix}</span>}
        {colorTag && <span className={classes.colorTag}>{colorTag}</span>}
        
        <input
          type={inputType}
          className={cx(classes.input, 'fin-text-preset-4')}
          placeholder={placeholder}
          value={field.state.value as string}
          onChange={e => field.handleChange(e.target.value as any)}
          onBlur={field.handleBlur}
        />
        
        {icon && <span className={classes.icon}>{icon}</span>}
        
        {(type === 'password' || showPasswordToggle) && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={classes.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlash size={16} weight="regular" />
            ) : (
              <Eye size={16} weight="regular" />
            )}
          </button>
        )}
      </div>
      
      {(helperText || field.state.meta.errors) && (
        <span
          className={cx(
            classes.helperText,
            'fin-text-preset-5',
            field.state.meta.errors && classes.errorText,
          )}
        >
          {field.state.meta.errors ? field.state.meta.errors.join(', ') : helperText}
        </span>
      )}
    </div>
  )
}