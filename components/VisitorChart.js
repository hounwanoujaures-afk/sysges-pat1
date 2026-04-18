// components/VisitorChart.js
// ============================================================
// Composants graphiques Recharts — barres, lignes, camembert
// ============================================================

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

// ── Palette couleurs graphiques ────────────────────────────
const COLORS = [
  '#fbbf24', // gold
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#a78bfa', // violet
  '#34d399', // green
  '#fb923c', // orange
];

// ── Tooltip personnalisé ────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card text-xs" style={{ minWidth: 140, padding: '10px 14px' }}>
      <p className="text-navy-400 mb-2 font-semibold">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-white font-medium">
            {new Intl.NumberFormat('fr-FR').format(entry.value)}
          </span>
          <span className="text-navy-500">{entry.name}</span>
        </div>
      ))}
    </div>
  );
};

// ── Label camembert personnalisé ────────────────────────────
const PIE_LABEL = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── Skeleton chart (loading state) ─────────────────────────
export function ChartSkeleton({ height = 300 }) {
  return (
    <div className="skeleton rounded-xl" style={{ height }} />
  );
}

// ════════════════════════════════════════════════════════════
// 1. GRAPHIQUE AIRE — Fréquentation quotidienne
// ════════════════════════════════════════════════════════════
export function FrequentationAreaChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={280} />;
  if (!data?.length) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVisiteurs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2845" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#5e5a8a', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={{ stroke: '#2a2845' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#5e5a8a', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="visiteurs"
          name="Visiteurs"
          stroke="#fbbf24"
          strokeWidth={2.5}
          fill="url(#colorVisiteurs)"
          dot={false}
          activeDot={{ r: 5, fill: '#fbbf24', stroke: '#0f0e1a', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ════════════════════════════════════════════════════════════
// 2. GRAPHIQUE BARRES — Fréquentation mensuelle
// ════════════════════════════════════════════════════════════
export function FrequentationBarChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={280} />;
  if (!data?.length) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2845" vertical={false} />
        <XAxis
          dataKey="mois"
          tick={{ fill: '#5e5a8a', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={{ stroke: '#2a2845' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#5e5a8a', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="visiteurs"
          name="Visiteurs"
          fill="#fbbf24"
          radius={[6, 6, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ════════════════════════════════════════════════════════════
// 3. CAMEMBERT — Répartition par nationalité
// ════════════════════════════════════════════════════════════
export function NationalityPieChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={280} />;
  if (!data?.length) return <EmptyChart />;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <ResponsiveContainer width={220} height={220} style={{ flexShrink: 0 }}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={PIE_LABEL}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [new Intl.NumberFormat('fr-FR').format(v), 'Visiteurs']}
            contentStyle={{ background: '#16152a', border: '1px solid #2a2845', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: '#9b97c7' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Légende */}
      <div className="flex-1 space-y-2 w-full">
        {data.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-navy-300 truncate max-w-[120px]">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-white">
              {new Intl.NumberFormat('fr-FR').format(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4. BARRES HORIZONTALES — Répartition par activité
// ════════════════════════════════════════════════════════════
export function ActivityChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={220} />;
  if (!data?.length) return <EmptyChart />;

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-navy-300 truncate max-w-[180px]">{item.name}</span>
            <span className="font-semibold text-white ml-2">
              {new Intl.NumberFormat('fr-FR').format(item.value)}
            </span>
          </div>
          <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width:      `${Math.round((item.value / max) * 100)}%`,
                background: COLORS[i % COLORS.length],
                animationDelay: `${i * 100}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5. DONUT — Répartition par sexe
// ════════════════════════════════════════════════════════════
export function SexDonutChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={200} />;
  if (!data?.length) return <EmptyChart />;

  const SEX_COLORS = { 'Homme': '#6366f1', 'Femme': '#f43f5e', 'Non précisé': '#5e5a8a' };
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" labelLine={false}>
            {data.map((entry, i) => (
              <Cell key={i} fill={SEX_COLORS[entry.name] || COLORS[i]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [`${new Intl.NumberFormat('fr-FR').format(v)} visiteurs`, '']}
            contentStyle={{ background: '#16152a', border: '1px solid #2a2845', borderRadius: 12, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: SEX_COLORS[item.name] || COLORS[i] }} />
            <span className="text-[10px] text-navy-400">{item.name}</span>
            <span className="text-xs font-bold text-white">
              {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Composant vide ──────────────────────────────────────────
function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center mb-3">
        <span className="text-2xl">📊</span>
      </div>
      <p className="text-sm text-navy-400">Aucune donnée disponible</p>
      <p className="text-xs text-navy-600 mt-1">Commencez par saisir des visiteurs</p>
    </div>
  );
}
