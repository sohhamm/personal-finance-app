import * as React from 'react'
import classes from './auth.module.css'

interface LoginProps {
  a?: string
}

export default function Login({a}: LoginProps) {
  return <div className={classes.box}>Login</div>
}
