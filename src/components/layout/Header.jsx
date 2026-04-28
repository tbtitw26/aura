'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './Header.module.scss'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)
  const authChecked = useRef(false)

  // Перевірка auth статусу - тільки один раз
  const checkAuthStatus = async () => {
    if (authChecked.current) {
      setIsLoading(false)
      return
    }
    
    if (!isMounted.current) return
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth-token')
      
      if (!token) {
        setIsLoggedIn(false)
        setUserName('')
        authChecked.current = true
        setIsLoading(false)
        return
      }
      
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!isMounted.current) return
      
      if (response.ok) {
        const data = await response.json()
        setIsLoggedIn(true)
        setUserName(data.user?.firstName || '')
      } else {
        localStorage.removeItem('auth-token')
        setIsLoggedIn(false)
        setUserName('')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsLoggedIn(false)
      setUserName('')
    } finally {
      if (isMounted.current) {
        authChecked.current = true
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    return () => {
      isMounted.current = false
    }
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('auth-token')
    setIsLoggedIn(false)
    setUserName('')
    window.location.href = '/login'
  }

  // Navigation items
  const mainNavItems = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const authNavItems = isLoggedIn ? [
    { href: '/wallet', label: 'Wallet' },
    { href: '/virtual-card', label: 'Virtual Card' },
    { href: '/buy-balance', label: 'Add Funds' },
  ] : []

  const allNavItems = [...authNavItems, ...mainNavItems]

  if (isLoading) {
    return (
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.skeletonLogo}></div>
          <nav className={styles.desktopNav}>
            <div className={styles.skeletonNav}></div>
          </nav>
          <div className={styles.actions}>
            <div className={styles.skeletonBtn}></div>
            <div className={styles.skeletonBtn}></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href={isLoggedIn ? '/wallet' : '/'} className={styles.logo}>
          AURA
        </Link>

        <nav className={styles.desktopNav}>
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <button className={styles.iconBtn}>
                <span className="material-symbols-outlined">shopping_bag</span>
              </button>
              <div className={styles.userMenu}>
                <button className={styles.userBtn}>
                  <span className="material-symbols-outlined">account_circle</span>
                  <span className={styles.userName}>{userName || 'Account'}</span>
                </button>
                <div className={styles.dropdown}>
                  <Link href="/profile">Profile</Link>
                  <Link href="/settings">Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>Login</Link>
              <Link href="/register" className={styles.signupBtn}>Sign Up</Link>
            </>
          )}

          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className={styles.mobileAuthBtns}>
              <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className={styles.mobileSignupBtn} onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={styles.mobileLogoutBtn}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}