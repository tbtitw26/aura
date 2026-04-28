export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Test Mode
  testMode: process.env.TEST_MODE === 'true',
  testUserBalance: parseFloat(process.env.TEST_USER_BALANCE) || 1000000,
  testUserEmail: process.env.TEST_USER_EMAIL || 'test@aura.finance',
  testUserPassword: process.env.TEST_USER_PASSWORD || 'Test123456',
  
  // Currencies
  supportedCurrencies: ['EUR', 'USD', 'GBP', 'JPY', 'CHF'],
  
  // Limits
  minTopUp: 10,
  maxBalance: 1000000,
  
  // Fees
  cardTopUpFee: 1.5, // 1.5%
  currencyConversionFee: 0.5, // 0.5%
  
  // Transaction statuses
  transactionStatus: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  }
}