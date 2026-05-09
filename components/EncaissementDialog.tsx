'use client'

import { addMouvement } from "@/lib/actions"
import { AlertCircleIcon, BanknoteArrowUp, Save } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useFormState } from "react-dom"
import { toast } from "sonner"
import CancelBtn from "./cancel-btn"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { useRouter } from "next/navigation"
import { ClientSelect } from "./ClientSelect"
import { EncaissementForm, FormPaiment } from "./EncaissementForm"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"
import SaveBtn from "./save-btn"
import Invoice, { InvoicePDF } from "./Invoice"
import { useDossiersStore } from "@/store/useDossiersStore"
import { getNextNumero } from "@/lib/utils"

export default function EncaissementDialog({
    open,
    onOpenChange,
    // onSuccess
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    // onSuccess: (data: any) => void
}) {

    // const [modeEncaissement, setModeEncaissement] = useState("NOUVEAU")
    // const [methodPayement, setMethodPayement] = useState("")
    // const [showInvoice, setShowInvoice] = useState(true)
    // const [state, formAction] = useFormState(addMouvement, null)
    // const dossiers = useDossiersStore(s => s.dossiers)





    // useEffect(() => {
    //     if (state?.error) {
    //         toast.error(state.error)
    //     } else if (state?.success) {
    //         toast.success("Encaissement enregistré avec succès!")
    //         // onSuccess(state)
    //         setTimeout(() => onOpenChange(false), 1000)
    //     }
    // }, [state, onOpenChange])

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-xl rounded-2xl w-full p-0 no-scrollbar max-h-screen overflow-y-auto">
                    <FormPaiment />
                </DialogContent>
            </Dialog>
        </>
    )
}
