'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, AlertCircle } from 'lucide-react';
import { Product } from '@/types';

// Form validation schema with Zod
const productSchema = z.object({
  sku: z.string().min(2, 'El SKU debe tener al menos 2 caracteres'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  category: z.string().min(1, 'Debe seleccionar una categoría'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  priceUnit: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().nullable().optional()),
  priceBox: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().nullable().optional()),
  imageUrl: z.string().optional(),
  available: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      sku: initialData?.sku || '',
      name: initialData?.name || '',
      category: initialData?.category || 'toma-de-muestras',
      description: initialData?.description || '',
      priceUnit: initialData?.priceUnit ?? '',
      priceBox: initialData?.priceBox ?? '',
      imageUrl: initialData?.imageUrl || '',
      available: initialData?.available ?? true,
    } as any,
  });

  const onSubmit = async (values: ProductFormValues) => {
    setError('');
    setLoading(true);

    try {
      const url = isEditMode 
        ? `/api/admin/products/${initialData.sku}`
        : '/api/admin/products';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Ocurrió un error al guardar el producto');
      }
    } catch (err) {
      console.error('Submit form error:', err);
      setError('Error de comunicación con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-border/85 p-6 sm:p-8 rounded-3xl shadow-sm">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {isEditMode ? `Editar Producto: ${initialData.sku}` : 'Crear Nuevo Producto'}
        </h2>
      </div>

      {error && (
        <div className="p-3 mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SKU */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Código SKU
            </label>
            <input
              type="text"
              disabled={isEditMode}
              placeholder="Ej: 1011"
              {...register('sku')}
              className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white disabled:opacity-50 transition-all"
            />
            {errors.sku && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.sku.message}</span>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Categoría
            </label>
            <select
              {...register('category')}
              className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all cursor-pointer"
            >
              <option value="toma-de-muestras">Toma de Muestras</option>
              <option value="accesorios-proceso-de-examen">Proceso de Examen</option>
              <option value="kit-de-diagnostico">Kits de Diagnóstico</option>
              <option value="solventes-y-reactivos-liquidos">Solventes y Reactivos</option>
              <option value="reactivos-deshidratados">Reactivos Deshidratados</option>
              <option value="epp">EPP y Prevención</option>
              <option value="papeleria">Papelería Clínica</option>
            </select>
            {errors.category && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.category.message}</span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Nombre del Producto
          </label>
          <input
            type="text"
            placeholder="Ej: GUANTE QUIRUGICO LATEX LIBRE DE POLVO T.7.0"
            {...register('name')}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
          />
          {errors.name && (
            <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Descripción de Uso
          </label>
          <textarea
            rows={3}
            placeholder="Escriba el detalle de uso o especificaciones técnicas del insumo..."
            {...register('description')}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all resize-y"
          ></textarea>
          {errors.description && (
            <span className="text-[10px] text-red-500 font-semibold">{errors.description.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price Unit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Precio Unitario (CLP) <span className="text-muted font-normal">(Opcional)</span>
            </label>
            <input
              type="number"
              placeholder="Ej: 500"
              {...register('priceUnit')}
              className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
            />
            {errors.priceUnit && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.priceUnit.message}</span>
            )}
          </div>

          {/* Price Box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Precio por Caja (CLP) <span className="text-muted font-normal">(Opcional)</span>
            </label>
            <input
              type="number"
              placeholder="Ej: 25000"
              {...register('priceBox')}
              className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
            />
            {errors.priceBox && (
              <span className="text-[10px] text-red-500 font-semibold">{errors.priceBox.message}</span>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            URL de la Imagen
          </label>
          <input
            type="text"
            placeholder="https://reactiva.cl/wp-content/uploads/..."
            {...register('imageUrl')}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
          />
        </div>

        {/* Available toggle */}
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="available"
            {...register('available')}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="available" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            Producto visible en el catálogo público
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow py-3 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={14} />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border border-border/80 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X size={14} />
            <span>Cancelar</span>
          </button>
        </div>
      </form>
    </div>
  );
}
