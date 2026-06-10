import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    // Check auth session
    const username = await getSessionUser();
    if (!username) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { sku } = await params;

    if (!sku) {
      return NextResponse.json({ error: 'SKU requerido' }, { status: 400 });
    }

    // Delete product from database
    await db.product.delete({
      where: { sku },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
