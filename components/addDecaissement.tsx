'use client';

import { CATEGORIES_DECAISSEMENT } from '@/app/data';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fmt, generatePayRef, getCatDecaiss } from '@/lib/utils';
import { useModalDecaissementStore } from '@/store/modal/decaissement';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { PaymentMethodSelect } from './PaymentMethodSelect';

export default function AddDecaissement() {
    const { isOpen, data, closeDecaissement } = useModalDecaissementStore();
    const [loading, setLoading] = useState(false);
    const route = useRouter();

    const [formDecaiss, setFormDecaiss] = useState({
        payement: "",
        montant: "",
        date: new Date().toISOString().split("T")[0],
        mode: "Espèces",
        ref: generatePayRef(),
        note: "",
    });

    const d = data?.d;
    const client = data?.client;
    if (!isOpen) return null;


    const catSel = getCatDecaiss(formDecaiss.payement);
    const enregistrerDecaissement = async () => {
        setLoading(true);
        if (!formDecaiss.payement) {
            toast.error("Veuillez sélectionner une catégorie");
            setLoading(false);
            return;
        }

        // Validation simple
        const montant = parseFloat(formDecaiss.montant);
        if (isNaN(montant) || montant <= 0) {
            toast.error("Veuillez entrer un montant valide");
            setLoading(false);
            return;
        }
        if (!formDecaiss.mode) {
            toast.error("Veuillez sélectionner un mode de paiement");
            setLoading(false);
            return;
        }

        // // Appel API pour enregistrer le décaissement
        const res = await fetch("/api/dossiers/decaissement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formDecaiss, id: d.id, clientId: d.clientId }),
        });

        if (res.ok) {
            toast.success("Décaissement enregistré avec succès");
            route.refresh();
            closeDecaissement();
        } else {
            const error = await res.json();
            console.error("Erreur API:", error);
            toast.error(error.message || "Une erreur est survenue");
        }
        setLoading(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={open => { if (!open) { /* reset form */ closeDecaissement(); } }}
        >
            <DialogContent className="rounded-2xl sm:max-w-lg no-scrollbar max-h-screen overflow-y-auto p-0">
                <div className="bg-white rounded-2xl w-full border border-slate-100">
                    {/* Header */}
                    <div className="bg-rose-600 px-6 py-4 rounded-t-2xl flex justify-between items-start">
                        <div>
                            <p className="text-white font-bold text-base">Nouveau décaissement</p>
                            <p className="text-rose-200 text-xs mt-0.5">{d?.reference} · {client?.name}</p>
                        </div>
                        <button onClick={() => closeDecaissement()} className="text-rose-200 hover:text-white text-xl leading-none transition-colors">✕</button>
                    </div>

                    <div className="p-6 space-y-5">

                        {/* ── Catégorie ── */}
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Catégorie de décaissement</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {CATEGORIES_DECAISSEMENT.map(cat => {
                                    const selected = formDecaiss.payement === cat.key;
                                    return (
                                        <button key={cat.key}
                                            onClick={() => setFormDecaiss(f => ({ ...f, payement: cat.key }))}
                                            className={`p-2.5 rounded-xl border text-left transition-all ${selected ? `${cat.bg} ${cat.border} border-2 shadow-sm` : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                                            <span className="text-base block mb-1">{cat.icon}</span>
                                            <span className={`text-xs font-semibold leading-tight block ${selected ? cat.color : "text-slate-700"}`}>{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Montant ── */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Montant décaissé (FCFA) *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm">−</span>
                                <Input
                                    type="number" min="0"
                                    placeholder="ex: 320000"
                                    value={formDecaiss.montant}
                                    onChange={e => setFormDecaiss(f => ({ ...f, montant: e.target.value }))}
                                    className="pl-8 rounded-xl text-base font-semibold"
                                />
                                {parseInt(formDecaiss.montant) > 0 && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{fmt(parseInt(formDecaiss.montant))}</span>
                                )}
                            </div>
                        </div>

                        {/* ── Date + Mode ── */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date du paiement</label>
                                <Input type="date" value={formDecaiss.date}
                                    onChange={e => setFormDecaiss(f => ({ ...f, date: e.target.value }))}
                                    className="rounded-xl text-sm" />
                            </div>
                            <div className="">
                                <Label className="block text-xs mb-1.5 font-semibold text-slate-500 uppercase tracking-wider">Mode de paiement</Label>
                                <PaymentMethodSelect onValueChange={v => setFormDecaiss(f => ({ ...f, mode: v }))} />
                            </div>
                            {/* <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mode de paiement</label>
                                <Select value={formDecaiss.mode} onValueChange={v => setFormDecaiss(f => ({ ...f, mode: v }))}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {modesPaiement.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div> */}
                        </div>

                        {/* ── Référence + Note ── */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence / Quittance</label>
                                <Input placeholder="ex: DD-2026-441"
                                    value={formDecaiss.ref}
                                    onChange={e => setFormDecaiss(f => ({ ...f, ref: e.target.value }))}
                                    className="rounded-xl font-mono text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note</label>
                                <Input placeholder="Commentaire…"
                                    value={formDecaiss.note}
                                    onChange={e => setFormDecaiss(f => ({ ...f, note: e.target.value }))}
                                    className="rounded-xl text-sm" />
                            </div>
                        </div>

                        {/* ── Aperçu ── */}
                        {parseInt(formDecaiss.montant) > 0 && (
                            <div className={`rounded-xl p-4 border ${catSel.bg} ${catSel.border}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{catSel.icon}</span>
                                        <div>
                                            <p className={`text-sm font-bold ${catSel.color}`}>{catSel.label}</p>
                                            <p className="text-xs text-slate-500">{formDecaiss.date} · {formDecaiss.mode}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-black text-rose-600 tabular-nums">−{fmt(parseInt(formDecaiss.montant))}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Actions ── */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={enregistrerDecaissement}
                                disabled={loading}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                                {loading ? "Enregistrement..." : "Enregistrer le décaissement"}
                            </button>
                            <button
                                onClick={() => closeDecaissement()}
                                disabled={loading}
                                className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
