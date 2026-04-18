// components/LoadingSpinner.js
// ============================================================
// Composant de chargement réutilisable
// ============================================================

import clsx from 'clsx';

/**
 * Spinner de chargement avec variantes de taille
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {string}              className
 * @param {string}              label       - Texte optionnel sous le spinner
 * @param {boolean}             overlay     - Affiche un overlay plein écran
 */
export default function LoadingSpinner({ size = 'md', className, label, overlay = false }) {
  const sizes = {
    sm:  'w-4 h-4 border-2',
    md:  'w-8 h-8 border-2',
    lg:  'w-12 h-12 border-2',
    xl:  'w-16 h-16 border-[3px]',
  };

  const spinner = (
    <div className={clsx('flex flex-col items-center gap-3', className)}>
      <div className={clsx(
        'rounded-full border-gold-400/20 border-t-gold-400 animate-spin',
        sizes[size],
      )} />
      {label && (
        <p className="text-xs text-navy-400 font-mono animate-pulse-slow">{label}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// ── Skeleton générique ────────────────────────────────────────
export function Skeleton({ width = '100%', height = 16, rounded = 'rounded-md', className }) {
  return (
    <div
      className={clsx('skeleton', rounded, className)}
      style={{ width, height }}
    />
  );
}

// ── Skeleton de page complète ─────────────────────────────────
export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card space-y-3">
            <Skeleton height={12} width="60%" />
            <Skeleton height={32} width="80%" />
            <Skeleton height={10} width="40%" />
          </div>
        ))}
      </div>
      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card">
          <Skeleton height={12} width="40%" className="mb-6" />
          <Skeleton height={260} />
        </div>
        <div className="card">
          <Skeleton height={12} width="50%" className="mb-6" />
          <Skeleton height={260} />
        </div>
      </div>
    </div>
  );
}
