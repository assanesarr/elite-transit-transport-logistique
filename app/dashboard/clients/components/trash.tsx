"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { User } from "./card-user";
import { deleteClient } from "@/lib/actions";
import { toast } from "sonner";


export default function TrashComponent({ user }: { user: User }) {

    const destr = async () => {
        const result = await deleteClient(user.id);
        if (result.success) {
            toast.success("Client supprimé avec succès !");
        } else {
            toast.error("Échec de la suppression du client. Veuillez réessayer SVP.");
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <IconTrash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement ce client et ses données de nos serveurs.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => destr()} className="bg-red-500 hover:bg-red-700">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}