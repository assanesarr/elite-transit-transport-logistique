// @ts-nocheck
import { useEmployesStore } from "@/store/useEmployesStore"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { getMonthsUntilNow } from "@/lib/utils"
import { DossierSelect } from "./DossierSelect"
import { PaymentMethodSelect } from "./PaymentMethodSelect"
import { ChequeDetails } from "./ChequeDetails"
import { VirementDetails } from "./VirementDetails"
import { AgentSelect } from "./AgentSelect"

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

const CHARGE_BUREAU = [
    "Transport",
    "Repas",
    "Internet",
    "Telephone",
    "Gainde",
    "Woyofal",
    "Location",
    "Salaire"
]

// Composant pour le formulaire de décaissement
export const DecaissementForm = ({ clientId, dossiers, otherPayement, setOtherPayement, methodPayement, setMethodPayement, onAddAgent }: any) => {
    const employes = useEmployesStore(state => state.employes)
    
    return (
        <>
            {clientId !== "OTHER" && (
                <div className="flex flex-col gap-3">
                    <Label>Dossiers</Label>
                    <DossierSelect dossiers={dossiers} />
                </div>
            )}

            <div className="flex flex-col gap-3">
                <Label>Type de paiement</Label>
                <Select name="payement" onValueChange={setOtherPayement}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Décaissement</SelectLabel>
                            {clientId === "OTHER" ? (
                                CHARGE_BUREAU.map(ch => (
                                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                                ))
                            ) : (
                                PAYEMENTS.map((p, index) => (
                                    <SelectItem key={index} value={p}>{p}</SelectItem>
                                ))
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {otherPayement === "Salaire" && (
                <div className="flex flex-col gap-3">
                    <Label>Employés</Label>
                    <Select name="employe">
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un employé" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Employés</SelectLabel>
                                {employes.map(employe => (
                                    <SelectItem key={employe.id} value={employe.name}>{employe.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="grid gap-3">
                <Label>Montant</Label>
                <Input name="montant" type="number" placeholder="0" />
            </div>

            {clientId === "OTHER" && (
                <div className="flex flex-col gap-3">
                    <Label>Libellé</Label>
                    <Input name="libelle" placeholder="Description de la charge" />
                </div>
            )}

            {clientId === "OTHER" && (
                <div className="flex flex-col gap-3">
                    <Label>Mois</Label>
                    <Select name="mois">
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le mois" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {getMonthsUntilNow(new Date().getFullYear()).map(month => (
                                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {otherPayement !== "Location" && otherPayement !== "Salaire" && !otherPayement && (
                <div className="grid gap-3">
                    <Label>Libellé</Label>
                    <Input name="libelle" placeholder="Libellé de l'opération" />
                </div>
            )}

            <div className="flex flex-col gap-3">
                <Label>Mode de paiement</Label>
                <PaymentMethodSelect onValueChange={setMethodPayement} />
            </div>

            {methodPayement === "CHEQUE" && <ChequeDetails />}
            {methodPayement === "VIREMENT" && <VirementDetails />}

            {otherPayement !== "Salaire" && (
                <AgentSelect isOther={clientId === "OTHER"} onAddAgent={onAddAgent} />
            )}
        </>
    )
}