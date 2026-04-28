'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(5)

  // Mock data - в реальному проекті завантажувати з API
  const allTransactions = [
    {
      id: 1,
      merchant: 'Farfetch',
      merchantInitial: 'F',
      date: 'Oct 12, 2023',
      timestamp: '2023-10-12',
      cardLastFour: '4209',
      amount: 1450.00,
      currency: '£',
      status: 'completed'
    },
    {
      id: 2,
      merchant: 'SSENSE',
      merchantInitial: 'S',
      date: 'Oct 10, 2023',
      timestamp: '2023-10-10',
      cardLastFour: '4209',
      amount: 890.00,
      currency: '£',
      status: 'completed'
    },
    {
      id: 3,
      merchant: 'Mytheresa',
      merchantInitial: 'M',
      date: 'Oct 09, 2023',
      timestamp: '2023-10-09',
      cardLastFour: '4209',
      amount: 2100.00,
      currency: '£',
      status: 'pending'
    },
    {
      id: 4,
      merchant: 'Net-a-Porter',
      merchantInitial: 'N',
      date: 'Oct 05, 2023',
      timestamp: '2023-10-05',
      cardLastFour: '4209',
      amount: 3200.00,
      currency: '£',
      status: 'completed'
    },
    {
      id: 5,
      merchant: 'LuisaViaRoma',
      merchantInitial: 'L',
      date: 'Sep 28, 2023',
      timestamp: '2023-09-28',
      cardLastFour: '4209',
      amount: 560.00,
      currency: '£',
      status: 'completed'
    },
    {
      id: 6,
      merchant: 'Browns Fashion',
      merchantInitial: 'B',
      date: 'Sep 20, 2023',
      timestamp: '2023-09-20',
      cardLastFour: '4209',
      amount: 1890.00,
      currency: '£',
      status: 'completed'
    }
  ]

  useEffect(() => {
    // Симуляція завантаження даних
    setTimeout(() => {
      setTransactions(allTransactions)
      setIsLoading(false)
    }, 500)
  }, [])

  // Фільтрація транзакцій
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || transaction.status === statusFilter
    
    let matchesDate = true
    if (dateFilter === 'month') {
      const transactionDate = new Date(transaction.timestamp)
      const now = new Date()
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
      matchesDate = transactionDate >= monthAgo
    } else if (dateFilter === 'year') {
      const transactionDate = new Date(transaction.timestamp)
      const now = new Date()
      const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1))
      matchesDate = transactionDate >= yearAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const visibleTransactions = filteredTransactions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTransactions.length

  const loadMore = () => {
    setVisibleCount(prev => prev + 5)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted
      case 'pending':
        return styles.statusPending
      default:
        return styles.statusDefault
    }
  }

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle}>
          A complete history of your purchases and card activity, curated for clarity.
        </p>
      </section>

      {/* Filter Bar */}
      <section className={styles.filterSection}>
        <div className={styles.searchWrapper}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search merchants, amounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.selectWrapper}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="">Status: All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <span className="material-symbols-outlined">expand_more</span>
          </div>

          <div className={styles.selectWrapper}>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.select}
            >
              <option value="">Date: All Time</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </section>

      {/* Transaction List */}
      <section className={styles.transactionsSection}>
        {/* Header Row - Desktop */}
        <div className={styles.listHeader}>
          <div className={styles.headerMerchant}>Merchant</div>
          <div className={styles.headerDate}>Date</div>
          <div className={styles.headerCard}>Card</div>
          <div className={styles.headerStatus}>Status</div>
          <div className={styles.headerAmount}>Amount</div>
        </div>

        {/* Transaction Items */}
        <div className={styles.transactionList}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className={styles.emptyState}>
              <span className="material-symbols-outlined">receipt_long</span>
              <p>No transactions found</p>
            </div>
          ) : (
            <>
              {visibleTransactions.map((transaction) => (
                <div key={transaction.id} className={styles.transactionItem}>
                  <div className={styles.transactionMerchant}>
                    <div className={styles.merchantAvatar}>
                      {transaction.merchantInitial}
                    </div>
                    <div className={styles.merchantInfo}>
                      <span className={styles.merchantName}>{transaction.merchant}</span>
                      <span className={styles.mobileDetails}>
                        {transaction.date} • **** {transaction.cardLastFour}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.transactionDate}>
                    {transaction.date}
                  </div>
                  
                  <div className={styles.transactionCard}>
                    <span className="material-symbols-outlined">credit_card</span>
                    •••• {transaction.cardLastFour}
                  </div>
                  
                  <div className={styles.transactionStatus}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className={styles.transactionAmount}>
                    {transaction.currency}{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Load More Button */}
        {!isLoading && hasMore && (
          <div className={styles.loadMoreContainer}>
            <button onClick={loadMore} className={styles.loadMoreBtn}>
              LOAD MORE
            </button>
          </div>
        )}
      </section>

      {/* Insight Block */}
      <section className={styles.insightBlock}>
        <div className={styles.insightBgDecoration}></div>
        <div className={styles.insightContent}>
          <h3>Secure & Transparent</h3>
          <p>Every transaction is protected by bank-grade encryption and monitored by our concierge team 24/7.</p>
        </div>
        <div className={styles.insightIcons}>
          <span className="material-symbols-outlined">verified_user</span>
          <span className="material-symbols-outlined">account_balance</span>
        </div>
      </section>
    </main>
  )
}