// pages/analytics.js — SysGeS-PAT v2
import { useState, useEffect, useCallback, useMemo } from 'react';
import Head   from 'next/head';
import Layout from '../components/Layout';
import { FrequentationBarChart, ActivityChart } from '../components/VisitorChart';
import { getAllVisitors, computeStats, getMockVisitors } from '../lib/firestore';
import { format, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import {
  HiOutlineFilter, HiOutlineDownload, HiOutlineChartBar,
  HiOutlineSearch, HiOutlineX, HiOutlineAdjustments,
  HiOutlineTable, HiOutlineSparkles, HiOutlineUsers,
  HiOutlineCurrencyDollar, HiOutlineTrendingUp,
} from 'react-icons/hi';

const USE_MOCK = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id';

const PERIODS = [
  { label: '7 jours',  value: 7  },
  { label: '30 jours', value: 30 },
  { label: '90 jours', value: 90 },
  { label: 'Tout',     value: 0  },
];

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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (USE_MOCK) { await new Promise(r => setTimeout(r, 600)); data = getMockVisitors(); }
      else { const r = await getAllVisitors(); data = r.data; }
      setVisitors(data);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { setPage(1); }, [search, periodDays, sexFilter, natFilter, actFilter]);

  const filtered = useMemo(() => {
    const cutoff = periodDays > 0 ? subDays(new Date(), periodDays) : null;
    return visitors.filter(v => {
      if (cutoff && !isAfter(new Date(v.createdAt), cutoff)) return false;
      if (sexFilter && v.sexe !== sexFilter) return false;
      if (natFilter && v.nationalite !== natFilter) return false;
      if (actFilter && v.activiteVisitee !== actFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (v.nom?.toLowerCase().includes(q) || v.prenom?.toLowerCase().includes(q) ||
          v.nationalite?.toLowerCase().includes(q) || v.activiteVisitee?.toLowerCase().includes(q));
      }
      return true;
    });
  }, [visitors, periodDays, sexFilter, natFilter, actFilter, search]);

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const nationalities = useMemo(() => [...new Set(visitors.map(v => v.nationalite).filter(Boolean))].sort(), [visitors]);
  const activities    = useMemo(() => [...new Set(visitors.map(v => v.activiteVisitee).filter(Boolean))].sort(), [visitors]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const exportCSV = () => {
    const header = 'Prénom,Nom,Sexe,Nationalité,Activité,Groupe,Date\n';
    const rows = filtered.map(v => [
      `"${v.prenom||''}"`, `"${v.nom||''}"`,
      v.sexe==='M'?'Homme':'Femme',
      `"${v.nationalite||''}"`, `"${v.activiteVisitee||''}"`,
      v.nombreVisiteurs,
      v.createdAt instanceof Date ? format(v.createdAt,'dd/MM/yyyy HH:mm') : '',
    ].join(',')).join('\n');
    const blob = new Blob(['\ufeff'+header+rows], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `sysges-export-${format(new Date(),'yyyyMMdd')}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Export CSV généré !');
  };

  const resetFilters = () => { setSearch(''); setPeriodDays(30); setSexFilter(''); setNatFilter(''); setActFilter(''); };
  const hasFilters = search || sexFilter || natFilter || actFilter || periodDays !== 30;

  const monthlyData = useMemo(() =>
    Object.entries(stats.byMonth).sort(([a],[b])=>a.localeCompare(b)).map(([key,visiteurs]) => {
      const [y,m] = key.split('-');
      return { mois: format(new Date(Number(y),Number(m)-1),'MMM yy',{locale:fr}), visiteurs };
    }), [stats]);

  const activityData = useMemo(() =>
    Object.entries(stats.byActivity).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value), [stats]);

  const kpis = [
    { label:'Enregistrements', value: filtered.length, icon: HiOutlineTable,         color:'#f59e0b', fmt: n => n },
    { label:'Total visiteurs', value: stats.totalVisitors, icon: HiOutlineUsers,     color:'#3b82f6', fmt: n => new Intl.NumberFormat('fr-FR').format(n) },
    { label:'Moy. groupe',     value: filtered.length ? (stats.totalVisitors/filtered.length).toFixed(1) : '0',
      icon: HiOutlineTrendingUp, color:'#228b57', fmt: n => n },
    { label:'Recettes est.',   value: stats.estimatedRevenue, icon: HiOutlineCurrencyDollar, color:'#ec4899',
      fmt: n => new Intl.NumberFormat('fr-FR',{notation:'compact',maximumFractionDigits:1}).format(n)+' F' },
  ];

  return (
    <>
      <Head><title>Analytiques — SysGeS-PAT</title></Head>
      <Layout title="Analytiques" subtitle="Analyse avancée des données" onRefresh={loadData}>

        {USE_MOCK && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.22)' }}>
            <HiOutlineSparkles className="w-4 h-4 flex-shrink-0" style={{ color:'#f59e0b' }}/>
            <p className="text-xs" style={{ color:'#92400e' }}>
              <strong style={{ color:'#f59e0b' }}>Mode démonstration</strong> — {visitors.length} entrées générées localement.
            </p>
          </div>
        )}

        {/* ── Filtres ── */}
        <div className="card mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiOutlineAdjustments className="w-4 h-4" style={{ color:'#f59e0b' }}/>
              <span className="text-sm font-semibold text-surface-dark">Filtres & Recherche</span>
            </div>
            {hasFilters && (
              <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-navy-400 hover:text-surface-dark transition-colors">
                <HiOutlineX className="w-3.5 h-3.5"/>Réinitialiser
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none"/>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Rechercher nom, nationalité…" className="form-input pl-9 text-sm"/>
            </div>
            <select value={periodDays} onChange={e=>setPeriodDays(Number(e.target.value))} className="form-input text-sm">
              {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select value={sexFilter} onChange={e=>setSexFilter(e.target.value)} className="form-input text-sm">
              <option value="">Tous les sexes</option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
            <select value={natFilter} onChange={e=>setNatFilter(e.target.value)} className="form-input text-sm">
              <option value="">Toutes nationalités</option>
              {nationalities.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="mt-3">
            <select value={actFilter} onChange={e=>setActFilter(e.target.value)} className="form-input text-sm w-full sm:max-w-sm">
              <option value="">Toutes les activités</option>
              {activities.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Résumé filtres actifs */}
          {hasFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {search && <span className="badge text-[11px]" style={{ background:'rgba(251,191,36,0.10)', border:'1px solid rgba(251,191,36,0.25)', color:'#f59e0b' }}>🔍 "{search}"</span>}
              {sexFilter && <span className="badge text-[11px]" style={{ background:'rgba(59,130,246,0.10)', border:'1px solid rgba(59,130,246,0.25)', color:'#3b82f6' }}>{sexFilter==='M'?'♂ Homme':'♀ Femme'}</span>}
              {natFilter && <span className="badge text-[11px]" style={{ background:'rgba(34,139,87,0.10)', border:'1px solid rgba(34,139,87,0.25)', color:'#228b57' }}>🌍 {natFilter}</span>}
              {actFilter && <span className="badge text-[11px]" style={{ background:'rgba(236,72,153,0.10)', border:'1px solid rgba(236,72,153,0.25)', color:'#ec4899' }}>📍 {actFilter}</span>}
            </div>
          )}
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((k, i) => (
            <div key={i} className="card text-center py-5 animate-slide-up"
              style={{ animationDelay:`${i*60}ms`, animationFillMode:'forwards' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background:k.color+'15', border:`1px solid ${k.color}40` }}>
                <k.icon className="w-4 h-4" style={{ color:k.color }}/>
              </div>
              <p className="font-display text-2xl font-bold text-surface-dark" style={{ color:k.color }}>{k.fmt(k.value)}</p>
              <p className="text-[11px] text-navy-400 mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── Graphiques ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineChartBar className="w-4 h-4" style={{ color:'#f59e0b' }}/>
              <div>
                <p className="section-title text-base">Fréquentation mensuelle</p>
                <p className="section-subtitle text-xs">Données filtrées</p>
              </div>
            </div>
            <FrequentationBarChart data={monthlyData} loading={loading}/>
          </div>
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineFilter className="w-4 h-4" style={{ color:'#3b82f6' }}/>
              <div>
                <p className="section-title text-base">Activités visitées</p>
                <p className="section-subtitle text-xs">Classement fréquentation</p>
              </div>
            </div>
            <ActivityChart data={activityData} loading={loading}/>
          </div>
        </div>

        {/* ── Tableau ── */}
        <div className="card animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <HiOutlineTable className="w-4 h-4 text-navy-400"/>
              <div>
                <p className="section-title text-base">Données filtrées</p>
                <p className="section-subtitle text-xs">{filtered.length} résultat{filtered.length>1?'s':''}{hasFilters?' (filtres actifs)':''}</p>
              </div>
            </div>
            <button onClick={exportCSV} disabled={filtered.length===0}
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-40">
              <HiOutlineDownload className="w-4 h-4"/>Exporter CSV
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(8)].map((_,i)=><div key={i} className="skeleton h-10 rounded-lg"/>)}</div>
          ) : filtered.length===0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mx-auto mb-4">
                <HiOutlineFilter className="w-6 h-6 text-navy-400"/>
              </div>
              <p className="text-sm text-navy-400">Aucun résultat pour ces filtres</p>
              <button onClick={resetFilters} className="mt-3 text-xs hover:underline" style={{ color:'#f59e0b' }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Prénom','Nom','Sexe','Nationalité','Activité','Groupe','Date'].map(col => (
                        <th key={col} className="pb-3 px-3 text-left text-[10px] font-semibold uppercase tracking-widest text-navy-400">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((v,i) => (
                      <tr key={v.id||i} className="border-b border-surface-border/50 table-row-hover">
                        <td className="py-3 px-3 text-navy-500">{v.prenom}</td>
                        <td className="py-3 px-3 font-medium text-surface-dark">{v.nom}</td>
                        <td className="py-3 px-3">
                          <span className="badge text-[10px]" style={v.sexe==='M'
                            ? { background:'rgba(59,130,246,0.10)', border:'1px solid rgba(59,130,246,0.25)', color:'#3b82f6' }
                            : { background:'rgba(236,72,153,0.10)', border:'1px solid rgba(236,72,153,0.25)', color:'#ec4899' }}>
                            {v.sexe==='M'?'♂ H':'♀ F'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-navy-500">{v.nationalite}</td>
                        <td className="py-3 px-3 text-navy-500 max-w-[160px] truncate">{v.activiteVisitee}</td>
                        <td className="py-3 px-3">
                          <span className="badge text-[10px]" style={{ background:'rgba(251,191,36,0.10)', border:'1px solid rgba(251,191,36,0.25)', color:'#f59e0b' }}>
                            {v.nombreVisiteurs}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-navy-400 text-xs whitespace-nowrap">
                          {v.createdAt instanceof Date ? format(v.createdAt,'dd/MM/yy HH:mm',{locale:fr}) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-border">
                  <p className="text-xs text-navy-400">Page {page} / {totalPages} · {filtered.length} résultats</p>
                  <div className="flex gap-1.5">
                    <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                      className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-30">← Préc.</button>
                    {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>Math.abs(p-page)<=2).map(p => (
                      <button key={p} onClick={()=>setPage(p)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={p===page
                          ? { background:'#0c2818', color:'white' }
                          : { color:'#6fa888', border:'1px solid var(--border)' }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                      className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-30">Suiv. →</button>
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