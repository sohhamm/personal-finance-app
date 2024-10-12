import * as React from 'react'
import classes from './auth.module.css'
import {cx} from '@/utils/cx'

export default function Login() {
  return (
    <div className={classes.box}>
      <h1 className={'text-preset-1'}>Login</h1>
      <div className={classes.fields}></div>
    </div>
  )
}
