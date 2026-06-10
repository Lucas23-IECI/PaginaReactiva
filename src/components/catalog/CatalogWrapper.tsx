'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Check, Box, Layers, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';

const CATEGORIES = [
  { slug: 'all', name: 'Todos los Productos' },
  { slug: 'toma-de-muestras', name: 'Toma de Muestras' },
  { slug: 'accesorios-proceso-de-examen', name: 'Proceso de Examen' },
  { slug: 'kit-de-diagnostico', name: 'Kits de Diagnóstico' },
  { slug: 'solventes-y-reactivos-liquidos', name: 'Solventes y Reactivos' },
  { slug: 'reactivos-deshidratados', name: 'Reactivos Deshidratados' },
  { slug: 'epp', name: 'EPP y Prevención' },
  { slug: 'papeleria', name: 'Papelería Clínica' }
];

export default function CatalogWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteFormat, setQuoteFormat] = useState<'unit' | 'box' | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    if (product.priceUnit && !product.priceBox) setQuoteFormat('unit');
    else if (product.priceBox && !product.priceUnit) setQuoteFormat('box');
    else setQuoteFormat('box');
  };

  const getWhatsAppLink = (product: Product, format: 'unit' | 'box' | null) => {
    const phone = '56992801300';
    const formatStr = format === 'unit' ? 'precio unitario' : 'precio por caja';
    const text = encodeURIComponent(
      `Hola Reactiva, me gustaría solicitar una cotización para el siguiente producto:\n\n` +
      `- *Insumo:* ${product.name}\n` +
      `- *SKU:* ${product.sku}\n` +
      `- *Formato solicitado:* ${formatStr}\n\n` +
      `Quedo atento a los valores correspondientes. ¡Muchas gracias!`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const getCategoryLabel = (slug: string) => {
    const found = CATEGORIES.find(c => c.slug === slug);
    return found ? found.name : slug;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Intro section */}
      <div className="text-center sm:text-left flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
          Catálogo Oficial de Productos
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          Busque entre nuestros más de 90 insumos médicos y de laboratorio. Seleccione el producto de su interés para solicitar valores directamente por WhatsApp.
        </p>
      </div>

      {/* Filters & Search Header */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-xs">
        
        {/* Category selector */}
        <div className="w-full md:w-auto flex items-center overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-none max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            placeholder="Buscar por nombre, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all duration-200"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-muted" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-muted hover:text-slate-800 dark:hover:text-white p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid Status / Count */}
      <div className="flex justify-between items-center text-xs font-medium text-muted">
        <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
        {selectedCategory !== 'all' && (
          <button 
            onClick={() => setSelectedCategory('all')}
            className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todos
          </button>
        )}
      </div>

      {/* Products Grid - Simple direct render with no bouncy layout shifting */}
      {loading ? (
        <div className="w-full py-24 flex flex-col justify-center items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/25 border-t-primary rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-muted">Cargando catálogo...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="w-full py-20 bg-slate-50 dark:bg-slate-850/10 rounded-2xl border border-dashed border-border/80 flex flex-col justify-center items-center text-center p-6">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron productos</p>
          <p className="text-xs text-muted max-w-xs mt-1">Pruebe escribiendo otro término de búsqueda o cambiando la categoría seleccionada.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs transition-all duration-300 cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.sku}
              onClick={() => handleOpenProduct(p)}
              className="group flex flex-col bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800/80 hover:border-primary/45 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer relative"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden flex items-center justify-center p-4">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="object-contain w-full h-full transform group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs text-muted">Sin imagen</div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow gap-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {p.category.replace(/-/g, ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-muted tracking-wide shrink-0">
                    SKU: {p.sku}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs font-semibold text-primary">
                  <span>Solicitar precio</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal (Professional, Non-AI styling) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row z-10 md:max-h-[85vh] my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 z-20 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X size={16} />
              </button>

              {/* Left Column: Image Frame */}
              <div className="w-full md:w-[45%] bg-slate-50/50 dark:bg-slate-950/20 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 relative select-none">
                <div className="relative w-full max-w-[220px] aspect-square rounded-xl bg-white dark:bg-slate-800 p-4 border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-center shadow-xs">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="object-contain max-h-[190px] w-full h-auto"
                  />
                </div>
                <div className="mt-4 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-bold tracking-wider uppercase border border-slate-200/40 dark:border-slate-700/60">
                  SKU: {selectedProduct.sku}
                </div>
              </div>

              {/* Right Column: Detailed Product Specs & Action */}
              <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-none">
                <div className="flex flex-col gap-5">
                  
                  {/* Category & Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {getCategoryLabel(selectedProduct.category)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={10} className="text-teal-600" />
                      Insumo Médico
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans tracking-tight">
                    {selectedProduct.name}
                  </h2>

                  <div className="h-px bg-slate-100 dark:bg-slate-800/80"></div>

                  {/* Specs / Description */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Box size={12} />
                      Especificaciones Técnicas
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-normal">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Format/Price Options */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Layers size={12} />
                      Formato de Venta
                    </span>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      
                      <button
                        onClick={() => setQuoteFormat('box')}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                          quoteFormat === 'box'
                            ? 'border-primary bg-teal-50/20 dark:bg-teal-950/10 text-primary'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Por Caja</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            quoteFormat === 'box' ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {quoteFormat === 'box' && <Check size={10} className="text-white" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1">Formato estándar de distribución y mayoristas</span>
                      </button>

                      <button
                        onClick={() => setQuoteFormat('unit')}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                          quoteFormat === 'unit'
                            ? 'border-primary bg-teal-50/20 dark:bg-teal-950/10 text-primary'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Por Unidad</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            quoteFormat === 'unit' ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {quoteFormat === 'unit' && <Check size={10} className="text-white" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1">Fraccionamiento especial y clínica directa</span>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Quoting WhatsApp Actions */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
                  <a
                    href={getWhatsAppLink(selectedProduct, quoteFormat)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 text-center text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Cotizar Insumo por WhatsApp</span>
                  </a>
                  <p className="text-[10px] text-center text-muted">
                    Se abrirá la aplicación de WhatsApp con su consulta precargada de forma segura.
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
