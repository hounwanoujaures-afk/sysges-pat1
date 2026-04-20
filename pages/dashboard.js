// pages/dashboard.js — SysGeS-PAT v2
import { useState, useEffect, useCallback } from 'react';
import Head   from 'next/head';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { FrequentationAreaChart, FrequentationBarChart, NationalityPieChart, SexDonutChart, ActivityChart } from '../components/VisitorChart';
import { getAllVisitors, computeStats, getMockVisitors } from '../lib/firestore';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  HiOutlineUsers, HiOutlineChartBar, HiOutlineCurrencyDollar,
  HiOutlineClock, HiOutlineGlobe, HiOutlineCalendar, HiOutlineSparkles,
} from 'react-icons/hi';

const USE_MOCK = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id';

export default function DashboardPage() {
  const [visitors,   setVisitors]   = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [period,     setPeriod]     = useState('30j');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (USE_MOCK) { await new Promise(r => setTimeout(r, 700)); data = getMockVisitors(); }
      else { const r = await getAllVisitors(); data = r.data; }
      setVisitors(data);
      setStats(computeStats(data));
      setLastUpdate(new Date());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const dailyData = stats
    ? Object.entries(stats.byDay).map(([date, visiteurs]) => ({
        date: format(parseISO(date), 'dd/MM', { locale: fr }), visiteurs,
      })) : [];

  const monthlyData = stats
    ? Object.entries(stats.byMonth).sort(([a],[b]) => a.localeCompare(b)).map(([key, visiteurs]) => {
        const [y,m] = key.split('-');
        return { mois: format(new Date(Number(y), Number(m)-1), 'MMM yy', { locale: fr }), visiteurs };
      }) : [];

  const nationalityData = stats
    ? Object.entries(stats.byNationality).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value).slice(0,8) : [];

  const sexData = stats
    ? Object.entries(stats.bySex).map(([name,value]) => ({name,value})).filter(d=>d.value>0) : [];

  const activityData = stats
    ? Object.entries(stats.byActivity).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value) : [];

  return (
    <>
      <Head><title>Tableau de bord — SysGeS-PAT</title></Head>
      <Layout title="Tableau de bord"
        subtitle={`Mis à jour ${lastUpdate ? format(lastUpdate,'HH:mm',{locale:fr}) : '…'}`}
        onRefresh={loadData}>

        {/* Bannière démo */}
        {USE_MOCK && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl animate-fade-in"
            style={{ background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.22)' }}>
            <HiOutlineSparkles className="w-4 h-4 flex-shrink-0" style={{ color:'#f59e0b' }}/>
            <p className="text-xs" style={{ color:'#92400e' }}>
              <strong style={{ color:'#f59e0b' }}>Mode démonstration</strong> — Données fictives.
              Configurez Firebase pour utiliser des données réelles.
            </p>
          </div>
        )}

        {/* KPIs */}
        <section className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Visiteurs"    value={stats?.totalVisitors??0} icon={HiOutlineUsers}          trend="+18%" trendLabel="vs mois dernier" accentColor="gold"  delay={0}   loading={loading}/>
            <StatCard title="Enregistrements"    value={stats?.totalEntries??0}  icon={HiOutlineChartBar}        trend="+12%" trendLabel="vs mois dernier" accentColor="blue"  delay={80}  loading={loading}/>
            <StatCard title="Recettes Estimées"  value={stats?.estimatedRevenue??0} format="currency" icon={HiOutlineCurrencyDollar} trend="+22%" trendLabel="vs mois dernier" accentColor="green" delay={160} loading={loading}/>
            <StatCard title="Moy. Journalière"   value={stats?.avgPerDay??0}     icon={HiOutlineClock} unit="vis/j" trend="+5%"  trendLabel="vs mois dernier" accentColor="red"   delay={240} loading={loading}/>
          </div>
        </section>

        {/* Ligne 1 : Aire + Donut sexe */}
        <section className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-title">Fréquentation quotidienne</h2>
                  <p className="section-subtitle">30 derniers jours</p>
                </div>
                <div className="flex gap-1 p-1 rounded-lg border border-surface-border bg-surface-muted">
                  {['7j','30j','12m'].map(p => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
                      style={period===p
                        ? { background:'#0c2818', color:'white' }
                        : { color:'#6fa888' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <FrequentationAreaChart data={dailyData} loading={loading}/>
            </div>
            <div className="card">
              <div className="mb-5">
                <h2 className="section-title">Répartition par sexe</h2>
                <p className="section-subtitle">Ensemble des visiteurs</p>
              </div>
              <SexDonutChart data={sexData} loading={loading}/>
            </div>
          </div>
        </section>

        {/* Ligne 2 : Nationalités + Activités */}
        <section className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="card">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineGlobe className="w-4 h-4" style={{ color:'#f59e0b' }}/>
                <div>
                  <h2 className="section-title">Nationalités</h2>
                  <p className="section-subtitle">Top 8</p>
                </div>
              </div>
              <NationalityPieChart data={nationalityData} loading={loading}/>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineCalendar className="w-4 h-4" style={{ color:'#3b82f6' }}/>
                <div>
                  <h2 className="section-title">Activités visitées</h2>
                  <p className="section-subtitle">Par fréquentation</p>
                </div>
              </div>
              <ActivityChart data={activityData} loading={loading}/>
            </div>
          </div>
        </section>

        {/* Ligne 3 : Barres mensuelles + Top nationaux */}
        <section className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 card">
              <div className="mb-5">
                <h2 className="section-title">Évolution mensuelle</h2>
                <p className="section-subtitle">Fréquentation par mois</p>
              </div>
              <FrequentationBarChart data={monthlyData} loading={loading}/>
            </div>
            <div className="card">
              <div className="mb-5">
                <h2 className="section-title">Top nationalités</h2>
                <p className="section-subtitle">Classement visiteurs</p>
              </div>
              {loading ? (
                <div className="space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="skeleton h-8 rounded-lg"/>)}</div>
              ) : (
                <div className="space-y-1">
                  {nationalityData.slice(0,7).map((item,i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl table-row-hover">
                      <span className="text-[10px] font-mono text-navy-400 w-4 text-center">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-surface-dark truncate mb-1">{item.name}</div>
                        <div className="h-1 rounded-full bg-surface-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${(item.value/(nationalityData[0]?.value||1))*100}%`, background:'linear-gradient(90deg, #228b57, #45ae7a)' }}/>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-surface-dark">{new Intl.NumberFormat('fr-FR').format(item.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tableau derniers enregistrements */}
        <section>
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title">Derniers enregistrements</h2>
                <p className="section-subtitle">Collectes récentes</p>
              </div>
              <span className="badge text-[10px]" style={{ background:'var(--bg-muted)', border:'1px solid var(--border)', color:'#6fa888' }}>
                {visitors.length} entrées
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">{[...Array(5)].map((_,i)=><div key={i} className="skeleton h-11 rounded-xl"/>)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Visiteur','Nationalité','Activité','Groupe','Sexe','Date'].map(h => (
                        <th key={h} className="pb-3 px-3 text-left text-[10px] font-semibold uppercase tracking-widest text-navy-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.slice(0,8).map((v,i) => (
                      <tr key={v.id||i} className="border-b border-surface-border/50 table-row-hover">
                        <td className="py-3 px-3 font-medium text-surface-dark truncate max-w-[130px]">{v.prenom} {v.nom}</td>
                        <td className="py-3 px-3 text-navy-500">{v.nationalite}</td>
                        <td className="py-3 px-3 text-navy-500 truncate max-w-[150px]">{v.activiteVisitee}</td>
                        <td className="py-3 px-3">
                          <span className="badge text-[10px]" style={{ background:'rgba(251,191,36,0.10)', border:'1px solid rgba(251,191,36,0.25)', color:'#f59e0b' }}>
                            {v.nombreVisiteurs}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="badge text-[10px]" style={v.sexe==='M'
                            ? { background:'rgba(59,130,246,0.10)', border:'1px solid rgba(59,130,246,0.25)', color:'#3b82f6' }
                            : { background:'rgba(236,72,153,0.10)', border:'1px solid rgba(236,72,153,0.25)', color:'#ec4899' }}>
                            {v.sexe==='M'?'Homme':'Femme'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-navy-400 text-xs whitespace-nowrap">
                          {v.createdAt instanceof Date ? format(v.createdAt,'dd/MM/yyyy HH:mm',{locale:fr}) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visitors.length===0 && (
                  <div className="py-16 text-center text-navy-400 text-sm">
                    Aucun enregistrement. Commencez par la page <strong className="text-surface-dark">Collecte</strong>.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}