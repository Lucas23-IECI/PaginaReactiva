import { NextResponse } from 'next/server';
import db from '@/lib/db';
import productsJson from '@/data/products.json';
import type { Product } from '@/types';

export async function GET() {
  try {
    // Intenta consultar la base de datos PostgreSQL via Prisma
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
    console.warn('Database unavailable, falling back to local products.json:', (error as Error).message);

    // Fallback: carga los datos desde el archivo JSON local
    // Esto permite que el sitio funcione sin PostgreSQL en desarrollo
    const mapped: Product[] = (productsJson as Array<Record<string, unknown>>)
      .filter((p) => p.available !== false)
      .map((p) => ({
        sku: String(p.sku),
        name: String(p.name),
        category: String(p.category),
        description: String(p.description),
        priceUnit: typeof p.priceUnit === 'number' ? p.priceUnit : null,
        priceBox: typeof p.priceBox === 'number' ? p.priceBox : null,
        imageUrl: String(p.imageUrl),
        available: p.available !== false,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(mapped);
  }
}
export const dynamic = 'force-dynamic';