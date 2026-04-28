import 'dotenv/config';
import { connectToDatabase } from '../src/lib/db.js';

async function main() {
  try {
    await connectToDatabase();

    const { default: User } = await import('../src/models/User.js');
    const { default: Wallet } = await import('../src/models/Wallet.js');
    const { default: Card } = await import('../src/models/Card.js');
    const { default: Transaction } = await import('../src/models/Transaction.js');

    const testEmail = process.env.SEED_TEST_EMAIL || 'test+dev@local.invalid';

    console.log('Seeding database...');

    // Create or update test user
    let user = await User.findOne({ email: testEmail });
    if (!user) {
      user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: process.env.SEED_TEST_PASSWORD || 'Password123!',
        phone: '+0000000000',
        dateOfBirth: new Date('1990-01-01'),
        address: { street: 'Test St 1', city: 'Testville', postcode: '00000', country: 'Testland' },
        emailVerified: true,
      });
      console.log('Created test user:', user.email);
    } else {
      console.log('Test user exists, skipping create:', user.email);
    }

    // Ensure wallet exists and set large balance (1,000,000 EUR) for testing
    let wallet = await Wallet.findOne({ userId: user._id });
    const seedAmount = parseFloat(process.env.SEED_TEST_AMOUNT || '1000000');
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user._id,
        balances: { EUR: seedAmount, USD: 0, GBP: 0, JPY: 0, CHF: 0 },
      });
      console.log('Created wallet with balance:', seedAmount);
    } else {
      wallet.balances = { ...wallet.balances, EUR: seedAmount };
      await wallet.save();
      console.log('Updated wallet EUR balance to:', seedAmount);
    }

    // Create a sample virtual card for the user
    let card = await Card.findOne({ userId: user._id });
    if (!card) {
      card = await Card.create({
        userId: user._id,
        brand: 'VIRTUAL',
        last4: '4242',
        expMonth: 12,
        expYear: 2030,
        cardholderName: `${user.firstName} ${user.lastName}`,
        isVirtual: true,
      });
      console.log('Created sample card for user.');
    } else {
      console.log('Sample card exists.');
    }

    // Create a sample deposit transaction
    const txn = await Transaction.create({
      userId: user._id,
      type: 'deposit',
      status: 'completed',
      amount: seedAmount,
      currency: 'EUR',
      fee: 0,
      description: 'Seed deposit (test account)',
      completedAt: new Date(),
    });
    console.log('Created transaction:', txn._id.toString());

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

main();
