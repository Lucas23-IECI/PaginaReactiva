import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import CatalogWrapper from '@/components/catalog/CatalogWrapper';
import db from '@/lib/db';
import productsJson from '@/data/products.json';
import { Product } from '@/types';
import { 
  ClipboardList, 
  FlaskConical, 
  Activity, 
  Atom, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Truck, 
  PackageCheck,
  MapPin,
  MessageCircle,
  Clock3
} from 'lucide-react';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const dbProducts = await db.product.findMany({
      take: 4,
      where: { available: true }
    });
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(p => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        description: p.description,
        priceUnit: p.priceUnit,
        priceBox: p.priceBox,
        imageUrl: p.imageUrl,
        available: p.available
      }));
    }
  } catch (error) {
    console.warn("Database not ready during build, using JSON fallback:", error);
  }
  
  // Fallback to local JSON products (first 4 products)
  return productsJson.slice(0, 4) as Product[];
}

const LANDING_CATEGORIES = [
  {
    slug: 'toma-de-muestras',
    name: 'Toma de Muestras',
    icon: ClipboardList,
    description: 'Tubos de recolección, agujas, mariposas y accesorios para toma de muestras clínicas seguras.'
  },
  {
    slug: 'accesorios-proceso-de-examen',
    name: 'Proceso de Examen',
    icon: FlaskConical,
    description: 'Portaobjetos, cubreobjetos de alta precisión y accesorios para microscopía.'
  },
  {
    slug: 'kit-de-diagnostico',
    name: 'Kits de Diagnóstico',
    icon: Activity,
    description: 'Kits de test rápido inmunológico and reactivos para diagnóstico clínico inmediato.'
  },
  {
    slug: 'solventes-y-reactivos-liquidos',
    name: 'Solventes y Reactivos',
    icon: FlaskConical,
    description: 'Alcoholes puros, solventes de limpieza y reactivos líquidos certificados.'
  },
  {
    slug: 'reactivos-deshidratados',
    name: 'Reactivos Deshidratados',
    icon: Atom,
    description: 'Medios de cultivo deshidratados y sales químicas para microbiología y análisis.'
  },
  {
    slug: 'epp',
    name: 'EPP y Prevención',
    icon: ShieldCheck,
    description: 'Guantes, pecheras desechables, mascarillas y elementos de protección biológica.'
  },
  {
    slug: 'papeleria',
    name: 'Papelería Clínica',
    icon: FileText,
    description: 'Sabanillas médicas de papel, papel interfoliado y registros para uso clínico.'
  }
];

const HERO_METRICS = [
  { value: '23', label: 'Anios abasteciendo laboratorios' },
  { value: '90+', label: 'SKU clinicos disponibles' },
  { value: '24-48h', label: 'Despacho coordinado en Biobio' }
];

const HERO_TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'Control ISP' },
  { icon: PackageCheck, label: 'Stock critico' },
  { icon: Truck, label: 'Entrega directa' }
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const heroProducts = featuredProducts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        {/* Continuity Manifesto Hero */}
        <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
          <div className="absolute right-8 top-16 hidden h-40 w-40 border-[18px] border-teal-100 dark:border-teal-900/40 lg:block" />
          <div className="absolute bottom-6 left-6 hidden text-[8rem] font-black leading-none tracking-tighter text-slate-100 dark:text-white/[0.04] sm:left-10 lg:block">
            24H
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col justify-center px-5 py-20 sm:px-6 lg:px-8">
            <p className="mb-7 max-w-xl text-[11px] font-black uppercase leading-6 tracking-[0.28em] text-teal-700 dark:text-teal-300 sm:text-xs">
              Cuando falta stock, falta continuidad.
            </p>
            <h1 className="max-w-6xl text-5xl font-black leading-[0.88] tracking-tight sm:text-7xl md:text-8xl lg:text-[9.2rem]">
              Que nada detenga el diagnostico.
            </h1>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#catalogo" className="inline-flex h-13 items-center justify-center gap-2 bg-slate-950 px-7 text-sm font-black text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
                Ver stock disponible <ArrowRight size={17} />
              </Link>
              <a
                href="https://wa.me/56992801300"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2 border-2 border-slate-950 px-7 text-sm font-black transition hover:-translate-y-0.5 dark:border-white"
              >
                <MessageCircle size={17} /> Hablar con Reactiva
              </a>
            </div>

            <div className="mt-14 grid max-w-5xl gap-4 lg:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Certificado', text: 'Insumos clinicos y reactivos con control.' },
                { icon: Clock3, title: 'Respuesta directa', text: 'Cotizacion rapida por canal humano.' },
                { icon: Truck, title: 'Ruta regional', text: 'Concepcion y Chiguayante sin intermediarios.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="border-t-4 border-slate-950 bg-white py-5 pr-6 dark:border-white dark:bg-slate-950">
                  <Icon className="mb-5 h-7 w-7 text-teal-600 dark:text-teal-300" />
                  <p className="text-xl font-black">{title}</p>
                  <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="hidden relative w-full overflow-hidden border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal-50/80 to-transparent dark:from-teal-950/30" />

          <div className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,1.05fr)] lg:px-8 lg:py-20">
            <div className="flex max-w-3xl flex-col items-start gap-8 text-left">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                  <ShieldCheck size={14} />
                  Distribucion clinica certificada
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />
                  Concepcion y Chiguayante
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-black leading-[1.03] tracking-tight text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  Insumos medicos y reactivos, listos para abastecer su laboratorio.
                </h1>
                <p className="max-w-2xl text-base font-medium leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                  Reactiva conecta stock certificado, asesoria directa y despacho regional para que clinicas, laboratorios e instituciones mantengan continuidad operativa sin friccion.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="#catalogo"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-white shadow-lg shadow-teal-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-teal-900/15"
                >
                  Explorar catalogo
                  <ArrowRight size={17} />
                </Link>
                <a
                  href="https://wa.me/56992801300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-extrabold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-700"
                >
                  <MessageCircle size={17} />
                  Cotizar por WhatsApp
                </a>
              </div>

              <div className="grid w-full grid-cols-3 gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:max-w-2xl">
                {HERO_METRICS.map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <div className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[420px] w-full lg:min-h-[560px]">
              <div className="absolute inset-0 rounded-[2rem] border border-slate-200 bg-slate-50/80 shadow-2xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/50" />
              <div className="absolute inset-4 rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mesa de abastecimiento</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Catalogo activo</h2>
                  </div>
                  <div className="rounded-xl bg-teal-50 px-3 py-2 text-right dark:bg-teal-950/40">
                    <p className="text-xl font-black leading-none text-primary">90+</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">SKU</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {heroProducts.map((product, index) => (
                    <Link
                      key={product.sku}
                      href={`/?sku=${product.sku}#catalogo`}
                      className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700"
                    >
                      <div className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="72px"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading={index === 0 ? 'eager' : 'lazy'}
                          />
                        ) : (
                          <PackageCheck className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="w-fit rounded-md bg-primary/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-primary">
                          {product.category.replace(/-/g, ' ')}
                        </p>
                        <h3 className="mt-2 truncate text-sm font-extrabold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">SKU {product.sku}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {HERO_TRUST_ITEMS.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex min-h-20 flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-[10px] font-extrabold uppercase leading-4 tracking-[0.08em] text-slate-600 dark:text-slate-300">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-5 left-6 right-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <Truck size={21} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-950 dark:text-white">Despacho directo y coordinado</p>
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                      Respuesta comercial por WhatsApp y seguimiento del pedido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Immersive Centered Hero Section */}
        <section className="hidden relative w-full py-16 sm:py-24 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden flex-col items-center justify-center">
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,148,136,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,148,136,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* Main Hero Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
            
            {/* Centered Main Content */}
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
              {/* Elegant Rotating SVG Seal of Trust - Larger & More Premium */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-6 select-none">
                <svg className="absolute w-36 h-36 text-teal-600/70 dark:text-teal-400/70 animate-spin-slow" viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="sealPath"
                      d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                      fill="none"
                    />
                  </defs>
                  <text className="text-[6.2px] font-bold fill-current tracking-[0.16em] uppercase font-mono">
                    <textPath href="#sealPath" startOffset="0%">
                      • 23 AÑOS CON USTED • DESDE 2003 • TRADICIÓN & CALIDAD
                    </textPath>
                  </text>
                </svg>
                <div className="w-20 h-20 rounded-full bg-teal-50/70 dark:bg-slate-800/80 border border-teal-200/50 dark:border-slate-700/60 flex flex-col items-center justify-center shadow-xs z-10">
                  <span className="text-2xl font-black text-primary leading-none">23</span>
                  <span className="text-[8px] font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-widest mt-1">Años</span>
                </div>
              </div>

              {/* Elegant text label above title - replacing the boring rounded pills */}
              <div className="text-[10px] sm:text-xs font-extrabold text-primary uppercase tracking-[0.25em] mb-4 flex items-center gap-2.5 select-none">
                <span>Insumos Médicos y Laboratorio</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/25 dark:bg-teal-400/25 shrink-0"></span>
                <span className="text-slate-450 dark:text-slate-500">Concepción & Chiguayante</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-3xl">
                Abastecimiento Clínico de <span className="text-primary">Máxima Confianza</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-350 max-w-2xl leading-relaxed mt-4 font-medium">
                Distribución certificada de insumos clínicos, reactivos y material de laboratorio. Más de dos décadas asegurando excelencia en Concepción y toda la Región del Biobío.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full mt-8">
                <Link
                  href="#catalogo"
                  className="px-8 py-4 text-center text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs hover:shadow-md transition-all duration-300 w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explorar Catálogo Completo</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/56992801300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-355 bg-slate-100 hover:bg-slate-150 dark:bg-slate-800 dark:hover:bg-slate-755 rounded-xl transition-all w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 border border-slate-200/40 dark:border-slate-700/60 cursor-pointer"
                >
                  <span>Contacto Directo</span>
                </a>
              </div>
            </div>

            {/* Desktop Left/Right Side Info Indicators (Sleek minimalist typography with medical SVGs) */}
            <div className="hidden lg:flex absolute inset-x-0 top-[48%] -translate-y-1/2 justify-between px-8 pointer-events-none select-none w-full">
              
              {/* Left Column (Callout 1 & 2) */}
              <div className="flex flex-col gap-12 max-w-[280px] text-right items-end pointer-events-auto">
                {/* Metric 1: Trayectoria */}
                <div className="group transition-all duration-300 hover:translate-x-2 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xs hover:border-teal-500/30 dark:hover:border-teal-500/30">
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight group-hover:text-primary transition-colors">
                      23 Años
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                      Trayectoria Regional
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                    {/* SVG Erlenmeyer Flask */}
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 20L9 12V5H15V12L18 20C18.5 21.3 17.5 22 16.5 22H7.5C6.5 22 5.5 21.3 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.2 14H15.8L17.2 18.5C17.5 19.3 16.9 20 16 20H8C7.1 20 6.5 19.3 6.8 18.5L8.2 14Z" fill="currentColor" fillOpacity="0.25"/>
                      <circle cx="10" cy="17" r="1" fill="currentColor"/>
                      <circle cx="13" cy="16" r="0.75" fill="currentColor"/>
                      <circle cx="11.5" cy="18" r="0.5" fill="currentColor"/>
                      <path d="M8.2 14C9.5 13.5 10.5 14.5 12 14C13.5 13.5 14.5 14.5 15.8 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {/* Metric 2: Catálogo */}
                <div className="group transition-all duration-300 hover:translate-x-2 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xs hover:border-teal-500/30 dark:hover:border-teal-500/30">
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight group-hover:text-primary transition-colors">
                      90+ SKU
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                      Insumos Activos
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                    {/* SVG Test Tube */}
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3H15M10 3V17C10 19.2 11.8 21 14 21C16.2 21 18 19.2 18 17V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6H12M7 6V15C7 16.7 8.3 18 10 18C11.7 18 13 16.7 13 15V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1"/>
                      <path d="M10 11V17C10 19.2 11.8 21 14 21C16.2 21 18 19.2 18 17V11H10Z" fill="currentColor" fillOpacity="0.25"/>
                      <line x1="12" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      <line x1="12" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      <line x1="12" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Column (Callout 3 & 4) */}
              <div className="flex flex-col gap-12 max-w-[280px] text-left items-start pointer-events-auto">
                {/* Metric 3: Logística */}
                <div className="group transition-all duration-300 hover:-translate-x-2 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xs hover:border-teal-500/30 dark:hover:border-teal-500/30">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                    {/* SVG Cryo-vial / Logistics Box */}
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="7" y="6" width="10" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="9" y="2" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.2"/>
                      <rect x="9" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 8C4.5 8.5 5 8.5 5.5 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      <path d="M18.5 8C19 8.5 19.5 8.5 20 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      <path d="M8 12H16V17C16 17.6 15.6 18 15 18H9C8.4 18 8 17.6 8 17V12Z" fill="currentColor" fillOpacity="0.25"/>
                      <path d="M11 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight group-hover:text-primary transition-colors">
                      Propio
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                      Despacho Directo
                    </span>
                  </div>
                </div>

                {/* Metric 4: Trazabilidad */}
                <div className="group transition-all duration-300 hover:-translate-x-2 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xs hover:border-teal-500/30 dark:hover:border-teal-500/30">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                    {/* SVG Petri Dish */}
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="12" cy="13" rx="8" ry="5" stroke="currentColor" strokeWidth="1.5"/>
                      <ellipse cx="12" cy="9" rx="8.5" ry="5.2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
                      <line x1="3.5" y1="9" x2="3.5" y2="13" stroke="currentColor" strokeWidth="1"/>
                      <line x1="20.5" y1="9" x2="20.5" y2="13" stroke="currentColor" strokeWidth="1"/>
                      <circle cx="9" cy="13" r="1.2" fill="currentColor"/>
                      <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
                      <circle cx="11" cy="12" r="0.8" fill="currentColor"/>
                      <circle cx="15" cy="12" r="1" fill="currentColor"/>
                      <path d="M10 16L12 18L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight group-hover:text-primary transition-colors">
                      Aprobado
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                      Control e ISP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Fallback List (Sleek minimalist cards with SVGs, visible on mobile only) */}
            <div className="lg:hidden grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full px-4 mt-16 select-none text-left">
              
              {/* Metric 1 */}
              <div className="flex flex-col gap-3 p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 20L9 12V5H15V12L18 20C18.5 21.3 17.5 22 16.5 22H7.5C6.5 22 5.5 21.3 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.2 14H15.8L17.2 18.5C17.5 19.3 16.9 20 16 20H8C7.1 20 6.5 19.3 6.8 18.5L8.2 14Z" fill="currentColor" fillOpacity="0.25"/>
                    <circle cx="10" cy="17" r="1" fill="currentColor"/>
                    <circle cx="13" cy="16" r="0.75" fill="currentColor"/>
                    <circle cx="11.5" cy="18" r="0.5" fill="currentColor"/>
                    <path d="M8.2 14C9.5 13.5 10.5 14.5 12 14C13.5 13.5 14.5 14.5 15.8 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">23 Años</h3>
                  <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 block">Trayectoria</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex flex-col gap-3 p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3H15M10 3V17C10 19.2 11.8 21 14 21C16.2 21 18 19.2 18 17V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6H12M7 6V15C7 16.7 8.3 18 10 18C11.7 18 13 16.7 13 15V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1"/>
                    <path d="M10 11V17C10 19.2 11.8 21 14 21C16.2 21 18 19.2 18 17V11H10Z" fill="currentColor" fillOpacity="0.25"/>
                    <line x1="12" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="12" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="12" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">90+ SKU</h3>
                  <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 block">Catálogo</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex flex-col gap-3 p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="7" y="6" width="10" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="2" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.2"/>
                    <rect x="9" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 8C4.5 8.5 5 8.5 5.5 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M18.5 8C19 8.5 19.5 8.5 20 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M8 12H16V17C16 17.6 15.6 18 15 18H9C8.4 18 8 17.6 8 17V12Z" fill="currentColor" fillOpacity="0.25"/>
                    <path d="M11 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Propio</h3>
                  <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 block">Despacho</span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex flex-col gap-3 p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-400/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="12" cy="13" rx="8" ry="5" stroke="currentColor" strokeWidth="1.5"/>
                    <ellipse cx="12" cy="9" rx="8.5" ry="5.2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
                    <line x1="3.5" y1="9" x2="3.5" y2="13" stroke="currentColor" strokeWidth="1"/>
                    <line x1="20.5" y1="9" x2="20.5" y2="13" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="9" cy="13" r="1.2" fill="currentColor"/>
                    <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
                    <circle cx="11" cy="12" r="0.8" fill="currentColor"/>
                    <circle cx="15" cy="12" r="1" fill="currentColor"/>
                    <path d="M10 16L12 18L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Aprobado</h3>
                  <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 block">Control ISP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Infinite Horizontal Conveyor Belt of Products (Unifying actual products in Hero) */}
          <div className="w-full relative mt-16 overflow-hidden py-4 select-none">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>
            
            <div className="flex w-max gap-6 animate-infinite-scroll hover:[animation-play-state:paused] py-2">
              {[...featuredProducts, ...featuredProducts, ...featuredProducts, ...featuredProducts].map((p, index) => (
                <Link
                  key={`${p.sku}-${index}`}
                  href={`/?sku=${p.sku}#catalogo`}
                  className="w-[280px] shrink-0 group flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 hover:border-teal-500/40 dark:hover:border-teal-500/40 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/60 border border-slate-100/80 dark:border-slate-800/40 flex items-center justify-center p-0 shrink-0">
                    {p.imageUrl ? (
                      <>
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="56px"
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/[0.01] dark:bg-slate-950/15 pointer-events-none transition-colors duration-300"></div>
                      </>
                    ) : (
                      <span className="text-[9px] text-slate-400">Sin foto</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden text-left">
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
                      {p.category.replace(/-/g, ' ')}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate pr-2 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">SKU: {p.sku}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Compact Section */}
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="text-center flex flex-col gap-2 max-w-2xl mx-auto">
              <div className="border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-550 dark:text-slate-400 mx-auto w-fit bg-white dark:bg-slate-900/50 shadow-2xs mb-2">
                <span className="text-primary font-extrabold mr-1">{'//'}</span> Categorías de Productos
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                Especialidades de Abastecimiento
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seleccione una especialidad para filtrar el catálogo a continuación de manera inmediata.
              </p>
            </div>

            {/* Compact Slide Plates Grid */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {LANDING_CATEGORIES.map((cat, index) => {
                const IconComponent = cat.icon;
                const displayIndex = String(index + 1).padStart(2, '0');
                return (
                  <Link
                    key={cat.slug}
                    href={`/?cat=${cat.slug}#catalogo`}
                    className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] relative flex items-center gap-3.5 p-3.5 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 rounded-xl shadow-2xs hover:shadow-[0_8px_20px_rgba(20,184,166,0.04)] hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
                  >
                    {/* Left accent line that slides in on hover */}
                    <div className="absolute left-0 inset-y-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    
                    {/* Icon Container */}
                    <div className="w-9 h-9 rounded-lg bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 dark:border-teal-450/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <IconComponent size={16} />
                    </div>
                    
                    {/* Text info */}
                    <div className="flex flex-col gap-0.5 text-left min-w-0">
                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">{displayIndex} {'//'}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Full Products Catalogue Embedded Section */}
        <section id="catalogo" className="w-full py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 scroll-mt-20">
          <CatalogWrapper />
        </section>

        {/* Corporate Values / Why Us Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Editorial Statement */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <div className="border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-550 dark:text-slate-400 w-fit bg-white dark:bg-slate-900/50 shadow-2xs">
                <span className="text-primary font-extrabold mr-1">{'//'}</span> Filosofía de Trabajo
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans leading-tight">
                Compromiso Absoluto con la <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">Continuidad Clínica</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                Entendemos que la disponibilidad y la trazabilidad de los insumos es fundamental para el diagnóstico médico y la investigación científica. Por ello, aseguramos un flujo continuo, transparente y directo para laboratorios, clínicas e instituciones.
              </p>
              
              {/* Premium abstract graphical widget of continuity */}
              <div className="hidden lg:flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 shadow-2xs mt-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center animate-spin-slow shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                    23Y
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">Flujo de Abastecimiento Optimizado</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">Monitoreo continuo de stock crítico y entregas programadas en la Región del Biobío.</span>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Pillars Bento Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  num: '01',
                  title: 'Certificación Total',
                  desc: 'Insumos autorizados por el ISP y bajo estrictas normas chilenas.'
                },
                {
                  num: '02',
                  title: 'Trazabilidad SKU',
                  desc: 'Registro detallado de lotes y especificaciones técnicas.'
                },
                {
                  num: '03',
                  title: 'Logística Directa',
                  desc: 'Distribución propia y coordinada sin intermediarios en el Biobío.'
                },
                {
                  num: '04',
                  title: 'Contacto Humano',
                  desc: 'Presupuestos y cotizaciones ágiles por canales digitales directos.'
                }
              ].map((value) => (
                <div
                  key={value.num}
                  className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col gap-3 text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
                  <span className="text-3xl font-black text-primary/30 font-mono tracking-tight group-hover:text-primary transition-colors">
                    {value.num}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Quoting Call-to-Action Banner */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-teal-950 dark:bg-slate-950 text-white text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Abastezca su Institución con Insumos de Calidad
            </h2>
            <p className="text-sm sm:text-base text-teal-100 max-w-2xl leading-relaxed">
              Solicite una cotización detallada de insumos médicos o reactivos de laboratorio. Nuestro equipo responderá su requerimiento de forma ágil y personalizada directamente por WhatsApp.
            </p>
            <a
              href="https://wa.me/56992801300"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-teal-950 font-extrabold rounded-xl shadow-md transition-colors text-sm uppercase tracking-wider cursor-pointer"
            >
              Iniciar Cotización Directa
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/80">
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
