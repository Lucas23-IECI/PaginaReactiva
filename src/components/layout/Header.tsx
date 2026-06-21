'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ShieldCheck, Mail, MapPin } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Banner (Contact info & Address) */}
      <div className="w-full bg-primary text-white text-[11px] sm:text-xs py-1.5 px-4 flex flex-wrap justify-between items-center gap-2 font-medium tracking-wide">
        <div className="flex items-center gap-4">
          <a href="tel:+56992801300" className="flex items-center gap-1 hover:text-teal-200 transition-colors">
            <Phone size={12} className="shrink-0" />
            <span>+56 9 9280 1300</span>
          </a>
          <a href="mailto:msaldias@reactiva.cl" className="hidden sm:flex items-center gap-1 hover:text-teal-200 transition-colors">
            <Mail size={12} className="shrink-0" />
            <span>msaldias@reactiva.cl</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="shrink-0" />
            <span>Concepción, Chiguayante</span>
          </span>
          <span className="hidden md:flex items-center gap-1 text-teal-200">
            <ShieldCheck size={12} className="shrink-0" />
            <span>Distribución de Insumos Médicos Certificados</span>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full py-4 px-4 sm:px-6 md:px-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Logo container */}
          <Link href="/" className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 shrink-0">
            <div className="relative h-8 w-28 sm:h-10 sm:w-32">
              <Image
                src="/logo.png"
                alt="Reactiva Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">
              Marco Saldías
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350">
          <Link href="/" className="hover:text-primary transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
            Inicio
          </Link>
          <Link href="/#catalogo" className="hover:text-primary transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
            Catálogo
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href="https://wa.me/56992801300"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xs:flex px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 items-center gap-1.5 cursor-pointer"
          >
            <span>Contacto Directo</span>
          </a>
        </div>
      </div>
    </header>
  );
}
