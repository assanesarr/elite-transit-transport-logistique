'use client'

import {
    Dialog,
    DialogContent,
} from "./ui/dialog"

import { FormPaiment } from "./EncaissementForm"
import { useModalStore } from "@/store/modal/paiement"

export default function EncaissementDialog() {
      const { isOpen, close } = useModalStore()

    return (
        <>
            <Dialog open={isOpen} onOpenChange={close}>
                <DialogContent className="sm:max-w-xl rounded-2xl w-full p-0 no-scrollbar max-h-screen overflow-y-auto">
                    <FormPaiment />
                </DialogContent>
            </Dialog>
        </>
    )
}
