import * as React from 'react'
import classes from './auth.module.css'

interface SignUpProps {
  a?: string
}

export default function SignUp({a}: SignUpProps) {
  console.log(a)
  return <div className={classes.box}>SignUp</div>
}
