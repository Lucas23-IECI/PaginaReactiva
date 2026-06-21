'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const generateWhatsAppLink = () => {
    const phone = '56992801300';
    let text = `Hola Reactiva, me gustaría solicitar una cotización para los siguientes productos:\n\n`;

    items.forEach((item, index) => {
      const formatStr = item.format === 'unit' ? 'Por Unidad' : 'Por Caja';
      text += `${index + 1}. *[SKU: ${item.product.sku}]* - ${item.product.name}\n`;
      text += `   - Formato: ${formatStr}\n`;
      text += `   - Cantidad: ${item.quantity}\n\n`;
    });

    text += `Quedo atento a los valores correspondientes. ¡Muchas gracias!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary-hover text-white p-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer"
        aria-label="Abrir Carrito"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            ></motion.div>

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart size={20} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Lista de Cotización</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar carrito"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-70 gap-3">
                    <ShoppingCart size={48} className="text-slate-300 dark:text-slate-700" />
                    <div>
                      <p className="text-slate-500 font-medium">Su lista está vacía</p>
                      <p className="text-xs text-slate-400 mt-1">Agregue productos para solicitar una cotización.</p>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={`${item.product.sku}-${item.format}`}
                      className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-xs relative group"
                    >
                      <div className="w-16 h-16 shrink-0 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1 flex items-center justify-center">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[8px] text-slate-400">Sin img</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-1 gap-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.sku, item.format)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 font-medium">
                          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">SKU: {item.product.sku}</span>
                          <span className="text-primary">{item.format === 'unit' ? 'Por Unidad' : 'Por Caja'}</span>
                        </div>

                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                            <button
                              onClick={() => updateQuantity(item.product.sku, item.format, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:text-primary transition-colors cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-700 dark:text-slate-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.sku, item.format, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:text-primary transition-colors cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3">
                <a
                  href={items.length > 0 ? generateWhatsAppLink() : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 text-center text-sm font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider ${
                    items.length > 0
                      ? 'bg-primary hover:bg-primary-hover text-white cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed pointer-events-none'
                  }`}
                  onClick={(e) => {
                    if (items.length === 0) e.preventDefault();
                  }}
                >
                  Solicitar Cotización
                </a>
                <p className="text-[10px] text-center text-slate-400">
                  Al hacer clic se abrirá WhatsApp con el detalle completo de los productos seleccionados para su rápida atención.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
