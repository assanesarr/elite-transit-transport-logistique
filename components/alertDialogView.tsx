'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAlertStore } from "@/store/alertStore"
import { Trash2 } from "lucide-react";


export function AlertDialogView() {
    const { isAlertOpen, context, confirm, cancel } = useAlertStore();

    return (
        <AlertDialog open={isAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. {context?.message || " Il sera définitivement supprimé de nos serveurs. "}
                        Êtes-vous sûr ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancel}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={confirm}><Trash2 />  Supprimer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
