/* ═══════════════════════════════════════
   CONSTANTS & SEED DATA
═══════════════════════════════════════ */
export const STATUTS_DOSSIER = {
  nouveau: { label: "Nouveau", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  en_cours: { label: "En cours", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  attente_doc: { label: "Attente docs", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-500" },
  douane: { label: "En douane", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500" },
  livraison: { label: "En livraison", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-500" },
  cloture: { label: "Clôturé", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  annule: { label: "Annulé", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
};

export const CHARGES_RATE = 0.22;
export const MONTHS = [
  { value: "04-2026", label: "Avril 2026" },
  { value: "03-2026", label: "Mars 2026" },
  { value: "02-2026", label: "Février 2026" },
  { value: "01-2026", label: "Janvier 2026" },
];

export const AVATAR_BG = [
  "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700", "bg-indigo-100 text-indigo-700",
];

export const PIE_COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#f97316", "#06b6d4", "#10b981", "#ec4899"];


// const categoriesDecaiss = [
//     {
//         "key": "Debarquement",
//         "label": "Débarquement",
//         "icon": "⚓",
//         "color": "text-teal-600",
//         "bg": "bg-teal-50",
//         "border": "border-teal-200"
//     },
//     {
//         "key": "Droit-Douanes",
//         "label": "Droit de Douanes",
//         "icon": "🏛",
//         "color": "text-violet-600",
//         "bg": "bg-violet-50",
//         "border": "border-violet-200"
//     },
//     {
//         "key": "B.A.E",
//         "label": "B.A.E",
//         "icon": "📄",
//         "color": "text-amber-600",
//         "bg": "bg-amber-50",
//         "border": "border-amber-200"
//     },
//     {
//         "key": "Enlevement",
//         "label": "Enlèvement",
//         "icon": "🚛",
//         "color": "text-teal-600",
//         "bg": "bg-teal-50",
//         "border": "border-teal-200"
//     },
//     {
//         "key": "Magasinage",
//         "label": "Magasinage",
//         "icon": "🏭",
//         "color": "text-orange-600",
//         "bg": "bg-orange-50",
//         "border": "border-orange-200"
//     },
//     {
//         "key": "Surestarie",
//         "label": "Surestarie",
//         "icon": "⏱",
//         "color": "text-rose-600",
//         "bg": "bg-rose-50",
//         "border": "border-rose-200"
//     },
//     {
//         "key": "Amende",
//         "label": "Amende",
//         "icon": "⚠️",
//         "color": "text-red-600",
//         "bg": "bg-red-50",
//         "border": "border-red-200"
//     },
//     {
//         "key": "Liquidation",
//         "label": "Liquidation",
//         "icon": "📊",
//         "color": "text-indigo-600",
//         "bg": "bg-indigo-50",
//         "border": "border-indigo-200"
//     },
//     {
//         "key": "Douanes Thies",
//         "label": "Douanes Thiès",
//         "icon": "🏢",
//         "color": "text-emerald-600",
//         "bg": "bg-emerald-50",
//         "border": "border-emerald-200"
//     },
//     {
//         "key": "Douane Diourbel",
//         "label": "Douane Diourbel",
//         "icon": "🏢",
//         "color": "text-cyan-600",
//         "bg": "bg-cyan-50",
//         "border": "border-cyan-200"
//     },
//     {
//         "key": "Douane Mbour",
//         "label": "Douane Mbour",
//         "icon": "🏢",
//         "color": "text-sky-600",
//         "bg": "bg-sky-50",
//         "border": "border-sky-200"
//     },
//     {
//         "key": "Douane Kedougou",
//         "label": "Douane Kédougou",
//         "icon": "🏢",
//         "color": "text-lime-600",
//         "bg": "bg-lime-50",
//         "border": "border-lime-200"
//     }
// ];
export const CATEGORIES_DECAISSEMENT = [
  { key: "Debarquement", label: "Débarquement", icon: "⚓", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "Droit-Douanes", label: "Droit de Douanes", icon: "🏛", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { key: "B.A.E", label: "B.A.E", icon: "📄", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "Enlevement", label: "Enlèvement", icon: "🚛", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
  { key: "Magasinage", label: "Magasinage", icon: "🏭", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "Surestarie", label: "Surestarie", icon: "⏱", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { key: "Amende", label: "Amende", icon: "⚠️", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { key: "Liquidation", label: "Liquidation", icon: "📊", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  { key: "Douanes Thies", label: "Douanes Thiès", icon: "🏢", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { key: "Douane Diourbel", label: "Douane Diourbel", icon: "🏢", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
  { key: "Douane Mbour", label: "Douane Mbour", icon: "🏢", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200" },
  { key: "Douane Kedougou", label: "Douane Kédougou", icon: "🏢", color: "text-lime-600", bg: "bg-lime-50", border: "border-lime-200" },
];

//"IT",
export const DEPARTEMENTS = ["Ressources humaines", "Finance", "Commercial", "Opérations"];
export const STATUTS = ["Actif", "Congé", "Période d'essai"];

export const initialEmployes = [
  { id: 1, prenom: "Aminata", nom: "Diallo", dept: "IT", poste: "Développeuse senior", salaire: 850000, statut: "Actif", date: "2021-03-15" },
  { id: 2, prenom: "Moussa", nom: "Traoré", dept: "Finance", poste: "Comptable", salaire: 620000, statut: "Actif", date: "2019-07-01" },
  { id: 3, prenom: "Fatou", nom: "Sow", dept: "Ressources humaines", poste: "Chargée RH", salaire: 480000, statut: "Congé", date: "2022-01-10" },
  { id: 4, prenom: "Ibrahima", nom: "Ba", dept: "Commercial", poste: "Responsable ventes", salaire: 750000, statut: "Actif", date: "2020-05-20" },
  { id: 5, prenom: "Mariama", nom: "Ndiaye", dept: "IT", poste: "Analyste données", salaire: 520000, statut: "Période d'essai", date: "2026-02-01" },
  { id: 6, prenom: "Ousmane", nom: "Fall", dept: "Opérations", poste: "Chef de projet", salaire: 690000, statut: "Actif", date: "2018-11-12" },
];

export const emptyForm = { prenom: "", nom: "", dept: "IT", poste: "", salaire: "", statut: "Actif", date: "" };

export const entreprise = {
  nom: "Elite Transit Transport Logistique Suarl",
  adresse: "19, Boulevard Djily Mbaye Immeuble Fahd 5 eme Etage",
  ville: "Dakar",
  ninea: "005553020",
  rc: "SN-DKR-2015-13017",
  telephone: "+221 33 822 48 67",
  email: "elitetransit16@gmail.com",
  site: "",
}