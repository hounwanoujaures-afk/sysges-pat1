// components/StatCard.js
// ============================================================
// Carte de statistique KPI — design premium avec animation
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import clsx from 'clsx';

// ── Hook d'animation compteur ──────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (typeof target !== 'number') return;
    const start     = performance.now();
    const startVal  = 0;
    const endVal    = target;

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing cubique
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startVal + (endVal - startVal) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return count;
}

// ── Composant principal ────────────────────────────────────
export default function StatCard({
  title,
  value,
  unit     = '',
  icon: Icon,
  trend,          // ex: '+12%' ou '-3%'
  trendLabel,     // ex: 'vs mois dernier'
  accentColor = 'gold', // 'gold' | 'blue' | 'green' | 'red'
  format: fmt = 'number', // 'number' | 'currency' | 'raw'
  delay = 0,
  loading = false,
}) {
  const animatedValue = useCountUp(typeof value === 'number' ? value : 0, 1400);
  const isPositive    = trend?.startsWith('+');

  // Palette de couleurs par accent
  const palette = {
    gold:  { bg: 'bg-gold-400/10',  border: 'border-gold-400/20',  text: 'text-gold-400',  icon: 'text-gold-400'  },
    blue:  { bg: 'bg-blue-500/10',  border: 'border-blue-500/20',  text: 'text-blue-400',  icon: 'text-blue-400'  },
    green: { bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',text: 'text-emerald-400',icon:'text-emerald-400'},
    red:   { bg: 'bg-rose-500/10',  border: 'border-rose-500/20',  text: 'text-rose-400',  icon: 'text-rose-400'  },
  };
  const colors = palette[accentColor] || palette.gold;

  // Formater la valeur affichée
  const displayValue = () => {
    if (fmt === 'currency') {
      return new Intl.NumberFormat('fr-FR', {
        style:    'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(animatedValue);
    }
    if (fmt === 'number') {
      return new Intl.NumberFormat('fr-FR').format(animatedValue);
    }
    return value; // raw
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'card group relative overflow-hidden',
        'animate-slide-up opacity-0',
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Lueur décorative arrière-plan */}
      <div className={clsx(
        'absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-50',
        colors.bg,
      )} />

      {/* ── En-tête : titre + icône ── */}
      <div className="flex items-start justify-between mb-4 relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-400">
          {title}
        </p>
        {Icon && (
          <div className={clsx(
            'w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0',
            colors.bg, colors.border,
          )}>
            <Icon className={clsx('w-4 h-4', colors.icon)} />
          </div>
        )}
      </div>

      {/* ── Valeur principale ── */}
      <div className="relative mb-3">
        <p className={clsx(
          'font-display text-3xl font-bold text-white leading-none',
          animatedValue > 0 && 'transition-all duration-300',
        )}>
          {displayValue()}
          {unit && <span className="text-base font-body font-normal text-navy-400 ml-1">{unit}</span>}
        </p>
      </div>

      {/* ── Tendance ── */}
      {trend && (
        <div className="flex items-center gap-1.5">
          <span className={clsx(
            'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
            isPositive
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-rose-400 bg-rose-400/10',
          )}>
            {isPositive
              ? <HiOutlineTrendingUp className="w-3 h-3" />
              : <HiOutlineTrendingDown className="w-3 h-3" />
            }
            {trend}
          </span>
          {trendLabel && (
            <span className="text-[11px] text-navy-500">{trendLabel}</span>
          )}
        </div>
      )}

      {/* Ligne décorative bas */}
      <div className={clsx(
        'absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        `bg-gradient-to-r from-transparent via-${accentColor === 'gold' ? 'gold-400' : accentColor === 'blue' ? 'blue-400' : accentColor === 'green' ? 'emerald-400' : 'rose-400'} to-transparent`,
      )} />
    </div>
  );
}
