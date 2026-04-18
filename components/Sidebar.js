// components/Sidebar.js
// ============================================================
// Sidebar de navigation latérale — design institutionnel premium
// ============================================================

import Link                 from 'next/link';
import { useRouter }        from 'next/router';
import { useAuth }          from '../context/AuthContext';
import toast                from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineCog,
} from 'react-icons/hi';

// Éléments de navigation
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: HiOutlineHome },
  { href: '/collecte',  label: 'Collecte',         icon: HiOutlineClipboardList },
  { href: '/analytics', label: 'Analytiques',      icon: HiOutlineChartBar },
];

const BOTTOM_ITEMS = [
  { href: '/parametres', label: 'Paramètres', icon: HiOutlineCog },
];

export default function Sidebar({ isOpen, onClose }) {
  const router       = useRouter();
  const { user, logout } = useAuth();

  // Déconnexion + redirection
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      router.push('/login');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Vérifier si le lien est actif
  const isActive = (href) => router.pathname === href;

  // Initiales de l'utilisateur
  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'AG';

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-surface-card border-r border-surface-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* ── Logo & Identité ── */}
        <div className="px-6 pt-8 pb-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            {/* Emblème */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <HiOutlineShieldCheck className="w-5 h-5 text-navy-900" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-surface-card" />
            </div>
            <div>
              <p className="text-xs font-mono text-gold-400 tracking-widest uppercase">SysGeS-PAT</p>
              <p className="text-[11px] text-navy-400 leading-tight mt-0.5">Patrimoine Touristique</p>
            </div>
          </div>
        </div>

        {/* ── Navigation principale ── */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-navy-500">
            Navigation
          </p>

          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 relative overflow-hidden
                ${isActive(href)
                  ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                  : 'text-navy-300 hover:text-white hover:bg-surface-muted'
                }
              `}
            >
              {/* Indicateur actif */}
              {isActive(href) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold-400 rounded-r-full" />
              )}
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200 ${isActive(href) ? 'text-gold-400' : 'group-hover:scale-110'}`} />
              <span>{label}</span>
            </Link>
          ))}

          {/* Séparateur */}
          <div className="my-4 border-t border-surface-border" />

          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-navy-500">
            Système
          </p>

          {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive(href)
                  ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                  : 'text-navy-300 hover:text-white hover:bg-surface-muted'
                }
              `}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* ── Profil utilisateur ── */}
        <div className="px-3 py-4 border-t border-surface-border">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-muted">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-gold-400">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.displayName || 'Agent Accueil'}
              </p>
              <p className="text-[10px] text-navy-400 truncate">{user?.email}</p>
            </div>
            {/* Bouton déconnexion */}
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="p-1.5 rounded-lg text-navy-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            >
              <HiOutlineLogout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
