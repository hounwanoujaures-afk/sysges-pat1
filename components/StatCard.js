// components/StatCard.js — Design institutionnel béninois
import { useEffect, useRef, useState } from 'react';
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import clsx from 'clsx';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    if (typeof target !== 'number') return;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return count;
}

const PALETTE = {
  gold:  { bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.22)',  text: '#f59e0b',  bar: '#fbbf24' },
  blue:  { bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.22)',  text: '#3b82f6',  bar: '#60a5fa' },
  green: { bg: 'rgba(34,139,87,0.12)',   border: 'rgba(34,139,87,0.25)',   text: '#228b57',  bar: '#45ae7a' },
  red:   { bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.22)',   text: '#ef4444',  bar: '#f87171' },
};

export default function StatCard({ title, value, unit='', icon:Icon, trend, trendLabel, accentColor='gold', format:fmt='number', delay=0, loading=false }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0, 1400);
  const isPos = trend?.startsWith('+');
  const p = PALETTE[accentColor] || PALETTE.gold;

  const display = () => {
    if (fmt === 'currency') return new Intl.NumberFormat('fr-FR', { style:'currency', currency:'XOF', maximumFractionDigits:0 }).format(animated);
    if (fmt === 'number')   return new Intl.NumberFormat('fr-FR').format(animated);
    return value;
  };

  if (loading) return (
    <div className="card animate-pulse">
      <div className="skeleton h-3 w-20 mb-4 rounded" />
      <div className="skeleton h-8 w-28 mb-3 rounded" />
      <div className="skeleton h-3 w-14 rounded" />
    </div>
  );

  return (
    <div className="card relative overflow-hidden group animate-slide-up opacity-0"
      style={{ animationDelay:`${delay}ms`, animationFillMode:'forwards' }}>

      {/* Accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: p.bar }} />

      {/* Glow décoratif */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: p.bg }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">{title}</p>
        {Icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{ background: p.bg, borderColor: p.border }}>
            <Icon className="w-4 h-4" style={{ color: p.text }} />
          </div>
        )}
      </div>

      {/* Valeur */}
      <p className="font-display text-3xl font-bold text-surface-dark leading-none mb-3">
        {display()}
        {unit && <span className="text-base font-body font-normal text-navy-400 ml-1">{unit}</span>}
      </p>

      {/* Tendance */}
      {trend && (
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md"
            style={ isPos
              ? { color:'#228b57', background:'rgba(34,139,87,0.10)' }
              : { color:'#ef4444', background:'rgba(239,68,68,0.10)' } }>
            {isPos ? <HiOutlineTrendingUp className="w-3 h-3" /> : <HiOutlineTrendingDown className="w-3 h-3" />}
            {trend}
          </span>
          {trendLabel && <span className="text-[11px] text-navy-400">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}