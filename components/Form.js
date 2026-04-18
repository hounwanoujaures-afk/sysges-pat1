// components/Form.js
// ============================================================
// Bibliothèque de composants de formulaire réutilisables
// Utilisés dans la page Collecte et Paramètres
// ============================================================

import clsx from 'clsx';
import { HiOutlineX } from 'react-icons/hi';

// ── Label ────────────────────────────────────────────────────
export function Label({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="form-label">
      {children}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

// ── Input texte ──────────────────────────────────────────────
export function Input({ error, className, ...props }) {
  return (
    <input
      className={clsx(
        'form-input',
        error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20',
        className,
      )}
      {...props}
    />
  );
}

// ── Select ───────────────────────────────────────────────────
export function Select({ error, children, className, ...props }) {
  return (
    <select
      className={clsx(
        'form-input',
        error && 'border-rose-500/60',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Textarea ─────────────────────────────────────────────────
export function Textarea({ error, className, ...props }) {
  return (
    <textarea
      className={clsx(
        'form-input resize-none',
        error && 'border-rose-500/60',
        className,
      )}
      {...props}
    />
  );
}

// ── Message d'erreur ─────────────────────────────────────────
export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
      <HiOutlineX className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

// ── Groupe champ (Label + Input + Error) ─────────────────────
export function FormField({ label, required, error, children, hint }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {hint && !error && <p className="mt-1.5 text-[11px] text-navy-600">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}

// ── Divider de section formulaire ───────────────────────────
export function FormSection({ title, subtitle, icon: Icon, children, color = 'gold' }) {
  const colors = {
    gold:  'bg-gold-400/10 border-gold-400/20 text-gold-400',
    blue:  'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };
  return (
    <div className="card">
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
          {Icon && (
            <div className={clsx('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', colors[color])}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            {title    && <p className="text-sm font-semibold text-white">{title}</p>}
            {subtitle && <p className="text-[11px] text-navy-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// ── Toggle switch ────────────────────────────────────────────
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={clsx(
          'w-10 h-5 rounded-full transition-colors duration-200',
          checked ? 'bg-gold-400' : 'bg-surface-muted border border-surface-border',
        )} />
        <div className={clsx(
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        )} />
      </div>
      {label && <span className="text-sm text-navy-300 group-hover:text-white transition-colors duration-200">{label}</span>}
    </label>
  );
}
