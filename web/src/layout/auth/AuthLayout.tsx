import classes from './auth-layout.module.css'
import illustration from '@/assets/illustration-authentication.svg'
import {Outlet} from '@tanstack/react-router'

export default function AuthLayout() {
  return (
    <div className={classes.authContainer}>
      <div className={classes.illustrationContainer}>
        <img src={illustration} alt='auth illustration' className={classes.illustrationImage} />
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
