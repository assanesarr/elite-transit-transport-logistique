'use client'
import { ReactNode } from "react";

interface StatsBarProps {
  stats: {
    total: number;
    montantTotal: number;
    valides: number;
    enAttente: number;
    montantValide: number;
    montantEnAttente: number;
    tauxValidation: number;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'slate' | 'emerald' | 'amber' | 'blue';
  icon?: ReactNode;
}

function StatCard({ title, value, subtitle, color, icon }: StatCardProps) {
  const colorClasses = {
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-700',
      value: 'text-slate-900',
      icon: 'bg-slate-100 text-slate-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      value: 'text-emerald-900',
      icon: 'bg-emerald-100 text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      value: 'text-amber-900',
      icon: 'bg-amber-100 text-amber-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      value: 'text-blue-900',
      icon: 'bg-blue-100 text-blue-600'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-xl p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${classes.text}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${classes.value}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${classes.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatsBar({ stats }: StatsBarProps) {
  // Icônes simples
  const icons = {
    total: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    valide: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    attente: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    taux: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total chèques" 
        value={stats.total} 
        subtitle={`${stats.montantTotal.toLocaleString()} FCFA`}
        color="slate"
        icon={icons.total}
      />
      <StatCard 
        title="Validés" 
        value={stats.valides} 
        subtitle={`${stats.montantValide.toLocaleString()} FCFA`}
        color="emerald"
        icon={icons.valide}
      />
      <StatCard 
        title="En attente" 
        value={stats.enAttente} 
        subtitle={`${stats.montantEnAttente.toLocaleString()} FCFA`}
        color="amber"
        icon={icons.attente}
      />
      <StatCard 
        title="Taux de validation" 
        value={`${stats.tauxValidation}%`} 
        subtitle="des montants"
        color="blue"
        icon={icons.taux}
      />
    </div>
  );
}