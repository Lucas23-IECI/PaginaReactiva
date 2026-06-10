import React from 'react';
import Header from '@/components/layout/Header';
import CatalogWrapper from '@/components/catalog/CatalogWrapper';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header section */}
      <Header />

      {/* Main Catalog content */}
      <main className="flex-grow">
        <CatalogWrapper />
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-slate-100 dark:border-slate-800 mt-16 bg-white dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-muted">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-slate-800 dark:text-white font-extrabold text-sm tracking-wide">REACTIVA</span>
            <span>Comercializadora, Insumos medicos y laboratorio</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Copyright &copy; {new Date().getFullYear()} Reactiva. Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/reactiva.cl/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Instagram
            </a>
            <span className="opacity-40">|</span>
            <a href="https://wa.me/56992801300" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
