import * as React from 'react'
import classes from './InputField.module.css'
import {cx} from '@/utils/cx'

interface InputFieldProps {
  label?: string
  placeholder?: string
  helperText?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  prefix?: React.ReactNode
  colorTag?: React.ReactNode
}

export function InputField({
  label,
  placeholder = 'Enter value',
  helperText,
  value,
  onChange,
  icon,
  prefix,
  colorTag,
}: InputFieldProps) {
  return (
    <div className={classes.container}>
      {label && <label className={cx(classes.label, 'text-preset-5-bold')}>{label}</label>}
      <div className={classes.inputWrapper}>
        {prefix && <span className={classes.prefix}>{prefix}</span>}
        {colorTag && <span className={classes.colorTag}>{colorTag}</span>}
        <input
          type='text'
          className={cx(classes.input, 'text-preset-4')}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {icon && <span className={classes.icon}>{icon}</span>}
      </div>
      {helperText && <span className={cx(classes.helperText, 'text-preset-5')}>{helperText}</span>}
    </div>
  )
}
