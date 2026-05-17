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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn, fmt, formatBLNumber, getNextNumero, today } from "@/lib/utils"
import { useClientsStore } from "@/store/clientStore"
import { useDossiersStore } from "@/store/useDossiersStore"
import { Save, FolderOpen, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { TYPES_PRESTATION } from "@/app/data"

export default function AddNewdossier() {
    const { dossiers, isOpenDos, setIsOpenDos } = useDossiersStore(state => state)
    const [loading, setLoading] = useState(false)
    const route = useRouter();
    const [tva, setTva] = useState(false)

    const [openPop, setOpenPop] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [clientSearchValue, setClientSearchValue] = useState("")

    const clients = useClientsStore(state => state.clients)
    const [formDossier, setFormDossier] = useState({
        clientId: "",
        clientName: "",
        clientDossiersCount: 0,
        type: "Dédouanement import",
        description: "",
        dateEcheance: "",
        priorite: "normale",
        responsable: "",
        port: "Port autonome de dakar",
        bl: "",
        dossierName: "",
        prestations: [{ label: "", montant: "" }]
    });

    // Calculer le nombre de dossiers par client
    const dossiersCountByClient = useMemo(() => {
        const countMap = new Map();
        dossiers.forEach(dossier => {
            const clientId = dossier.clientId;
            countMap.set(clientId, (countMap.get(clientId) || 0) + 1);
        });
        return countMap;
    }, [dossiers]);

    // Filtrer les clients en fonction de la recherche
    const filteredClients = useMemo(() => {
        if (!clientSearchValue.trim()) {
            return clients
                .map(client => ({
                    ...client,
                    dossiersCount: dossiersCountByClient.get(client.id) || 0
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        }

        const searchLower = clientSearchValue.toLowerCase();
        return clients
            .filter(client =>
                client.name.toLowerCase().includes(searchLower) ||
                (client.email && client.email.toLowerCase().includes(searchLower)) ||
                (client.phone && client.phone.includes(clientSearchValue))
            )
            .map(client => ({
                ...client,
                dossiersCount: dossiersCountByClient.get(client.id) || 0
            }))
            .sort((a, b) => {
                const aStartsWith = a.name.toLowerCase().startsWith(searchLower);
                const bStartsWith = b.name.toLowerCase().startsWith(searchLower);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.name.localeCompare(b.name);
            });
    }, [clients, clientSearchValue, dossiersCountByClient]);

    // Mettre à jour les infos du client quand l'ID change
    useEffect(() => {
        if (formDossier.clientId) {
            const selectedClient = clients.find(c => String(c.id) === formDossier.clientId)
            if (selectedClient) {
                const dossiersCount = dossiersCountByClient.get(selectedClient.id) || 0
                setFormDossier(f => ({
                    ...f,
                    clientName: selectedClient.name,
                    clientDossiersCount: dossiersCount
                }))
                setClientSearchValue(selectedClient.name)
            }
        } else {
            setFormDossier(f => ({ ...f, clientName: "", clientDossiersCount: 0 }))
            setClientSearchValue("")
        }
    }, [formDossier.clientId, clients, dossiersCountByClient])

    if (!isOpenDos) return null;

    /* ── Ajouter dossier ── */
    const ajouterDossier = async () => {
        setLoading(true)
        if (!formDossier.clientId || !formDossier.description) {
            toast.error("Veuillez remplir tous les champs obligatoires")
            setLoading(false)
            return;
        }
        if (formDossier.prestations.some(p => (p.label && !p.montant) || (!p.label && p.montant))) {
            toast.error("Chaque ligne de prestation doit avoir un libellé et un montant")
            setLoading(false)
            return;
        }
        if (formDossier.dossierName.trim() === "") {
            toast.error("Le champ Dossier Name est obligatoire")
            setLoading(false)
            return;
        }

        if (!formDossier.bl) {
            toast.error("Le numéro B/L est obligatoire")
            setLoading(false)
            return;
        }

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
            port: formDossier.port || "Port autonome de dakar",
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

        route.refresh()
        setLoading(false)
        toast.success('✅ Enregistrement effectué avec succès')
        setFormDossier({
            clientId: "",
            clientName: "",
            clientDossiersCount: 0,
            type: "Dédouanement import",
            description: "",
            dateEcheance: "",
            priorite: "normale",
            responsable: "",
            port: "Port autonome de dakar",
            bl: "",
            dossierName: "",
            prestations: [{ label: "", montant: "" }]
        });
        setClientSearchValue("")
        setIsOpenDos(false)
    };

    const handleSelectClient = (clientId: string, clientName: string, dossiersCount: number) => {
        setFormDossier(f => ({ ...f, clientId, clientName, clientDossiersCount: dossiersCount }))
        setClientSearchValue(clientName)
    }

    const clearSelectedClient = () => {
        setFormDossier(f => ({ ...f, clientId: "", clientName: "", clientDossiersCount: 0 }))
        setClientSearchValue("")
    }

    const formatDossierCount = (count: number) => {
        if (count === 0) return "Aucun dossier";
        if (count === 1) return "1 dossier";
        return `${count} dossiers`;
    }

    return (
        <Dialog open={isOpenDos} onOpenChange={setIsOpenDos}>
            <DialogContent className="p-0 no-scrollbar max-h-[95vh] overflow-y-auto sm:max-w-2xl  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <DialogHeader className="bg-linear-to-r from-slate-900 to-slate-800 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sticky top-0 z-10">
                    <DialogTitle className="text-white font-bold text-lg sm:text-xl">Nouveau dossier</DialogTitle>
                </DialogHeader>

                <div className="bg-white rounded-2xl w-full  ">
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Sélection Client avec Combobox */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                Client *
                            </label>

                            {!formDossier.clientId ? (
                                <div className="relative">
                                    <Command className="rounded-lg border shadow-md" shouldFilter={false}>
                                        <div className="flex items-center border-b px-3">
                                            <CommandInput
                                                placeholder="Rechercher un client..."
                                                value={clientSearchValue}
                                                onValueChange={setClientSearchValue}
                                                className="border-0 focus:ring-0 h-11 w-full text-sm"
                                            />
                                            {clientSearchValue && (
                                                <button
                                                    onClick={() => setClientSearchValue("")}
                                                    className="text-gray-400 hover:text-gray-600 shrink-0"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <CommandList>
                                            <CommandEmpty>
                                                <div className="py-6 text-center">
                                                    <p className="text-sm text-gray-500 px-4">Aucun client trouvé</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setIsOpenDos(false);
                                                            startTransition(() => route.push("/dashboard/clients/?r=new"))
                                                        }}
                                                    >
                                                        + Ajouter un client
                                                    </Button>
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup heading="Clients">
                                                {filteredClients.map((client) => (
                                                    <CommandItem
                                                        key={client.id}
                                                        value={client.name}
                                                        onSelect={() => handleSelectClient(String(client.id), client.name, client.dossiersCount)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex flex-col w-full">
                                                            <div className="flex justify-between items-center flex-wrap gap-2">
                                                                <span className="font-medium text-sm sm:text-base">{client.name}</span>
                                                                <span className={cn(
                                                                    "text-xs px-2 py-0.5 rounded-full shrink-0",
                                                                    client.dossiersCount > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                                                )}>
                                                                    <FolderOpen className="w-3 h-3 inline mr-1" />
                                                                    {client.dossiersCount}
                                                                </span>
                                                            </div>
                                                            {(client.email || client.phone) && (
                                                                <span className="text-xs text-gray-500 mt-1 break-all">
                                                                    {client.email && `📧 ${client.email}`}
                                                                    {client.email && client.phone && " • "}
                                                                    {client.phone && `📱 ${client.phone}`}
                                                                </span>
                                                            )}
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {formatDossierCount(client.dossiersCount)}
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 sm:p-4 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <div className="font-semibold text-emerald-900 text-base sm:text-lg wrap-break-word">
                                                {formDossier.clientName}
                                            </div>
                                            <div className={cn(
                                                "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                                                formDossier.clientDossiersCount > 0 ? "bg-emerald-200 text-emerald-800" : "bg-gray-200 text-gray-600"
                                            )}>
                                                <FolderOpen className="w-3 h-3 inline mr-1" />
                                                {formDossier.clientDossiersCount} dossier{formDossier.clientDossiersCount !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        {clients.find(c => String(c.id) === formDossier.clientId)?.email && (
                                            <div className="text-sm text-emerald-700 break-all">
                                                📧 {clients.find(c => String(c.id) === formDossier.clientId)?.email}
                                            </div>
                                        )}
                                        {clients.find(c => String(c.id) === formDossier.clientId)?.phone && (
                                            <div className="text-sm text-emerald-700 break-all">
                                                📱 {clients.find(c => String(c.id) === formDossier.clientId)?.phone}
                                            </div>
                                        )}
                                        <div className="text-xs text-emerald-600 mt-2 font-medium">
                                            📊 {formatDossierCount(formDossier.clientDossiersCount)} existant{formDossier.clientDossiersCount !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSelectedClient}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 ml-2"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Formulaire complet - affiché seulement si un client est sélectionné */}
                        {formDossier.clientId && (
                            <>
                                <div className="border-t border-slate-200 my-4"></div>
                                
                                {/* 2 colonnes sur desktop, 1 colonne sur mobile */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Dossier N *</label>
                                        <Input
                                            placeholder="EX: DOS-2026-001"
                                            value={formDossier.dossierName}
                                            onChange={e => setFormDossier(f => ({ ...f, dossierName: e.target.value }))}
                                            className="rounded-xl text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type de prestation</label>
                                        <Select value={formDossier.type} onValueChange={v => setFormDossier(f => ({ ...f, type: v }))}>
                                            <SelectTrigger className="w-full rounded-xl text-sm sm:text-base">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TYPES_PRESTATION.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Checkbox TVA */}
                                <label className={cn("flex items-center gap-3 rounded-xl border p-3 cursor-pointer select-none transition-colors",
                                    tva ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200 hover:border-slate-300")}>
                                    <input type="checkbox" checked={tva as boolean} onChange={e => setTva(e.target.checked)} className="w-4 h-4 rounded border-slate-300 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-slate-800">TVA 18%</div>
                                        <div className="text-xs text-slate-400">TVA Afrique</div>
                                    </div>
                                    {tva && <span className="ml-auto text-emerald-600 font-bold shrink-0">✓</span>}
                                </label>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description *</label>
                                    <Input
                                        placeholder="ex: Conteneur 40HC électroniques — Chine"
                                        value={formDossier.description}
                                        onChange={e => setFormDossier(f => ({ ...f, description: e.target.value }))}
                                        className="rounded-xl text-sm sm:text-base"
                                    />
                                </div>

                                {/* Priorité et Date échéance */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Priorité</label>
                                        <Select value={formDossier.priorite} onValueChange={v => setFormDossier(f => ({ ...f, priorite: v }))}>
                                            <SelectTrigger className="w-full rounded-xl text-sm sm:text-base">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    { value: "urgente", label: "🔴 Urgente", color: "text-red-600" },
                                                    { value: "haute", label: "🟠 Haute", color: "text-orange-600" },
                                                    { value: "normale", label: "🟢 Normale", color: "text-green-600" }
                                                ].map(p => (
                                                    <SelectItem key={p.value} value={p.value} className={p.color}>
                                                        {p.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date échéance</label>
                                        <Popover open={openPop} onOpenChange={setOpenPop}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full rounded-xl justify-start font-normal text-sm sm:text-base">
                                                    {date ? date.toISOString().split("T")[0] : "Sélectionner une date"}
                                                </Button>
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

                                {/* Port et B/L */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Port / Aéroport</label>
                                        <Input
                                            placeholder="ex: Port Dakar"
                                            value={formDossier.port}
                                            onChange={e => setFormDossier(f => ({ ...f, port: e.target.value }))}
                                            className="rounded-xl text-sm sm:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">B/L · LTA · AWB</label>
                                        <Input
                                            placeholder="ex: BL-SH-2026-4521"
                                            value={formatBLNumber(formDossier.bl).formatted}
                                            onChange={e => setFormDossier(f => ({ ...f, bl: e.target.value }))}
                                            className="rounded-xl text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                {/* Prestations */}
                                <div>
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lignes de prestation</label>
                                        <button
                                            onClick={() => setFormDossier(f => ({ ...f, prestations: [...f.prestations, { label: "", montant: "" }] }))}
                                            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full font-medium transition-colors shrink-0"
                                        >
                                            + Ajouter ligne
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formDossier.prestations.map((p, i) => (
                                            <div key={i} className="flex gap-2 items-center flex-col sm:flex-row">
                                                <Input
                                                    placeholder="Libellé prestation"
                                                    value={p.label}
                                                    onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, label: e.target.value } : x) }))}
                                                    className="rounded-xl flex-1 text-sm sm:text-base w-full"
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Montant"
                                                    value={p.montant}
                                                    onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, montant: e.target.value } : x) }))}
                                                    className="rounded-xl w-full sm:w-32 text-sm sm:text-base"
                                                />
                                                {formDossier.prestations.length > 1 && (
                                                    <button
                                                        onClick={() => setFormDossier(f => ({ ...f, prestations: f.prestations.filter((_, j) => j !== i) }))}
                                                        className="text-slate-300 hover:text-rose-500 transition-colors shrink-0"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                        <div className="text-right">
                                            <div className="text-sm text-slate-600">
                                                Total HT : <span className="font-bold text-slate-800 text-base sm:text-lg">
                                                    {fmt(formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0))}
                                                </span>
                                            </div>
                                            {tva && (
                                                <div className="text-xs text-slate-500 mt-1">
                                                    TVA (18%) : {fmt((formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0) * 0.18))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-3 p-4 bg-slate-50 rounded-b-lg flex-col sm:flex-row">
                    <DialogClose asChild>
                        <CancelBtn />
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={ajouterDossier}
                        disabled={loading || !formDossier.clientId || !formDossier.description || formDossier.dossierName.trim() === "" || formDossier.prestations.some(p => (!p.label && p.montant) || (p.label && !p.montant)) || (!formDossier.bl)}
                        className="bg-slate-500 hover:bg-slate-600 text-white font-bold w-full sm:w-auto"
                    >
                        {loading ? <><Spinner /> Enregistrement...</> : <><Save className="w-4 h-4 mr-2" />Enregistrer</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}