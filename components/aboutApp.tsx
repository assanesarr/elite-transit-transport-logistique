
import pkg from '@/package.json'
import { Card } from './ui/card'

export default function AboutApp() {

    return (
        /* ── À propos de l'application ── */
        <Card className="overflow-hidden" >
            <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">À propos de l'application</h3>
            </div>
            <div className="p-6 space-y-6">

                {/* Identité app */}
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-900 flex items-center justify-center text-3xl shrink-0 shadow-lg">🚢</div>
                    <div>
                        <div className="text-xl font-black text-slate-900 tracking-tight uppercase">{pkg.name}</div>
                        <div className="text-sm text-slate-500 mt-0.5">Application de gestion de facturation et de suivi de conteneurs</div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                📦 v{pkg.version}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                                ✅ Stable
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                                📅 {new Date().getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Informations techniques */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">🛠 Informations techniques</p>
                        {[
                            ["Version", pkg.version],
                            ["Date de sortie", "Avril 2026"],
                            ["Stack", "React · Tailwind CSS"],
                            ["Rendu PDF", "html2canvas · jsPDF"],
                            ["QR Code", "Html5-QrCode v2.3.8"],
                            ["Navigateurs", "Chrome · Firefox · Edge · Safari"],
                            ["Mobile", "Responsive — iOS & Android"],
                        ].map(([l, v]) => (
                            <div key={l} className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-medium">{l}</span>
                                <span className="font-semibold text-slate-700">{v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">📋 Modules disponibles</p>
                        {[
                            ["🧾 Facturation", "Multi-conteneurs, TVA, QR code"],
                            ["📦 Camions porteurs", "Suivi livraisons, détention, EIR"],
                            ["🗺️ Zones & Tarifs", "Tarification par zone / franchise"],
                            ["👥 Membres GIE", "Gestion rôles & camions"],
                            ["📊 Dashboard", "CA, TVA, charts analytiques"],
                            ["🔐 Journal d'audit", "Logs connexions & activités"],
                            ["⚙️ Paramètres", "NINEA, RC, logo, cachet"],
                            ["🔍 Scanner QR", "Vérification authenticité factures"],
                        ].map(([l, v]) => (
                            <div key={l} className="flex flex-col text-xs border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                                <span className="font-semibold text-slate-700">{l}</span>
                                <span className="text-slate-400">{v}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
                {/* Contact fabricant & support */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fabricant */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">👨‍💻 Fabricant de l'application</p>
                        {[
                            ["Société", "AfriTech Solutions SN"],
                            ["Développeur", "Assane sarr"],
                            ["Email", "dev@afritech.sn"],
                            ["Téléphone", "+221 78 153 54 13"],
                            ["WhatsApp", "+221 78 153 54 13"],
                            ["Site web", "www.afritech.sn"],
                            ["Adresse", "Plateau, Dakar — Sénégal"],
                        ].map(([l, v]) => (
                            <div key={l} className="flex justify-between items-center text-xs border-b border-blue-100 pb-1.5 last:border-0 last:pb-0">
                                <span className="text-blue-600 font-medium">{l}</span>
                                <span className="font-semibold text-slate-800">{v}</span>
                            </div>
                        ))}
                    </div>
                    {/* Support */}
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 space-y-3">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">🛟 Support technique</p>
                        {[
                            ["Email support", "support@afritech.sn"],
                            ["Hotline", "+221 33 836 64 26"],
                            ["WhatsApp", "+221 78 153 54 13"],
                            ["Horaires", "Lun–Ven · 08h–18h"],
                            ["Urgences", "+221 77 153 54 13"],
                            ["Délai réponse", "< 24h ouvrables"],
                        ].map(([l, v]) => (
                            <div key={l} className="flex justify-between items-center text-xs border-b border-emerald-100 pb-1.5 last:border-0 last:pb-0">
                                <span className="text-emerald-600 font-medium">{l}</span>
                                <span className="font-semibold text-slate-800">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Changelog */}
                {/* <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">📝 Historique des versions</p>
                    {[
                        { version: "2.5.0", date: "Avril 2025", color: "blue", changes: ["Calcul détention hors franchise (sortie − retour − franchise)", "Scanner QR Html5-QrCode avec vérification", "Logo GIE & cachet importables", "Formulaire membres avec rôles (Membre / Secrétaire / Admin)", "Multi-conteneurs sur une même facture", "TVA totale collectée dans le dashboard"] },
                        { version: "2.0.0", date: "Mars 2025", color: "purple", changes: ["Module camions porteurs avec suivi livraisons", "Validation paiement par admin avec décomposition HT/TVA/TTC", "Journal d'audit complet (connexions, activités, alertes)", "Page paramètres GIE complète (NINEA, RC, banque)"] },
                        { version: "1.5.0", date: "Février 2025", color: "emerald", changes: ["Factures multi-conteneurs", "Zones & tarifs avec simulateur de prix", "Avance de paiement sur factures", "Export CSV des factures", "QR code sur chaque facture"] },
                        { version: "1.0.0", date: "Janvier 2025", color: "slate", changes: ["Lancement initial GCMDS", "Facturation mono-conteneur", "Gestion zones de livraison", "Dashboard CA mensuel", "Authentification multi-rôles"] },
                    ].map(({ version, date, color, changes }) => {
                        const colors = { blue: "border-blue-200 bg-blue-50", purple: "border-purple-200 bg-purple-50", emerald: "border-emerald-200 bg-emerald-50", slate: "border-slate-200 bg-white" };
                        const badges = { blue: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700", emerald: "bg-emerald-100 text-emerald-700", slate: "bg-slate-100 text-slate-600" };
                        return (
                            <div key={version} className={cn("rounded-xl border p-4", colors[color as keyof typeof colors])}>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={cn("text-xs font-black px-2.5 py-1 rounded-full", badges[color as keyof typeof badges])}>v{version}</span>
                                    <span className="text-xs text-slate-400 font-medium">{date}</span>
                                    {version === "2.5.0" && <span className="ml-auto text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">Actuelle</span>}
                                </div>
                                <ul className="space-y-1">
                                    {changes.map((c, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                            <span className="text-slate-400 flex-shrink-0 mt-0.5">•</span>
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div> */}
                
                {/* Footer about */}
                <div className="rounded-xl bg-slate-900 p-5 text-center space-y-1">
                    <div className="text-white font-black text-base uppercase">{pkg.name} · v{pkg.version}</div>
                    <div className="text-slate-400 text-xs">Groupement Camionnage &amp; Manutention du Senegal</div>
                    <div className="text-slate-500 text-xs mt-2">Développé par <strong className="text-slate-300">AfriTech Solutions SN</strong> · Conçu pour le Sénégal 🇸🇳</div>
                    <div className="text-slate-600 text-xs mt-1">© {new Date().getFullYear()} <span className='uppercase'>{pkg.name}</span> · Tous droits réservés</div>
                </div>

            </div>
        </Card >
    )
}

