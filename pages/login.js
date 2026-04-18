// pages/login.js
// ============================================================
// Page de connexion — design premium institutionnel
// Firebase Auth email/mot de passe
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import Head                    from 'next/head';
import { useAuth }             from '../context/AuthContext';
import toast                   from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
} from 'react-icons/hi';

// Données de démo visibles (pour présentation)
const DEMO_CREDENTIALS = {
  email:    'admin@sysges-pat.bj',
  password: 'Demo@2024',
};

export default function LoginPage() {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [errors,      setErrors]      = useState({});

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // ── Validation locale ──────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!email)    errs.email    = 'L\'adresse email est requise';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Format email invalide';
    if (!password) errs.password = 'Le mot de passe est requis';
    else if (password.length < 6) errs.password = 'Minimum 6 caractères';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Soumission du formulaire ───────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Connexion réussie ! Bienvenue.');
      router.push('/dashboard');
    } catch (err) {
      // Mapper les erreurs Firebase en messages lisibles
      const msg = {
        'auth/user-not-found':   'Aucun compte avec cet email',
        'auth/wrong-password':   'Mot de passe incorrect',
        'auth/invalid-email':    'Format d\'email invalide',
        'auth/too-many-requests':'Trop de tentatives. Réessayez plus tard',
        'auth/invalid-credential':'Identifiants incorrects',
      }[err.code] || 'Erreur de connexion. Vérifiez vos identifiants.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Remplir les identifiants de démo ──────────────────
  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setErrors({});
  };

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Connexion — SysGeS-PAT</title>
        <meta name="description" content="Système de Gestion des Statistiques du Patrimoine Touristique" />
      </Head>

      <div className="min-h-screen bg-surface flex relative overflow-hidden">

        {/* ── Fond décoratif ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient mesh */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-mesh" />
          {/* Cercles décoratifs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-navy-600/30 blur-3xl" />
          {/* Grille subtile */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(to right, #fbbf24 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* ── Panneau gauche (hero) — masqué sur mobile ── */}
        <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative border-r border-surface-border p-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold">
              <HiOutlineShieldCheck className="w-5 h-5 text-navy-900" />
            </div>
            <div>
              <p className="text-xs font-mono text-gold-400 tracking-widest uppercase">SysGeS-PAT</p>
              <p className="text-[11px] text-navy-400">République du Bénin</p>
            </div>
          </div>

          {/* Contenu central */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse-slow" />
              <span className="text-xs font-semibold text-gold-400 tracking-wide">Système Officiel</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white leading-tight">
              Gestion du<br />
              <span className="text-gradient-gold">Patrimoine</span><br />
              Touristique
            </h2>
            <p className="text-sm text-navy-300 leading-relaxed max-w-xs">
              Plateforme nationale de collecte et d'analyse des données de fréquentation
              des sites touristiques du Bénin.
            </p>

            {/* Métriques rapides */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: '120+', label: 'Sites gérés' },
                { value: '50K+', label: 'Visiteurs' },
                { value: '12',   label: 'Départements' },
              ].map((m, i) => (
                <div key={i} className="card text-center p-4">
                  <p className="font-display text-2xl font-bold text-gradient-gold">{m.value}</p>
                  <p className="text-[10px] text-navy-400 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-[11px] text-navy-600 font-mono">
            © {new Date().getFullYear()} Ministère du Tourisme, de la Culture et des Arts
          </p>
        </div>

        {/* ── Panneau droit : formulaire ── */}
        <div className="flex-1 flex items-center justify-center p-6 relative">

          <div className="w-full max-w-md animate-slide-up">

            {/* Logo mobile */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <HiOutlineShieldCheck className="w-4 h-4 text-navy-900" />
              </div>
              <p className="font-mono text-sm text-gold-400 tracking-widest uppercase">SysGeS-PAT</p>
            </div>

            {/* En-tête formulaire */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-white">Connexion</h1>
              <p className="text-sm text-navy-400 mt-2">
                Accédez à votre espace de gestion sécurisé
              </p>
            </div>

            {/* Badge démo */}
            <button
              type="button"
              onClick={fillDemo}
              className="w-full flex items-center gap-3 mb-6 p-3 rounded-xl bg-gold-400/5 border border-gold-400/20 hover:bg-gold-400/10 transition-colors duration-200 group"
            >
              <div className="w-7 h-7 rounded-lg bg-gold-400/15 flex items-center justify-center flex-shrink-0">
                <span className="text-base">🔑</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gold-400">Mode démonstration</p>
                <p className="text-[11px] text-navy-500">Cliquer pour pré-remplir les identifiants de test</p>
              </div>
              <HiOutlineArrowRight className="ml-auto w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label className="form-label">Adresse email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="agent@sysges-pat.bj"
                    className={`form-input pl-10 ${errors.email ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                    placeholder="••••••••"
                    className={`form-input pl-10 pr-11 ${errors.password ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors duration-200"
                  >
                    {showPass ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-2 h-12 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                    Connexion en cours…
                  </>
                ) : (
                  <>
                    <HiOutlineArrowRight className="w-4 h-4" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Note sécurité */}
            <div className="mt-6 flex items-center gap-2 text-[11px] text-navy-500">
              <HiOutlineShieldCheck className="w-3.5 h-3.5 text-navy-600" />
              <span>Connexion sécurisée TLS 1.3 • Authentification Firebase</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
