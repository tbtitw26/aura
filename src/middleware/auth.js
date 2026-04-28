import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function authMiddleware(request) {
  // Get token from cookies or Authorization header
  const token = request.cookies.get('auth-token')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user info to request
  request.user = decoded;
  
  return null; // Continue to API route
}

// Higher-order function to protect API routes
export function withAuth(handler) {
  return async function(req, context) {
    const authError = await authMiddleware(req);
    
    if (authError) {
      return authError;
    }
    
    return handler(req, context);
  };
}

// Role-based access
export function withRole(allowedRoles) {
  return function(handler) {
    return async function(req, context) {
      const authError = await authMiddleware(req);
      
      if (authError) {
        return authError;
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return handler(req, context);
    };
  };
}