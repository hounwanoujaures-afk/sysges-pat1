// components/Card.js
// ============================================================
// Carte générique réutilisable avec variantes
// ============================================================

import clsx from 'clsx';

/**
 * @param {object}  props
 * @param {string}  props.className     - Classes additionnelles
 * @param {string}  props.title         - Titre de la carte
 * @param {string}  props.subtitle      - Sous-titre optionnel
 * @param {node}    props.action        - Élément action (bouton, badge…)
 * @param {node}    props.children      - Contenu de la carte
 * @param {'default'|'glass'|'bordered'} props.variant
 * @param {number}  props.animDelay     - Délai d'animation (ms)
 */
export default function Card({
  className,
  title,
  subtitle,
  action,
  children,
  variant    = 'default',
  animDelay  = 0,
}) {
  const variants = {
    default:  'card',
    glass:    'glass border border-surface-border rounded-2xl p-6',
    bordered: 'bg-transparent border border-surface-border rounded-2xl p-6',
  };

  return (
    <div
      className={clsx(
        variants[variant],
        'animate-slide-up opacity-0',
        className,
      )}
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'forwards' }}
    >
      {/* En-tête optionnel */}
      {(title || action) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title    && <p className="section-title">{title}</p>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
      )}

      {/* Contenu */}
      {children}
    </div>
  );
}

// ── Variante : carte vide (état zéro) ──────────────────────
export function EmptyCard({ icon, message, hint, action }) {
  return (
    <div className="card flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mb-4 text-2xl">
          {icon}
        </div>
      )}
      <p className="text-sm text-navy-400">{message}</p>
      {hint && <p className="text-xs text-navy-600 mt-1.5">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Variante : skeleton de carte ────────────────────────────
export function CardSkeleton({ rows = 3, className }) {
  return (
    <div className={clsx('card animate-pulse space-y-3', className)}>
      <div className="skeleton h-4 w-1/3 rounded" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="skeleton h-3 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}
