import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";


export default function TrasDossier(
    { dossierId,
        setDossiers
    }:
        {
            dossierId: string,
            setDossiers: React.Dispatch<React.SetStateAction<any[]>>
        }) {




    const deleteDossier = (dossierId: string) => {
        fetch('/api/dossiers/delete-dossier', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dossierId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Versement deleted:', data);
                // Refresh dossiers after deletion
                setDossiers(prev => prev.filter(item => item.id !== dossierId))
            })
            .catch(error => {
                console.error('Error deleting versement:', error);
            });
    };

    return (
        <AlertDialog >
            <AlertDialogTrigger className="flex items-center" >
                <IconTrash className="text-red-500 hover:text-red-700" size={12} />
                {/* Supprimer le document */}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement le
                        dossier et tous les versement contenu.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteDossier(dossierId)} className="bg-red-500 hover:bg-red-700">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}   
