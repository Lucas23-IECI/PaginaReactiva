import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Fetch products ordered by name alphabetically
    const products = await db.product.findMany({
      where: {
        available: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error serving products API from database:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
