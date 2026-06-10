import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import Image from 'next/image';
import { LogOut, Package, PlusCircle, LayoutDashboard, Globe } from 'lucide-react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: LayoutProps) {
  // Check auth session
  const username = await getSessionUser();
  if (!username) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-950 border-r border-border flex flex-col justify-between shrink-0 z-30">
        <div className="flex flex-col gap-6 p-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-28">
              <Image
                src="https://reactiva.cl/wp-content/uploads/2026/01/cropped-LogoReactiva-VerdeO-300x100.png"
                alt="Reactiva Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-[10px] font-bold text-accent bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase shrink-0">
              Admin
            </span>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/dashboard/nuevo"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <PlusCircle size={16} />
              <span>Nuevo Producto</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Globe size={16} />
              <span>Ver Catálogo Público</span>
            </Link>
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-white">Conectado como:</span>
            <span className="text-xs text-muted">{username}</span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-8 md:p-10 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}

// Client Component button to handle logout
function LogoutButton() {
  return <LogoutAction />;
}

// Helper logout client button component in separate Client Action
import LogoutAction from './LogoutAction';
