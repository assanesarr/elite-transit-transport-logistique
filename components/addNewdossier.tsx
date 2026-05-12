'use client'

import { Dossier } from "@/app/type"
import CancelBtn from "@/components/cancel-btn"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn, fmt, formatBLNumber, getNextNumero, today } from "@/lib/utils"
import { useAgentsStore } from "@/store/agentStore"
import { useClientsStore } from "@/store/clientStore"
import { useDossiersStore } from "@/store/useDossiersStore"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { toast } from "sonner"

export default function AddNewdossier() {
    const dossiers = useDossiersStore(state => state.dossiers)
    // const { typesPrestation, responsables } = useConfigStore(state => state.config)
    // const setDossiers = useDossiersStore(state => state.setDossiers)
    const [loading, setLoading] = useState(false)
    const route = useRouter();
    const [tva, setTva] = useState(false)

    const [open, setOpen] = useState(false)
    const [openPop, setOpenPop] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())

    const clients = useClientsStore(state => state.clients)
    const [formDossier, setFormDossier] = useState({ clientId: "", type: "Dédouanement import", description: "", dateEcheance: "", priorite: "normale", responsable: "", port: "", bl: "", dossierName: "", prestations: [{ label: "", montant: "" }] });


    /* ── Ajouter dossier ── */
    const ajouterDossier = async () => {
        setLoading(true)
        if (!formDossier.clientId || !formDossier.description) return;
        const total = formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0);
        const ref: string = getNextNumero(dossiers)
        const payload = {
            reference: ref,
            tva,
            dossierName: formDossier.dossierName,
            clientId: formDossier.clientId,
            type: formDossier.type,
            description: formDossier.description,
            statut: "nouveau" as Dossier["statut"],
            dateOuverture: today,
            dateEcheance: formDossier.dateEcheance,
            montant_total: total,
            prestations: formDossier.prestations.filter(p => p.label && p.montant).map(p => ({ ...p, montant: parseInt(p.montant) })),
            priorite: formDossier.priorite,
            port: formDossier.port,
            bl: formDossier.bl,
            createdAt: new Date().toISOString(),
        };

        const res = await fetch("/api/dossiers/created", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!res.ok) {
            console.error("Erreur lors de l'ajout du dossier:", await res.text());
            toast.error("Erreur lors de l'ajout du dossier");
            setLoading(false);
            return;
        }
        const d = await res.json()
        const data: Dossier[] = [{ ...d }, ...dossiers]
        route.refresh()
        // setDossiers(data);
        setLoading(false)
        toast.success('✅ Enregistrement effectué avec succès')
        setFormDossier({ clientId: "", type: "Dédouanement import", description: "", dateEcheance: "", priorite: "normale", responsable: "", port: "", bl: "", dossierName: "", prestations: [{ label: "", montant: "" }] });
        setOpen(false)
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    + Nouveau dossier
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 no-scrollbar max-h-screen overflow-y-auto">
                <DialogHeader className="bg-slate-900 px-6 py-4 rounded-t-lg sticky top-0">
                    <DialogTitle className="text-white font-bold">Nouveau dossier</DialogTitle>
                </DialogHeader>
                <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 max-h-[90vh] overflow-y-auto">

                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Client *</label>
                                <Select value={formDossier.clientId} onValueChange={v => setFormDossier(f => ({ ...f, clientId: v }))}>
                                    <SelectTrigger className="w-full rounded-xl"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                                    <SelectContent>
                                        {clients.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => { setOpen(false); startTransition(() => route.push("/dashboard/clients/?r=new")) }} >Ajouter un nouveau client</Button>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Dossier N *</label>
                                <Input placeholder="EX: DOS-2026-001" value={formDossier.dossierName}
                                    onChange={e => setFormDossier(f => ({ ...f, dossierName: e.target.value }))} className="rounded-xl" />
                            </div>

                            {/* <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type de prestation</label>
                                <Select value={formDossier.type} onValueChange={v => setFormDossier(f => ({ ...f, type: v }))}>
                                    <SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>{typesPrestation && typesPrestation.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                </Select>
                            </div> */}
                        </div>
                        <label className={cn("flex items-center gap-3 rounded-xl border p-3 cursor-pointer select-none transition-colors",
                            tva ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200 hover:border-slate-300")}>
                            <input type="checkbox" checked={tva as boolean} onChange={e => setTva(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                            <div>
                                <div className="text-sm font-semibold text-slate-800">TVA 18%</div>
                                <div className="text-xs text-slate-400">TVA Aprique</div>
                            </div>
                            {tva && <span className="ml-auto text-emerald-600 font-bold">✓</span>}
                        </label>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description *</label>
                            <Input placeholder="ex: Conteneur 40HC électroniques — Chine" value={formDossier.description}
                                onChange={e => setFormDossier(f => ({ ...f, description: e.target.value }))} className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Priorité</label>
                                <Select value={formDossier.priorite} onValueChange={v => setFormDossier(f => ({ ...f, priorite: v }))}>
                                    <SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>{["urgente", "haute", "normale"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date échéance</label>
                                {/* <Input type="date" value={formDossier.dateEcheance} onChange={e => setFormDossier(f => ({ ...f, dateEcheance: e.target.value }))} className="rounded-xl" /> */}
                                <Popover open={openPop} onOpenChange={setOpenPop}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full rounded-xl justify-start font-normal">
                                            {date ? date.toISOString().split("T")[0] : "Select date"}
                                        </Button>
                                        {/* <Button variant="outline" id="date" className="justify-start font-normal">{date ? date.toLocaleDateString() : "Select date"}</Button> */}
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            defaultMonth={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date)
                                                setFormDossier(f => ({ ...f, dateEcheance: date ? date.toISOString().split("T")[0] : "" }))
                                                setOpenPop(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Port / Aéroport</label>
                                <Input placeholder="ex: Port Dakar" value={formDossier.port}
                                    onChange={e => setFormDossier(f => ({ ...f, port: e.target.value }))} className="rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">B/L · LTA · AWB</label>
                                <Input placeholder="ex: BL-SH-2026-4521" value={formatBLNumber(formDossier.bl).formatted}
                                    onChange={e => setFormDossier(f => ({ ...f, bl: e.target.value }))} className="rounded-xl" />
                            </div>
                        </div>


                        {/* Prestations */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lignes de prestation</label>
                                <button onClick={() => setFormDossier(f => ({ ...f, prestations: [...f.prestations, { label: "", montant: "" }] }))}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Ajouter ligne</button>
                            </div>
                            <div className="space-y-2">
                                {formDossier.prestations.map((p, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <Input placeholder="Libellé prestation" value={p.label}
                                            onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, label: e.target.value } : x) }))}
                                            className="rounded-xl flex-1 text-sm" />
                                        <Input type="number" placeholder="Montant" value={p.montant}
                                            onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, montant: e.target.value } : x) }))}
                                            className="rounded-xl w-32 text-sm" />
                                        {formDossier.prestations.length > 1 && (
                                            <button onClick={() => setFormDossier(f => ({ ...f, prestations: f.prestations.filter((_, j) => j !== i) }))}
                                                className="text-slate-300 hover:text-rose-400 shrink-0">✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-right text-xs text-slate-400">
                                Total : <span className="font-bold text-slate-700">
                                    {fmt(formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-3 p-2">
                    <DialogClose asChild>
                        <CancelBtn />
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={ajouterDossier}
                        disabled={loading}
                    // className="disabled:opacity-50 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5"
                    >
                        {loading ? <><Spinner /> Enregistrement...</> : <><Save className="w-4 h-4" />Enregistrer</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

