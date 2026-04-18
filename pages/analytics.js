// pages/analytics.js
// ============================================================
// Page analytiques avancées — filtres, tableaux, exports
// ============================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import Head                                           from 'next/head';
import Layout                                         from '../components/Layout';
import { FrequentationBarChart, ActivityChart }       from '../components/VisitorChart';
import { getAllVisitors, computeStats, getMockVisitors } from '../lib/firestore';
import { format, subDays, isAfter, parseISO }         from 'date-fns';
import { fr }                                         from 'date-fns/locale';
import toast                                          from 'react-hot-toast';
import {
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineChartBar,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineAdjustments,
  HiOutlineTable,
  HiOutlineSparkles,
} from 'react-icons/hi';

const USE_MOCK = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id';

// ── Constantes filtres ────────────────────────────────────
const PERIODS = [
  { label: '7 jours',   value: 7  },
  { label: '30 jours',  value: 30 },
  { label: '90 jours',  value: 90 },
  { label: 'Tout',      value: 0  },
];

const COLS = ['Prénom', 'Nom', 'Sexe', 'Nationalité', 'Activité', 'Groupe', 'Date'];

export default function AnalyticsPage() {
  const [visitors,   setVisitors]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [periodDays, setPeriodDays] = useState(30);
  const [sexFilter,  setSexFilter]  = useState('');
  const [natFilter,  setNatFilter]  = useState('');
  const [actFilter,  setActFilter]  = useState('');
  const [page,       setPage]       = useState(1);
  const PAGE_SIZE = 12;

  // ── Chargement ──────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        data = getMockVisitors();
      } else {
        const result = await getAllVisitors();
        data = result.data;
      }
      setVisitors(data);
    } catch {
      toast.error('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { setPage(1); }, [search, periodDays, sexFilter, natFilter, actFilter]);

  // ── Filtrage ────────────────────────────────────────────
  const filtered = useMemo(() => {
    const cutoff = periodDays > 0 ? subDays(new Date(), periodDays) : null;
    return visitors.filter((v) => {
      if (cutoff && !isAfter(new Date(v.createdAt), cutoff)) return false;
      if (sexFilter && v.sexe !== sexFilter)              return false;
      if (natFilter && v.nationalite !== natFilter)       return false;
      if (actFilter && v.activiteVisitee !== actFilter)   return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          v.nom?.toLowerCase().includes(q)          ||
          v.prenom?.toLowerCase().includes(q)       ||
          v.nationalite?.toLowerCase().includes(q)  ||
          v.activiteVisitee?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [visitors, periodDays, sexFilter, natFilter, actFilter, search]);

  // ── Stats sur données filtrées ──────────────────────────
  const stats = useMemo(() => computeStats(filtered), [filtered]);

  // ── Listes déroulantes dynamiques ──────────────────────
  const nationalities = useMemo(() =>
    [...new Set(visitors.map((v) => v.nationalite).filter(Boolean))].sort(), [visitors]);
  const activities = useMemo(() =>
    [...new Set(visitors.map((v) => v.activiteVisitee).filter(Boolean))].sort(), [visitors]);

  // ── Pagination ──────────────────────────────────────────
  const totalPages   = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Export CSV ──────────────────────────────────────────
  const exportCSV = () => {
    const header = 'Prénom,Nom,Sexe,Nationalité,Activité,Groupe,Date\n';
    const rows   = filtered.map((v) => [
      `"${v.prenom || ''}"`,
      `"${v.nom || ''}"`,
      v.sexe === 'M' ? 'Homme' : 'Femme',
      `"${v.nationalite || ''}"`,
      `"${v.activiteVisitee || ''}"`,
      v.nombreVisiteurs,
      v.createdAt instanceof Date ? format(v.createdAt, 'dd/MM/yyyy HH:mm') : '',
    ].join(',')).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `sysges-pat-export-${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export CSV généré !');
  };

  // ── Reset filtres ────────────────────────────────────────
  const resetFilters = () => {
    setSearch('');
    setPeriodDays(30);
    setSexFilter('');
    setNatFilter('');
    setActFilter('');
  };

  const hasFilters = search || sexFilter || natFilter || actFilter || periodDays !== 30;

  // ── Graphiques dérivés ──────────────────────────────────
  const monthlyData = useMemo(() =>
    Object.entries(stats.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, visiteurs]) => {
        const [y, m] = key.split('-');
        return { mois: format(new Date(Number(y), Number(m) - 1), 'MMM yy', { locale: fr }), visiteurs };
      }), [stats]);

  const activityData = useMemo(() =>
    Object.entries(stats.byActivity)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value), [stats]);

  return (
    <>
      <Head><title>Analytiques — SysGeS-PAT</title></Head>

      <Layout title="Analytiques" subtitle="Analyse avancée des données" onRefresh={loadData}>

        {/* ── Bannière démo ── */}
        {USE_MOCK && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-400/8 border border-gold-400/20">
            <HiOutlineSparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <p className="text-xs text-gold-300">
              <strong className="text-gold-400">Mode démonstration</strong> — {visitors.length} entrées générées localement.
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            Barre de filtres
        ════════════════════════════════════════════════ */}
        <div className="card mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineAdjustments className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-semibold text-white">Filtres & Recherche</span>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto flex items-center gap-1 text-xs text-navy-400 hover:text-gold-400 transition-colors duration-200"
              >
                <HiOutlineX className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Recherche textuelle */}
            <div className="relative lg:col-span-2">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="form-input pl-9 text-sm"
              />
            </div>

            {/* Période */}
            <select
              value={periodDays}
              onChange={(e) => setPeriodDays(Number(e.target.value))}
              className="form-input text-sm"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            {/* Sexe */}
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="form-input text-sm"
            >
              <option value="">Tous les sexes</option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>

            {/* Nationalité */}
            <select
              value={natFilter}
              onChange={(e) => setNatFilter(e.target.value)}
              className="form-input text-sm"
            >
              <option value="">Toutes nationalités</option>
              {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Activité — filtre large */}
          <div className="mt-3">
            <select
              value={actFilter}
              onChange={(e) => setActFilter(e.target.value)}
              className="form-input text-sm w-full sm:max-w-sm"
            >
              <option value="">Toutes les activités</option>
              {activities.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            KPIs résumés filtrés
        ════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Enregistrements',  value: filtered.length,         color: 'text-gold-400'    },
            { label: 'Total visiteurs',  value: stats.totalVisitors,     color: 'text-blue-400'    },
            { label: 'Moy. groupe',
              value: filtered.length
                ? (stats.totalVisitors / filtered.length).toFixed(1)
                : '0',                                                    color: 'text-emerald-400' },
            { label: 'Recettes est.',
              value: new Intl.NumberFormat('fr-FR', {
                notation: 'compact', maximumFractionDigits: 1,
              }).format(stats.estimatedRevenue) + ' F',                   color: 'text-rose-400'    },
          ].map((kpi, i) => (
            <div key={i} className="card text-center py-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
              <p className={`font-display text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[11px] text-navy-400 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════
            Graphiques avancés
        ════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineChartBar className="w-4 h-4 text-gold-400" />
              <div>
                <p className="section-title text-base">Fréquentation mensuelle</p>
                <p className="section-subtitle text-xs">Basée sur les filtres actifs</p>
              </div>
            </div>
            <FrequentationBarChart data={monthlyData} loading={loading} />
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineFilter className="w-4 h-4 text-blue-400" />
              <div>
                <p className="section-title text-base">Activités visitées</p>
                <p className="section-subtitle text-xs">Classement par fréquentation</p>
              </div>
            </div>
            <ActivityChart data={activityData} loading={loading} />
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            Tableau des données filtrées
        ════════════════════════════════════════════════ */}
        <div className="card animate-slide-up">
          {/* En-tête tableau */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <HiOutlineTable className="w-4 h-4 text-navy-400" />
              <div>
                <p className="section-title text-base">Données filtrées</p>
                <p className="section-subtitle text-xs">
                  {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                  {hasFilters ? ' (filtres actifs)' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
            >
              <HiOutlineDownload className="w-4 h-4" />
              Exporter CSV
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mx-auto mb-4">
                <HiOutlineFilter className="w-6 h-6 text-navy-500" />
              </div>
              <p className="text-sm text-navy-400">Aucun résultat pour ces filtres</p>
              <button onClick={resetFilters} className="mt-3 text-xs text-gold-400 hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {COLS.map((col) => (
                        <th key={col} className="pb-3 px-3 text-left text-[10px] font-semibold uppercase tracking-widest text-navy-500">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((v, i) => (
                      <tr key={v.id || i} className="border-b border-surface-border/40 table-row-hover">
                        <td className="py-3 px-3 text-navy-200">{v.prenom}</td>
                        <td className="py-3 px-3 text-white font-medium">{v.nom}</td>
                        <td className="py-3 px-3">
                          <span className={`badge text-[10px] ${
                            v.sexe === 'M'
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
                            {v.sexe === 'M' ? '♂ H' : '♀ F'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-navy-300">{v.nationalite}</td>
                        <td className="py-3 px-3 text-navy-300 max-w-[160px] truncate">{v.activiteVisitee}</td>
                        <td className="py-3 px-3">
                          <span className="badge bg-gold-400/10 border-gold-400/20 text-gold-400">
                            {v.nombreVisiteurs}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-navy-400 text-xs whitespace-nowrap">
                          {v.createdAt instanceof Date
                            ? format(v.createdAt, 'dd/MM/yy HH:mm', { locale: fr })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-border">
                  <p className="text-xs text-navy-500">
                    Page {page} / {totalPages} — {filtered.length} résultats
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-30"
                    >
                      ← Préc.
                    </button>
                    {/* Pages numérotées (max 5 visibles) */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            p === page
                              ? 'bg-gold-400 text-navy-900'
                              : 'text-navy-400 hover:text-white hover:bg-surface-muted border border-surface-border'
                          }`}
                        >
                          {p}
                        </button>
                      ))
                    }
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-30"
                    >
                      Suiv. →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </Layout>
    </>
  );
}
