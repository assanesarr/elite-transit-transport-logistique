import { startTransition, useEffect, useState, useTransition } from "react";
import { ChequeDetails } from "./ChequeDetails";
import { ClientSelect } from "./ClientSelect";
import { DossierSelect } from "./DossierSelect";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { VirementDetails } from "./VirementDetails";
import { useRouter } from "next/navigation";
import { cn, fmt, generatePayRef, getNextNumero, resteApayer, totalPaye } from "@/lib/utils";
import { useDossiersStore } from "@/store/useDossiersStore";
import { Dossier } from "@/app/type";
import { toast } from "sonner";
import { useModalStore } from "@/store/modal/paiement";
import { Spinner } from "./ui/spinner";

// Composant pour le formulaire d'encaissement
export const EncaissementForm = ({ onOpenChange, methodPayement, modeEncaissement, setModeEncaissement, setMethodPayement }: any) => {
    const [clientId, setClientId] = useState("")
    const [dossiersClient, setDossiersClient] = useState<Dossier[]>([])
    const [isPending, startTransition] = useTransition()
    const [montantTotal, setMontantTotal] = useState('')
    const [montantRecu, setMontantRecu] = useState('')
    const [dossierSelected, setDossierSelected] = useState('')
    const [avecTVA, setAvecTVA] = useState(false) // État pour la TVA
    const router = useRouter()
    const dossiers = useDossiersStore(s => s.dossiers)

    useEffect(() => {
        if (clientId && clientId !== "OTHER") {
            fetch("/api/dossiers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId })
            })
                .then(res => res.json())
                .then(setDossiersClient)
                .catch(console.error)
        }
    }, [clientId])

    // Récupérer le dossier sélectionné
    const dossierS = dossiersClient.length > 0
        ? dossiersClient.find(d => d.id === dossierSelected) as Dossier
        : null;

    // Fonction pour calculer le montant TTC (HT + TVA 18%)
    const calculerMontantTTC = (montantHT: number, tvaActive: boolean): number => {
        if (!tvaActive) return montantHT;
        return montantHT * 1.18; // +18% de TVA
    };

    // Calcul du montant total selon le mode
    const getMontantTotal = () => {
        if (modeEncaissement === "NOUVEAU") {
            // Pour NOUVEAU : utiliser le montant HT saisi + TVA si applicable
            const montantHT = Number(montantTotal) || 0;
            return avecTVA ? montantHT * 1.18 : montantHT;
        } else {
            // Pour ACOMPTE : utiliser le montant_total du dossier sélectionné
            return dossierS?.montant_total || 0;
        }
    };

    // const montantTotalCalcule = getMontantTotal();

    // Montant TTC calculé (uniquement pour mode NOUVEAU)
    const montantTTC = modeEncaissement === "NOUVEAU"
        ? calculerMontantTTC(Number(montantTotal) || 0, avecTVA)
        : Number(montantTotal);

    return (
        <>
            {/* {modeEncaissement === "ACOMPTE" && <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex justify-between">
                <span className="text-rose-600 text-sm font-medium">Reste à percevoir</span>
                <span className="text-rose-700 font-bold tabular-nums">{fmt(12000)}</span>
            </div>} */}
            <div className="grid grid-cols-1 gap-3">
                <ClientSelect
                    onValueChange={setClientId}
                    isDecaissement={false}
                    onAddClient={() => {
                        onOpenChange(false)
                        startTransition(() => router.push("/dashboard/clients/?r=new"))
                    }}
                />
                {/* La TVA n'apparaît qu'en mode NOUVEAU */}
                {modeEncaissement === "NOUVEAU" && (
                    <label className={cn("flex items-center gap-3 rounded-xl border p-3 cursor-pointer select-none transition-colors",
                        avecTVA ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200 hover:border-slate-300")}>
                        <input type="checkbox" checked={avecTVA} onChange={e => setAvecTVA(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                        <div>
                            <div className="text-sm font-semibold text-slate-800">TVA 18%</div>
                            <div className="text-xs text-slate-400">La TVA sera appliquée sur cette facture</div>
                        </div>
                        {avecTVA && <span className="ml-auto text-emerald-600 font-bold">✓</span>}
                    </label>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3">

                <div className="flex flex-col gap-3 w-full">
                    <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Mode d'encaissement</Label>
                    {dossiersClient.length === 0 ? (
                        <Input name="mode" value="NOUVEAU" readOnly />
                    ) : (
                        <Select name="mode" onValueChange={setModeEncaissement} defaultValue={modeEncaissement}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner le mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Mode d'encaissement</SelectLabel>
                                    <SelectItem value="NOUVEAU">NOUVEAU</SelectItem>
                                    <SelectItem value="ACOMPTE">ACOMPTE</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {modeEncaissement === "ACOMPTE" && <DossierSelect setDossier={setDossierSelected} dossiers={dossiersClient} />}

                {modeEncaissement === "NOUVEAU" && (
                    <div className="flex flex-col gap-3 w-full">
                        <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom du dossier</Label>
                        <Input name="dossier_name" defaultValue={getNextNumero(dossiers)} placeholder="Entrez le nom du dossier" />
                    </div>
                )}
                {modeEncaissement === "NOUVEAU" && (
                    <div className="grid gap-3">
                        <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Montant HT
                            {avecTVA && <span className="text-green-600 ml-1">(hors TVA)</span>}
                        </Label>
                        <Input
                            name="montant_total"
                            type="number"
                            placeholder="0"
                            onChange={(e) => setMontantTotal(e.target.value)}
                        />
                        {/* Affichage du montant TTC si TVA activée */}
                        {avecTVA && Number(montantTotal) > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                                + TVA 18% : {fmt(Number(montantTotal) * 0.18)}<br />
                                <span className="font-bold">Total TTC : {fmt(montantTTC)}</span>
                            </p>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant reçu</Label>
                    <Input
                        name="montant"
                        type="number"
                        // placeholder={`Max ${modeEncaissement === "NOUVEAU" ? fmt(avecTVA ? Number(montantTTC) : Number(montantTotal)) : (Number(montantTotalCalcule) - Number(totalPaye(dossierS as Dossier))).toLocaleString("fr-FR")}`} 
                        onChange={(e) => setMontantRecu(e.target.value)} />
                </div>
                {modeEncaissement === "NOUVEAU" && <div className="flex flex-col gap-3">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">B/L · LTA · AWB</label>
                    <Input name="bl" placeholder="ex: BL-SH-2026-4521" />
                </div>}

                <div className="flex flex-col gap-3">
                    <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Mode de paiement</Label>
                    <PaymentMethodSelect onValueChange={setMethodPayement} />
                </div>

                {methodPayement === "CHEQUE" && <ChequeDetails />}
                {methodPayement === "VIREMENT" && <VirementDetails />}
            </div>

            <div className="flex flex-col gap-3">
                <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</Label>
                <Input name="description" placeholder="ex: Conteneur 40HC électroniques — Chine" />
            </div>


            {/* Récap global - Utilisation du montant TTC pour NOUVEAU */}
            {((modeEncaissement === "NOUVEAU" && Number(montantTotal) > 0) ||
                (modeEncaissement === "ACOMPTE" && dossierS)) && (
                    <RecapPaiement
                        mode={modeEncaissement}
                        montantTotal={modeEncaissement === "NOUVEAU" ? montantTTC : dossierS?.montant_total || 0}
                        montantRecuActuel={Number(montantRecu)}
                        dossier={dossierS}
                        avecTVA={modeEncaissement === "NOUVEAU" ? avecTVA : false}
                        montantHT={modeEncaissement === "NOUVEAU" ? Number(montantTotal) : 0}
                    />
                )}
        </>
    )
}

// Composant de récapitulatif
const RecapPaiement = ({ mode, montantTotal, montantRecuActuel, dossier, avecTVA, montantHT }: {
    mode?: string;
    montantTotal: number;
    montantRecuActuel: number;
    dossier: Dossier | null;
    avecTVA?: boolean;
    montantHT?: number;
}) => {
    // Calculs selon le mode
    let totalDu = 0;
    let totalDejaPaye = 0;
    let nouveauTotalPaye = 0;
    let resteAPayer = 0;

    // if (mode === "NOUVEAU") {
    //     // Pour un NOUVEAU dossier : montant TTC - montant reçu
    //     totalDu = montantTotal;
    //     totalDejaPaye = 0;
    //     nouveauTotalPaye = montantRecuActuel;
    //     resteAPayer = montantTotal - montantRecuActuel;
    // } else {
    //     // Pour un ACOMPTE : (montant_total du dossier - total versements existants) - nouveau montant reçu
    //     totalDu = dossier?.montant_total || 0;
    //     totalDejaPaye = totalPaye(dossier as Dossier);
    //     nouveauTotalPaye = totalDejaPaye + montantRecuActuel;
    //     resteAPayer = totalDu - nouveauTotalPaye;
    // }

    totalDu = dossier?.montant_total || 0;
    totalDejaPaye = totalPaye(dossier as Dossier);
    nouveauTotalPaye = totalDejaPaye + montantRecuActuel;
    resteAPayer = totalDu - nouveauTotalPaye;

    const totalVersementsDepasse = nouveauTotalPaye > totalDu;
    const pourcentagePaye = totalDu > 0 ? (nouveauTotalPaye / totalDu) * 100 : 0;
    const tvaMontant = (montantHT || 0) * 0.18;

    // Ne pas afficher si reste à payer est négatif ou si aucun montant valide
    if (totalDu === 0) return null;

    return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                📊 Récapitulatif financier - {mode === "NOUVEAU" ? "Nouveau dossier" : "Acompte"}
            </p>

            {mode === "NOUVEAU" && avecTVA && montantHT && montantHT > 0 && (
                <>
                    {/* Ligne Montant HT */}
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Montant HT</span>
                        <span>{fmt(montantHT)}</span>
                    </div>

                    {/* Ligne TVA 18% */}
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">TVA 18%</span>
                        <span className="text-blue-600">+ {fmt(tvaMontant)}</span>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-blue-200 my-1"></div>
                </>
            )}

            {/* Ligne Total TTC / HT selon le cas */}
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                    {mode === "NOUVEAU" && avecTVA ? "Total TTC" : "Total HT"}
                </span>
                <span className="font-semibold">{fmt(totalDu)}</span>
            </div>

            {/* Si c'est un acompte, montrer les versements déjà effectués */}
            {mode === "ACOMPTE" && totalDejaPaye > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Déjà versé</span>
                    <span className="text-blue-600">{fmt(totalDejaPaye)}</span>
                </div>
            )}

            {/* Montant reçu (actuel) */}
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                    {mode === "NOUVEAU" ? "Montant reçu" : "Nouveau versement"}
                </span>
                <span className="text-green-600 font-medium">{fmt(montantRecuActuel)}</span>
            </div>

            {/* Total payé après ce versement */}
            <div className="flex justify-between text-sm border-t border-blue-200 pt-2 mt-1">
                <span className="text-slate-500 font-semibold">Total payé</span>
                <span className="font-bold text-blue-700">{fmt(nouveauTotalPaye)}</span>
            </div>

            {/* Reste à payer après ce versement */}
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Reste à payer</span>
                <span className={resteAPayer === 0 ? "text-green-600 font-bold" : "text-amber-600 font-medium"}>
                    {fmt(Math.max(0, resteAPayer))}
                </span>
            </div>

            {/* Alerte si dépassement */}
            {totalVersementsDepasse && (
                <div className="rounded-lg bg-amber-100 p-2 mt-2">
                    <p className="text-xs text-amber-700">
                        ⚠️ Attention : Le total des versements ({fmt(nouveauTotalPaye)}) dépasse le montant total facturé ({fmt(totalDu)})
                    </p>
                </div>
            )}

            {/* Progression du paiement (seulement si totalDu > 0) */}
            {nouveauTotalPaye > 0 && nouveauTotalPaye <= totalDu && (
                <div className="mt-2 pt-1">
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, pourcentagePaye)}%` }}
                        />
                    </div>
                    <p className="text-xs text-blue-600 mt-1 text-right">
                        {Math.round(pourcentagePaye)}% payé
                    </p>
                </div>
            )}
        </div>
    );
};


export const FormPaiment = () => {
    // const { modesPaiement } = useConfigStore((state) => state.config)
    const { isOpen, type, data, close } = useModalStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [methodPayement, setMethodPayement] = useState('E')
    const [formPaiement, setFormPaiement] = useState({
        montant: "",
        mode: "Espèces",
        date: new Date().toISOString().split("T")[0],
        ref: generatePayRef(),
        note: "",
    });
    if (!isOpen) return null;

    const d = data.d;
    const client = data.client;
    const reste = d ? resteApayer(d) : 0;


    const enregistrerPaiement = async () => {
        setLoading(true);
        // Validation simple
        const montant = parseFloat(formPaiement.montant);
        if (isNaN(montant) || montant <= 0) {
            toast.error("Veuillez entrer un montant valide");
            setLoading(false)
            return;
        }
        if (!formPaiement.mode) {
            toast.error("Veuillez sélectionner un mode de paiement");
            setLoading(false)
            return;
        }
        if (montant > reste) {
            toast.error("Le montant dépasse le reste à payer");
            setLoading(false)
            return;
        }
        const dt = {
                id: d.id,
                clientId: d.clientId,
                ...formPaiement,
            }
        // Appel API pour enregistrer le paiement
        const res = await fetch("/api/dossiers/paiement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dt),
        })
        if (res.ok) {
            router.refresh(); // 🔥 refresh data (server components)
            // setDossiers(prev => prev.map(ds =>
            //     ds.id === d.id
            //         ? { ...ds, versement: [...ds.versement, dt] }
            //         : ds
            // ));
            toast.success("Paiement enregistré (simulé)");
            setFormPaiement({
                montant: "",
                mode: "",
                date: new Date().toISOString().split("T")[0],
                ref: generatePayRef(),
                note: "",
            });
            close();
        }

        setLoading(false);
    }

    return (
        <div>
            <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-start">
                <div>
                    <p className="text-white font-bold">Enregistrer un paiement</p>
                    <p className="text-slate-400 text-xs mt-0.5">{d?.reference} · {client?.name}</p>
                </div>
                <button
                    onClick={() => close()}
                    className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
                <RecapPaiement
                    // mode={modeEncaissement}
                    montantTotal={d?.montant_total || 0}
                    montantRecuActuel={Number(formPaiement.montant)}
                    dossier={d}
                    avecTVA={d.avecTVA}
                    montantHT={Number(d.montant_total)}
                />
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Montant reçu (FCFA) *</label>
                    <Input type="number" max={reste} placeholder={`Max: ${reste.toLocaleString("fr-FR")}`}
                        value={formPaiement.montant} onChange={e => setFormPaiement(f => ({ ...f, montant: e.target.value }))}
                        className="text-lg font-semibold" />
                    <div className="mt-2 text-right text-xs text-slate-400" >
                        <span className="font-bold text-slate-700">
                            {fmt(formPaiement.montant)}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {/* <div className="w-full">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Mode de paiement</label>
                        <Select
                            value={formPaiement.mode} onValueChange={v => setFormPaiement(f => ({ ...f, mode: v }))}>
                            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {modesPaiement.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div> */}
                    <div className="">
                        <Label className="block text-xs mb-1.5 font-semibold text-slate-500 uppercase tracking-wider">Mode de paiement</Label>
                        <PaymentMethodSelect onValueChange={setMethodPayement} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date</label>
                        <Input type="date" value={formPaiement.date} onChange={e => setFormPaiement(f => ({ ...f, date: e.target.value }))} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Référence</label>
                    <Input placeholder="ex: VIR-2026-042" value={formPaiement.ref}
                        onChange={e => setFormPaiement(f => ({ ...f, ref: e.target.value }))} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
                    <Input placeholder="Commentaire optionnel" value={formPaiement.note}
                        onChange={e => setFormPaiement(f => ({ ...f, note: e.target.value }))} />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        disabled={loading}
                        onClick={enregistrerPaiement}
                        className="flex justify-center items-center flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
                        {loading ? (<><Spinner /> Enregistrement...</>) : "Confirmer le paiement"}
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => close()}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50">Annuler</button>
                </div>
            </div>
        </div>
    )
}