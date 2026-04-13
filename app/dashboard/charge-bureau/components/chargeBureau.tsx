'use client'
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getMonthsUntilNow, getRangeLabel } from "@/lib/utils";

/* ── Constants ── */
const CATEGORIES = [
  "Transport",
  "Repas",
  "Internet",
  "Telephone",
  "Gainde",
  "Woyofal",
  "Location",
  "Salaire",
];

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const CAT_COLORS : Record<string, string | string> = {
  Transport: "#3b82f6",
  Repas: "#f59e0b",
  Internet: "#8b5cf6",
  Telephone: "#06b6d4",
  Gainde: "#10b981",
  Woyofal: "#f97316",
  Location: "#ec4899",
  Salaire: "#6366f1",
};

const CAT_ICONS : Record<string, number | string> = {
  Transport: "🚌",
  Repas: "🍽️",
  Internet: "📡",
  Telephone: "📱",
  Gainde: "📋",
  Woyofal: "⚡",
  Location: "🏢",
  Salaire: "💼",
};

/* ── Seed data ── */
// function seed() {
//   const rows = [];
//   let id = 1;
//   const annee = 2026;
//   const montants = {
//     Transport: [45000, 52000, 48000, 50000],
//     Repas: [38000, 41000, 36000, 42000],
//     Internet: [25000, 25000, 25000, 25000],
//     Telephone: [18000, 21000, 19000, 20000],
//     Gainde: [12000, 0, 15000, 0],
//     Woyofal: [8500, 9200, 7800, 8900],
//     Location: [180000, 180000, 180000, 180000],
//     Salaire: [850000, 850000, 850000, 850000],
//   };
//   for (let m = 0; m < 4; m++) {
//     CATEGORIES.forEach(cat => {
//       const mt = montants[cat][m];
//       if (mt > 0) {
//         rows.push({
//           id: id++,
//           categorie: cat,
//           description: `${cat} — ${MOIS[m]} ${annee}`,
//           montant: mt,
//           mois: m + 1,
//           annee,
//           date: `${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}/${String(m + 1).padStart(2, "0")}/${annee}`,
//           note: "",
//         });
//       }
//     });
//   }
//   return rows;
// }

// const initCharges = seed();

/* ── Helpers ── */
const fmt = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill || p.color }} className="font-medium">
          {p.name}: {p.value.toLocaleString("fr-FR")} FCFA
        </p>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ChargesBureau({ data }: { data?: any[] }) {
  const [charges, setCharges] = useState(data || []);
  const [filtreMois, setFiltreMois] = useState("all");
  const [filtreCategorie, setFiltreCategorie] = useState("all");
  const [recherche, setRecherche] = useState("");
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [moisVue, setMoisVue] = useState(currentMonth); // Mois en cours par défaut
  const allmois = getMonthsUntilNow(new Date().getFullYear());

  // const [form, setForm] = useState({ categorie: "Transport", description: "", montant: "", mois: "4", annee: "2026", date: "", note: "" });

  /* Filtered table rows */
  const filtered = useMemo(() => {
    return charges.filter(c => {
      const matchMois = filtreMois === "all" || String(c.mois) === filtreMois;
      const matchCat = filtreCategorie === "all" || c.payement === filtreCategorie;
      const matchQ = !recherche ||
        // c?.libelle.toLowerCase().includes(recherche.toLowerCase()) || 
        c.payement.toLowerCase().includes(recherche.toLowerCase());
      return matchMois && matchCat && matchQ;
    });
  }, [charges, filtreMois, filtreCategorie, recherche]);

  /* Stats globales */
  const totalGeneral = useMemo(() => charges.reduce((s, c) => s + Number(c.montant), 0), [charges]);

  /* Stats par catégorie pour le mois sélectionné en vue */
  const statsMois = useMemo(() => {
    // const m = parseInt(moisVue);
    console.log("Calcul stats pour mois:", moisVue);
    const du_mois = charges.filter(c => c.mois === moisVue);
    return CATEGORIES.map(cat => ({
      cat,
      montant: du_mois.filter(c => c.payement === cat).reduce((s, c) => s + Number(c.montant), 0),
    })).filter(x => x.montant > 0);
  }, [charges, moisVue]);

  const totalMois = statsMois.reduce((s, x) => s + x.montant, 0);

  /* Bar chart : évolution mensuelle par catégorie */
  const barData = useMemo(() => {
    return allmois.map(m => {
      const obj: Record<string, number | string> = { mois: m.label.slice(0, 3) };
      CATEGORIES.forEach(cat => {
        obj[cat] = charges.filter(c => c.mois === m.value && c.payement === cat).reduce((s, c) => s + Number(c.montant), 0);
      });
      console.log("Bar data for", obj);
      return obj;
    });
  }, [charges]);

  const mois = new Date().getMonth() + 1;

  /* Add charge */
  // const ajouterCharge = () => {
  //   if (!form.montant || !form.description) return;
  //   setCharges(prev => [...prev, {
  //     ...form,
  //     id: Date.now(),
  //     montant: parseInt(form.montant),
  //     mois: parseInt(form.mois),
  //     annee: parseInt(form.annee),
  //     date: form.date || `01/${String(form.mois).padStart(2,"0")}/${form.annee}`,
  //   }]);
  //   setForm({ categorie: "Transport", description: "", montant: "", mois: "4", annee: "2026", date: "", note: "" });
  //   setModalOpen(false);
  // };

  const supprimerCharge = (id: number) => setCharges(prev => prev.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      {/* <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap'); * { font-family: 'Sora', sans-serif; }`}</style> */}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Charges de Bureau</h1>
          <p className="text-slate-400 text-sm mt-0.5">Suivi des dépenses · Exercice 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-600 font-semibold text-sm px-3 py-1">
            Total : {fmt(totalGeneral)}
          </Badge>
          {/* <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                + Ajouter une charge
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-slate-800">Nouvelle charge</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Catégorie</label>
                  <Select value={form.categorie} onValueChange={v => setForm(f => ({...f, categorie: v}))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{CAT_ICONS[c]} {c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Description</label>
                  <Input className="rounded-xl" placeholder="ex: Facture Orange Money" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Montant (FCFA)</label>
                    <Input className="rounded-xl" type="number" placeholder="ex: 25000" value={form.montant} onChange={e => setForm(f => ({...f, montant: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Mois</label>
                    <Select value={form.mois} onValueChange={v => setForm(f => ({...f, mois: v}))}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{MOIS.map((m,i) => <SelectItem key={i} value={String(i+1)}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Date</label>
                  <Input className="rounded-xl" type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Note (optionnel)</label>
                  <Input className="rounded-xl" placeholder="Commentaire..." value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))} />
                </div>
                <Button onClick={ajouterCharge} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl mt-2">
                  Enregistrer
                </Button>
              </div>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total 2026", value: fmt(totalGeneral), sub: `${charges.length} entrées`, color: "text-slate-900" },
          { label: `Total ${MOIS[parseInt(moisVue.split("-")[1]) - 1]}`, value: fmt(totalMois), sub: `${statsMois.length} catégories`, color: "text-blue-600" },
          { label: "Charge max", value: fmt(Math.max(...charges.map(c => c.montant))), sub: charges.find(c => c.montant === Math.max(...charges.map(c => c.montant)))?.categorie || "", color: "text-rose-500" },
          { label: "Moyenne / mois", value: fmt(Math.round(totalGeneral / mois)), sub: getRangeLabel(), color: "text-emerald-600" },
        ].map(k => (
          <Card key={k.label} className="rounded-2xl border-slate-100 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">{k.label}</p>
              <p className={`text-lg font-bold ${k.color} leading-tight`}>{k.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Bar chart */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Évolution mensuelle par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                {CATEGORIES.map(cat => (
                  <Bar key={cat} dataKey={cat} stackId="a" fill={CAT_COLORS[cat]} radius={cat === "Salaire" ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart du mois */}
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700">Répartition</CardTitle>
            <Select value={moisVue} onValueChange={setMoisVue}>
              <SelectTrigger className="w-28 h-7 text-xs rounded-lg border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allmois.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statsMois} dataKey="montant" nameKey="cat" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {statsMois.map(entry => (
                    <Cell key={entry.cat} fill={CAT_COLORS[entry.cat]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v.toLocaleString("fr-FR") + " FCFA", n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              {statsMois.map(x => (
                <div key={x.cat} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CAT_COLORS[x.cat] }} />
                  <span className="text-xs text-slate-500 truncate">{x.cat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Catégorie Progress Bars ── */}
      <Card className="rounded-2xl border-slate-100 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Détail par catégorie — {MOIS[parseInt(moisVue) - 1]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => {
              const mt = charges.filter(c => c.mois === moisVue && c.payement === cat).reduce((s, c) => s + Number(c.montant), 0);
              const pct = totalMois ? Math.round((mt / totalMois) * 100) : 0;
              return (
                <div key={cat} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-700 font-medium">{CAT_ICONS[cat]} {cat}</span>
                    <span className="text-xs font-semibold text-slate-600">{mt > 0 ? fmt(mt) : "—"}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: CAT_COLORS[cat] }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{pct}% du total</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Table ── */}
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Journal des charges</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Rechercher…"
                className="w-44 h-8 text-xs rounded-xl"
                value={recherche}
                onChange={e => setRecherche(e.target.value)}
              />
              <Select value={filtreMois} onValueChange={setFiltreMois}>
                <SelectTrigger className="w-32 h-8 text-xs rounded-xl"><SelectValue placeholder="Tous les mois" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  {allmois.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtreCategorie} onValueChange={(v) => { console.log("Filtre catégorie changé", v); setFiltreCategorie(v); }}>
                <SelectTrigger className="w-36 h-8 text-xs rounded-xl"><SelectValue placeholder="Toutes catégories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CAT_ICONS[c]} {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-slate-50/60">
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-5">Catégorie</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mois</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right pr-5">Montant</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-sm">Aucune charge trouvée</TableCell>
                  </TableRow>
                )}
                {filtered.map(c => (
                  <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <TableCell className="pl-5 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: CAT_COLORS[c.payement] }}
                        />
                        <span className="text-sm font-medium text-slate-700">{CAT_ICONS[c.payement]} {c.payement}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">{c.payement === "Salaire" ? c.employe : c.libelle}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-medium rounded-lg" style={{ color: CAT_COLORS[c.payement], borderColor: CAT_COLORS[c.payement] + "40", background: CAT_COLORS[c.payement] + "10" }}>
                        {/* {MOIS[c.mois - 1]} */}
                        {new Date(c.mois).toLocaleString("fr-FR", {
                          month: "long",
                        })}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 font-mono">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right pr-5 font-semibold text-slate-800 text-sm tabular-nums">{c.montant.toLocaleString("fr-FR")}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => supprimerCharge(c.id)}
                        className="text-slate-300 hover:text-rose-400 transition-colors text-xs p-1 rounded"
                        title="Supprimer"
                      >✕</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 0 && (
            <div className="flex justify-between items-center px-5 py-3 border-t border-slate-50 bg-slate-50/40 text-xs text-slate-400">
              <span>{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</span>
              <span className="font-semibold text-slate-600">
                Sous-total : {fmt(filtered.reduce((s, c) => s + Number(c.montant), 0))}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}