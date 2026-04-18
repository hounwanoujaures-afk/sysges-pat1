// pages/dashboard.js
// ============================================================
// Dashboard analytique principal — KPIs + graphiques
// Données temps réel depuis Firebase Firestore
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Head                                 from 'next/head';
import Layout                               from '../components/Layout';
import StatCard                             from '../components/StatCard';
import {
  FrequentationAreaChart,
  FrequentationBarChart,
  NationalityPieChart,
  SexDonutChart,
  ActivityChart,
} from '../components/VisitorChart';
import { getAllVisitors, computeStats, getMockVisitors } from '../lib/firestore';
import { format, parseISO }                 from 'date-fns';
import { fr }                               from 'date-fns/locale';
import {
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineGlobe,
  HiOutlineCalendar,
  HiOutlineSparkles,
} from 'react-icons/hi';

// ── Constante : utiliser mock si Firebase non configuré ──
const USE_MOCK = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
                  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'your_project_id';

export default function DashboardPage() {
  const [visitors,   setVisitors]   = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [period,     setPeriod]     = useState('30j'); // '7j' | '30j' | '12m'

  // ── Chargement des données ─────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (USE_MOCK) {
        // Données de démonstration
        await new Promise((r) => setTimeout(r, 800)); // simuler latence
        data = getMockVisitors();
      } else {
        const result = await getAllVisitors();
        data = result.data;
      }
      setVisitors(data);
      setStats(computeStats(data));
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Transformer données pour les graphiques ────────────

  // Série temporelle journalière
  const dailyChartData = stats
    ? Object.entries(stats.byDay)
        .map(([date, visiteurs]) => ({
          date:      format(parseISO(date), 'dd/MM', { locale: fr }),
          visiteurs,
        }))
    : [];

  // Série mensuelle
  const monthlyChartData = stats
    ? Object.entries(stats.byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, visiteurs]) => {
          const [y, m] = key.split('-');
          return {
            mois: format(new Date(Number(y), Number(m) - 1), 'MMM yy', { locale: fr }),
            visiteurs,
          };
        })
    : [];

  // Nationalité → tableau trié
  const nationalityData = stats
    ? Object.entries(stats.byNationality)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : [];

  // Sexe
  const sexData = stats
    ? Object.entries(stats.bySex)
        .map(([name, value]) => ({ name, value }))
        .filter((d) => d.value > 0)
    : [];

  // Activité
  const activityData = stats
    ? Object.entries(stats.byActivity)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    : [];

  // Format monétaire FCFA
  const formatFCFA = (n) =>
    new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(n) + ' FCFA';

  return (
    <>
      <Head>
        <title>Tableau de bord — SysGeS-PAT</title>
      </Head>

      <Layout
        title="Tableau de bord"
        subtitle={`Mis à jour ${lastUpdate ? format(lastUpdate, 'HH:mm', { locale: fr }) : '…'}`}
        onRefresh={loadData}
      >

        {/* ── Bannière MODE DÉMO ── */}
        {USE_MOCK && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-400/8 border border-gold-400/20 animate-fade-in">
            <HiOutlineSparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <p className="text-xs text-gold-300">
              <strong className="text-gold-400">Mode démonstration</strong> — Données fictives générées localement.
              Configurez Firebase dans <code className="font-mono bg-gold-400/10 px-1 rounded">.env.local</code> pour utiliser des données réelles.
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            Section 1 : KPIs principaux
        ════════════════════════════════════════════════ */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Visiteurs"
              value={stats?.totalVisitors ?? 0}
              icon={HiOutlineUsers}
              trend="+18%"
              trendLabel="vs mois dernier"
              accentColor="gold"
              delay={0}
              loading={loading}
            />
            <StatCard
              title="Enregistrements"
              value={stats?.totalEntries ?? 0}
              icon={HiOutlineChartBar}
              trend="+12%"
              trendLabel="vs mois dernier"
              accentColor="blue"
              delay={100}
              loading={loading}
            />
            <StatCard
              title="Recettes Estimées"
              value={stats?.estimatedRevenue ?? 0}
              format="currency"
              icon={HiOutlineCurrencyDollar}
              trend="+22%"
              trendLabel="vs mois dernier"
              accentColor="green"
              delay={200}
              loading={loading}
            />
            <StatCard
              title="Moy. Journalière"
              value={stats?.avgPerDay ?? 0}
              unit="vis/j"
              icon={HiOutlineClock}
              trend="+5%"
              trendLabel="vs mois dernier"
              accentColor="red"
              delay={300}
              loading={loading}
            />
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            Section 2 : Fréquentation dans le temps
        ════════════════════════════════════════════════ */}
        <section className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Graphique principal — aire journalière */}
            <div className="xl:col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="section-title">Fréquentation quotidienne</h2>
                  <p className="section-subtitle">30 derniers jours</p>
                </div>
                {/* Sélecteur de période */}
                <div className="flex gap-1 bg-surface-muted border border-surface-border rounded-lg p-1">
                  {['7j', '30j', '12m'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                        period === p
                          ? 'bg-gold-400 text-navy-900'
                          : 'text-navy-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <FrequentationAreaChart data={dailyChartData} loading={loading} />
            </div>

            {/* Camembert sexe */}
            <div className="card">
              <div className="mb-6">
                <h2 className="section-title">Répartition par sexe</h2>
                <p className="section-subtitle">Ensemble des visiteurs</p>
              </div>
              <SexDonutChart data={sexData} loading={loading} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            Section 3 : Nationalités + Activités
        ════════════════════════════════════════════════ */}
        <section className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Nationalités */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineGlobe className="w-4 h-4 text-gold-400" />
                <div>
                  <h2 className="section-title">Répartition par nationalité</h2>
                  <p className="section-subtitle">Top 8 nationalités</p>
                </div>
              </div>
              <NationalityPieChart data={nationalityData} loading={loading} />
            </div>

            {/* Activités */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <HiOutlineCalendar className="w-4 h-4 text-blue-400" />
                <div>
                  <h2 className="section-title">Activités visitées</h2>
                  <p className="section-subtitle">Par nombre de visiteurs</p>
                </div>
              </div>
              <ActivityChart data={activityData} loading={loading} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            Section 4 : Fréquentation mensuelle + tableau
        ════════════════════════════════════════════════ */}
        <section className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Barres mensuelles */}
            <div className="xl:col-span-2 card">
              <div className="mb-6">
                <h2 className="section-title">Évolution mensuelle</h2>
                <p className="section-subtitle">Fréquentation par mois</p>
              </div>
              <FrequentationBarChart data={monthlyChartData} loading={loading} />
            </div>

            {/* Top nationalités tableau rapide */}
            <div className="card">
              <div className="mb-5">
                <h2 className="section-title">Top visiteurs</h2>
                <p className="section-subtitle">Par nationalité</p>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-8 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {nationalityData.slice(0, 7).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl table-row-hover">
                      <span className="font-mono text-[11px] text-navy-500 w-5 text-center">{i + 1}</span>
                      <span className="flex-1 text-sm text-navy-200 truncate">{item.name}</span>
                      <span className="font-semibold text-sm text-white">
                        {new Intl.NumberFormat('fr-FR').format(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            Section 5 : Tableau des derniers enregistrements
        ════════════════════════════════════════════════ */}
        <section>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Derniers enregistrements</h2>
                <p className="section-subtitle">Collectes récentes</p>
              </div>
              <span className="badge bg-surface-muted border border-surface-border text-navy-400">
                {visitors.length} entrées
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Nom', 'Nationalité', 'Activité', 'Visiteurs', 'Sexe', 'Date'].map((h) => (
                        <th key={h} className="pb-3 px-3 text-left text-[10px] font-semibold uppercase tracking-widest text-navy-500 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.slice(0, 8).map((v, i) => (
                      <tr key={v.id || i} className="border-b border-surface-border/50 table-row-hover">
                        <td className="py-3 px-3 text-white font-medium truncate max-w-[120px]">
                          {v.prenom} {v.nom}
                        </td>
                        <td className="py-3 px-3 text-navy-300">{v.nationalite}</td>
                        <td className="py-3 px-3 text-navy-300 truncate max-w-[150px]">{v.activiteVisitee}</td>
                        <td className="py-3 px-3">
                          <span className="badge bg-gold-400/10 border border-gold-400/20 text-gold-400">
                            {v.nombreVisiteurs}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`badge ${v.sexe === 'M'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
                            {v.sexe === 'M' ? 'Homme' : 'Femme'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-navy-400 text-xs whitespace-nowrap">
                          {v.createdAt instanceof Date
                            ? format(v.createdAt, 'dd/MM/yyyy HH:mm', { locale: fr })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visitors.length === 0 && (
                  <div className="py-16 text-center text-navy-500 text-sm">
                    Aucun enregistrement. Commencez par la page <strong className="text-navy-400">Collecte</strong>.
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
