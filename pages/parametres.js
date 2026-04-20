// pages/parametres.js — SysGeS-PAT v2
import { useState } from 'react';
import Head   from 'next/head';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck,
  HiOutlineInformationCircle, HiOutlineCheckCircle, HiOutlineDatabase,
  HiOutlineGlobe, HiOutlineBell, HiOutlineColorSwatch, HiOutlineLogout,
} from 'react-icons/hi';
import { useRouter } from 'next/router';

const INFO_ROWS = [
  { label:'Application',    value:'SysGeS-PAT' },
  { label:'Version',        value:'v2.0.0' },
  { label:'Framework',      value:'Next.js 14' },
  { label:'Déploiement',    value:'Vercel (Edge Network)' },
  { label:'Authentification', value:'Firebase Auth' },
  { label:'Base de données', value:'Cloud Firestore' },
  { label:'Hébergement DB', value:'Google Cloud' },
  { label:'Ministère',      value:'Tourisme, Culture & Arts' },
];

export default function ParametresPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profil');

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Paramètres enregistrés');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    router.push('/login');
  };

  const tabs = [
    { id:'profil',   label:'Profil',      icon:HiOutlineUser },
    { id:'securite', label:'Sécurité',    icon:HiOutlineLockClosed },
    { id:'systeme',  label:'Système',     icon:HiOutlineDatabase },
    { id:'apropos',  label:'À propos',    icon:HiOutlineInformationCircle },
  ];

  return (
    <>
      <Head><title>Paramètres — SysGeS-PAT</title></Head>
      <Layout title="Paramètres" subtitle="Configuration du système">
        <div className="max-w-3xl mx-auto">

          {/* ── Onglets ── */}
          <div className="flex gap-1 mb-6 p-1 rounded-2xl border border-surface-border bg-surface-card shadow-card">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={activeTab===t.id
                  ? { background:'#0c2818', color:'white', boxShadow:'0 2px 8px rgba(12,40,24,0.25)' }
                  : { color:'#6fa888' }}>
                <t.icon className="w-4 h-4"/>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Profil ── */}
          {activeTab==='profil' && (
            <div className="space-y-5 animate-fade-in">
              {/* Avatar & identité */}
              <div className="card">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-surface-border">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background:'linear-gradient(135deg, #155a3a, #0c2818)', boxShadow:'0 4px 16px rgba(12,40,24,0.25)' }}>
                    <span className="text-xl font-bold" style={{ color:'#fbbf24' }}>
                      {user?.email?.substring(0,2).toUpperCase()||'AG'}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-surface-dark">
                      {user?.displayName || 'Agent d\'accueil'}
                    </p>
                    <p className="text-sm text-navy-500">{user?.email}</p>
                    <span className="mt-1.5 badge text-[10px]" style={{ background:'rgba(34,139,87,0.10)', border:'1px solid rgba(34,139,87,0.25)', color:'#228b57' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow inline-block mr-1"/>
                      {user?.isDemo ? 'Mode démo' : 'Compte actif'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Nom complet</label>
                      <input type="text" defaultValue={user?.displayName||''} placeholder="Votre nom" className="form-input"/>
                    </div>
                    <div>
                      <label className="form-label">Adresse email</label>
                      <input type="email" defaultValue={user?.email||''} readOnly className="form-input opacity-60 cursor-not-allowed"/>
                    </div>
                    <div>
                      <label className="form-label">Rôle</label>
                      <div className="form-input text-navy-500 cursor-not-allowed">Agent d'accueil / Administrateur</div>
                    </div>
                    <div>
                      <label className="form-label">Langue</label>
                      <select className="form-input">
                        <option>Français (Bénin)</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-navy-400 font-mono">UID: {user?.uid||'demo-user'}</p>
                    <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                      {saving
                        ? <><span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'white' }}/>Sauvegarde…</>
                        : <><HiOutlineCheckCircle className="w-4 h-4"/>Enregistrer</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Notifications */}
              <div className="card">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-border">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(251,191,36,0.10)', border:'1px solid rgba(251,191,36,0.25)' }}>
                    <HiOutlineBell className="w-4 h-4" style={{ color:'#f59e0b' }}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-dark">Notifications</p>
                    <p className="text-[11px] text-navy-400">Préférences d'alertes</p>
                  </div>
                </div>
                {[
                  { label:'Nouveaux enregistrements', sub:'Notifier à chaque collecte', on:true },
                  { label:'Rapports hebdomadaires',   sub:'Résumé chaque lundi',        on:true },
                  { label:'Alertes de fréquentation', sub:'Pic ou baisse anormale',     on:false },
                ].map((n,i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-surface-dark">{n.label}</p>
                      <p className="text-[11px] text-navy-400">{n.sub}</p>
                    </div>
                    <div className="w-10 h-5 rounded-full cursor-pointer transition-all duration-300 relative"
                      style={{ background: n.on ? '#155a3a' : '#d4e6da' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                        style={{ left: n.on ? '22px' : '2px' }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone danger */}
              <div className="card" style={{ border:'1px solid rgba(239,68,68,0.20)', background:'rgba(239,68,68,0.02)' }}>
                <p className="text-sm font-semibold text-red-500 mb-3">Zone de déconnexion</p>
                <p className="text-xs text-navy-400 mb-4">Vous serez redirigé vers la page de connexion.</p>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444' }}>
                  <HiOutlineLogout className="w-4 h-4"/>Se déconnecter
                </button>
              </div>
            </div>
          )}

          {/* ── Sécurité ── */}
          {activeTab==='securite' && (
            <div className="space-y-5 animate-fade-in">
              <div className="card">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(59,130,246,0.10)', border:'1px solid rgba(59,130,246,0.25)' }}>
                    <HiOutlineShieldCheck className="w-4 h-4" style={{ color:'#3b82f6' }}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-dark">Authentification & Sessions</p>
                    <p className="text-[11px] text-navy-400">Sécurité du compte</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label:'Méthode',          value:'Email / Mot de passe', badge:'Actif', badgeColor:'#228b57' },
                    { label:'Fournisseur',       value:'Google Firebase Auth', badge:null },
                    { label:'Dernière connexion',value:user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString('fr-FR') : 'Session démo', badge:null },
                    { label:'Protocole TLS',     value:'TLS 1.3 (chiffrement bout en bout)', badge:'Actif', badgeColor:'#228b57' },
                  ].map((item,i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-muted border border-surface-border">
                      <div>
                        <p className="text-xs text-navy-400">{item.label}</p>
                        <p className="text-sm text-surface-dark mt-0.5">{item.value}</p>
                      </div>
                      {item.badge && (
                        <span className="badge text-[10px]" style={{ background:`${item.badgeColor}15`, border:`1px solid ${item.badgeColor}40`, color:item.badgeColor }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow inline-block mr-1" style={{ background:item.badgeColor }}/>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl" style={{ background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.20)' }}>
                  <p className="text-xs text-navy-500">
                    La modification du mot de passe s'effectue via la <strong className="text-surface-dark">console Firebase</strong> ou par email de réinitialisation.
                  </p>
                </div>
              </div>

              {/* Historique connexions */}
              <div className="card">
                <p className="text-sm font-semibold text-surface-dark mb-4">Historique des connexions</p>
                <div className="space-y-2">
                  {[
                    { ip:'197.x.x.x (Cotonou, BJ)', time:'Aujourd\'hui – Session actuelle', current:true },
                    { ip:'197.x.x.x (Cotonou, BJ)', time:'Hier – 09:14', current:false },
                    { ip:'197.x.x.x (Cotonou, BJ)', time:'Il y a 3 jours – 08:52', current:false },
                  ].map((s,i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-surface-muted border border-surface-border">
                      <div>
                        <p className="text-xs font-mono text-surface-dark">{s.ip}</p>
                        <p className="text-[10px] text-navy-400 mt-0.5">{s.time}</p>
                      </div>
                      {s.current && (
                        <span className="badge text-[10px]" style={{ background:'rgba(34,139,87,0.10)', border:'1px solid rgba(34,139,87,0.25)', color:'#228b57' }}>
                          En cours
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Système ── */}
          {activeTab==='systeme' && (
            <div className="space-y-5 animate-fade-in">
              <div className="card">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(34,139,87,0.10)', border:'1px solid rgba(34,139,87,0.25)' }}>
                    <HiOutlineDatabase className="w-4 h-4" style={{ color:'#228b57' }}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-dark">Base de données Firebase</p>
                    <p className="text-[11px] text-navy-400">Configuration Firestore</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label:'Projet Firebase',     value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Non configuré' },
                    { label:'Collection',          value:'visitors' },
                    { label:'Mode',                value: !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Démonstration (données fictives)' : 'Production (données réelles)' },
                    { label:'Règles Firestore',    value:'Authentification requise (read/write)' },
                    { label:'Région',              value:'europe-west1 (Belgique)' },
                  ].map((item,i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-surface-muted border border-surface-border">
                      <p className="text-xs text-navy-400">{item.label}</p>
                      <p className="text-xs font-mono text-surface-dark">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infos système */}
              <div className="card">
                <p className="text-sm font-semibold text-surface-dark mb-4">Stack technique</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {INFO_ROWS.slice(0,8).map((item,i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-muted border border-surface-border">
                      <p className="text-[9px] uppercase tracking-widest text-navy-400 mb-1">{item.label}</p>
                      <p className="text-xs font-mono text-surface-dark leading-snug">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Santé système */}
              <div className="card">
                <p className="text-sm font-semibold text-surface-dark mb-4">État des services</p>
                <div className="space-y-2">
                  {[
                    { name:'Vercel Edge Network', status:'Opérationnel', color:'#228b57' },
                    { name:'Firebase Auth',        status:'Opérationnel', color:'#228b57' },
                    { name:'Cloud Firestore',      status:'Opérationnel', color:'#228b57' },
                    { name:'Next.js Build',        status:'Compilé (prod)', color:'#3b82f6' },
                  ].map((s,i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-surface-muted border border-surface-border">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background:s.color }}/>
                        <p className="text-sm text-surface-dark">{s.name}</p>
                      </div>
                      <span className="text-xs font-semibold" style={{ color:s.color }}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── À propos ── */}
          {activeTab==='apropos' && (
            <div className="space-y-5 animate-fade-in">
              {/* Carte institutionnelle */}
              <div className="rounded-2xl overflow-hidden" style={{ background:'linear-gradient(135deg, #0c2818 0%, #050f09 100%)', border:'1px solid #1e4a2e' }}>
                {/* Bandeau tricolore */}
                <div className="h-1.5" style={{ background:'linear-gradient(90deg, #009A00 0%, #009A00 33%, #FFCD00 33%, #FFCD00 66%, #E8000D 66%, #E8000D 100%)' }}/>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background:'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow:'0 0 24px rgba(251,191,36,0.35)' }}>
                      <HiOutlineShieldCheck className="w-7 h-7" style={{ color:'#0c2818' }}/>
                    </div>
                    <div>
                      <p className="text-lg font-bold" style={{ color:'#fbbf24' }}>SysGeS-PAT</p>
                      <p className="text-xs" style={{ color:'#a3c9b0' }}>Système de Gestion des Statistiques du Patrimoine Touristique</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color:'#a3c9b0' }}>
                    Plateforme numérique gouvernementale conçue pour la collecte, le suivi et l'analyse
                    des données de fréquentation des sites touristiques du Bénin. Développée conformément
                    aux exigences du Ministère du Tourisme, de la Culture et des Arts.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value:'120+', label:'Sites touristiques' },
                      { value:'12',   label:'Départements' },
                      { value:'v2.0', label:'Version actuelle' },
                    ].map((s,i) => (
                      <div key={i} className="text-center p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid #1e4a2e' }}>
                        <p className="font-display text-xl font-bold" style={{ color:'#fbbf24' }}>{s.value}</p>
                        <p className="text-[10px] mt-1" style={{ color:'#6fa888' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Architecture */}
              <div className="card">
                <p className="text-sm font-semibold text-surface-dark mb-4">Architecture de la plateforme</p>
                <div className="space-y-3">
                  {[
                    { level:'Niveau 1', title:'Interface utilisateur (Front-end)', desc:'Web · Mobile · Tableaux de bord interactifs', icon:'🖥️', color:'#f59e0b' },
                    { level:'Niveau 2', title:'Serveur logique (Back-end via Firebase)', desc:'Firebase Auth · Firestore · Cloud Functions', icon:'⚡', color:'#3b82f6' },
                    { level:'Niveau 3', title:'Base de données (Cloud Firestore)', desc:'Visiteurs · Fréquentation · Statistiques · Rapports', icon:'🗄️', color:'#228b57' },
                  ].map((a,i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-muted border border-surface-border">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background:`${a.color}12`, border:`1px solid ${a.color}30` }}>
                        {a.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:a.color }}>{a.level}</span>
                        </div>
                        <p className="text-sm font-semibold text-surface-dark">{a.title}</p>
                        <p className="text-xs text-navy-400 mt-0.5">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card text-center">
                <HiOutlineGlobe className="w-6 h-6 mx-auto mb-3 text-navy-400"/>
                <p className="text-xs text-navy-400 leading-relaxed">
                  © {new Date().getFullYear()} République du Bénin<br/>
                  <strong className="text-surface-dark">Ministère du Tourisme, de la Culture et des Arts</strong><br/>
                  Tous droits réservés · SysGeS-PAT v2.0
                </p>
              </div>
            </div>
          )}

        </div>
      </Layout>
    </>
  );
}