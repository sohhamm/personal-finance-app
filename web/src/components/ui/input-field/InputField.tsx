import * as React from 'react'
import {FieldApi} from '@tanstack/react-form'
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
  type?: string // Add this line
}

export function InputField<TFieldValues>({
  field,
  label,
  placeholder = 'Enter value',
  helperText,
  icon,
  prefix,
  colorTag,
  type,
}: InputFieldProps<TFieldValues>) {
  return (
    <div className={classes.container}>
      {label && <label className={cx(classes.label, 'text-preset-5-bold')}>{label}</label>}
      <div className={classes.inputWrapper}>
        {prefix && <span className={classes.prefix}>{prefix}</span>}
        {colorTag && <span className={classes.colorTag}>{colorTag}</span>}
        <input
          type={type}
          className={cx(classes.input, 'text-preset-4')}
          placeholder={placeholder}
          value={field.state.value as string}
          onChange={e => field.handleChange(e.target.value as any)}
          onBlur={field.handleBlur}
        />
        {icon && <span className={classes.icon}>{icon}</span>}
      </div>
      {(helperText || field.state.meta.errors) && (
        <span
          className={cx(
            classes.helperText,
            'text-preset-5',
            field.state.meta.errors && classes.errorText,
          )}
        >
          {field.state.meta.errors ? field.state.meta.errors.join(', ') : helperText}
        </span>
      )}
    </div>
  )
}
