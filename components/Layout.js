// components/Layout.js
// ============================================================
// Layout principal des pages authentifiées
// Combine Sidebar + Navbar + contenu de page
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import { useAuth }             from '../context/AuthContext';
import Sidebar                 from './Sidebar';
import Navbar                  from './Navbar';

export default function Layout({ children, title = 'SysGeS-PAT', subtitle, onRefresh }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading }  = useAuth();
  const router                        = useRouter();

  // Redirection si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Affichage du spinner pendant la vérification de la session
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-navy-400 font-mono">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien rendre tant que la redirection n'est pas faite
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Navbar */}
        <Navbar
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setSidebarOpen(true)}
          onRefresh={onRefresh}
        />

        {/* Contenu de la page */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 page-enter">
          {children}
        </main>

        {/* Footer discret */}
        <footer className="px-8 py-4 border-t border-surface-border">
          <p className="text-[11px] text-navy-600 text-center font-mono">
            SysGeS-PAT v1.0 • Ministère du Tourisme • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
