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
}

export function AddUser() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string>("")
    const [state, formAction] = useFormState(addUser, null)
    const searchParams = useSearchParams();
    const req = searchParams.get("r");

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.error) {
            toast.error(state.message);
        }
    }, [state])

    useEffect(() => {
        if (req === "new") {
            setOpen(true);
        }
    }, [req])



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4"><Plus /> Ajouter Nouveau</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction} className="grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Ajouter un agent</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" />
                        </div>
                        <Select
                            name="role"
                            defaultValue="AGENT"
                            onValueChange={vl => setRole(vl)}
                        >
                            <SelectTrigger >
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="AGENT">AGENT</SelectItem>
                                    <SelectItem value="EDITOR">EDITOR</SelectItem>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                    <SelectItem value="EMPLOYE">EMPLOYE</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {
                            role === 'EMPLOYE' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-3">
                                        <Label htmlFor="poste">Poste</Label>
                                        <Input id="poste" name="poste" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label >Statut</Label>
                                        <Select
                                            name="statut"
                                        >
                                            <SelectTrigger className="w-full ">
                                                <SelectValue placeholder="Statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Statut</SelectLabel>
                                                    {STATUTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )
                        }
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email or Phone</Label>
                            <Input id="email" name="email" />
                        </div>
                        {
                            role === "ADMIN" || role === "EDITOR" && (
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" />
                                </div>
                            )
                        }

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


