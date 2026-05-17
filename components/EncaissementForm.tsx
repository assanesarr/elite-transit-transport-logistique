import { useState } from "react";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { fmt, generatePayRef, resteApayer, totalPaye } from "@/lib/utils";
import { Dossier } from "@/app/type";
import { toast } from "sonner";
import { useModalStore } from "@/store/modal/paiement";
import { Spinner } from "./ui/spinner";
import { useClientsStore } from "@/store/clientStore";


// Composant de récapitulatif
const RecapPaiement = ({ mode, montantRecuActuel, dossier }: {
    mode?: string;
    montantRecuActuel: number;
    dossier: Dossier | null;
}) => {
    // Calculs selon le mode
    let totalDu = 0;
    let totalDejaPaye = 0;
    let nouveauTotalPaye = 0;
    let resteAPayer = 0;

    totalDu = dossier?.montant_total || 0;
    const tvaMontant = dossier?.tva ? (totalDu || 0) * 0.18 : 0;
    totalDu += tvaMontant; // Ajouter la TVA au total dû si applicable


    totalDejaPaye = totalPaye(dossier as Dossier);
    nouveauTotalPaye = totalDejaPaye + montantRecuActuel;
    resteAPayer = totalDu - nouveauTotalPaye;

    const totalVersementsDepasse = nouveauTotalPaye > totalDu;
    const pourcentagePaye = totalDu > 0 ? (nouveauTotalPaye / totalDu) * 100 : 0;



    // Ne pas afficher si reste à payer est négatif ou si aucun montant valide
    if (totalDu === 0) return null;

    return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                📊 Récapitulatif financier - {mode === "NOUVEAU" ? "Nouveau dossier" : "Acompte"}
            </p>

            {dossier?.tva && dossier?.montant_total && dossier?.montant_total > 0 && (
                <>
                    {/* Ligne Montant HT */}
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Montant HT</span>
                        <span>{fmt(dossier.montant_total)}</span>
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
                    {dossier?.tva ? "Total TTC" : "Total HT"}
                </span>
                <span className="font-semibold">{fmt(totalDu)}</span>
            </div>

            {/* Si c'est un acompte, montrer les versements déjà effectués */}
            {totalDejaPaye > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Déjà versé</span>
                    <span className="text-blue-600">{fmt(totalDejaPaye)}</span>
                </div>
            )}

            {/* Montant reçu (actuel) */}
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                    Nouveau versement
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
    // const setClients = useClientsStore((state) => state.setClients);
    const addPaiementToDossier = useClientsStore((state) => state.addPaiementToDossier);
    const { isOpen, type, data, close } = useModalStore();
    const [loading, setLoading] = useState(false);
    const [formPaiement, setFormPaiement] = useState<{
        montant: string | null;
        mode: string;
        date: string;
        ref: string;
        note: string;
    }>({
        montant: null,
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
        const montant = parseFloat(formPaiement.montant as unknown as string);
        
        if (isNaN(montant) || montant <= 0) {
            toast.error("Veuillez entrer un montant valide");
            setLoading(false);
            return;
        }
        if (!formPaiement.mode) {
            toast.error("Veuillez sélectionner un mode de paiement");
            setLoading(false);
            return;
        }
        if (montant > reste) {
            toast.error("Le montant dépasse le reste à payer");
            setLoading(false);
            return;
        }
        
        const dt = {
            id: d.id,
            clientId: d.clientId,
            ...formPaiement,
            montant: montant,
        }
        
        const res = await fetch("/api/dossiers/paiement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dt),
        })
        
        if (res.ok) {
            // Utiliser la méthode ciblée du store au lieu de setClients
            addPaiementToDossier(client.id, d.id, dt);
            
            toast.success("Paiement enregistré avec succès");
            setFormPaiement({
                montant: null,
                mode: "Espèces",
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
                    mode={formPaiement.mode}
                    montantRecuActuel={Number(formPaiement.montant)}
                    dossier={d}
                />
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Montant reçu (FCFA) *</label>
                    <Input type="number" max={reste} placeholder={`Max: ${reste.toLocaleString("fr-FR")}`}
                        value={formPaiement.montant as unknown as string} onChange={e => setFormPaiement(f => ({ ...f, montant: e.target.value }))}
                        className="text-lg font-semibold" />
                    <div className="mt-2 text-right text-xs text-slate-400" >
                        <span className="font-bold text-slate-700">
                            {fmt(formPaiement.montant as unknown as string)}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="">
                        <Label className="block text-xs mb-1.5 font-semibold text-slate-500 uppercase tracking-wider">Mode de paiement</Label>
                        <PaymentMethodSelect onValueChange={(value) => setFormPaiement((f) => ({ ...f, mode: value }))} />
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