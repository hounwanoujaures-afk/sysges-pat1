// pages/404.js
// ============================================================
// Page 404 personnalisée — design cohérent avec l'application
// ============================================================

import Head   from 'next/head';
import Link   from 'next/link';
import { HiOutlineHome, HiOutlineArrowLeft } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <>
      <Head><title>Page introuvable — SysGeS-PAT</title></Head>

      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        {/* Fond décoratif */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold-400/3 blur-3xl" />
        </div>

        <div className="relative text-center max-w-md animate-fade-in">
          {/* Numéro 404 décoratif */}
          <p className="font-display text-[120px] font-bold leading-none text-gradient-gold opacity-20 select-none">
            404
          </p>
          <div className="-mt-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏛️</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">
              Page introuvable
            </h1>
            <p className="text-sm text-navy-400 mb-8 leading-relaxed">
              Cette page n'existe pas ou vous n'avez pas les droits d'accès nécessaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <Link href="/dashboard" className="btn-primary">
                <HiOutlineHome className="w-4 h-4" />
                Tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
