'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function Terms() {
  const [activeSection, setActiveSection] = useState('terms')
  const [lastUpdated] = useState('Oct 2023')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['terms', 'eligibility', 'wallet', 'privacy', 'disclosure', 'aml', 'cookie']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navItems = [
    { id: 'terms', label: 'Terms of Service', icon: 'gavel' },
    { id: 'privacy', label: 'Privacy Policy', icon: 'policy' },
    { id: 'disclosure', label: 'Investment Disclosure', icon: 'security' },
    { id: 'aml', label: 'AML Policy', icon: 'verified_user' },
    { id: 'cookie', label: 'Cookie Policy', icon: 'cookie' }
  ]

  const handleContactLegal = () => {
    window.location.href = '/contact'
  }

  return (
    <div className={styles.container}>
      {/* Main Content Layout */}
      <main className={styles.main}>
        {/* SideNavBar Desktop */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Legal Center</h2>
              <p className={styles.sidebarDate}>Last updated {lastUpdated}</p>
            </div>
            
            <nav className={styles.sidebarNav}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`${styles.navLink} ${
                    activeSection === item.id ? styles.activeNavLink : ''
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Document Content */}
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>Terms & Conditions</h1>
            <p className={styles.articleSubtitle}>
              Please read these terms and conditions carefully before using our exclusive financial 
              services platform. Your access to and use of the Service is conditioned on your 
              acceptance of and compliance with these Terms.
            </p>
            <div className={styles.divider}></div>
          </header>

          <div className={styles.sectionsContainer}>
            {/* Section 1: Terms of Service */}
            <section id="terms" className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Introduction</h2>
              <div className={styles.sectionContent}>
                <p>
                  Welcome to Aureus. These Terms govern your use of our luxury fintech services, 
                  including wealth management, concierge payments, and bespoke investment portfolios. 
                  By accessing our platform, you agree to be bound by these sophisticated standards of service.
                </p>
                <p>
                  Aureus operates as a premier financial institution, prioritizing security, discretion, 
                  and flawless execution. We reserve the right to modify these terms to reflect evolving 
                  regulatory landscapes and service enhancements.
                </p>
              </div>
            </section>

            {/* Section 2: Eligibility */}
            <section id="eligibility" className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Eligibility & Access</h2>
              <div className={styles.sectionContent}>
                <p>
                  Membership to Aureus is strictly by invitation or subject to rigorous financial vetting. 
                  To utilize our services, you must:
                </p>
                <ul className={styles.list}>
                  <li>Be at least 21 years of age.</li>
                  <li>Maintain a minimum qualifying portfolio balance as defined in your onboarding agreement.</li>
                  <li>Provide verified, accurate personal and financial information in compliance with international KYC standards.</li>
                  <li>Ensure that your use of the Service complies with all local, state, national, and international laws.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Wallet & Payments */}
            <section id="wallet" className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Wallet & Payments</h2>
              <div className={styles.sectionContent}>
                <p>
                  The Aureus Digital Wallet provides frictionless access to global liquidity. 
                  Transactions are secured via military-grade encryption and executed with priority routing.
                </p>
                
                <div className={styles.walletCard}>
                  <div className={styles.walletCardHighlight}></div>
                  <h3 className={styles.walletCardTitle}>Transaction Limits</h3>
                  <p className={styles.walletCardText}>
                    Standard daily transfer limits apply unless elevated privileges have been granted 
                    by your dedicated relationship manager. Processing times for international wires 
                    may vary based on destination jurisdiction.
                  </p>
                  <p className={styles.walletCardNote}>Refer to Fee Schedule A for details.</p>
                </div>
              </div>
            </section>

            {/* Section 4: Privacy Policy */}
            <section id="privacy" className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Privacy Policy</h2>
              <div className={styles.sectionContent}>
                <p>
                  Your privacy is paramount. We collect and process personal data in accordance with 
                  GDPR and international data protection standards. We never share your information 
                  with third parties without explicit consent, except as required by law.
                </p>
                <p>
                  All data transmitted through our platform is encrypted using AES-256 encryption. 
                  We employ strict access controls and continuous monitoring to ensure the integrity 
                  and confidentiality of your information.
                </p>
              </div>
            </section>

            {/* Section 5: Investment Disclosure */}
            <section id="disclosure" className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Investment Disclosure</h2>
              <div className={styles.sectionContent}>
                <p>
                  Investments involve inherent risks, including the potential loss of principal. 
                  Past performance does not guarantee future results. Aureus provides sophisticated 
                  financial tools but does not guarantee investment outcomes.
                </p>
                <p>
                  All investment decisions made through our platform are solely your responsibility. 
                  We recommend consulting with your personal financial advisor before making significant 
                  investment decisions.
                </p>
              </div>
            </section>

            {/* Section 6: AML Policy */}
            <section id="aml" className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Anti-Money Laundering Policy</h2>
              <div className={styles.sectionContent}>
                <p>
                  Aureus maintains strict anti-money laundering (AML) and counter-terrorism financing 
                  (CTF) protocols. All accounts undergo rigorous due diligence and ongoing transaction 
                  monitoring to detect and prevent illicit financial activities.
                </p>
                <p>
                  We reserve the right to suspend or terminate any account that violates our AML 
                  policies or engages in suspicious activities.
                </p>
              </div>
            </section>

            {/* Section 7: Cookie Policy */}
            <section id="cookie" className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Cookie Policy</h2>
              <div className={styles.sectionContent}>
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze site traffic, and personalize content. You can control cookie preferences 
                  through your browser settings.
                </p>
                <p>
                  Essential cookies are required for platform functionality. Marketing and analytics 
                  cookies can be disabled without affecting core services.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className={styles.contactSection}>
              <h2 className={styles.contactTitle}>Concierge Support</h2>
              <p className={styles.contactText}>
                For inquiries regarding these terms or your account status, your dedicated concierge 
                is available 24/7.
              </p>
              <button onClick={handleContactLegal} className={styles.contactBtn}>
                Contact Legal Team
              </button>
            </section>
          </div>
        </article>
      </main>
    </div>
  )
}