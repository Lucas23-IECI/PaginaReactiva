'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, ArrowRight, Check, Box, Layers, ShieldCheck, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

function CatalogInner() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const skuParam = searchParams.get('sku');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteFormat, setQuoteFormat] = useState<'unit' | 'box' | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const ITEMS_PER_PAGE = 12; // 4 columns * 3 rows
  const { addToCart } = useCart();

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF();
      
      // Helper to load image as base64 via internal proxy to bypass CORS
      const loadImage = async (url: string): Promise<string> => {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(blob);
          
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // White background for transparent images
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/jpeg', 0.8));
            } else {
              reject(new Error('Canvas context null'));
            }
            URL.revokeObjectURL(objectUrl);
          };
          img.onerror = (e) => {
            reject(e);
            URL.revokeObjectURL(objectUrl);
          };
          img.src = objectUrl;
        });
      };

      // Header Function
      const drawHeader = (doc: jsPDF, pageNumber: number) => {
        doc.setFillColor(15, 118, 110);
        doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).setFont('helvetica', 'bold');
        doc.text('Catálogo Oficial - Reactiva', 14, 16);
        doc.setFontSize(9);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).setFont('helvetica', 'normal');
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')} | Página ${pageNumber}`, doc.internal.pageSize.width - 14, 16, { align: 'right' });
      };

      drawHeader(doc, 1);
      let currentY = 35;

      // Group products
      const grouped = CATEGORIES.map(c => ({
        ...c,
        items: products.filter(p => p.category === c.slug).sort((a,b) => a.name.localeCompare(b.name))
      })).filter(c => c.items.length > 0);
      
      for (let i = 0; i < grouped.length; i++) {
        const group = grouped[i];
        
        if (currentY > 250) {
          doc.addPage();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          drawHeader(doc, (doc.internal as any).getNumberOfPages());
          currentY = 35;
        }

        doc.setFontSize(14);
        doc.setTextColor(15, 118, 110);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).setFont('helvetica', 'bold');
        doc.text(group.name.toUpperCase(), 14, currentY);
        currentY += 5;

        const tableColumn = ["Imagen", "SKU", "Producto", "Descripción"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tableRows: any[] = [];
        const base64Images: Record<string, string> = {};

        // Load images for this group concurrently
        await Promise.all(group.items.map(async (product) => {
          if (product.imageUrl) {
            try {
              const b64 = await loadImage(product.imageUrl);
              base64Images[product.sku] = b64;
            } catch(e) {
               console.warn("Could not load image for", product.sku, e);
            }
          }
        }));

        group.items.forEach(product => {
          tableRows.push([
            '', // Placeholder for image
            product.sku,
            product.name,
            product.description.length > 90 ? product.description.substring(0, 90) + '...' : product.description
          ]);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: currentY,
          theme: 'grid',
          headStyles: { fillColor: [248, 250, 252], textColor: [71, 85, 105], fontStyle: 'bold' },
          styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
          columnStyles: {
            0: { cellWidth: 22, minCellHeight: 22 },
            1: { cellWidth: 22, fontStyle: 'bold' },
            2: { cellWidth: 45, fontStyle: 'bold', textColor: [15, 118, 110] },
            3: { cellWidth: 'auto' }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          didDrawCell: (data: any) => {
            if (data.section === 'body' && data.column.index === 0) {
              const productSku = data.row.raw[1];
              const imgData = base64Images[productSku];
              if (imgData) {
                const x = data.cell.x + 2;
                const y = data.cell.y + 2;
                const w = 18;
                const h = 18;
                doc.addImage(imgData, 'JPEG', x, y, w, h);
              } else {
                 doc.setFontSize(7);
                 doc.setTextColor(150);
                 doc.text('Sin img', data.cell.x + 4, data.cell.y + 11);
              }
            }
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        currentY = (doc as any).lastAutoTable.finalY + 12;
      }

      doc.save('catalogo-reactiva.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, compruebe su conexión.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    if (product.priceUnit && !product.priceBox) setQuoteFormat('unit');
    else if (product.priceBox && !product.priceUnit) setQuoteFormat('box');
    else setQuoteFormat('box');
  };

  // Sync category state with query param if it changes
  useEffect(() => {
    if (catParam) {
      const isValid = CATEGORIES.some(c => c.slug === catParam);
      if (isValid) {
        setSelectedCategory(catParam);
        setCurrentPage(1);
      }
    }
  }, [catParam]);

  // Sync selected product with 'sku' query param on mount/load
  useEffect(() => {
    if (skuParam && products.length > 0) {
      const found = products.find(p => p.sku === skuParam);
      if (found) {
        handleOpenProduct(found);
      }
    }
  }, [skuParam, products]);

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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);



  const getCategoryLabel = (slug: string) => {
    const found = CATEGORIES.find(c => c.slug === slug);
    return found ? found.name : slug;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Intro section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="text-center sm:text-left flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Catálogo Oficial de Productos
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Busque entre nuestros más de 90 insumos médicos y de laboratorio. Seleccione el producto de su interés para solicitar valores directamente por WhatsApp.
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf || products.length === 0}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 group"
        >
          <Download size={16} className={isGeneratingPdf ? "animate-bounce" : "text-primary group-hover:scale-110 transition-transform"} />
          {isGeneratingPdf ? "Generando PDF..." : "Descargar Catálogo PDF"}
        </button>
      </div>

      {/* Filters & Search Header */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-xs">
        
        {/* Category selector */}
        <div className="flex-1 min-w-0 w-full relative">
          <div className="w-full flex items-center overflow-x-auto gap-2 pb-2 md:pb-0 max-w-full scroll-smooth">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            placeholder="Buscar por nombre, SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all duration-200"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-muted" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-3 text-muted hover:text-slate-800 dark:hover:text-white p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid Status / Count */}
      <div className="flex justify-between items-center text-xs font-medium text-muted">
        <span>
          Mostrando {filteredProducts.length > 0 ? startIndex + 1 : 0}-
          {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
        </span>
        {selectedCategory !== 'all' && (
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
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
        <div className="w-full py-20 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-border/80 flex flex-col justify-center items-center text-center p-6">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron productos</p>
          <p className="text-xs text-muted max-w-xs mt-1">Pruebe escribiendo otro término de búsqueda o cambiando la categoría seleccionada.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs transition-all duration-300 cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                key={p.sku}
                onClick={() => handleOpenProduct(p)}
                className="group flex flex-col p-3 bg-white dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80 hover:border-teal-500/45 dark:hover:border-teal-500/45 rounded-2xl shadow-xs hover:shadow-[0_12px_30px_rgba(20,184,166,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/60 border border-slate-100/80 dark:border-slate-800/40 flex items-center justify-center p-0">
                  {p.imageUrl ? (
                    <>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/[0.02] dark:bg-slate-950/15 pointer-events-none transition-colors duration-300"></div>
                    </>
                  ) : (
                    <div className="text-xs text-muted">Sin imagen</div>
                  )}
                </div>
                <div className="pt-3.5 pb-1 px-1 flex flex-col flex-grow gap-2.5">
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
                  <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center text-xs font-semibold text-primary">
                    <span>Solicitar precio</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-200 cursor-pointer border border-slate-200/50 dark:border-slate-700/50 shadow-xs flex items-center justify-center"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </motion.button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setCurrentPage(page);
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative w-10 h-10 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                  currentPage === page
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/10'
                    : 'bg-white hover:bg-slate-50 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-700/60 text-slate-705 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors duration-200 cursor-pointer border border-slate-200/50 dark:border-slate-700/50 shadow-xs flex items-center justify-center"
            aria-label="Siguiente página"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      )}

      {/* Product Details Modal */}
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

                {/* Add to Cart Actions */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:text-primary transition-colors cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:text-primary transition-colors cursor-pointer"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        if (quoteFormat) {
                          addToCart(selectedProduct, quantity, quoteFormat);
                          setSelectedProduct(null);
                        }
                      }}
                      className={`flex-1 py-3.5 text-center text-xs sm:text-sm font-bold text-white rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer ${
                        quoteFormat
                          ? 'bg-primary hover:bg-primary-hover'
                          : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      <span>Añadir al Carrito</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-muted">
                    Los productos añadidos se pueden visualizar en su carrito para solicitar una cotización conjunta.
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

export default function CatalogWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/25 border-t-primary rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-muted">Cargando catálogo...</span>
      </div>
    }>
      <CatalogInner />
    </Suspense>
  );
}
