// pages/parametres.js
// ============================================================
// Page Paramètres — profil, sécurité, informations système
// ============================================================

import { useState }  from 'react';
import Head          from 'next/head';
import Layout        from '../components/Layout';
import { useAuth }   from '../context/AuthContext';
import toast         from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineDatabase,
} from 'react-icons/hi';

export default function ParametresPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Simulation sauvegarde
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    toast.success('Paramètres enregistrés');
  };

  // ── Section réutilisable ─────────────────────────────────
  const Section = ({ icon: Icon, title, subtitle, color = 'gold', children }) => {
    const colors = {
      gold:  'bg-gold-400/10 border-gold-400/20 text-gold-400',
      blue:  'bg-blue-500/10 border-blue-500/20 text-blue-400',
      green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      gray:  'bg-surface-muted border-surface-border text-navy-400',
    };
    return (
      <div className="card animate-slide-up">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            {subtitle && <p className="text-[11px] text-navy-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    );
  };

  return (
    <>
      <Head><title>Paramètres — SysGeS-PAT</title></Head>

      <Layout title="Paramètres" subtitle="Configuration du système">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Profil ── */}
          <Section icon={HiOutlineUser} title="Profil utilisateur" subtitle="Informations de compte" color="gold">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    defaultValue={user?.displayName || ''}
                    placeholder="Nom d'affichage"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Adresse email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    readOnly
                    className="form-input opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="form-label">Rôle</label>
                  <div className="form-input text-navy-400 cursor-not-allowed bg-surface-muted/50">
                    Agent d'accueil / Administrateur
                  </div>
                </div>
                <div>
                  <label className="form-label">UID Firebase</label>
                  <div className="form-input text-navy-500 text-xs font-mono truncate cursor-not-allowed bg-surface-muted/50">
                    {user?.uid || 'demo-user-id'}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> Sauvegarde…</>
                  ) : (
                    <><HiOutlineCheckCircle className="w-4 h-4" /> Enregistrer</>
                  )}
                </button>
              </div>
            </form>
          </Section>

          {/* ── Sécurité ── */}
          <Section icon={HiOutlineLockClosed} title="Sécurité" subtitle="Authentification et sessions" color="blue">
            <div className="space-y-3">
              {[
                { label: 'Authentification', value: 'Firebase Auth Email/Mot de passe', badge: 'Actif' },
                { label: 'Fournisseur',      value: 'Google Firebase (BaaS)',           badge: null   },
                { label: 'Dernière connexion',
                  value: user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString('fr-FR')
                    : 'Non disponible',
                  badge: null },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-muted border border-surface-border">
                  <div>
                    <p className="text-xs text-navy-400">{item.label}</p>
                    <p className="text-sm text-white mt-0.5">{item.value}</p>
                  </div>
                  {item.badge && (
                    <span className="badge bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
              <p className="text-xs text-navy-600 mt-2 px-1">
                La modification du mot de passe s'effectue via la console Firebase ou l'e-mail de réinitialisation.
              </p>
            </div>
          </Section>

          {/* ── Firebase / Base de données ── */}
          <Section icon={HiOutlineDatabase} title="Base de données" subtitle="Configuration Firestore" color="green">
            <div className="space-y-3">
              {[
                { label: 'Projet Firebase',    value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Non configuré' },
                { label: 'Région',             value: 'europe-west (par défaut)' },
                { label: 'Collection principale', value: 'visitors' },
                { label: 'Mode',               value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id' || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Démonstration (mock data)' : 'Production' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-surface-muted border border-surface-border">
                  <p className="text-xs text-navy-400">{item.label}</p>
                  <p className="text-xs font-mono text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Informations système ── */}
          <Section icon={HiOutlineInformationCircle} title="Informations système" subtitle="Version et environnement" color="gray">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Application',  value: 'SysGeS-PAT' },
                { label: 'Version',      value: 'v1.0.0' },
                { label: 'Framework',    value: 'Next.js 14' },
                { label: 'Déploiement',  value: 'Vercel' },
                { label: 'Auth',         value: 'Firebase Auth' },
                { label: 'Base de données', value: 'Firestore' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-muted border border-surface-border">
                  <p className="text-[10px] uppercase tracking-widest text-navy-500 mb-1">{item.label}</p>
                  <p className="text-xs font-mono text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gold-400/5 border border-gold-400/15">
              <div className="flex items-start gap-2">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-navy-300 leading-relaxed">
                  Ce système est développé conformément aux exigences du
                  <strong className="text-gold-400"> Ministère du Tourisme, de la Culture et des Arts</strong> de la
                  République du Bénin. Toutes les données sont sécurisées par Firebase et hébergées sur Vercel.
                </p>
              </div>
            </div>
          </Section>

        </div>
      </Layout>
    </>
  );
}
