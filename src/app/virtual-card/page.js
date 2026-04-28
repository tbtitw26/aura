'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function VirtualCard() {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '**** **** **** 4289',
    cardHolder: 'A. Vang',
    expiryMonth: '12',
    expiryYear: '26',
    cvv: '***',
    isActive: true,
    id: null
  })
  
  const [showFullDetails, setShowFullDetails] = useState(false)
  const [isFrozen, setIsFrozen] = useState(false)
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      merchant: 'Net-a-Porter',
      date: 'Today',
      time: '14:30',
      amount: -1200.00,
      currency: '€',
      icon: 'shopping_bag'
    },
    {
      id: 2,
      merchant: 'LuisaViaRoma',
      date: 'Yesterday',
      time: '09:15',
      amount: -850.00,
      currency: '€',
      icon: 'shopping_bag'
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const headers = {}
        const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`
        const res = await fetch('/api/cards', { credentials: 'same-origin', headers });
        if (res.ok) {
          const json = await res.json();
          const list = json.cards || [];
          if (list.length > 0) {
            const first = list[0];
            setCardDetails({
              cardNumber: `**** **** **** ${first.last4}`,
              cardHolder: first.cardholderName || '—',
              expiryMonth: first.expMonth || 'XX',
              expiryYear: first.expYear || 'XX',
              cvv: '***',
              isActive: true,
              id: first._id
            });
          }
          setCards(list);
        }
      } catch (error) {
        console.error('Failed to fetch card details:', error)
      }
    }
    
    fetchCardDetails()
  }, [])

  const [cards, setCards] = useState([])

  const toggleCardDetails = () => {
    if (!showFullDetails) {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: '4532 1234 5678 4289',
        cvv: '123'
      }))
    } else {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: '**** **** **** 4289',
        cvv: '***'
      }))
    }
    setShowFullDetails(!showFullDetails)
  }

  const handleFreezeCard = async () => {
    setIsLoading(true)
    try {
      setIsFrozen(!isFrozen)
      setCardDetails(prev => ({
        ...prev,
        isActive: !prev.isActive
      }))
    } catch (error) {
      console.error('Failed to freeze card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = async () => {
    if (!cardDetails.id) return
    if (confirm('Are you sure you want to delete this virtual card? This action cannot be undone.')) {
      setIsLoading(true)
      try {
        const headers = { 'Content-Type': 'application/json' }
        const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`
        const res = await fetch(`/api/cards/${cardDetails.id}`, { method: 'DELETE', credentials: 'same-origin', headers })
        if (res.ok) {
          // remove from list and clear details
          const remaining = cards.filter(c => c._id !== cardDetails.id)
          setCards(remaining)
          if (remaining.length > 0) {
            const first = remaining[0]
            setCardDetails({
              cardNumber: `**** **** **** ${first.last4}`,
              cardHolder: first.cardholderName || '—',
              expiryMonth: first.expMonth || 'XX',
              expiryYear: first.expYear || 'XX',
              cvv: '***',
              isActive: true,
              id: first._id
            })
          } else {
            setCardDetails({ cardNumber: '**** **** **** 4289', cardHolder: '', expiryMonth: 'XX', expiryYear: 'XX', cvv: '***', isActive: false, id: null })
          }
        } else {
          const err = await res.json().catch(() => null)
          console.error('Delete failed', err)
          alert(err?.error || 'Failed to delete card')
        }
      } catch (error) {
        console.error('Failed to delete card:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCreateCard = async () => {
    setIsLoading(true)
    try {
      // generate simple random last4 and expiry
      const last4 = String(Math.floor(1000 + Math.random() * 9000))
      const expMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')
      const expYear = String(new Date().getFullYear() % 100 + Math.floor(Math.random() * 3))

      const payload = {
        brand: 'VISA',
        last4,
        expMonth,
        expYear,
        cardholderName: 'Virtual Card',
        isVirtual: true,
      }

      const headers = { 'Content-Type': 'application/json' }
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
      if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`
      const res = await fetch('/api/cards', { method: 'POST', headers, credentials: 'same-origin', body: JSON.stringify(payload) })
      if (res.ok) {
        const json = await res.json()
        const newCard = json.card
        const updated = [newCard, ...cards]
        setCards(updated)
        setCardDetails({
          cardNumber: `**** **** **** ${newCard.last4}`,
          cardHolder: newCard.cardholderName || '—',
          expiryMonth: newCard.expMonth || 'XX',
          expiryYear: newCard.expYear || 'XX',
          cvv: '***',
          isActive: true,
          id: newCard._id
        })
      } else {
        const err = await res.json().catch(() => null)
        console.error('Create card failed', err)
        alert(err?.error || 'Failed to create card')
      }
    } catch (err) {
      console.error('Create card error', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount).toFixed(2)
    return amount < 0 ? `- €${absAmount}` : `€${absAmount}`
  }

  return (
    // ❌ ВИДАЛЕНО <div className={styles.container}> і локальний header
    // ✅ Тільки main з контентом (Header буде з layout.js)
    <main className={styles.main}>
      {/* Left Column: Card Visual & Core Actions */}
      <div className={styles.leftColumn}>
        <section className={styles.cardSection}>
          <div className={styles.cardBgBlur}></div>
          
          <div className={`${styles.virtualCard} ${!cardDetails.isActive ? styles.frozenCard : ''}`}>
            <div className={styles.cardInnerGlow}></div>
            
            <div className={styles.cardHeader}>
              <span className={styles.cardLogo}>Aura</span>
              <div className={styles.cardStatus}>
                <span className={`${styles.statusDot} ${cardDetails.isActive && !isFrozen ? styles.active : styles.inactive}`}></span>
                <span className={styles.statusText}>
                  {isFrozen ? 'Frozen' : (cardDetails.isActive ? 'Active' : 'Inactive')}
                </span>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <span className={styles.cardNumber}>
                {showFullDetails ? cardDetails.cardNumber : '**** **** **** 4289'}
              </span>
              <div className={styles.cardDetailsRow}>
                <div className={styles.cardDetailItem}>
                  <span className={styles.cardDetailLabel}>Card Holder</span>
                  <span className={styles.cardDetailValue}>{cardDetails.cardHolder}</span>
                </div>
                <div className={styles.cardDetailItem}>
                  <span className={styles.cardDetailLabel}>Expires</span>
                  <span className={styles.cardDetailValue}>{cardDetails.expiryMonth}/{cardDetails.expiryYear}</span>
                </div>
                {showFullDetails && (
                  <div className={styles.cardDetailItem}>
                    <span className={styles.cardDetailLabel}>CVV</span>
                    <span className={styles.cardDetailValue}>{cardDetails.cvv}</span>
                  </div>
                )}
              </div>
            </div>
            
            {isFrozen && (
              <div className={styles.frozenOverlay}>
                <span className="material-symbols-outlined">ac_unit</span>
                <span>Card Frozen</span>
              </div>
            )}
          </div>

          <div className={styles.cardActions}>
            <button 
              onClick={toggleCardDetails}
              className={styles.primaryActionBtn}
            >
              <span className="material-symbols-outlined">
                {showFullDetails ? 'visibility_off' : 'visibility'}
              </span>
              <span>{showFullDetails ? 'Hide Card Details' : 'Show Card Details'}</span>
            </button>
          </div>
        </section>

        <section className={styles.secondaryActions}>
          <button 
            onClick={handleFreezeCard}
            disabled={isLoading}
            className={`${styles.actionBtn} ${isFrozen ? styles.frozenAction : ''}`}
          >
            <span className="material-symbols-outlined">ac_unit</span>
            <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
          </button>
          <button 
            onClick={handleDeleteCard}
            disabled={isLoading}
            className={styles.dangerActionBtn}
          >
            <span className="material-symbols-outlined">delete</span>
            <span>Delete Card</span>
          </button>
        </section>
      </div>

      {/* Right Column: Details & Activity */}
      <div className={styles.rightColumn}>
        <section className={styles.securitySection}>
          <h3 className={styles.securityTitle}>Usage Security</h3>
          <div className={styles.securityGrid}>
            <div className={styles.securityItem}>
              <span className="material-symbols-outlined">lock</span>
              <span>Encrypted Data</span>
            </div>
            <div className={styles.securityItem}>
              <span className="material-symbols-outlined">verified_user</span>
              <span>PCI DSS Compliant</span>
            </div>
            <div className={styles.securityItem}>
              <span className="material-symbols-outlined">shield</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </section>

        <section className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Activity</h3>
            <Link href="/transactions" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          
          <div className={styles.activityList}>
            {recentActivity.map(activity => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <div className={styles.activityIcon}>
                    <span className="material-symbols-outlined">{activity.icon}</span>
                  </div>
                  <div className={styles.activityDetails}>
                    <span className={styles.activityMerchant}>{activity.merchant}</span>
                    <span className={styles.activityDate}>
                      {activity.date}, {activity.time}
                    </span>
                  </div>
                </div>
                <span className={styles.activityAmount}>
                  {formatCurrency(activity.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.retailersSection}>
          <h4 className={styles.retailersTitle}>Accepted At Premium Retailers</h4>
          <div className={styles.retailersList}>
            <span>SSENSE</span>
            <span>Mytheresa</span>
            <span>Net-a-Porter</span>
            <span>Farfetch</span>
          </div>
        </section>
      </div>

      {/* Mobile Navigation */}
      <nav className={styles.mobileNav}>
        <Link href="/wallet" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>
        <Link href="/virtual-card" className={`${styles.mobileNavItem} ${styles.activeMobileNav}`}>
          <span className="material-symbols-outlined">credit_card</span>
          <span>Cards</span>
        </Link>
        <Link href="/transactions" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span>Activity</span>
        </Link>
        <Link href="/profile" className={styles.mobileNavItem}>
          <span className="material-symbols-outlined">person</span>
          <span>Settings</span>
        </Link>
      </nav>
    </main>
  )
}