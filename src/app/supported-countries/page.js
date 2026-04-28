'use client'
import Link from 'next/link'
import { useState } from 'react'
import styles from './page.module.scss'

export default function SupportedCountries() {
  const [activeTab, setActiveTab] = useState('regions')

  const regions = [
    { name: 'Europe', icon: 'east' },
    { name: 'North America', icon: 'east' },
    { name: 'Asia-Pacific', icon: 'east' },
    { name: 'South America', icon: 'east' },
    { name: 'Middle East', icon: 'east' }
  ]

  const countries = [
    { region: 'Europe', countries: ['United Kingdom', 'France', 'Germany', 'Switzerland', 'Italy', 'Spain', 'Netherlands', 'Luxembourg'] },
    { region: 'North America', countries: ['United States', 'Canada', 'Mexico'] },
    { region: 'Asia-Pacific', countries: ['Singapore', 'Japan', 'South Korea', 'Australia', 'Hong Kong', 'UAE'] },
    { region: 'South America', countries: ['Brazil', 'Argentina', 'Chile', 'Colombia'] },
    { region: 'Middle East', countries: ['Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'] }
  ]

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Availability & Security</h1>
          <p className={styles.heroSubtitle}>
            Global access with trusted protection
          </p>
        </section>

        {/* Availability Map & Regions Bento Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridContainer}>
            {/* Map Card */}
            <div className={styles.mapCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.cardBorder}></div>
              <div className={styles.cardContent}>
                <h2 className={styles.mapTitle}>Service Availability</h2>
                <p className={styles.mapDescription}>
                  Our service is available in most countries worldwide
                </p>
                <div className={styles.mapContainer}>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKe7JRG0_nF3Xg4MjH4uRRnR2FAl48wEVf3Iy-LH_D_cXAMQzWzOS8vPXzk9jJoP0hmEhXZsdGHRgCQSYQMvWYWA6m8w8sNAegoiz1dXy7d7Xp3GQcHMbrlalgG0IM_6jsAp9atUFn8WKZOiwsREee5n0UZj0R2RzJjJ9CbcSrPcLHXLFYMFDAWAGcYNgXir4Z5vcN2bseD_NNYrQpM1sfHFzXx0bgEmzCXT560KZ4smasR2c25KBgv6wsbhrAoiuqqwWe5dvC2O4"
                    alt="Stylized minimalist world map"
                    className={styles.worldMap}
                  />
                </div>
              </div>
            </div>

            {/* Regions Card */}
            <div className={styles.regionsCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.cardBorder}></div>
              <div className={styles.regionsContent}>
                <h3 className={styles.regionsTitle}>Supported Regions</h3>
                <ul className={styles.regionsList}>
                  {regions.map((region, idx) => (
                    <li key={idx} className={styles.regionItem}>
                      <span>{region.name}</span>
                      <span className="material-symbols-outlined">{region.icon}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Countries Section */}
        <section className={styles.detailedSection}>
          <div className={styles.detailedHeader}>
            <h2 className={styles.detailedTitle}>Complete List of Supported Countries</h2>
            <p className={styles.detailedSubtitle}>
              We're continuously expanding our global footprint
            </p>
          </div>
          
          <div className={styles.countriesGrid}>
            {countries.map((region, idx) => (
              <div key={idx} className={styles.countryCard}>
                <h3 className={styles.regionHeader}>{region.region}</h3>
                <ul className={styles.countryList}>
                  {region.countries.map((country, cIdx) => (
                    <li key={cIdx}>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{country}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className={styles.securitySection}>
          <div className={styles.securityHeader}>
            <span className="material-symbols-outlined">security</span>
            <h2 className={styles.securityTitle}>Security Infrastructure</h2>
          </div>
          <div className={styles.securityGrid}>
            <div className={styles.securityCard}>
              <span className="material-symbols-outlined">lock</span>
              <h3>Data Encryption</h3>
              <p>End-to-end AES-256 encryption for all sensitive data transactions</p>
            </div>
            <div className={styles.securityCard}>
              <span className="material-symbols-outlined">verified_user</span>
              <h3>PCI DSS Compliant</h3>
              <p>Level 1 compliance for all payment processing operations</p>
            </div>
            <div className={styles.securityCard}>
              <span className="material-symbols-outlined">fingerprint</span>
              <h3>Biometric Authentication</h3>
              <p>Advanced biometric security for account access and verification</p>
            </div>
            <div className={styles.securityCard}>
              <span className="material-symbols-outlined">monitor_heart</span>
              <h3>24/7 Monitoring</h3>
              <p>Real-time fraud detection and prevention systems</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}