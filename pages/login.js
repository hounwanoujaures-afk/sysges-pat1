// pages/login.js — Design institutionnel béninois
import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import Head                    from 'next/head';
import { useAuth }             from '../context/AuthContext';
import toast                   from 'react-hot-toast';
import {
  HiOutlineMail, HiOutlineLockClosed, HiOutlineEye,
  HiOutlineEyeOff, HiOutlineShieldCheck, HiOutlineArrowRight,
} from 'react-icons/hi';

const DEMO = { email: 'admin@sysges-pat.bj', password: 'Demo@2024' };

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, authLoading, router]);

  const validate = () => {
    const e = {};
    if (!email)    e.email    = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format invalide';
    if (!password) e.password = 'Le mot de passe est requis';
    else if (password.length < 6) e.password = 'Minimum 6 caractères';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Connexion réussie ! Bienvenue.');
      router.push('/dashboard');
    } catch (err) {
      const msg = {
        'auth/user-not-found':    'Aucun compte avec cet email',
        'auth/wrong-password':    'Mot de passe incorrect',
        'auth/invalid-email':     "Format d'email invalide",
        'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard',
        'auth/invalid-credential':'Identifiants incorrects',
      }[err.code] || 'Erreur de connexion. Vérifiez vos identifiants.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (authLoading) return null;

  return (
    <>
      <Head>
        <title>Connexion — SysGeS-PAT</title>
        <meta name="description" content="Système de Gestion des Statistiques du Patrimoine Touristique" />
      </Head>

      <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#f5f7f5' }}>

        {/* ── Panneau gauche — Institutionnel ── */}
        <div className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 relative"
          style={{ background: 'linear-gradient(180deg, #0c2818 0%, #050f09 100%)', borderRight: '1px solid #1e4a2e' }}>

          {/* Bandeau tricolore Bénin */}
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #009A00 0%, #009A00 33%, #FFCD00 33%, #FFCD00 66%, #E8000D 66%, #E8000D 100%)' }} />

          {/* Header */}
          <div className="px-10 pt-10">
            <div className="flex items-center gap-1.5 mb-8">
              <div className="w-1 h-5 rounded-full"
                style={{ background: 'linear-gradient(180deg, #009A00, #FFCD00, #E8000D)' }} />
              <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#4a8a66' }}>
                République du Bénin
              </span>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 24px rgba(251,191,36,0.35)' }}>
                <HiOutlineShieldCheck className="w-7 h-7" style={{ color: '#0c2818' }} />
              </div>
              <div>
                <p className="text-lg font-bold tracking-wide" style={{ color: '#fbbf24' }}>SysGeS-PAT</p>
                <p className="text-xs" style={{ color: '#a3c9b0' }}>Patrimoine Touristique du Bénin</p>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold leading-snug mb-4" style={{ color: '#e8f5ed' }}>
              Plateforme nationale<br />
              de gestion du{' '}
              <span className="text-gradient-gold">Patrimoine</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6fa888' }}>
              Collecte, suivi et analyse des données de fréquentation
              des sites touristiques du Bénin.
            </p>
          </div>

          {/* Stats rapides */}
          <div className="px-10 py-8">
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { value: '120+', label: 'Sites gérés' },
                { value: '50K+', label: 'Visiteurs/an' },
                { value: '12',   label: 'Départements' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e4a2e' }}>
                  <p className="font-display text-xl font-bold text-gradient-gold">{s.value}</p>
                  <p className="text-[9px] mt-1" style={{ color: '#6fa888' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono" style={{ color: '#2e6b47' }}>
              © {new Date().getFullYear()} Ministère du Tourisme, de la Culture et des Arts
            </p>
          </div>
        </div>

        {/* ── Panneau droit — Formulaire ── */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-slide-up">

            {/* Logo mobile */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                <HiOutlineShieldCheck className="w-5 h-5" style={{ color: '#0c2818' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#0c2818' }}>SysGeS-PAT</p>
                <p className="text-[10px] text-navy-500">République du Bénin</p>
              </div>
            </div>

            {/* Titre */}
            <div className="mb-7">
              <h1 className="font-display text-2xl font-bold text-surface-dark">Connexion</h1>
              <p className="text-sm text-navy-500 mt-1">Accédez à votre espace de gestion sécurisé</p>
            </div>

            {/* Badge démo */}
            <button type="button" onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); setErrors({}); }}
              className="w-full flex items-center gap-3 mb-6 p-3 rounded-xl transition-all duration-200 group text-left"
              style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.20)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(251,191,36,0.07)'}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(251,191,36,0.15)' }}>
                <span className="text-base">🔑</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Mode démonstration</p>
                <p className="text-[11px] text-navy-400">Cliquer pour pré-remplir les identifiants de test</p>
              </div>
              <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" style={{ color: '#f59e0b' }} />
            </button>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label className="form-label">Adresse email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                  <input type="email" value={email} placeholder="agent@sysges-pat.bj" autoComplete="email"
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email:''})); }}
                    className={`form-input pl-10 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15' : ''}`} />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                  <input type={showPass ? 'text' : 'password'} value={password} placeholder="••••••••" autoComplete="current-password"
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password:''})); }}
                    className={`form-input pl-10 pr-11 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15' : ''}`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-surface-dark transition-colors duration-200">
                    {showPass ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="btn-primary w-full h-12 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor:'rgba(255,255,255,0.4)', borderTopColor:'transparent' }} />
                    Connexion en cours…</>
                ) : (
                  <><HiOutlineArrowRight className="w-4 h-4" />Se connecter</>
                )}
              </button>
            </form>

            {/* Sécurité */}
            <div className="mt-5 flex items-center gap-2 text-[11px] text-navy-400">
              <HiOutlineShieldCheck className="w-3.5 h-3.5 text-navy-300" />
              <span>Connexion sécurisée TLS 1.3 • Authentification Firebase</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}