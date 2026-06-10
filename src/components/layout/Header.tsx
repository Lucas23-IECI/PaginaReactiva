'use client';

import React from 'react';
import Image from 'next/image';
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
          <div className="relative h-10 w-32 sm:h-12 sm:w-40 transition-transform duration-300 hover:scale-102">
            <Image
              src="https://reactiva.cl/wp-content/uploads/2026/01/cropped-LogoReactiva-VerdeO-300x100.png"
              alt="Reactiva Logo"
              fill
              priority
              sizes="(max-width: 640px) 120px, 160px"
              className="object-contain"
            />
          </div>

          {/* 23 Years Badge */}
          <div className="relative flex items-center shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50/80 dark:bg-slate-800 border border-teal-200/60 dark:border-slate-700/80 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-semibold text-teal-900 dark:text-slate-200 tracking-wide">
                <strong className="text-teal-600 dark:text-teal-400 font-extrabold">23 años</strong> con usted
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://wa.me/56992801300"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Contacto Directo</span>
          </a>
        </div>
      </div>
    </header>
  );
}
