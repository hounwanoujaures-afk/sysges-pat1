// components/Layout.js
import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import { useAuth }             from '../context/AuthContext';
import Sidebar                 from './Sidebar';
import Navbar                  from './Navbar';

export default function Layout({ children, title = 'SysGeS-PAT', subtitle, onRefresh }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading }  = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, loading, router]);

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
          <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#fbbf24', borderTopColor: 'transparent' }} />
        </div>
        <p className="text-xs text-navy-500 font-mono">Chargement...</p>
      </div>
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} subtitle={subtitle}
          onMenuToggle={() => setSidebarOpen(true)} onRefresh={onRefresh} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 page-enter">
          {children}
        </main>

        <footer className="px-8 py-3 border-t border-surface-border">
          <p className="text-[10px] text-navy-400 text-center font-mono">
            SysGeS-PAT v1.0 © {new Date().getFullYear()} — Ministère du Tourisme, de la Culture et des Arts du Bénin
          </p>
        </footer>
      </div>
    </div>
  );
}