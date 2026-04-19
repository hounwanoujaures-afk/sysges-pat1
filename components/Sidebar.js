// components/Sidebar.js — Design institutionnel béninois
import Link            from 'next/link';
import { useRouter }   from 'next/router';
import { useAuth }     from '../context/AuthContext';
import toast           from 'react-hot-toast';
import {
  HiOutlineHome, HiOutlineChartBar, HiOutlineClipboardList,
  HiOutlineLogout, HiOutlineCog, HiOutlineShieldCheck,
} from 'react-icons/hi';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: HiOutlineHome },
  { href: '/collecte',  label: 'Collecte',         icon: HiOutlineClipboardList },
  { href: '/analytics', label: 'Analytiques',      icon: HiOutlineChartBar },
];
const BOTTOM_ITEMS = [
  { href: '/parametres', label: 'Paramètres', icon: HiOutlineCog },
];

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try { await logout(); toast.success('Déconnexion réussie'); router.push('/login'); }
    catch { toast.error('Erreur lors de la déconnexion'); }
  };

  const isActive = (href) => router.pathname === href;
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'AG';

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 flex flex-col sidebar-bg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `} style={{ boxShadow: '4px 0 24px rgba(5,15,9,0.4)' }}>

        {/* ── Logo & Identité ── */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid #1e4a2e' }}>
          {/* Bandeau République du Bénin */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #009A00 0%, #FFCD00 50%, #E8000D 100%)' }} />
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#a3c9b0' }}>
              République du Bénin
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Emblème */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 16px rgba(251,191,36,0.3)' }}>
              <HiOutlineShieldCheck className="w-6 h-6" style={{ color: '#0c2818' }} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide" style={{ color: '#fbbf24' }}>SysGeS-PAT</p>
              <p className="text-[10px] leading-tight" style={{ color: '#a3c9b0' }}>Patrimoine Touristique</p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: '#4a8a66' }}>
            Navigation
          </p>

          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onClose}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative"
              style={isActive(href) ? {
                background: 'rgba(251,191,36,0.12)',
                color: '#fbbf24',
                border: '1px solid rgba(251,191,36,0.20)',
              } : {
                color: '#a3c9b0',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive(href)) { e.currentTarget.style.background = '#173825'; e.currentTarget.style.color = '#fff'; }}}
              onMouseLeave={e => { if (!isActive(href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a3c9b0'; }}}
            >
              {isActive(href) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: '#fbbf24' }} />
              )}
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="my-4" style={{ borderTop: '1px solid #1e4a2e' }} />

          <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: '#4a8a66' }}>
            Système
          </p>

          {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onClose}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={isActive(href) ? { background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.20)' }
                : { color: '#a3c9b0', border: '1px solid transparent' }}
              onMouseEnter={e => { if (!isActive(href)) { e.currentTarget.style.background = '#173825'; e.currentTarget.style.color = '#fff'; }}}
              onMouseLeave={e => { if (!isActive(href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a3c9b0'; }}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* ── Utilisateur ── */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid #1e4a2e' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: '#173825' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e4a2e, #0c2818)' }}>
              <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.displayName || 'Agent Accueil'}
              </p>
              <p className="text-[10px] truncate" style={{ color: '#6fa888' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} title="Se déconnecter"
              className="p-1.5 rounded-lg transition-all duration-200"
              style={{ color: '#6fa888' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6fa888'; e.currentTarget.style.background = 'transparent'; }}>
              <HiOutlineLogout className="w-4 h-4" />
            </button>
          </div>

          {/* Ministère */}
          <p className="mt-3 px-1 text-[9px] text-center leading-relaxed" style={{ color: '#2e6b47' }}>
            Ministère du Tourisme, de la Culture<br />et des Arts — Bénin
          </p>
        </div>
      </aside>
    </>
  );
}