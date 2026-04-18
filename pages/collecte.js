// pages/collecte.js
// ============================================================
// Page de collecte des données visiteurs
// Formulaire complet → envoi vers Firebase Firestore
// ============================================================

import { useState }    from 'react';
import Head            from 'next/head';
import Layout          from '../components/Layout';
import { addVisitor }  from '../lib/firestore';
import toast           from 'react-hot-toast';
import { format }      from 'date-fns';
import { fr }          from 'date-fns/locale';
import {
  HiOutlineUser,
  HiOutlineGlobe,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineUsers,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

// ── Listes de référence ────────────────────────────────────
const NATIONALITES = [
  'Béninoise', 'Française', 'Américaine', 'Togolaise', 'Nigériane',
  'Allemande', 'Britannique', 'Sénégalaise', 'Ivoirienne', 'Ghanéenne',
  'Burkinabè', 'Nigérienne', 'Malienne', 'Camerounaise', 'Congolaise',
  'Brésilienne', 'Canadienne', 'Chinoise', 'Japonaise', 'Italienne',
  'Espagnole', 'Portugaise', 'Belge', 'Suisse', 'Néerlandaise',
  'Autre',
];

const ACTIVITES = [
  'Visite Palais Royal d\'Abomey',
  'Musée Historique d\'Abomey',
  'Route des Esclaves — Ouidah',
  'Temple des Pythons — Ouidah',
  'Cour Royale de Danhomè',
  'Bénin Bronze Tour',
  'Palais de Ouidah',
  'Plage de Cotonou',
  'Marché Dantokpa',
  'Fondation Zinsou',
  'Festival Vodoun',
  'Parc national de la Pendjari',
  'W National Park',
  'Lac Nokoué',
  'Villages lacustres de Ganvié',
  'Autre activité',
];

const TRANCHES_AGE = ['< 18', '18–25', '26–35', '36–50', '51–65', '> 65'];

// ── Valeurs initiales du formulaire ───────────────────────
const INITIAL_FORM = {
  nom:             '',
  prenom:          '',
  trancheAge:      '',
  sexe:            '',
  nationalite:     '',
  nombreVisiteurs: '1',
  activiteVisitee: '',
  observations:    '',
};

// ── Composant principal ────────────────────────────────────
export default function CollectePage() {
  const [form,       setForm]       = useState(INITIAL_FORM);
  const [errors,     setErrors]     = useState({});
  const [isLoading,  setIsLoading]  = useState(false);
  const [submitted,  setSubmitted]  = useState(null); // stocke le dernier envoi réussi
  const [count,      setCount]      = useState(0);    // nb d'enregistrements de la session

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  // ── Mise à jour champ ────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.nom.trim())           errs.nom           = 'Nom requis';
    if (!form.prenom.trim())        errs.prenom        = 'Prénom requis';
    if (!form.sexe)                 errs.sexe          = 'Sexe requis';
    if (!form.nationalite)          errs.nationalite   = 'Nationalité requise';
    if (!form.activiteVisitee)      errs.activiteVisitee = 'Activité requise';
    const nb = Number(form.nombreVisiteurs);
    if (!form.nombreVisiteurs || isNaN(nb) || nb < 1 || nb > 200) {
      errs.nombreVisiteurs = 'Nombre entre 1 et 200';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Soumission ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Corrigez les erreurs avant de soumettre');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...form,
        nombreVisiteurs: Number(form.nombreVisiteurs),
        dateVisite:      new Date().toISOString(),
      };

      const result = await addVisitor(payload);

      if (result.success || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id') {
        // Succès (ou mode démo)
        setSubmitted({ ...payload, id: result.id || `demo-${Date.now()}` });
        setCount((c) => c + 1);
        setForm(INITIAL_FORM);
        setErrors({});
        toast.success('✅ Enregistrement sauvegardé avec succès !');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset formulaire ─────────────────────────────────────
  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(null);
  };

  // ── Composant champ erreur ───────────────────────────────
  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
        <HiOutlineX className="w-3 h-3" />
        {errors[field]}
      </p>
    ) : null;

  return (
    <>
      <Head>
        <title>Collecte de données — SysGeS-PAT</title>
      </Head>

      <Layout title="Collecte de données" subtitle="Enregistrement visiteur">
        <div className="max-w-4xl mx-auto">

          {/* ── En-tête de section ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <p className="text-xs font-mono text-gold-400 uppercase tracking-widest mb-1">
                Session du {today}
              </p>
              <h2 className="font-display text-2xl font-bold text-white">
                Enregistrement visiteur
              </h2>
              <p className="text-sm text-navy-400 mt-1">
                Remplissez le formulaire pour chaque groupe de visiteurs
              </p>
            </div>

            {/* Compteur session */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-card border border-surface-border">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
                <HiOutlineCheckCircle className="w-4.5 h-4.5 text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Enregistrements aujourd'hui</p>
                <p className="font-display text-xl font-bold text-white">{count}</p>
              </div>
            </div>
          </div>

          {/* ── Confirmation du dernier envoi ── */}
          {submitted && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 animate-slide-up">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-400">Enregistrement confirmé</p>
                <p className="text-xs text-navy-400 mt-0.5">
                  <strong className="text-navy-300">{submitted.prenom} {submitted.nom}</strong>
                  {' '}— {submitted.nombreVisiteurs} visiteur{submitted.nombreVisiteurs > 1 ? 's' : ''}
                  {' '}— {submitted.activiteVisitee}
                </p>
              </div>
              <button onClick={() => setSubmitted(null)} className="text-navy-500 hover:text-white transition-colors">
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              FORMULAIRE PRINCIPAL
          ════════════════════════════════════════════════ */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6 animate-slide-up">

            {/* ── Bloc 1 : Identité ── */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
                  <HiOutlineUser className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Identité du visiteur principal</p>
                  <p className="text-[11px] text-navy-500">Informations de base</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nom */}
                <div>
                  <label className="form-label">Nom <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    placeholder="AGOSSOU"
                    className={`form-input ${errors.nom ? 'border-rose-500/60' : ''}`}
                  />
                  <FieldError field="nom" />
                </div>

                {/* Prénom */}
                <div>
                  <label className="form-label">Prénom(s) <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    placeholder="Kossigan Jean"
                    className={`form-input ${errors.prenom ? 'border-rose-500/60' : ''}`}
                  />
                  <FieldError field="prenom" />
                </div>

                {/* Tranche d'âge */}
                <div>
                  <label className="form-label">Tranche d'âge</label>
                  <select
                    value={form.trancheAge}
                    onChange={(e) => handleChange('trancheAge', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Sélectionner</option>
                    {TRANCHES_AGE.map((t) => (
                      <option key={t} value={t}>{t} ans</option>
                    ))}
                  </select>
                </div>

                {/* Sexe */}
                <div>
                  <label className="form-label">Sexe <span className="text-rose-400">*</span></label>
                  <div className="flex gap-3">
                    {[
                      { val: 'M', label: '♂ Masculin', color: 'blue' },
                      { val: 'F', label: '♀ Féminin',  color: 'rose' },
                    ].map(({ val, label, color }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleChange('sexe', val)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                          form.sexe === val
                            ? color === 'blue'
                              ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                              : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                            : 'bg-surface-muted border-surface-border text-navy-400 hover:text-white hover:border-navy-400'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <FieldError field="sexe" />
                </div>
              </div>
            </div>

            {/* ── Bloc 2 : Provenance + Groupe ── */}
            <div className="card animate-slide-up animate-delay-100">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <HiOutlineGlobe className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Provenance & Groupe</p>
                  <p className="text-[11px] text-navy-500">Nationalité et taille du groupe</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nationalité */}
                <div>
                  <label className="form-label">Nationalité <span className="text-rose-400">*</span></label>
                  <select
                    value={form.nationalite}
                    onChange={(e) => handleChange('nationalite', e.target.value)}
                    className={`form-input ${errors.nationalite ? 'border-rose-500/60' : ''}`}
                  >
                    <option value="">Sélectionner la nationalité</option>
                    {NATIONALITES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <FieldError field="nationalite" />
                </div>

                {/* Nombre de visiteurs */}
                <div>
                  <label className="form-label">
                    Nombre de visiteurs dans le groupe <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    {/* Décrémenteur */}
                    <button
                      type="button"
                      onClick={() => handleChange('nombreVisiteurs', String(Math.max(1, Number(form.nombreVisiteurs) - 1)))}
                      className="w-11 h-11 flex-shrink-0 rounded-xl border border-surface-border bg-surface-muted text-white text-lg font-bold hover:border-navy-400 transition-all duration-200 flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={form.nombreVisiteurs}
                      onChange={(e) => handleChange('nombreVisiteurs', e.target.value)}
                      className={`form-input text-center font-bold text-lg flex-1 ${errors.nombreVisiteurs ? 'border-rose-500/60' : ''}`}
                    />
                    {/* Incrémenteur */}
                    <button
                      type="button"
                      onClick={() => handleChange('nombreVisiteurs', String(Math.min(200, Number(form.nombreVisiteurs) + 1)))}
                      className="w-11 h-11 flex-shrink-0 rounded-xl border border-surface-border bg-surface-muted text-white text-lg font-bold hover:border-navy-400 transition-all duration-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <FieldError field="nombreVisiteurs" />
                </div>
              </div>
            </div>

            {/* ── Bloc 3 : Activité ── */}
            <div className="card animate-slide-up animate-delay-200">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <HiOutlineLocationMarker className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Activité & Observations</p>
                  <p className="text-[11px] text-navy-500">Site visité et notes</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Activité visitée */}
                <div>
                  <label className="form-label">Activité visitée <span className="text-rose-400">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ACTIVITES.map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleChange('activiteVisitee', act)}
                        className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          form.activiteVisitee === act
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-surface-muted border-surface-border text-navy-400 hover:text-white hover:border-navy-400'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                  <FieldError field="activiteVisitee" />
                </div>

                {/* Date (automatique, lecture seule) */}
                <div>
                  <label className="form-label flex items-center gap-1.5">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    Date de visite (automatique)
                  </label>
                  <div className="form-input text-navy-400 cursor-not-allowed bg-surface-muted/50 capitalize">
                    {today}
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="form-label flex items-center gap-1.5">
                    <HiOutlinePencil className="w-3.5 h-3.5" />
                    Observations (optionnel)
                  </label>
                  <textarea
                    value={form.observations}
                    onChange={(e) => handleChange('observations', e.target.value)}
                    rows={3}
                    placeholder="Informations complémentaires sur la visite…"
                    className="form-input resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Actions formulaire ── */}
            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up animate-delay-300">
              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="btn-secondary flex-1 sm:flex-none px-8 disabled:opacity-50"
              >
                <HiOutlineX className="w-4 h-4" />
                Réinitialiser
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 h-12 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                    Enregistrement en cours…
                  </>
                ) : (
                  <>
                    <HiOutlineUsers className="w-4 h-4" />
                    Enregistrer {Number(form.nombreVisiteurs) > 1
                      ? `${form.nombreVisiteurs} visiteurs`
                      : 'le visiteur'
                    }
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </Layout>
    </>
  );
}
