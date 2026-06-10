import crypto from 'crypto';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'reactiva-secret-key-2026-very-secure-signature-key';

export function signSession(username: string): string {
  const payload = JSON.stringify({ username, exp: Date.now() + 24 * 60 * 60 * 1000 }); // 24 hours
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

export function verifySession(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadBase64, signature] = parts;
    const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    if (payload.exp < Date.now()) return null; // Expired

    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(payloadStr);
    const expectedSignature = hmac.digest('hex');

    if (signature === expectedSignature) {
      return payload.username;
    }
  } catch (err) {
    console.error('Session verify failed:', err);
  }
  return null;
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('reactiva_session')?.value;
  if (!token) return null;
  return verifySession(token);
}
