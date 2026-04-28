'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <main className={styles.main}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Reset Password</h1>
              <p className={styles.subtitle}>
                We'll send you a link to reset your password
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={styles.input}
                  />
                  {error && <span className={styles.errorMessage}>{error}</span>}
                </div>

                <div className={styles.submitSection}>
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.successMessage}>
                <span className="material-symbols-outlined">check_circle</span>
                <h3>Check your email</h3>
                <p>We've sent a password reset link to {email}</p>
                <Link href="/login" className={styles.backToLogin}>
                  Back to Login
                </Link>
              </div>
            )}

            <div className={styles.backLink}>
              <Link href="/login">
                ← Back to Login
              </Link>
            </div>
          </div>
        </main>
      </div>
      
      <div className={styles.imageContainer}>
        <div className={styles.imageGradient}></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhFX9s2mXKl2XfOMju95RdCv3sav4LE14UmpRyp-yCO8_DWuhdjMU_xbyNYrvw5RSQAyeLpAtEuhmHxH5Mdmqqnl_U6Y_YqMlPRhnY4u0xb8pZesKIU3mbsfuXn9Nikpt0Bq2a46Yumqir3ULNmyhrISaI2xFgOyp4ZCbc4k9xUH_8laPGndAw0RxmgP5IdB-U10t8HL7--knGrZzYroURtbbbo1kqeniXocG9zZbmb7n9vvf7EGhu3ucxZOAvmGlVmihXnEoz5bA"
          alt="Luxury fashion"
          className={styles.heroImage}
        />
      </div>
    </div>
  )
}