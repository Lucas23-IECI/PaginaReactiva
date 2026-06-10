'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Edit, Trash2, Plus, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Product } from '@/types';

interface AdminDashboardProps {
  initialProducts: Product[];
}

export default function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (sku: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este producto del catálogo?')) {
      return;
    }

    setDeletingId(sku);
    try {
      const response = await fetch(`/api/admin/products/${sku}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.sku !== sku));
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar el producto');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error en el servidor al intentar eliminar.');
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryName = (slug: string) => {
    const names: Record<string, string> = {
      'toma-de-muestras': 'Toma de Muestras',
      'accesorios-proceso-de-examen': 'Proceso de Examen',
      'kit-de-diagnostico': 'Kits de Diagnóstico',
      'solventes-y-reactivos-liquidos': 'Solventes y Reactivos',
      'reactivos-deshidratados': 'Reactivos Deshidratados',
      'epp': 'EPP y Prevención',
      'papeleria': 'Papelería Clínica'
    };
    return names[slug] || slug;
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'No def.';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
            Listado de Productos
          </h1>
          <p className="text-xs text-muted">
            Administre el catálogo, edite precios y agregue nuevos insumos médicos.
          </p>
        </div>
        <Link
          href="/admin/dashboard/nuevo"
          className="px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-teal-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Agregar Producto</span>
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-950 p-4 border border-border/70 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-muted" />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all cursor-pointer"
        >
          <option value="all">Todas las Categorías</option>
          <option value="toma-de-muestras">Toma de Muestras</option>
          <option value="accesorios-proceso-de-examen">Proceso de Examen</option>
          <option value="kit-de-diagnostico">Kits de Diagnóstico</option>
          <option value="solventes-y-reactivos-liquidos">Solventes y Reactivos</option>
          <option value="reactivos-deshidratados">Reactivos Deshidratados</option>
          <option value="epp">EPP y Prevención</option>
          <option value="papeleria">Papelería Clínica</option>
        </select>
      </div>

      {/* Table container */}
      <div className="w-full bg-white dark:bg-slate-950 border border-border/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-border text-[10px] uppercase font-bold text-muted tracking-wider">
                <th className="p-4 w-16 text-center">Imagen</th>
                <th className="p-4 w-20">SKU</th>
                <th className="p-4">Nombre Insumo</th>
                <th className="p-4">Categoría</th>
                <th className="p-4 w-28 text-right">P. Unitario</th>
                <th className="p-4 w-28 text-right">P. Caja</th>
                <th className="p-4 w-20 text-center">Estado</th>
                <th className="p-4 w-24 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted font-semibold">
                    No se encontraron productos en la base de datos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => (
                  <tr key={p.sku} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    {/* Image */}
                    <td className="p-4 text-center">
                      <div className="relative w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 border border-border/50 overflow-hidden flex items-center justify-center mx-auto">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <span className="text-[8px] text-muted">No img</span>
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {p.sku}
                    </td>

                    {/* Name */}
                    <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate" title={p.name}>
                      {p.name}
                    </td>

                    {/* Category */}
                    <td className="p-4 text-muted">
                      {getCategoryName(p.category)}
                    </td>

                    {/* Price Unit */}
                    <td className="p-4 text-right font-bold text-teal-600 dark:text-teal-400">
                      {formatPrice(p.priceUnit)}
                    </td>

                    {/* Price Box */}
                    <td className="p-4 text-right font-bold text-secondary">
                      {formatPrice(p.priceBox)}
                    </td>

                    {/* Visibility Status */}
                    <td className="p-4 text-center">
                      <span className="flex items-center justify-center">
                        {p.available ? (
                          <span title="Activo"><CheckCircle size={16} className="text-emerald-500" /></span>
                        ) : (
                          <span title="Desactivado"><XCircle size={16} className="text-red-500" /></span>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/dashboard/editar/${p.sku}`}
                          className="p-1.5 rounded-lg border border-border/70 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-all"
                          title="Editar"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.sku)}
                          disabled={deletingId === p.sku}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          {deletingId === p.sku ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
