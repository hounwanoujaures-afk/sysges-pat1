// pages/index.js
// ============================================================
// Page racine — redirige vers /dashboard ou /login
// ============================================================

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth }   from '../context/AuthContext';
import Head          from 'next/head';

export default function IndexPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <>
      <Head>
        <title>SysGeS-PAT — Chargement…</title>
      </Head>

      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Emblème animé */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 animate-pulse-slow" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold">
              <span className="text-2xl">🏛️</span>
            </div>
          </div>

          {/* Spinner */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold-400/20 border-t-gold-400 rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-mono text-xs text-gold-400 tracking-widest uppercase">SysGeS-PAT</p>
              <p className="text-xs text-navy-500 mt-1">Initialisation du système…</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
