// pages/404.js
import Head  from 'next/head';
import Link  from 'next/link';
import { HiOutlineHome, HiOutlineArrowLeft, HiOutlineShieldCheck } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <>
      <Head><title>Page introuvable — SysGeS-PAT</title></Head>
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-fade-in">
          <p className="font-display text-[100px] font-bold leading-none opacity-10 select-none"
            style={{ color: '#0c2818' }}>404</p>
          <div className="-mt-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.22)' }}>
              <HiOutlineShieldCheck className="w-7 h-7" style={{ color: '#f59e0b' }} />
            </div>
            <h1 className="font-display text-2xl font-bold text-surface-dark mb-3">Page introuvable</h1>
            <p className="text-sm text-navy-500 mb-8 leading-relaxed">
              Cette page n'existe pas ou vous n'avez pas les droits d'accès nécessaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => window.history.back()} className="btn-secondary">
                <HiOutlineArrowLeft className="w-4 h-4" />Retour
              </button>
              <Link href="/dashboard" className="btn-primary">
                <HiOutlineHome className="w-4 h-4" />Tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}