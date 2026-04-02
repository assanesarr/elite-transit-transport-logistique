import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";


export default function TrashBtn(
    { dossierName, versementDate,
        setDossiers
    }:
        {
            dossierName: string,
            versementDate: string,
            setDossiers: React.Dispatch<React.SetStateAction<any[]>>
        }) {

    const deleteVersement = (dossierName: string, versementDate: string) => {
        fetch('/api/dossiers/delete-versement', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dossierName, versementDate }),
        })
            .then(response => response.json())
            .then(() => {
                // Refresh dossiers after deletion
                setDossiers((prevDossiers) => {
                    return prevDossiers.map((dossier: any) => {
                        if (dossier.dossierName === dossierName) {
                            return {
                                ...dossier,
                                versement: dossier.versement.filter((v: any) => v.date !== versementDate)
                            };
                        }
                        return dossier;
                    });
                });

            })
            .catch(error => {
                console.error('Error deleting versement:', error);
            });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <IconTrash className="text-red-500 hover:text-red-700 " />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement cette
                        facture et vos données de nos serveurs.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteVersement(dossierName, versementDate)} className="bg-red-500 hover:bg-red-700">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}   
