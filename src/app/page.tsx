'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import VirtualCard from '@/components/ui/VirtualCard'
import styles from './page.module.scss'

export default function Home() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState(0)

  const steps = [
    { number: '01', title: 'Register', desc: 'Complete our high-speed KYC in under 2 minutes.' },
    { number: '02', title: 'Add Balance', desc: 'Fund your vault via bank transfer or credit card.' },
    { number: '03', title: 'Generate', desc: 'Create a virtual card for a specific purchase or store.' },
    { number: '04', title: 'Shop', desc: 'Check out securely at any global luxury retailer.' }
  ]

  const faqs = [
    {
      question: "How does the membership work?",
      answer: "Membership is by application or invitation. Once accepted, you gain access to unlimited virtual card generation, our global currency vault, and a dedicated personal concierge."
    },
    {
      question: "Are there limits on card generation?",
      answer: "No. Premium members can generate an unlimited number of single-use or merchant-specific cards as needed for their transactions."
    },
    {
      question: "What boutiques support Aura?",
      answer: "Aura cards are issued via Visa and Mastercard networks, meaning they are accepted at virtually every luxury retailer and boutique globally, both online and in-store."
    },
    {
      question: "How secure is my data?",
      answer: "We prioritize privacy above all. Your primary funding source is never revealed to retailers, and your account data is protected by the highest standards of financial encryption."
    }
  ]

  const handleApplyMembership = () => router.push('/register')
  const handleHowItWorks = () => router.push('/how-it-works')
  const handleExploreConcierge = () => router.push('/contact')
  const handleViewWallet = () => router.push('/wallet')
  const handleAddFunds = () => router.push('/buy-balance')
  const handleRequestAccess = () => router.push('/register')

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Smart Shopping Cards for <br />
              <span className={styles.heroSpan}>Global Luxury</span>
            </h1>
            <p className={styles.heroDescription}>
              Experience the next generation of private finance. Secure, instant virtual cards 
              designed for the world's most exclusive boutiques.
            </p>
            <div className={styles.heroButtons}>
              <button onClick={handleApplyMembership} className={styles.primaryBtn}>Apply for Membership</button>
              <button onClick={handleHowItWorks} className={styles.secondaryBtn}>
                <span>How it works</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className={styles.heroCard}>
            <VirtualCard />
          </div>
        </div>
      </section>

      {/* Trusted Platforms */}
      <section className={styles.trusted}>
        <div className={styles.container}>
          <p className={styles.trustedLabel}>Seamless Integration with Global Ateliers</p>
          <div className={styles.platforms}>
            <div className={styles.platform}>Net-a-Porter</div>
            <div className={styles.platform}>SSENSE</div>
            <div className={styles.platform}>Mytheresa</div>
            <div className={styles.platform}>Farfetch</div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className={styles.valueProps}>
        <div className={styles.container}>
          <div className={styles.propsGrid}>
            <div className={styles.propItem}>
              <span className="material-symbols-outlined">public</span>
              <h3>Global Access</h3>
              <p>Shop at any luxury boutique worldwide without regional restrictions or merchant blocks.</p>
            </div>
            <div className={styles.propItem}>
              <span className="material-symbols-outlined">encrypted</span>
              <h3>Secure Payments</h3>
              <p>Single-use or merchant-locked cards ensure your main accounts remain completely invisible.</p>
            </div>
            <div className={styles.propItem}>
              <span className="material-symbols-outlined">bolt</span>
              <h3>Instant Cards</h3>
              <p>Generate a new Visa or Mastercard in seconds. Ready for checkout immediately.</p>
            </div>
            <div className={styles.propItem}>
              <span className="material-symbols-outlined">currency_exchange</span>
              <h3>Multi-currency</h3>
              <p>Store and spend in USD, EUR, GBP, and JPY with institutional-grade exchange rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Effortless Acquisition</h2>
            <p>The invisible concierge process for your digital transactions.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((step, idx) => (
              <div key={idx} className={styles.step}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className={styles.parallax}>
        <div className={styles.parallaxBg}></div>
        <div className={styles.parallaxOverlay}></div>
        <div className={styles.parallaxContent}>
          <h2>Shop globally without limits.</h2>
          <p>Aura removes the digital borders of luxury commerce, allowing you to acquire what you desire, wherever it exists.</p>
          <button onClick={handleExploreConcierge} className={styles.parallaxBtn}>Explore Concierge</button>
        </div>
      </section>

      {/* Features Simple Grid */}
      <section className={styles.featuresGrid}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresGridInner}>
            <div className={styles.walletCard}>
              <div>
                <span className={styles.cardLabel}>Centralized Control</span>
                <h3 className={styles.cardTitle}>The Unified Wallet</h3>
                <p className={styles.cardText}>Monitor all your cards and transactions in a single high-fidelity interface designed for clarity.</p>
              </div>
              <div className={styles.walletCardFooter}>
                <div className={styles.avatars}>
                  <div className={styles.avatar}></div>
                  <div className={styles.avatar}></div>
                  <div className={styles.avatar}></div>
                </div>
                <button onClick={handleViewWallet} className={styles.viewWalletBtn}>View Wallet</button>
              </div>
            </div>

            <div className={styles.instantCard}>
              <span className="material-symbols-outlined">add_card</span>
              <h3>Instant Generation</h3>
              <p>Create a temporary card number for one-time drops or high-value limited editions.</p>
            </div>

            <div className={styles.spendingCard}>
              <h3>Spending Limits</h3>
              <p>Set granular daily or monthly limits for each virtual card in your vault.</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
            </div>

            <div className={styles.topupsCard}>
              <div>
                <h3>Auto Top-ups</h3>
                <p>Never miss an exclusive release. Automatically fund your wallet when balances dip below your threshold.</p>
              </div>
              <span className="material-symbols-outlined">refresh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Preview UI Mockup */}
      <section className={styles.walletPreview}>
        <div className={styles.walletPreviewContainer}>
          <div className={styles.walletPreviewLeft}>
            <div className={styles.walletMockup}>
              <div className={styles.walletMockupHeader}>
                <h4>My Wallet</h4>
                <span className="material-symbols-outlined">more_horiz</span>
              </div>
              <div className={styles.walletMockupBody}>
                <div className={styles.balanceItem}>
                  <div className={styles.balanceIcon}>€</div>
                  <div>
                    <div className={styles.balanceTitle}>Euro Account</div>
                    <div className={styles.balanceSubtitle}>Primary Currency</div>
                  </div>
                  <div className={styles.balanceAmount}>€12,450.00</div>
                </div>
                <div className={styles.balanceItem}>
                  <div className={styles.balanceIcon}>$</div>
                  <div>
                    <div className={styles.balanceTitle}>US Dollar</div>
                    <div className={styles.balanceSubtitle}>Secondary Vault</div>
                  </div>
                  <div className={styles.balanceAmount}>$8,200.00</div>
                </div>
                <button onClick={handleAddFunds} className={styles.addFundsBtn}>
                  <span className="material-symbols-outlined">add</span>
                  <span>Add Funds</span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.walletPreviewRight}>
            <h2>Intelligent Asset Management</h2>
            <p>Swap between global currencies instantly to take advantage of pricing disparities in different luxury markets.</p>
            <ul>
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Real-time interbank exchange rates</span>
              </li>
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Zero hidden fees for premium members</span>
              </li>
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Automated tax documentation for luxury goods</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security Block */}
      <section className={styles.securityBlock}>
        <div className={styles.securityContainer}>
          <div className={styles.securityContent}>
            <h2>Bank-Grade Security,<br /><span>Boutique Service.</span></h2>
            <p>We utilize PCI DSS Level 1 compliance and 256-bit AES encryption to ensure your data remains as exclusive as your wardrobe.</p>
            <div className={styles.securityIcons}>
              <span className="material-symbols-outlined">verified_user</span>
              <span className="material-symbols-outlined">shield_with_heart</span>
              <span className="material-symbols-outlined">lock</span>
            </div>
          </div>
          <div className={styles.securityLogos}>
            <span>VISA</span>
            <span>Mastercard</span>
            <span>PCI-DSS</span>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle}>Inquiries</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <button 
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span>{faq.question}</span>
                  <span className="material-symbols-outlined">
                    {openFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContainer}>
          <h2>Ready for the Aura experience?</h2>
          <p>Join a select community of global shoppers who demand precision, privacy, and performance in their financial tools.</p>
          <button onClick={handleRequestAccess} className={styles.ctaButton}>Request Access Now</button>
        </div>
      </section>
    </main>
  )
}