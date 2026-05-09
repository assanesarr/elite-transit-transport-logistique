import { AlertCircleIcon, Save } from "lucide-react"
import { CategorieDecaissementSelect } from "./CategorieDecaissementSelect"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Dialog, DialogContent } from "./ui/dialog"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { addMouvement } from "@/lib/actions"
import { useFormState } from "react-dom"
import { fmt, generatePayRef } from "@/lib/utils"
import { Button } from "./ui/button"
import { useClientsStore } from "@/store/clientStore"
import { AgentSelect } from "./AgentSelect"
import { Spinner } from "./ui/spinner"
import SaveBtn from "./save-btn"
import CancelBtn from "./cancel-btn"
import { CATEGORIES_DECAISSEMENT } from "@/app/data"

const PAYEMENTS = [
    "Debarquement",
    "Droit-Douanes",
    "B.A.E",
    "Enlevement",
    "Magasinage",
    "Surestarie",
    "Amende",
    "Liquidation",
    "Douanes Thies",
    "Douane Diourbel",
    "Douane Mbour",
    "Douane Kedougou"
]



const modesPaiement = [
    'ESPECE',
    'ORANGE MONEY',
    'WAVE',
    'CHEQUE',
    'VIREMENT'
]

// Dialogue de décaissement (version améliorée sans OTHER)
export default function DecaissementDialog({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: (data: any) => void }) {
    const [clientId, setClientId] = useState("")
    const [dossiers, setDossiers] = useState<any[]>([])
    const [categorie, setCategorie] = useState("")
    const [montant, setMontant] = useState("")
    const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split("T")[0])
    const [modePaiement, setModePaiement] = useState("ESPECE")
    const [reference, setReference] = useState(generatePayRef())
    const [note, setNote] = useState("")
    const [selectedDossier, setSelectedDossier] = useState("")
    const [state, formAction] = useFormState(addMouvement, null)
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const selectedCategorie = CATEGORIES_DECAISSEMENT?.find(c => c.key === categorie)

    useEffect(() => {
        if (clientId) {
            fetch("/api/dossiers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId })
            })
                .then(res => res.json())
                .then(setDossiers)
                .catch(console.error)
        }
    }, [clientId])

    useEffect(() => {
        if (!state?.error) return

        toast.error(state.error)

    }, [state?.error])

    useEffect(() => {
        if (!state?.success) return

        toast.success("Décaissement enregistré avec succès!")
        setMontant('')
        setCategorie('')

        onSuccess(state)

        onOpenChange(false)
    }, [state?.success])

    const handleSubmit = async (formData: FormData) => {
        formData.set("type", "decaissement")
        formData.set("payement", categorie)
        formData.set("montant", montant)
        formData.set("date", datePaiement)
        formData.set("payment_method", modePaiement)
        formData.set("ref", reference)
        formData.set("note", note)
        if (selectedDossier) {
            // formData.set("dossier_name", dossiers.find(d => d.id === selectedDossier).dossierName)
            formData.set("dossier_name", selectedDossier)
        }

        // console.log(dossiers.find(d => d.id === selectedDossier))
        // console.log(Object.fromEntries(formData.entries()))
        formAction(formData)
    }

    const montantNum = parseInt(montant)

    if (!open) return

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl sm:max-w-xl max-h-screen overflow-y-auto p-0">
                <div className="bg-white rounded-2xl w-full border border-slate-100">
                    <div className="bg-rose-600 px-6 py-4 rounded-t-2xl flex justify-between items-start">
                        <div>
                            <p className="text-white font-bold text-base">Nouveau décaissement</p>
                            {clientId && (
                                <p className="text-rose-200 text-xs mt-0.5">
                                    {clientId === "nouveau" ? "Nouveau client" : `Client sélectionné`}
                                </p>
                            )}
                        </div>

                    </div>

                    <form ref={formRef} action={handleSubmit} className="p-6 space-y-5">
                        {state?.error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Échec de l'enregistrement</AlertTitle>
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Sélection Client (sans OTHER) */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="w-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Client *
                                </label>
                                <Select name="clients" onValueChange={setClientId}>
                                    <SelectTrigger className="rounded-lg w-full">
                                        <SelectValue placeholder="Sélectionner un client" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {useClientsStore.getState().clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2"
                                            onClick={() => {
                                                onOpenChange(false)
                                                startTransition(() => router.push("/dashboard/clients/?r=new"))
                                            }}
                                        >
                                            Ajouter un nouveau client
                                        </Button>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sélection Dossier */}
                            {clientId && dossiers.length > 0 && (
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Dossier
                                    </label>
                                    <Select onValueChange={setSelectedDossier}>
                                        <SelectTrigger className="rounded-lg w-full">
                                            <SelectValue placeholder="Sélectionner un dossier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dossiers.map((dossier) => (
                                                <SelectItem key={dossier.id} value={dossier.id}>
                                                    {dossier.dossierName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        {/* Catégorie de décaissement */}
                        {CATEGORIES_DECAISSEMENT && selectedDossier && (
                            <CategorieDecaissementSelect
                                value={categorie}
                                onChange={setCategorie}
                                categories={CATEGORIES_DECAISSEMENT}
                            />
                        )}

                        {/* Montant */}
                        <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Montant décaissé (FCFA) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm">−</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="ex: 320000"
                                    value={montant}
                                    onChange={e => setMontant(e.target.value)}
                                    className="pl-8 rounded-lg text-base font-semibold"
                                />
                                {montantNum > 0 && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                        {fmt(montantNum)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Date + Mode de paiement */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Date du paiement
                                </label>
                                <Input
                                    type="date"
                                    value={datePaiement}
                                    onChange={e => setDatePaiement(e.target.value)}
                                    className="rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Mode de paiement
                                </label>
                                <Select value={modePaiement} onValueChange={setModePaiement}>
                                    <SelectTrigger className="rounded-lg w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modesPaiement?.map(m => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {modePaiement === "CHEQUE" && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Numéro de chèque
                                </label>
                                <Input
                                    name="numero_cheque"
                                    placeholder="Entrez le numéro du chèque"
                                    className="rounded-lg w-full"
                                />
                            </div>
                        )}

                        {modePaiement === "VIREMENT" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="w-full">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                            Banque
                                        </label>
                                        <Select name="banque">
                                            <SelectTrigger className="rounded-lg w-full">
                                                <SelectValue placeholder="Sélectionner la banque" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Banque Islamique du Senegal">
                                                    Banque Islamique du Sénégal
                                                </SelectItem>
                                                <SelectItem value="CBAO">CBAO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                            Date de virement
                                        </label>
                                        <Input
                                            type="date"
                                            name="datevirement"
                                            className="rounded-lg w-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Numéro de virement
                                    </label>
                                    <Input
                                        name="numero_virement"
                                        placeholder="Entrez le numéro du virement"
                                        className="rounded-lg w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Référence + Note */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Référence / Quittance
                                </label>
                                <Input
                                    placeholder="ex: DD-2026-441"
                                    value={reference}
                                    onChange={e => setReference(e.target.value)}
                                    className="rounded-lg font-mono text-sm w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Note
                                </label>
                                <Input
                                    placeholder="Commentaire…"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    className="rounded-lg text-sm w-full"
                                />
                            </div>
                        </div>

                        {/* Aperçu */}
                        {montantNum > 0 && selectedCategorie && (
                            <div className={`rounded-xl p-4 border ${selectedCategorie.bg} ${selectedCategorie.border}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{selectedCategorie.icon}</span>
                                        <div>
                                            <p className={`text-sm font-bold ${selectedCategorie.color}`}>
                                                {selectedCategorie.label}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {datePaiement} · {modePaiement}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-black text-rose-600 tabular-nums">
                                        −{fmt(montantNum)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Sélection Agent */}
                        <AgentSelect
                            onAddAgent={() => {
                                onOpenChange(false)
                                startTransition(() => router.push("/dashboard/settings?r=new"))
                            }}
                        />

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            {/* <button
                                type="submit"
                                disabled={isPending || !categorie || !montant || !clientId}
                                className="flex flex-1 justify-center items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3 rounded-lg  transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
                            >
                                {isPending ? <><Spinner /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer le décaissement</>}
                            </button> */}
                            <SaveBtn />
                            <CancelBtn type="button" onClick={() => onOpenChange(false)} />
                            {/* <button
                                type="button"
                                
                                disabled={isPending}
                                className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium"
                            >
                                Annuler
                            </button> */}
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
