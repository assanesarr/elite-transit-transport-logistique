'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fmt, fmtM, initials, resteApayer, tauxPaiement, totalDecaisse, totalPaye } from '@/lib/utils';
import { useClientsStore } from '@/store/clientStore';
import { useDossiersStore } from '@/store/useDossiersStore';
import { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart,
    Line, Legend, Area, AreaChart
} from "recharts";
import { AVATAR_BG, PIE_COLORS, STATUTS_DOSSIER } from '@/app/data';

import { useRouter } from 'next/navigation';


import { useUIStore } from '@/store/booleanStore';
import { entreprise } from '@/app/data';


import {
    Eye, EyeOff, FileChartColumnIncreasing, TrendingUp,
    TrendingDown, Calendar, Users, Ship, DollarSign,
    CreditCard, Receipt, AlertCircle, CheckCircle,
    Clock, Download, Filter, RefreshCw, ChevronRight,
    ArrowUp, ArrowDown, Wallet, Building2, Briefcase
} from 'lucide-react';
import { Dossier } from '../type';
import ChequesSuivi from './dashsuiviCheque';
import { Cheque } from './suivi-cheques/frontsuivicheque';
import { PrintRapportAnnuel } from '@/components/pdf-components/rapport-annuel';

// Composants d'amélioration
function PriorityBadge({ priorite }: { priorite: string }) {
    const cfg: Record<string, { bg: string, text: string, border: string, icon: string }> = {
        urgente: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", icon: "🔴" },
        haute: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", icon: "🟠" },
        normale: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: "🔵" },
    };
    const style = cfg[priorite] || cfg.normale;
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border} flex items-center gap-1`}>
            <span>{style.icon}</span>
            {priorite}
        </span>
    );
}

function AvatarCircle({ name, idx, size = "w-9 h-9", text = "text-sm" }: { name: string, idx: number, size?: string, text?: string }) {
    const c = AVATAR_BG[idx % AVATAR_BG.length];
    return <div className={`${size} ${c} rounded-xl flex items-center justify-center font-bold ${text} shrink-0 shadow-sm`}>{initials(name)}</div>;
}

const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
            <p className="font-semibold text-slate-700 mb-1">{label}</p>
            {payload.map(p => (
                <div key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between gap-3">
                    <span>{p.name}</span>
                    <span className="font-semibold">{p.value?.toLocaleString("fr-FR")}</span>
                </div>
            ))}
        </div>
    );
};

// Nouveau composant KPI amélioré
const KpiCard = ({ label, value, sub, icon, color, bg, trend, trendValue, isOpen }: any) => (
    <Card className={`rounded-2xl border-0 shadow-sm ${bg} hover:shadow-md transition-all duration-300 group`}>
        <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 leading-tight">{label}</p>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color} bg-white/80 shadow-sm group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            <p className={`text-xl font-black ${color} leading-tight tabular-nums`}>
                {isOpen ? value : "••••••"}
                {/* {value} */}
            </p>
            <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-400">{sub}</p>
                {trend && (
                    <div className={`flex items-center gap-0.5 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);

// Nouveau composant pour l'évolution mensuelle
const MonthlyEvolution = ({ dossiers }: { dossiers: Dossier[] }) => {
    const monthlyData = useMemo(() => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const currentYear = new Date().getFullYear();

        return months.map((month, idx) => {
            const monthDossiers = dossiers.filter(d => {
                const date = new Date(d.createdAt);
                return date.getMonth() === idx && date.getFullYear() === currentYear;
            });

            return {
                month,
                facture: monthDossiers.reduce((sum, d) => sum + d.montant_total, 0),
                encaisse: monthDossiers.reduce((sum, d) => sum + totalPaye(d), 0),
                depense: monthDossiers.reduce((sum, d) => sum + totalDecaisse(d), 0)
            };
        });
    }, [dossiers]);

    return (
        <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} />
                    Évolution mensuelle {new Date().getFullYear()}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <YAxis tickFormatter={v => v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "k"} />
                        <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                        <Legend />
                        <Area type="monotone" dataKey="facture" stackId="1" fill="#cbd5e1" stroke="#94a3b8" name="Facturé" />
                        <Area type="monotone" dataKey="encaisse" stackId="2" fill="#10b981" stroke="#059669" name="Encaissé" />
                        <Area type="monotone" dataKey="depense" stackId="3" fill="#f43f5e" stroke="#e11d48" name="Décaissé" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


// Nouveau composant pour les performances par responsable
const PerformanceResponsable = ({ dossiers }: { dossiers: Dossier[] }) => {
    const perfData = useMemo(() => {
        const parResp = dossiers.reduce((acc, d) => {
            const resp = d.responsable || 'Non assigné';
            if (!acc[resp]) {
                acc[resp] = { total: 0, encaisse: 0, dossiers: 0, clotures: 0 };
            }
            acc[resp].total += d.montant_total;
            acc[resp].encaisse += totalPaye(d);
            acc[resp].dossiers++;
            if (d.statut === 'cloture') acc[resp].clotures++;
            return acc;
        }, {} as Record<string, any>);

        return Object.entries(parResp).map(([nom, data]) => ({
            nom: nom.split(' ')[0],
            ...data,
            taux: data.total > 0 ? (data.encaisse / data.total) * 100 : 0
        })).sort((a, b) => b.taux - a.taux);
    }, [dossiers]);

    if (perfData.length === 0) return null;

    return (
        <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase size={16} />
                    Performance par responsable
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {perfData.map((resp, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <AvatarCircle name={resp.nom} idx={idx} size="w-6 h-6" text="text-[10px]" />
                                    <span className="font-medium text-slate-700">{resp.nom}</span>
                                    <span className="text-slate-400">({resp.dossiers} dossiers)</span>
                                </div>
                                <span className="font-semibold" style={{ color: resp.taux >= 80 ? '#10b981' : resp.taux >= 50 ? '#f59e0b' : '#ef4444' }}>
                                    {resp.taux.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${resp.taux}%`,
                                        background: resp.taux >= 80 ? '#10b981' : resp.taux >= 50 ? '#f59e0b' : '#ef4444'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Composant principal amélioré
export default function Dashboard({cheques}: {cheques: Cheque[]}) {
    const { dossiers, stats } = useDossiersStore();
    const clients = useClientsStore((state) => state.clients);
    const { isOpen, toggle } = useUIStore();
    const route = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

    function ouvrirDossier(dossier: Dossier) {
        return
        // route.push(`/dashboard/dossiers/${dossier.reference}`);
    }

    const handleRefresh = async () => {
        setIsRefreshing(true);
        route.refresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const barEncaissement = useMemo(() => {
        return clients.slice(0, 6).map(c => {
            const dos = dossiers.filter(d => d.clientId === c.id);
            return {
                name: c.name.split(" ")[0],
                Facturé: dos.reduce((s, d) => s + d.montant_total, 0),
                Encaissé: dos.reduce((s, d) => s + totalPaye(d), 0),
            };
        });
    }, [dossiers, clients]);

    const pieData = useMemo(() => {
        return Object.entries(STATUTS_DOSSIER).map(([k, v]) => ({
            name: v.label,
            value: dossiers.filter(d => d.statut === k).length
        })).filter(x => x.value > 0);
    }, [dossiers]);

    // Calcul des tendances
    // const trends = useMemo(() => {
    //     const currentMonth = new Date().getMonth();
    //     const currentYear = new Date().getFullYear();

    //     const currentMonthDossiers = dossiers.filter(d => {
    //         const date = new Date(d.createdAt);
    //         return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    //     });

    //     const lastMonthDossiers = dossiers.filter(d => {
    //         const date = new Date(d.createdAt);
    //         return date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear;
    //     });

    //     const currentTotal = currentMonthDossiers.reduce((s, d) => s + d.montant_total, 0);
    //     const lastTotal = lastMonthDossiers.reduce((s, d) => s + d.montant_total, 0);

    //     return {
    //         facturation: lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0
    //     };
    // }, [dossiers]);

    // Calcul des tendances
const trends = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Handle previous month (with year rollover)
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    
    if (previousMonth < 0) {
        previousMonth = 11; // December
        previousYear = currentYear - 1;
    }
    
    // Current month dossiers
    const currentMonthDossiers = dossiers.filter(d => {
        const date = new Date(d.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // Previous month dossiers
    const previousMonthDossiers = dossiers.filter(d => {
        const date = new Date(d.createdAt);
        return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });
    
    const currentTotal = currentMonthDossiers.reduce((s, d) => s + d.montant_total, 0);
    const previousTotal = previousMonthDossiers.reduce((s, d) => s + d.montant_total, 0);
    
    // Calculate percentage change
    let percentChange = 0;
    let trend = "neutral";
    
    if (previousTotal === 0 && currentTotal > 0) {
        percentChange = 100;
        trend = "up";
    } else if (previousTotal === 0 && currentTotal === 0) {
        percentChange = 0;
        trend = "neutral";
    } else {
        percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        trend = percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral";
    }
    
    return {
        facturation: percentChange,
        trend: trend,           // ← "up", "down", or "neutral"
        currentTotal,
        previousTotal
    };
}, [dossiers]);

  

    return (
        <div className="space-y-5">
            {/* En-tête améliorée */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Ship className="w-6 h-6 text-blue-600" />
                        Tableau de bord
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Activité transitaire — {new Date().toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                            day: "numeric"
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Période selector */}
                    <div className="flex bg-slate-100 rounded-xl p-1">
                        {[
                            { value: 'month', label: 'Mois' },
                            { value: 'quarter', label: 'Trimestre' },
                            { value: 'year', label: 'Année' }
                        ].map(period => (
                            <button
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value as any)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedPeriod === period.value
                                        ? 'bg-white shadow-sm text-slate-900'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        Actualiser
                    </button>


                    <button
                        onClick={() => toggle()}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${isOpen ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                            }`}
                    >
                        {isOpen ? <EyeOff size={14} /> : <Eye size={14} />}
                        {isOpen ? "Masquer soldes" : "Afficher soldes"}
                    </button>

                    <button
                        onClick={() => PrintRapportAnnuel(dossiers, clients, entreprise)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                    >
                        <FileChartColumnIncreasing size={14} />
                        Rapport annuel
                    </button>


                    {/* {hasPermission("dossier.write") && <AddNewdossier />} */}
                </div>
            </div>

            {/* KPI améliorés avec tendances */}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <KpiCard
                    label="Total facturé"
                    value={fmtM(stats.total)}
                    sub="Prestations TTC"
                    icon={<DollarSign size={16} />}
                    color="text-slate-900"
                    bg="bg-white"
                    trend={trends.trend}
                    trendValue={`${trends.facturation > 0 ? '+' : ''}${trends.facturation.toFixed(1)}%`}
                    isOpen={isOpen}

                />
                <KpiCard
                    label="Encaissements"
                    value={fmtM(stats.paye)}
                    sub="Reçus clients"
                    icon={<TrendingDown size={16} />}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    isOpen={isOpen}

                />
                <KpiCard
                    label="Décaissements"
                    value={fmtM(stats.totalDecaiss)}
                    sub="Frais réglés"
                    icon={<TrendingUp size={16} />}
                    color="text-rose-600"
                    bg="bg-rose-50"
                    isOpen={isOpen}

                />
                <KpiCard
                    label="Solde net"
                    value={ (stats.soldeNet < 0 ? "-" : "") + fmtM(Math.abs(stats.soldeNet))}
                    sub={stats.soldeNet >= 0 ? "Bénéfice" : "Déficit"}
                    icon={<Wallet size={16} />}
                    color={stats.soldeNet >= 0 ? "text-blue-700" : "text-orange-600"}
                    bg={stats.soldeNet >= 0 ? "bg-blue-50" : "bg-orange-50"}
                    isOpen={isOpen}

                />
                <KpiCard
                    label="Reste à percevoir"
                    value={fmtM(stats.reste)}
                    sub="Non encaissé"
                    icon={<Clock size={16} />}
                    color="text-amber-600"
                    bg="bg-amber-50"
                    isOpen={isOpen}

                />
            </div>


            {/* Cartes d'action rapide */}
            <div className="grid grid-cols-3 gap-3">
                <Card
                    className="rounded-2xl border-0 shadow-sm bg-blue-50/60 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                    // onClick={() => hasPermission("dossier.read") ? route.push("/dashboard/dossiers") : null}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Dossiers actifs</p>
                            <p className="text-3xl font-black text-blue-600 leading-tight">{stats.enCours}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="rounded-2xl border-0 shadow-sm bg-amber-50/60 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                    // onClick={() => hasPermission("dossier.read") ? route.push("/dashboard/dossiers?filter=attente") : null}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500">À traiter</p>
                            <p className="text-3xl font-black text-amber-600 leading-tight">{stats.aTraiter}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="rounded-2xl border-0 shadow-sm bg-rose-50/60 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                    // onClick={() => hasPermission("dossier.read") ? route.push("/dashboard/dossiers?filter=urgent") : null}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Urgents</p>
                            <p className="text-3xl font-black text-rose-600 leading-tight">{stats.urgents}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Graphiques améliorés */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Graphique client */}
                <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Users size={16} />
                            Facturé vs Encaissé par client
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barEncaissement} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "k"} />
                                <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="Facturé" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={18} />
                                <Bar dataKey="Encaissé" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie chart statuts */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <CheckCircle size={16} />
                            Répartition des dossiers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [`${v} dossier(s)`, n]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            {pieData.map((d, i) => (
                                <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    {d.name} ({d.value})
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Deuxième ligne de graphiques */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MonthlyEvolution dossiers={dossiers} />
                <PerformanceResponsable dossiers={dossiers} />
            </div> */}

            {/* Troisième ligne */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <ChequesSuivi cheques={cheques} />
                </div>

                {/* Indicateur de santé financière */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <TrendingUp size={16} />
                            Santé financière
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Taux de recouvrement</span>
                                    <span className="font-semibold">{stats.total > 0 ? ((stats.paye / stats.total) * 100).toFixed(1) : 0}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.total > 0 ? (stats.paye / stats.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Marge nette</span>
                                    <span className={`font-semibold ${stats.soldeNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {stats.total > 0 ? ((stats.soldeNet / stats.total) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${stats.soldeNet >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                        style={{ width: `${Math.min(Math.abs((stats.soldeNet / stats.total) * 100), 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Ratio encaissement/décaissement</span>
                                    <span className="font-semibold">
                                        {stats.totalDecaiss > 0 ? (stats.paye / stats.totalDecaiss).toFixed(2) : stats.paye > 0 ? '∞' : '0'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Liste des dossiers prioritaires améliorée */}
            <Card className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <AlertCircle size={16} className="text-rose-500" />
                        Dossiers prioritaires à traiter
                    </CardTitle>
                    <button
                        onClick={() => route.push("/dashboard/clients")}
                        className="text-xs text-slate-400 hover:text-slate-700 font-medium flex items-center gap-1"
                    >
                        Voir tous <ChevronRight size={12} />
                    </button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {dossiers
                            .filter(d => !["cloture", "annule"].includes(d.statut))
                            .sort((a, b) => {
                                const priorityOrder = { urgente: 0, haute: 1, normale: 2 };
                                return (priorityOrder[a.priorite as keyof typeof priorityOrder] || 2) -
                                    (priorityOrder[b.priorite as keyof typeof priorityOrder] || 2);
                            })
                            .slice(0, 5)
                            .map((d, i) => {
                                const client = clients.find(c => c.id === d.clientId);
                                const reste = resteApayer(d);
                                const taux = tauxPaiement(d);
                                return (
                                    <div key={d.id}
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 cursor-pointer transition-all group"
                                        onClick={() => ouvrirDossier(d)}
                                    >
                                        <AvatarCircle name={client?.name || "?"} idx={i} size="w-9 h-9" text="text-xs" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                    {d.reference || d.dossierName}
                                                </span>
                                                {/* <PriorityBadge priorite={d.priorite} /> */}
                                                {/* <StatutBadge statut={d.statut} /> */}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>{client?.name}</span>
                                                {d.dateEcheance && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            Échéance: {new Date(d.dateEcheance).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs text-slate-400">Reste à payer</p>
                                            <p className={`text-sm font-bold ${reste > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                                                {reste > 0 ? fmt(reste) : "Soldé"}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block w-20 shrink-0">
                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                <span>Taux</span>
                                                <span>{taux}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-emerald-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${taux}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                                <p className="text-sm">Aucun dossier prioritaire à traiter</p>
                                <p className="text-xs">Tous les dossiers sont à jour</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}