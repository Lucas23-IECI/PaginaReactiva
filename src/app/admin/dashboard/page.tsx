import React from 'react';
import db from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch all products from SQLite
  const products = await db.product.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Convert Date objects to ISO strings for client component serialization
  const serializedProducts = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <AdminDashboard initialProducts={serializedProducts as any} />;
}
