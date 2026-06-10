import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('reactiva_session');
  return response;
}
export const dynamic = 'force-dynamic';
