'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutAction() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-2.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 dark:border-red-900/40 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
    >
      <LogOut size={14} />
      <span>Cerrar Sesión</span>
    </button>
  );
}
