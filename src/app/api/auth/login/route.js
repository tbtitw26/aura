import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { generateToken, formatUserResponse } from '@/lib/auth';
import { config } from '@/config';

export async function POST(request) {
  try {
    console.log('📝 Login attempt started...');
    console.log('🔍 TEST_MODE from config:', config.testMode);
    
    await connectToDatabase();
    console.log('✅ Database connected');
    
    const body = await request.json();
    const { email, password, rememberMe } = body;
    
    console.log(`📧 Login attempt for email: ${email}`);
    
    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('✅ User found, checking password...');
    console.log('🔍 User emailVerified:', user.emailVerified);
    console.log('🔍 config.testMode:', config.testMode);
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('✅ Password valid');
    
    // 🔥🔥🔥 ГОЛОВНА ПЕРЕВІРКА 🔥🔥🔥
    // Якщо TEST_MODE вимкнено І email не верифікований -> БЛОКУЄМО
    if (config.testMode === false && user.emailVerified === false) {
      console.log('❌❌❌ EMAIL NOT VERIFIED - BLOCKING LOGIN ❌❌❌');
      return NextResponse.json(
        { 
          error: 'Please verify your email before logging in.',
          message: 'Check your inbox for the verification link we sent you.',
          needVerification: true 
        },
        { status: 403 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      console.log('❌ Account is deactivated');
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }
    
    console.log('✅ Email verified or test mode, logging in...');
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);
    
    // Get wallet for response
    const wallet = await Wallet.findOne({ userId: user._id });
    
    // Set cookie expiry based on remember me
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    
    const response = NextResponse.json({
      success: true,
      user: formatUserResponse(user),
      wallet: wallet ? {
        balances: wallet.balances,
        totalBalance: wallet.totalBalance,
      } : null,
      token,
    });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
    
    console.log('✅ Login successful for:', user.email);
    return response;
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}