'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import { IconCircleCheckFilled, IconLoader, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn, Commit, fmt, formatBLNumber, formatDate, getCatDecaiss, isDossierSolde, resteApayer, soldeDecaisse, tauxPaiement, totalDecaisse, totalPaye } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dossier } from "@/app/type";
import { useClientsStore } from "@/store/clientStore";
import { CATEGORIES_DECAISSEMENT, STATUTS_DOSSIER } from "@/app/data";
import { AvatarCircle, PriorityBadge } from "../../components/helpers-components";
import { useModalStore } from "@/store/modal/paiement";
import { useModalDecaissementStore } from "@/store/modal/decaissement";
import { useAlertStore } from "@/store/alertStore";
import { entreprise } from "@/app/data"
import { useRouter } from "next/navigation";
import { GenerateDossierReport } from "@/components/pdf-components/rapport-dossier-client";
import { GenerateClientReport } from "@/components/pdf-components/raport-client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "./user-avatar";

type ViewType = "main" | "details";

export default function FooterUser({ user, docs }: { user: any, docs: any[] }) {
    const [currentView, setCurrentView] = useState<ViewType>("main");
    const isMobile = useIsMobile();
    const [dossiers, setDossiers] = useState<any[]>(docs)
    const [dossier, setDossier] = useState<Dossier | null>(null)
    const [dossierView, setDossierView] = useState("grid"); // "grid" | "list"
    const dossiersCount = docs?.length || 0;


    const [filtreStatut, setFiltreStatut] = useState("all");
    const [filtrePrio, setFiltrePrio] = useState("all");
    const [recherche, setRecherche] = useState("");


    /* ── Dossiers filtrés ── */
    const dossiersFiltres = useMemo(() => {
        const q = recherche.toLowerCase();
        return dossiers.filter(d => {
            return (
                (filtreStatut === "all" || d.statut === filtreStatut) &&
                (filtrePrio === "all" || d.priorite === filtrePrio) &&
                (!q || d.dossierName.toLowerCase().includes(q) || d.reference.toLowerCase().includes(q))
            );
        });
    }, [dossiers, filtreStatut, filtrePrio, recherche]);



    // Navigation entre les vues
    const navigateTo = (view: ViewType, d?: any) => {
        if (!d) return
        setDossier(d)
        setCurrentView(view);
    };

    const goBack = () => {
        setCurrentView("main");
    };


    useEffect(() => {
        setDossiers(docs)
    }, [user])



    return (
        <Drawer direction={isMobile ? "bottom" : "right"} >
            <DrawerTrigger className="cursor-pointer">
                <UserAvatar
                    name={user.name}
                    avatar={user.avatar}
                    dossiersCount={dossiersCount}
                />
            </DrawerTrigger>
            <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-4xl">
                <DrawerHeader className="">
                    <DrawerTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AvatarCircle name={user?.name || "?"} idx={2} />
                            <div>
                                <p className="font-semibold">{user?.name}</p>
                                <p className="text-slate-400 text-xs">{user?.phone}</p>
                            </div>
                        </div>

                        {currentView !== "main" ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={goBack}
                                className="mb-2 -ml-2"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Button>
                        ) : (
                            <DrawerDescription>{dossiers.length} Dossier{dossiers.length > 1 && "s"}</DrawerDescription>
                        )}
                    </DrawerTitle>
                </DrawerHeader>
                {currentView === "main" && (
                    <div className="px-4 space-y-4 no-scrollbar overflow-y-auto">
                        <Card className="rounded-2xl border-slate-100 shadow-sm">
                            <CardContent className="p-4 flex flex-wrap gap-2 items-center">
                                <Input placeholder="Rechercher…" className="w-40 h-8 text-xs rounded-xl" value={recherche} onChange={e => setRecherche(e.target.value)} />
                                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                                    <SelectTrigger className="w-36 h-8 text-xs rounded-xl"><SelectValue placeholder="Statut" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous statuts</SelectItem>
                                        {Object.entries(STATUTS_DOSSIER).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={filtrePrio} onValueChange={setFiltrePrio}>
                                    <SelectTrigger className="w-28 h-8 text-xs rounded-xl"><SelectValue placeholder="Priorité" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes</SelectItem>
                                        {["urgente", "haute", "normale"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <span className="text-xs text-slate-400">{dossiersFiltres.length} résultats</span>
                                <div className="ml-auto flex items-center">
                                    <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                                        <button onClick={() => setDossierView("grid")} title="Vue grille"
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dossierView === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                                <rect x="1" y="1" width="6" height="6" rx="1.5" />
                                                <rect x="9" y="1" width="6" height="6" rx="1.5" />
                                                <rect x="1" y="9" width="6" height="6" rx="1.5" />
                                                <rect x="9" y="9" width="6" height="6" rx="1.5" />
                                            </svg>
                                        </button>
                                        <button onClick={() => setDossierView("list")} title="Vue liste"
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dossierView === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                                                <line x1="3" y1="4" x2="13" y2="4" /><line x1="3" y1="8" x2="13" y2="8" /><line x1="3" y1="12" x2="13" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {dossierView === "grid" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {
                                    dossiersFiltres.map((dossier: any, index: number) => (
                                        <GridDossier key={index} d={dossier} client={user} setDossiers={setDossiers} navigateTo={navigateTo} />
                                    ))
                                }
                            </div>
                        )}

                        {dossierView === "list" && (
                            <ListDossier ds={dossiersFiltres} client={user} setDossiers={setDossiers} navigateTo={navigateTo} />
                        )}

                    </div>
                )}
                {currentView === "details" && (
                    <ViewDossier dossier={dossier} />
                )}

                <DrawerFooter>
                    <Button
                        variant="outline"
                        onClick={() => currentView === "details" ? GenerateDossierReport(dossier, user, entreprise) : GenerateClientReport(user, entreprise)}
                        className="print:hidden"
                    >
                        <Printer className="mr-2 h-4 w-4" /> Imprimer le Rapport {currentView === "details" ? (dossier && dossier.reference || dossier && dossier.dossierName) : user.name}
                    </Button>
                    <DrawerClose asChild>
                        <p className="hidden text-center text-xs print:text-muted-foreground mt-4 print:block ">
                            Reçu généré par Elite Transit Transport Logistique. Merci de votre confiance!
                        </p>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >

    );
}

function GridDossier({ d, client, setDossiers, navigateTo }: { d: any, client: any, setDossiers: any, navigateTo: any }) {
    const open = useModalStore(s => s.open)
    const openAlert = useAlertStore(s => s.open)
    // const paye = totalPaye(d);
    const reste = resteApayer(d);
    const taux = tauxPaiement(d);


    const deleteDossier = async (dossierId: string) => {
        const r = isDossierSolde(d)
        if (!r) return toast.error("Impossible de supprimer un dossier non clôturé ou annule. Veuillez d'abord le clôturé.")

        const result = await openAlert({ message: `Supprimer lee Dossier "${d.dossierName}" ` })

        if (!result) return

        await Commit('/api/dossiers/delete-dossier', { dossierId }, "DELETE")
        setDossiers((prev: Dossier[]) => prev.filter(item => item.id !== dossierId))
        toast.success(`Le Dossier ${d.dossierName} est supprimer aveec succes!!!`)

    };
    return (
        <Card key={d.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => navigateTo("details", d)}
        >
            <CardContent className="p-5">
                {/* Header card */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-slate-800 text-sm group-hover:text-slate-600 transition-colors">{d.dossierName || d.reference}</span>
                            {/* <PriorityBadge priorite={d.priorite} /> */}
                        </div>
                        <Badge variant="outline" className={cn(
                            "gap-1",
                            reste <= 0
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                        )}>
                            {reste <= 0 ? (
                                <>
                                    <IconCircleCheckFilled className="h-3 w-3 fill-green-500 dark:fill-green-400" />
                                    PAYÉ
                                </>
                            ) : (
                                <>
                                    <IconLoader className="h-3 w-3 animate-spin" />
                                    En cours
                                </>
                            )}
                        </Badge>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteDossier(d.id) }}
                        className="p-1.5 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors group relative"
                        title="Supprimer"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                <p className="text-xs text-slate-500 mb-1 font-medium">{client?.name}</p>
                <p className="text-sm text-slate-700 font-medium mb-1 leading-snug line-clamp-2">{d.description}</p>
                <p className="text-xs text-slate-400 mb-3">{d.type} · {d.port}</p>

                {/* Financier */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Total TTC</p>
                        <p className="text-sm font-bold text-slate-800 tabular-nums">{(Number(d.montant_total) / 1000).toFixed(0)}k</p>
                    </div>
                    <div className={`rounded-xl p-2.5 ${reste > 0 ? "bg-rose-50" : "bg-emerald-50"}`}>
                        <p className={`text-xs mb-0.5 ${reste > 0 ? "text-rose-400" : "text-emerald-500"}`}>Reste à payer</p>
                        <p className={`text-sm font-bold tabular-nums ${reste > 0 ? "text-rose-600" : "text-emerald-600"}`}>{reste > 0 ? (reste / 1000).toFixed(0) + "k" : "Soldé"}</p>
                    </div>
                </div>

                {/* Barre paiement */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Encaissement</span><span className="font-semibold text-slate-600">{taux}%</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full transition-all ${taux >= 100 ? "bg-emerald-400" : taux > 50 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${taux}%` }} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-400">📅 Éch. {d.dateEcheance}</div>
                    <button
                        onClick={(e) => { e.stopPropagation(); open("CREATE_PAYMENT", { d: d, client: client }); }}
                        disabled={reste <= 0}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${reste > 0 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                        {reste > 0 ? "💰 Paiement" : "Soldé"}
                    </button>

                </div>
            </CardContent>
        </Card>
    )
}

function ListDossier({ ds, client, setDossiers, navigateTo }: { ds: any[], client: any, setDossiers: any, navigateTo: any }) {
    const open = useModalStore(s => s.open)
    const openAlert = useAlertStore(s => s.open)
    // const paye = totalPaye(d);
    // const reste = resteApayer(d);
    // const taux = tauxPaiement(d);


    const deleteDossier = async (d: any) => {
        const r = isDossierSolde(d)
        if (!r) return toast.error("Impossible de supprimer un dossier non clôturé ou annule. Veuillez d'abord le clôturé.")

        const result = await openAlert({ message: `Supprimer lee Dossier "${d.dossierName}" ` })

        if (!result) return

        await Commit('/api/dossiers/delete-dossier', { dossierId: d.id }, "DELETE")
        setDossiers((prev: Dossier[]) => prev.filter(item => item.id !== d.id))
        toast.success(`Le Dossier ${d.dossierName} est supprimer aveec succes!!!`)

    };
    return (
        <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-100">
                            {["Dossier", "Statut", "Facturé", "Encaissé", "Décaissé", "Solde net", "Éch.", ""].map(h => (
                                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-3 whitespace-nowrap">{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ds.length === 0 && (
                            <TableRow><TableCell colSpan={10} className="text-center py-10 text-slate-400">Aucun dossier</TableCell></TableRow>
                        )}
                        {ds.map((d, i) => {
                            const paye = totalPaye(d);
                            const reste = resteApayer(d);
                            const decaiss = totalDecaisse(d);
                            const solde = soldeDecaisse(d);
                            return (
                                <TableRow key={d.id} className="border-slate-50 hover:bg-slate-50/60 cursor-pointer group" onClick={() => navigateTo("details", d)}>
                                    <TableCell className="pl-5 py-3">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="text-xs font-bold text-slate-800">{d.dossierName || d.reference}</span>
                                                {/* <PriorityBadge priorite={d.priorite} /> */}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate max-w-[140px]">{d.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <Badge variant="outline" className={cn(
                                            "gap-1",
                                            reste <= 0
                                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                                : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                        )}>
                                            {reste <= 0 ? (
                                                <>
                                                    <IconCircleCheckFilled className="h-3 w-3 fill-green-500 dark:fill-green-400" />
                                                    PAYÉ
                                                </>
                                            ) : (
                                                <>
                                                    <IconLoader className="h-3 w-3 animate-spin" />
                                                    En cours
                                                </>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-slate-800 tabular-nums py-3 text-right">{(d.montant_total / 1000).toFixed(0)}k</TableCell>
                                    <TableCell className="text-sm font-semibold text-emerald-600 tabular-nums py-3 text-right">{(paye / 1000).toFixed(0)}k</TableCell>
                                    <TableCell className="text-sm font-semibold text-rose-500 tabular-nums py-3 text-right">{(decaiss / 1000).toFixed(0)}k</TableCell>
                                    <TableCell className={`text-sm font-bold tabular-nums py-3 text-right ${solde >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                                        {solde >= 0 ? "+" : ""}{(solde / 1000).toFixed(0)}k
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-400 py-3 whitespace-nowrap">{d.dateEcheance}</TableCell>
                                    <TableCell className="pr-4 py-3">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={e => { e.stopPropagation(); open("CREATE_PAYMENT", { d: d, client: client }); }} disabled={reste <= 0}
                                                className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${reste > 0 ? "bg-amber-50 hover:bg-amber-100 text-amber-700" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}>
                                                {reste > 0 ? "Paiement" : "Soldé"}
                                            </button>

                                            <button onClick={e => { e.stopPropagation(); deleteDossier(d); }}
                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-500 text-slate-400 flex items-center justify-center text-xs transition-colors">🗑</button>


                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {ds.length > 0 && (
                    <div className="flex justify-between items-center px-5 py-3 border-t border-slate-50 bg-slate-50/50 text-xs text-slate-400 flex-wrap gap-2">
                        <span>{ds.length} dossier{ds.length > 1 ? "s" : ""}</span>
                        <div className="flex gap-4 flex-wrap">
                            <span>Facturé : <span className="font-semibold text-slate-700">{fmt(ds.reduce((s, d) => s + d.montant_total, 0))}</span></span>
                            <span>Encaissé : <span className="font-semibold text-emerald-600">{fmt(ds.reduce((s, d) => s + totalPaye(d), 0))}</span></span>
                            <span>Décaissé : <span className="font-semibold text-rose-500">{fmt(ds.reduce((s, d) => s + totalDecaisse(d), 0))}</span></span>
                            <span>Solde : <span className={`font-semibold ${ds.reduce((s, d) => s + soldeDecaisse(d), 0) >= 0 ? "text-blue-600" : "text-orange-600"}`}>{fmt(ds.reduce((s, d) => s + soldeDecaisse(d), 0))}</span></span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function ViewDossier({ dossier }: { dossier: any }) {
    const open = useModalStore(s => s.open)
    const clients = useClientsStore((state) => state.clients);
    const [d, setD] = useState<Dossier>(dossier)
    const openDecaissement = useModalDecaissementStore((s) => s.openDecaissement);
    const openAlert = useAlertStore(s => s.open)
    // const d = dossier as Dossier;
    const router = useRouter()

    const client = clients.find(c => c.id === d.clientId);

    const paye = totalPaye(d);
    const reste = resteApayer(d);
    const taux = tauxPaiement(d);


    const supprimerPaiement = async (dossierId: string, p: any) => {
        const rs = await openAlert({ message: "Supprimer cet encaissement de " + fmt(p.montant) + " ?" })
        if (!rs) return

        const res = await fetch("/api/dossiers/paiement", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dossierId, paiementId: p.date }),
        })
        if (res.ok) {
            router.refresh(); // 🔥 refresh data (server components
            toast.success("Paiement supprimé (simulé)");
        }
    };


    /* ── Changer statut ── */
    const changerStatut = async (id: string, statut: string) => {
        // Appel API pour changer le statut du dossier  
        // console.log("Changer statut du dossier", id, "en", statut);
        const res = await fetch("/api/dossiers/paiement", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, statut }),
        });
        if (res.ok) {
            setD(prv => ({ ...prv, statut: statut as Dossier['statut'] }))
            toast.success("Statut du dossier mis à jour");
        }

    };

    const supprimerDecaissement = async (dossierId: string, dec: any) => {
        const rs = await openAlert({ message: "Supprimer ce décaissement de " + fmt(dec.montant) + " ?" })
        if (!rs) return

        const res = await fetch("/api/dossiers/decaissement", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dossierId, decaissementId: dec.date }),
        });
        if (res.ok) {
            router.refresh(); // 🔥 refresh data (server components)
            toast.success("Décaissement supprimé");
        }
    };

    async function supprimerDossier(d: Dossier) {

        const r = isDossierSolde(d)
        if (!r) return toast.error("Impossible de supprimer un dossier non clôturé ou annule. Veuillez d'abord le clôturé.")

        const rs = await openAlert({ message: "" })
        if (!rs) return

        await Commit("/api/dossiers/", { dossierId: d.id }, "DELETE")

        toast.success(`Le Dossier ${d.dossierName} est supprimer aveec succes!!!`)

    }


    return (
        <div className="space-y-5 px-4 no-scrollbar overflow-y-auto">
            {/* Breadcrumb */}
            <div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-slate-900">{d.dossierName || d.reference}</h1>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {/* <button
                            onClick={() => printFacture(d, client, entreprise, true)}
                            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                            🖨 Print Facture
                        </button> */}
                        <button
                            onClick={() => GenerateDossierReport(d, client, entreprise)}
                            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                            🖨 Rapport Dossier
                        </button>
                        <button
                            disabled={reste <= 0}
                            onClick={() => open("CREATE_PAYMENT", { d: d, client: client })}
                            className={cn("flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-colors", reste > 0 ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
                            🧾 Encaissement
                        </button>


                        <button
                            onClick={() => openDecaissement({ d: d, client: client })}
                            className="text-sm font-bold px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors">
                            − Décaissement
                        </button>
                        {/* <button
                            onClick={() => open("CREATE_PAYMENT", { d: d, client: client })}
                            
                            className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${reste > 0 ? "bg-amber-400 hover:bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                            + Encaissement
                        </button> */}
                        <button
                            onClick={() => { supprimerDossier(d) }}
                            className="text-sm font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 transition-colors">
                            🗑 Supprimer
                        </button>

                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Colonne gauche */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Info dossier */}
                    <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-slate-400 text-xs">B/L · LTA · AWB</p>
                            <p className="text-white text-sm font-mono font-semibold">{formatBLNumber(d.bl as string).formatted}</p>
                        </div>
                    </div>

                    {/* Prestations */}
                    {d.prestations && d.prestations.length > 0 && (
                        <Card className="rounded-2xl border-slate-100 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-semibold text-slate-700">Détail des prestations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 border-slate-100">
                                            {["Prestation", "Montant HT", "% du total"].map(h => (
                                                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5">{h}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {d.prestations.map((p: any, i: number) => (
                                            <TableRow key={i} className="border-slate-50">
                                                <TableCell className="pl-5 text-sm text-slate-700">{p.label}</TableCell>
                                                <TableCell className="font-semibold text-slate-800 tabular-nums text-sm">{fmt(p.montant)}</TableCell>
                                                <TableCell className="pr-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 bg-slate-100 rounded-full w-16 overflow-hidden">
                                                            <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: `${Math.round(p.montant / d.montant_total * 100)}%` }} />
                                                        </div>
                                                        <span className="text-xs text-slate-400">{Math.round(p.montant / d.montant_total * 100)}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                                    <span className="text-sm font-bold text-slate-700">Total</span>
                                    <span className="text-base font-black text-slate-900 tabular-nums">{fmt(d.montant_total)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}


                    {/* ── Encaissements reçus ── */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-slate-700">Encaissements reçus du client</CardTitle>
                            <button
                                onClick={() => open("CREATE_PAYMENT", { d: d, client: client })} disabled={reste <= 0}
                                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${reste > 0 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                                + Ajouter
                            </button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {d.versement.length === 0 ? (
                                <div className="py-6 text-center text-slate-400 text-sm">Aucun encaissement enregistré</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-emerald-50/60 border-slate-100">
                                            {["Date", "Référence", "Mode", "Montant", ""].map(h => (
                                                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5">{h}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {d.versement.map((p, i) => (
                                            <TableRow key={i} className="border-slate-50 hover:bg-emerald-50/30 group">
                                                <TableCell className="pl-5 text-sm text-slate-600 font-mono">{formatDate(new Date(p.date))}</TableCell>
                                                <TableCell className="text-sm text-slate-600 font-mono">{p.ref}</TableCell>
                                                <TableCell><Badge variant="outline" className="text-xs rounded-lg">{p.mode || p.method}</Badge></TableCell>
                                                <TableCell className="pr-5 font-bold text-emerald-600 tabular-nums text-sm">+{fmt(p.montant)}</TableCell>
                                                <TableCell className="pr-3 text-right text-black">
                                                    <button
                                                        onClick={() => { supprimerPaiement(d.id, p); }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 flex items-center justify-center text-xs"
                                                        title="Supprimer cet encaissement">
                                                        ✕
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            <div className="flex justify-between items-center px-5 py-2.5 border-t border-slate-100 bg-emerald-50/40">
                                <span className="text-xs text-slate-500">Total encaissé</span>
                                <span className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(paye)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Décaissements ── */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-semibold text-slate-700">Décaissements effectués</CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">Frais réglés pour le traitement du dossier</p>
                            </div>
                            <button
                                onClick={() => openDecaissement({ d: d, client: client })}
                                className="text-xs font-semibold px-3 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors">
                                − Ajouter
                            </button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {(d.payements || []).length === 0 ? (
                                <div className="py-6 text-center text-slate-400 text-sm">Aucun décaissement enregistré</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-rose-50/50 border-slate-100">
                                            {["Catégorie", "Date", "Référence", "Mode", "Montant", "Note", ""].map(h => (
                                                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5">{h}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(d.payements || []).map((dec, i) => {
                                            const cat = getCatDecaiss(dec.payement);
                                            return (
                                                <TableRow key={i} className="border-slate-50 hover:bg-rose-50/20 group">
                                                    <TableCell className="pl-5">
                                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                                                            {cat.icon} {cat.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500 font-mono">{formatDate(new Date(dec.date))}</TableCell>
                                                    <TableCell className="text-xs text-slate-500 font-mono">{dec.ref}</TableCell>
                                                    <TableCell><Badge variant="outline" className="text-xs rounded-lg">{dec.mode || "ESPECE"}</Badge></TableCell>
                                                    <TableCell className="font-bold text-rose-600 tabular-nums text-sm">−{fmt(dec.montant)}</TableCell>
                                                    <TableCell className="pr-5 text-xs text-slate-400 max-w-[100px] truncate">{dec.note || "—"}</TableCell>
                                                    <TableCell className="pr-3 text-right">
                                                        <button
                                                            onClick={() => { supprimerDecaissement(d.id, dec); }}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 flex items-center justify-center text-xs"
                                                            title="Supprimer ce décaissement">✕</button>

                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                            <div className="flex justify-between items-center px-5 py-2.5 border-t border-slate-100 bg-rose-50/40">
                                <span className="text-xs text-slate-500">Total décaissé</span>
                                <span className="text-sm font-bold text-rose-600 tabular-nums">−{fmt(totalDecaisse(d))}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Solde net (encaissements - décaissements) ── */}
                    {(() => {
                        const solde = soldeDecaisse(d);
                        return (
                            <Card className={`rounded-2xl shadow-sm border ${solde >= 0 ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Solde net du dossier</p>
                                            <p className="text-xs text-slate-400">Encaissements − Décaissements</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-black tabular-nums ${solde >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                                {solde >= 0 ? "+" : ""}{fmt(solde)}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">{solde >= 0 ? "Bénéfice sur opérations" : "Déficit sur opérations"}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 text-xs">
                                        {[
                                            { label: "Encaissé", value: fmt(paye), color: "text-emerald-600" },
                                            { label: "Décaissé", value: fmt(totalDecaisse(d)), color: "text-rose-600" },
                                            { label: "Solde net", value: fmt(Math.abs(solde)), color: solde >= 0 ? "text-emerald-700" : "text-rose-700" },
                                        ].map(r => (
                                            <div key={r.label} className="text-center">
                                                <p className="text-slate-400 mb-0.5">{r.label}</p>
                                                <p className={`font-bold tabular-nums ${r.color}`}>{r.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })()}
                </div>

                {/* Colonne droite — solde */}
                <div className="space-y-4">
                    <div className={`px-5 py-4 ${reste <= 0 ? "bg-emerald-600" : "bg-slate-900"}`}>
                        <p className={`text-xs uppercase tracking-widest mb-1 ${reste <= 0 ? "text-emerald-100" : "text-slate-400"}`}>Situation financière</p>
                        <p className={`text-2xl font-black ${reste <= 0 ? "text-white" : "text-white"}`}>{reste <= 0 ? "Soldé" : fmt(reste)}</p>
                        <p className={`text-xs mt-0.5 ${reste <= 0 ? "text-emerald-200" : "text-slate-400"}`}>{reste <= 0 ? "Paiement complet reçu" : "Reste à percevoir"}</p>
                    </div>
                    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">

                        <CardContent className="p-4 space-y-3">
                            {[
                                { label: "Montant total", value: fmt(d.montant_total), color: "text-slate-800" },
                                { label: "Encaissé", value: fmt(paye), color: "text-emerald-600" },
                                { label: "Reste", value: fmt(reste), color: reste > 0 ? "text-rose-500" : "text-emerald-600" },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between text-sm">
                                    <span className="text-slate-400">{r.label}</span>
                                    <span className={`font-bold tabular-nums ${r.color}`}>{r.value}</span>
                                </div>
                            ))}
                            <div className="pt-2">
                                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Taux d'encaissement</span><span className="font-semibold text-slate-600">{taux}%</span></div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-3 rounded-full transition-all ${taux >= 100 ? "bg-emerald-400" : taux > 50 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${taux}%` }} />
                                </div>
                            </div>
                            {reste > 0 && (
                                <button
                                    onClick={() => open("CREATE_PAYMENT", { d: d, client: client })}
                                    className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
                                    + Enregistrer un paiement
                                </button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mini résumé décaissements */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                        <div className="bg-rose-600 px-4 py-3 rounded-t-2xl flex justify-between items-center">
                            <p className="text-rose-100 text-xs font-semibold uppercase tracking-widest">Décaissements</p>
                            <p className="text-white text-lg font-black tabular-nums">{fmt(totalDecaisse(d))}</p>
                        </div>
                        <CardContent className="p-4 space-y-1.5">
                            {CATEGORIES_DECAISSEMENT.map((cat: any) => {
                                const montantCat = (d.payements || []).filter(x => x.payement === cat.key).reduce((s, x) => s + x.montant, 0);
                                if (!montantCat) return null;
                                const pctCat = totalDecaisse(d) ? Math.round(montantCat / totalDecaisse(d) * 100) : 0;
                                return (
                                    <div key={cat.key} className="flex items-center gap-2">
                                        <span className="text-sm shrink-0">{cat.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between text-xs mb-0.5">
                                                <span className="text-slate-600 truncate font-medium">{cat.label}</span>
                                                <span className="text-rose-600 font-semibold tabular-nums shrink-0 ml-2">{(montantCat / 1000).toFixed(0)}k</span>
                                            </div>
                                            <div className="h-1 bg-slate-100 rounded-full">
                                                <div className="h-1 bg-rose-300 rounded-full" style={{ width: `${pctCat}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(d.payements || []).length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-2">Aucun décaissement</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Changer statut */}

                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                        <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Changer le statut</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2">
                            {Object.entries(STATUTS_DOSSIER).map(([k, v]) => (
                                <button key={k} onClick={() => changerStatut(d.id, k)}
                                    className={`text-xs font-medium px-2 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${d.statut === k ? `${v.bg} ${v.border} ${v.color}` : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
                                    {v.label}
                                </button>
                            ))}
                        </CardContent>
                    </Card>


                </div>
            </div>
        </div>
    );
}

