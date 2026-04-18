// components/Navbar.js
// ============================================================
// Barre de navigation supérieure — titre de page + actions
// ============================================================

import { useState }    from 'react';
import { format }      from 'date-fns';
import { fr }          from 'date-fns/locale';
import {
  HiOutlineMenuAlt3,
  HiOutlineBell,
  HiOutlineRefresh,
} from 'react-icons/hi';

export default function Navbar({ title, subtitle, onMenuToggle, onRefresh }) {
  const [notifOpen, setNotifOpen] = useState(false);

  const now = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <header className="sticky top-0 z-10 glass border-b border-surface-border px-6 py-4">
      <div className="flex items-center justify-between">

        {/* ── Gauche : bouton menu (mobile) + titre ── */}
        <div className="flex items-center gap-4">
          {/* Toggle sidebar mobile */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-navy-400 hover:text-white hover:bg-surface-muted transition-all duration-200"
          >
            <HiOutlineMenuAlt3 className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-display text-xl font-semibold text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-navy-400 mt-0.5 capitalize">{subtitle || now}</p>
            )}
          </div>
        </div>

        {/* ── Droite : actions ── */}
        <div className="flex items-center gap-2">

          {/* Date affichage */}
          <span className="hidden md:flex items-center text-xs text-navy-400 bg-surface-muted border border-surface-border rounded-lg px-3 py-2 capitalize">
            {now}
          </span>

          {/* Bouton refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Actualiser les données"
              className="p-2.5 rounded-xl text-navy-400 hover:text-gold-400 hover:bg-gold-400/10 border border-surface-border transition-all duration-200 group"
            >
              <HiOutlineRefresh className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl text-navy-400 hover:text-white hover:bg-surface-muted border border-surface-border transition-all duration-200"
            >
              <HiOutlineBell className="w-4 h-4" />
              {/* Badge notification */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-400 rounded-full" />
            </button>

            {/* Dropdown notifications */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 card z-50 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <span className="badge bg-gold-400/10 text-gold-400 border border-gold-400/20">2 nouvelles</span>
                </div>
                <div className="space-y-3">
                  {[
                    { text: 'Pic de fréquentation détecté aujourd\'hui', time: 'Il y a 2h', dot: 'bg-gold-400' },
                    { text: 'Rapport mensuel disponible', time: 'Il y a 5h', dot: 'bg-blue-400' },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-muted transition-colors duration-150">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.dot}`} />
                      <div>
                        <p className="text-xs text-white">{notif.text}</p>
                        <p className="text-[10px] text-navy-500 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
