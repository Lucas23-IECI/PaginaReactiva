'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error en el servidor. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-border/80 rounded-3xl p-8 shadow-xl flex flex-col gap-6 glass-panel relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>

        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className="relative h-12 w-40">
            <Image
              src="https://reactiva.cl/wp-content/uploads/2026/01/cropped-LogoReactiva-VerdeO-300x100.png"
              alt="Reactiva Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xs font-bold text-muted uppercase tracking-wider mt-2">
            Panel de Administración
          </span>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 relative">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900/50 border border-border/70 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-muted" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900/50 border border-border/70 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center relative">
          <a
            href="/"
            className="text-xs font-semibold text-primary hover:underline transition-all"
          >
            Volver al catálogo público
          </a>
        </div>

      </div>
    </div>
  );
}
