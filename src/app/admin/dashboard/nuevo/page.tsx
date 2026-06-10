import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function NuevoProductoPage() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[70vh]">
      <ProductForm />
    </div>
  );
}
export const dynamic = 'force-dynamic';
