import classes from './auth-layout.module.css'
import illustration from '@/assets/illustration-authentication.svg'
import {Outlet} from '@tanstack/react-router'

export default function AuthLayout() {
  return (
    <div className={classes.authContainer}>
      <div className={classes.illustrationContainer}>
        <div className={classes.leftContent}>
          <div className={classes.brandSection}>
            <h1 className={classes.brandTitle}>finance</h1>
          </div>
          
          <div className={classes.heroSection}>
            <img 
              src={illustration} 
              alt='Personal finance illustration' 
              className={classes.illustrationImage} 
            />
            
            <div className={classes.heroText}>
              <h2 className={classes.heroTitle}>
                Keep track of your money and save for your future
              </h2>
              <p className={classes.heroDescription}>
                Personal finance app puts you in control of your spending. Track 
                transactions, set budgets, and add to savings pots easily.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}