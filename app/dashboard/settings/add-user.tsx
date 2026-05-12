"use client"
import { STATUTS } from "@/app/data"
import CancelBtn from "@/components/cancel-btn"
import SaveBtn from "@/components/save-btn"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addUser } from "@/lib/actions"
import { Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { toast } from "sonner"

enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  AGENT = "AGENT",
  EMPLOYE = "EMPLOYE",
}

export function AddUser() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string>("AGENT")
    const [state, formAction] = useFormState(addUser, null)
    const searchParams = useSearchParams();
    const req = searchParams.get("r");

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            setOpen(false); // Fermer le dialog après succès
            setRole("AGENT"); // Réinitialiser le rôle
        } else if (state?.error) {
            toast.error(state.message);
        }
    }, [state])

    useEffect(() => {
        if (req === "new") {
            setOpen(true);
        }
    }, [req])

    // Vérifier si le rôle nécessite un mot de passe
    const requiresPassword = role === Role.ADMIN || role === Role.EDITOR;

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
                // Réinitialiser le formulaire à la fermeture
                setRole("AGENT");
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4"><Plus /> Ajouter Nouveau</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction} className="grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Ajouter un agent</DialogTitle>
                        <DialogDescription>
                            Remplissez les informations pour ajouter un nouvel utilisateur
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Nom complet</Label>
                            <Input 
                                id="name-1" 
                                name="name" 
                                required 
                                placeholder="Jean Dupont"
                            />
                        </div>
                        
                        <Select
                            name="role"
                            defaultValue="AGENT"
                            onValueChange={vl => setRole(vl)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Rôles</SelectLabel>
                                    <SelectItem value={Role.AGENT}>AGENT</SelectItem>
                                    <SelectItem value={Role.EDITOR}>EDITOR</SelectItem>
                                    <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
                                    <SelectItem value={Role.EMPLOYE}>EMPLOYE</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        
                        {role === Role.EMPLOYE && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-3">
                                    <Label htmlFor="poste">Poste</Label>
                                    <Input id="poste" name="poste" placeholder="Développeur" />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Statut</Label>
                                    <Select name="statut">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Statut</SelectLabel>
                                                {STATUTS.map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                        
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email ou Téléphone</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                required 
                                placeholder="exemple@email.com"
                            />
                        </div>
                        
                        {/* Correction : password pour ADMIN ou EDITOR */}
                        {requiresPassword && (
                            <div className="grid gap-3">
                                <Label htmlFor="password">
                                    Mot de passe
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    required
                                    minLength={6}
                                    placeholder="Au moins 6 caractères"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Le mot de passe doit contenir au moins 6 caractères
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelBtn />
                        </DialogClose>
                        <SaveBtn />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}