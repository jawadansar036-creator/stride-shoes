import crypto from 'crypto';
import { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'stride_admin_session';

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || 'jawadansar036@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'strideshoes.765';
  const secret = process.env.ADMIN_SESSION_SECRET || 'stride_default_admin_secret_key_987654321';
  return { email, password, secret };
}

export function verifyAdminCredentials(inputEmail: string, inputPass: string): boolean {
  const { email, password } = getAdminCredentials();
  if (!inputEmail || !inputPass) return false;
  
  const isEmailMatch = inputEmail.trim().toLowerCase() === email.trim().toLowerCase();
  const isPassMatch = inputPass.trim() === password.trim();
  
  return isEmailMatch && isPassMatch;
}

export function createAdminToken(email: string): string {
  const { secret } = getAdminCredentials();
  const payload = {
    email: email.trim().toLowerCase(),
    role: 'admin',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifyAdminToken(token: string | undefined | null): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signature] = parts;
    const { secret } = getAdminCredentials();

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadB64)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export function isAuthorizedAdmin(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminToken(cookie).valid;
}
