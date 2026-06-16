import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Barcode,
  Clock3,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import productsJson from '@/data/products.json';
import { Product } from '@/types';

const products = productsJson as Product[];
const labelProduct = products.find((p) => p.sku === '2248') ?? products[0];

function ProductPhoto({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function Nav() {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.24em] text-teal-700">
          Reactiva / shortlist hero
        </Link>
        <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.14em]">
          <a href="#lote" className="border border-slate-300 px-3 py-2 hover:bg-slate-950 hover:text-white">
            Opcion 1
          </a>
          <a href="#continuidad" className="border border-slate-300 px-3 py-2 hover:bg-slate-950 hover:text-white">
            Opcion 4
          </a>
        </div>
      </div>
    </div>
  );
}

function OptionBadge({ n, name }: { n: string; name: string }) {
  return (
    <div className="absolute left-5 top-5 z-30 bg-slate-950 px-4 py-3 text-white shadow-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Opcion {n}</p>
      <p className="text-sm font-black uppercase tracking-[0.12em]">{name}</p>
    </div>
  );
}

function BarcodeMark() {
  return (
    <div className="flex h-20 items-end gap-1" aria-hidden="true">
      {Array.from({ length: 31 }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-950"
          style={{
            width: index % 5 === 0 ? 9 : index % 2 === 0 ? 5 : 3,
            height: `${28 + (index % 8) * 6}px`,
          }}
        />
      ))}
    </div>
  );
}

function HeroBatchLabel() {
  return (
    <section id="lote" className="relative min-h-[900px] overflow-hidden bg-[#eff6f4] text-slate-950">
      <OptionBadge n="1" name="Lote y ruta" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute bottom-0 left-0 h-28 w-full bg-white" />

      <div className="absolute -right-20 top-24 hidden h-[670px] w-[680px] rotate-[5deg] border-[24px] border-slate-950 bg-white shadow-2xl shadow-slate-950/20 lg:block">
        <div className="absolute inset-x-0 top-0 grid grid-cols-[1fr_160px] border-b-[18px] border-slate-950">
          <div className="px-8 py-7">
            <p className="text-6xl font-black leading-none tracking-tighter">REACTIVA</p>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.24em] text-teal-700">Despacho clinico certificado</p>
          </div>
          <div className="border-l-[18px] border-slate-950 px-5 py-6 text-right">
            <p className="text-5xl font-black leading-none">23</p>
            <p className="text-[10px] font-black uppercase tracking-[0.18em]">anos</p>
          </div>
        </div>

        <div className="absolute left-8 right-8 top-40 grid grid-cols-[1fr_205px] gap-7">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Pedido critico</p>
            <p className="mt-3 text-5xl font-black leading-[0.95]">Stock con nombre, lote y ruta.</p>
            <div className="mt-7 grid grid-cols-3 gap-2 text-center">
              {[
                ['90+', 'SKU'],
                ['ISP', 'control'],
                ['24-48h', 'ruta'],
              ].map(([value, label]) => (
                <div key={label} className="border-2 border-slate-950 py-4">
                  <p className="text-xl font-black leading-none">{value}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ProductPhoto product={labelProduct} className="aspect-square border-2 border-slate-950" />
            <p className="mt-3 truncate text-[10px] font-black uppercase tracking-[0.12em]">{labelProduct.name}</p>
            <p className="text-[10px] font-bold text-slate-500">SKU {labelProduct.sku}</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <BarcodeMark />
          <div className="mt-4 flex items-center justify-between border-t-2 border-slate-950 pt-4 text-[10px] font-black uppercase tracking-[0.18em]">
            <span>Concepcion</span>
            <span>Chiguayante</span>
            <span>Reactiva.cl</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[900px] max-w-7xl flex-col justify-center px-5 py-28 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-8 inline-flex items-center gap-2 border-2 border-slate-950 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] shadow-[6px_6px_0_#0f172a]">
            <Barcode size={18} /> Pedido identificado
          </p>
          <h1 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            Insumos clinicos con trazabilidad visible.
          </h1>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-slate-700">
            Una primera pantalla con lenguaje de etiqueta tecnica: concreta, regional y distinta a una vitrina generica.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/#catalogo" className="inline-flex h-13 items-center justify-center gap-2 bg-slate-950 px-7 text-sm font-black text-white shadow-[6px_6px_0_#0d9488]">
              Abrir catalogo <ArrowRight size={17} />
            </Link>
            <a href="https://wa.me/56992801300" className="inline-flex h-13 items-center justify-center border-2 border-slate-950 bg-white px-7 text-sm font-black">
              Cotizar directo
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: 'Control ISP' },
              { icon: PackageCheck, label: '90+ SKU' },
              { icon: Truck, label: 'Despacho directo' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="border-t-2 border-slate-950 pt-4">
                <Icon className="mb-3 h-5 w-5 text-teal-700" />
                <p className="text-[11px] font-black uppercase leading-4 tracking-[0.12em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroContinuity() {
  return (
    <section id="continuidad" className="relative min-h-[900px] overflow-hidden bg-white text-slate-950">
      <OptionBadge n="4" name="Continuidad clinica" />

      <div className="absolute left-0 top-0 h-full w-24 bg-teal-600" />
      <div className="absolute left-24 top-0 h-full w-7 bg-slate-950" />
      <div className="absolute right-8 top-16 hidden h-40 w-40 border-[18px] border-teal-100 lg:block" />
      <div className="absolute bottom-6 left-40 hidden text-[10rem] font-black leading-none tracking-tighter text-slate-100 lg:block">
        24H
      </div>

      <div className="relative mx-auto flex min-h-[900px] max-w-7xl flex-col justify-center px-5 py-28 pl-36 lg:px-8 lg:pl-44">
        <p className="mb-8 max-w-xl text-[12px] font-black uppercase leading-6 tracking-[0.28em] text-teal-700">
          Cuando falta stock, falta continuidad.
        </p>
        <h1 className="max-w-6xl text-7xl font-black leading-[0.84] tracking-tight sm:text-8xl lg:text-[9.2rem]">
          Que nada detenga el diagnostico.
        </h1>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/#catalogo" className="inline-flex h-13 items-center justify-center gap-2 bg-slate-950 px-7 text-sm font-black text-white">
            Ver stock disponible <ArrowRight size={17} />
          </Link>
          <a href="https://wa.me/56992801300" className="inline-flex h-13 items-center justify-center gap-2 border-2 border-slate-950 px-7 text-sm font-black">
            <MessageCircle size={17} /> Hablar con Reactiva
          </a>
        </div>

        <div className="mt-16 grid max-w-5xl gap-4 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Certificado', text: 'Insumos clinicos y reactivos con control.' },
            { icon: Clock3, title: 'Respuesta directa', text: 'Cotizacion rapida por canal humano.' },
            { icon: Truck, title: 'Ruta regional', text: 'Concepcion y Chiguayante sin intermediarios.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t-4 border-slate-950 bg-white py-5 pr-6">
              <Icon className="mb-5 h-7 w-7 text-teal-600" />
              <p className="text-xl font-black">{title}</p>
              <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HeroOptionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <HeroBatchLabel />
        <HeroContinuity />
      </main>
    </div>
  );
}
