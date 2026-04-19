// components/Navbar.js — Design institutionnel béninois
import { useState }       from 'react';
import { format }         from 'date-fns';
import { fr }             from 'date-fns/locale';
import { HiOutlineMenuAlt3, HiOutlineBell, HiOutlineRefresh } from 'react-icons/hi';

export default function Navbar({ title, subtitle, onMenuToggle, onRefresh }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const now = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <header className="sticky top-0 z-10 glass border-b border-surface-border px-6 py-4">
      {/* Ligne décorative supérieure — couleurs Bénin */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, #009A00 0%, #009A00 33%, #FFCD00 33%, #FFCD00 66%, #E8000D 66%, #E8000D 100%)' }} />

      <div className="flex items-center justify-between">

        {/* Gauche */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-navy-500 hover:text-surface-dark hover:bg-surface-muted transition-all duration-200">
            <HiOutlineMenuAlt3 className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-lg font-semibold text-surface-dark leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-navy-500 mt-0.5 capitalize">{subtitle}</p>}
          </div>
        </div>

        {/* Droite */}
        <div className="flex items-center gap-2">
          {/* Date */}
          <span className="hidden md:flex items-center text-xs text-navy-500 bg-surface-muted border border-surface-border rounded-lg px-3 py-2 capitalize">
            {now}
          </span>

          {/* Refresh */}
          {onRefresh && (
            <button onClick={onRefresh} title="Actualiser"
              className="p-2.5 rounded-xl text-navy-500 hover:text-surface-dark hover:bg-surface-muted border border-surface-border transition-all duration-200 group">
              <HiOutlineRefresh className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl text-navy-500 hover:text-surface-dark hover:bg-surface-muted border border-surface-border transition-all duration-200">
              <HiOutlineBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-400 rounded-full" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 card z-50 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-surface-dark">Notifications</p>
                  <span className="badge" style={{ background: 'rgba(251,191,36,0.12)', color: '#f59e0b', border: '1px solid rgba(251,191,36,0.25)' }}>
                    2 nouvelles
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { text: "Pic de fréquentation détecté aujourd'hui", time: 'Il y a 2h', color: '#fbbf24' },
                    { text: 'Rapport mensuel disponible', time: 'Il y a 5h', color: '#45ae7a' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-muted transition-colors duration-150 cursor-default">
                      <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.color }} />
                      <div>
                        <p className="text-xs text-surface-dark">{n.text}</p>
                        <p className="text-[10px] text-navy-400 mt-0.5">{n.time}</p>
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