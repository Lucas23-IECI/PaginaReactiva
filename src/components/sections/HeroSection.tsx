'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Stethoscope,
    Microscope,
    ShieldCheck,
    Truck,
    ArrowRight,
    Star,
} from 'lucide-react';

/**
 * HeroSection — Hero moderno y disruptivo para Reactiva.cl
 *
 * Concepto visual:
 * - Split layout: texto animado a la izquierda + composición gráfica a la derecha
 * - Fondo con patrón hexagonal dinámico que respira
 * - Partículas flotantes de íconos médicos
 * - Efecto parallax sutil en scroll
 * - Estadísticas animadas con contadores
 * - Transiciones staggered con framer-motion
 */

// ─── Datos ───────────────────────────────────────────
const STATS = [
    { value: 23, suffix: '+', label: 'Años de experiencia' },
    { value: 93, suffix: '+', label: 'Productos en catálogo' },
    { value: 500, suffix: '+', label: 'Clientes activos' },
    { value: 98, suffix: '%', label: 'Satisfacción' },
];

const FLOATING_ICONS = [
    { Icon: Stethoscope, x: '8%', y: '15%', delay: 0, size: 22 },
    { Icon: Microscope, x: '82%', y: '25%', delay: 1.2, size: 26 },
    { Icon: ShieldCheck, x: '12%', y: '75%', delay: 2.4, size: 20 },
    { Icon: Star, x: '88%', y: '70%', delay: 0.6, size: 18 },
    { Icon: ShieldCheck, x: '45%', y: '85%', delay: 1.8, size: 24 },
    { Icon: Stethoscope, x: '75%', y: '12%', delay: 3.0, size: 20 },
];

// ─── Sub-componentes ─────────────────────────────────

function FloatingIcons() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {FLOATING_ICONS.map(({ Icon, x, y, delay, size }, i) => (
                <motion.div
                    key={i}
                    className="absolute text-teal-400/20 dark:text-teal-300/15"
                    style={{ left: x, top: y }}
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{
                        opacity: [0.15, 0.35, 0.15],
                        scale: [1, 1.15, 1],
                        y: [0, -12, 0],
                        rotate: [0, 8, 0],
                    }}
                    transition={{
                        duration: 5 + delay,
                        repeat: Infinity,
                        delay,
                        ease: 'easeInOut',
                    }}
                >
                    <Icon size={size} strokeWidth={1.5} />
                </motion.div>
            ))}
        </div>
    );
}

function HexMesh() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.06]" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="hex-grid" width="56" height="98" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                        <path
                            d="M28 0L56 16.5V49.5L28 66L0 49.5V16.5Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </pattern>
                    <mask id="hex-fade">
                        <rect width="100%" height="100%" fill="url(#hex-grad)" />
                    </mask>
                    <radialGradient id="hex-grad" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-grid)" mask="url(#hex-fade)" />
            </svg>
        </div>
    );
}

function AnimatedCounter({
    value,
    suffix,
    label,
    inView,
}: {
    value: number;
    suffix: string;
    label: string;
    inView: boolean;
}) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const duration = 1800;
        const start = performance.now();

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }, [inView, value]);

    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 tabular-nums tracking-tight">
                {display}
                <span className="text-teal-500 dark:text-teal-300">{suffix}</span>
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                {label}
            </span>
        </div>
    );
}

// ─── Componente Principal ────────────────────────────

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const [statsInView, setStatsInView] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

    // Observer para disparar contadores cuando las stats entran en viewport
    useEffect(() => {
        const node = statsRef.current;
        if (!node) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsInView(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[92vh] flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 overflow-hidden"
        >
            {/* Capas decorativas */}
            <HexMesh />
            <FloatingIcons />

            {/* Glow spots */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] rounded-full bg-teal-400/8 dark:bg-teal-500/6 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[50%] rounded-full bg-sky-400/6 dark:bg-sky-500/5 blur-[100px] pointer-events-none" />

            {/* Contenido principal */}
            <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative z-10 flex flex-col lg:flex-row items-center justify-center flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-20 gap-10 lg:gap-16"
            >
                {/* ── Columna izquierda: Texto ───────────────── */}
                <div className="w-full lg:w-[52%] flex flex-col gap-5 sm:gap-6 items-start text-center lg:text-left">
                    {/* Badge animado */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 dark:bg-teal-900/40 border border-teal-200/60 dark:border-teal-700/30 backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-[0.15em]">
                            Proveedor Líder en Chile
                        </span>
                    </motion.div>

                    {/* Título con staggered words */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                        <motion.span
                            className="block"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        >
                            Insumos Médicos
                        </motion.span>
                        <motion.span
                            className="block text-teal-600 dark:text-teal-400"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
                        >
                            de Calidad Superior
                        </motion.span>
                    </h1>

                    {/* Descripción */}
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
                        className="text-base sm:text-lg text-slate-600 dark:text-slate-350 leading-relaxed max-w-xl"
                    >
                        Equipamos a laboratorios, clínicas y hospitales con más de{' '}
                        <strong className="text-teal-700 dark:text-teal-300">93 insumos certificados</strong>.
                        Desde Concepción a todo Chile, con la confianza que solo{' '}
                        <strong className="text-teal-700 dark:text-teal-300">23 años</strong> de
                        experiencia pueden brindar.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.55 }}
                        className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
                    >
                        <a
                            href="#catalogo"
                            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                            Ver catálogo completo
                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                        <a
                            href="https://wa.me/56992801300"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-300 cursor-pointer"
                        >
                            <Truck size={17} />
                            Solicitar cotización
                        </a>
                    </motion.div>
                </div>

                {/* ── Columna derecha: Composición visual ─────── */}
                <div className="w-full lg:w-[48%] flex items-center justify-center relative">
                    {/* Tarjeta principal flotante con glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                        className="relative w-full max-w-[420px] aspect-[4/3] glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-center shadow-2xl shadow-teal-500/5 dark:shadow-teal-900/10 border border-white/20 dark:border-slate-700/40"
                    >
                        {/* Decorative corner accent */}
                        <div className="absolute -top-3 -left-3 w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-300/30 dark:border-teal-500/20 rotate-12" />

                        {/* Inner content */}
                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    Certificación Minsal
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    Todos nuestros insumos cumplen con las normativas sanitarias
                                    chilenas vigentes.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
                                <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    Despacho 24-48 hrs
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    Entregas rápidas en Biobío y cobertura nacional para que nunca
                                    te falte stock.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                                <Microscope className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    Tecnología de Punta
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    Equipamiento y reactivos de última generación para resultados
                                    precisos.
                                </p>
                            </div>
                        </div>

                        {/* Etiqueta de año flotante */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-4 -right-4 bg-teal-600 text-white rounded-2xl px-5 py-3 shadow-xl shadow-teal-500/30"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 block leading-none">
                                Desde
                            </span>
                            <span className="text-2xl font-extrabold leading-none">2002</span>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Barra de estadísticas ────────────────────── */}
            <div
                ref={statsRef}
                className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-14 lg:pb-20"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 py-6 px-4 sm:px-8 rounded-3xl bg-white/60 dark:bg-slate-850/50 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/40 shadow-sm">
                    {STATS.map((stat) => (
                        <AnimatedCounter
                            key={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                            inView={statsInView}
                        />
                    ))}
                </div>
            </div>

            {/* Separador curvado inferior */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path
                        d="M0 40C240 80 480 0 720 20C960 40 1200 0 1440 30L1440 80L0 80Z"
                        className="fill-slate-50 dark:fill-slate-900"
                    />
                </svg>
            </div>
        </section>
    );
}