const fmt = (n: any) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n));

export default function StatsBar({ stats }:{ stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard label="Total chèques" value={stats.total} />
      <StatCard
        label="Montant total"
        value={`${fmt(stats.montant)} FCFA`}
        size="sm"
      />
      <StatCard
        label="Valides"
        value={stats.valides}
        color="text-emerald-600"
      />
      <StatCard
        label="Expirés"
        value={stats.expires}
        color="text-red-600"
      />
    </div>
  );
}

function StatCard({ label, value, color = "text-slate-800", size = "lg" }:{label: string, value: string, color?: string, size?: string}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`font-semibold ${color} ${size === "sm" ? "text-base" : "text-2xl"}`}>
        {value}
      </p>
    </div>
  );
}
