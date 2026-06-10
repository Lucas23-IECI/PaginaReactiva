import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Check auth session
    const username = await getSessionUser();
    if (!username) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { sku, name, category, description, priceUnit, priceBox, imageUrl, available } = body;

    // Validation
    if (!sku || !name || !category || !description) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    // Check if SKU already exists
    const existingProduct = await db.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'Ya existe un insumo con este código SKU' }, { status: 400 });
    }

    // Create product in database
    const newProduct = await db.product.create({
      data: {
        sku: sku.trim(),
        name: name.trim(),
        category,
        description: description.trim(),
        priceUnit: priceUnit !== null && priceUnit !== undefined ? Number(priceUnit) : null,
        priceBox: priceBox !== null && priceBox !== undefined ? Number(priceBox) : null,
        imageUrl: imageUrl || 'https://reactiva.cl/wp-content/uploads/2026/01/LogoReactiva-BN.png', // Fallback image
        available: available !== undefined ? Boolean(available) : true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
