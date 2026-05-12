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
import { Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export function AlertDialogView() {
    const { isAlertOpen, context, confirm, cancel } = useAlertStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = useCallback(async () => {
        if (context?.onConfirm) {
            setIsLoading(true);
            try {
                await context.onConfirm();
                confirm();
            } catch (error) {
                console.error("Erreur:", error);
                toast.error("Une erreur est survenue. Veuillez réessayer.");
            } finally {
                setIsLoading(false);
            }
        } else {
            confirm();
        }
    }, [context, confirm]);

    if (!isAlertOpen) return null;

    return (
        <AlertDialog open={isAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {context?.title || "Êtes-vous absolument sûr ?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {context?.message || "Cette action est irréversible. Il sera définitivement supprimé de nos serveurs."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        onClick={cancel}
                        disabled={isLoading}
                    >
                        {context?.cancelText || "Annuler"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Chargement...
                            </>
                        ) : (
                            context?.buttonText || "Supprimer"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}