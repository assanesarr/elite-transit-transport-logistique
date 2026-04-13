'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { capitalizeFirstLetter } from "@/lib/utils";
import { BanknoteArrowDown, BanknoteArrowUp, Printer } from "lucide-react";




export default function ShowRecu(
    { open, setOpen, recu }:
        { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, recu: any }
) {
    // Object.entries(recu || {}).map(([key, value]) => {
    //     console.log(key, value)
    // })

    console.log(recu)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex flex-col justify-center items-center gap-2" >
                        {recu?.type === 'encaissement' ? <BanknoteArrowUp className="w-8 h-8" /> : <BanknoteArrowDown className="w-8 h-8" />}
                        {capitalizeFirstLetter(recu?.type as string)} effectuer
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex justify-center">
                            Paiement {recu?.payement}
                        </div>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Montant</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {recu?.type === 'decaissement' ? '-' : ''}
                                {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "XOF",
                                }).format(recu?.montant || 0)}
                            </ItemActions>
                        </Item>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Method</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {recu?.payment_method}
                            </ItemActions>
                        </Item>
                        {
                            recu?.payment_method === "CHEQUE" && (
                                <Item >
                                    <ItemContent>
                                        <ItemTitle>Numéro du chèque</ItemTitle>
                                    </ItemContent>
                                    <ItemActions >
                                        {recu?.numero_cheque || "N/A"}
                                    </ItemActions>
                                </Item>
                            )
                        }
                        {
                            recu?.payment_method === "VIREMENT" && (
                                <>
                                    <Item >
                                        <ItemContent>
                                            <ItemTitle>Date Virement et Banque</ItemTitle>
                                        </ItemContent>
                                        <ItemActions >
                                            {recu?.datevirement || "N/A"} {recu?.banque || "N/A"}
                                        </ItemActions>
                                    </Item>
                                    <Item >
                                        <ItemContent>
                                            <ItemTitle>Numéro du virement</ItemTitle>
                                        </ItemContent>
                                        <ItemActions >
                                            {recu?.numero_virement || "N/A"}
                                        </ItemActions>
                                    </Item>
                                </>
                            )
                        }
                        {
                            recu?.type === 'decaissement' && (
                                <>
                                    {
                                        recu?.clients === 'OTHER' ? (
                                            <div>

                                            </div>
                                        ) : (
                                            <Item >
                                                <ItemContent>
                                                    <ItemTitle>Nom de l'agent</ItemTitle>
                                                </ItemContent>
                                                <ItemActions className="capitalize">
                                                    {recu?.agent}
                                                </ItemActions>
                                            </Item>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            recu?.clients === 'OTHER' ? (
                                <>

                                    {/* {
                                        Object.entries(recu).map(([key, value]) => (
                                            <p key={key}>
                                                {key}: {value}
                                            </p>
                                        ))
                                    } */}

                                    <Item >
                                        <ItemContent>
                                            <ItemTitle>{recu?.payement === 'Salaire' ? 'Employe' : 'Agent'}</ItemTitle>
                                        </ItemContent>
                                        <ItemActions className="capitalize">
                                            {recu?.payement === 'Salaire' ? recu?.employe : recu?.agent }
                                        </ItemActions>
                                    </Item>
                                    <Item >
                                        <ItemContent>
                                            <ItemTitle>{recu?.payement === 'Salaire' || recu?.payement === 'Location' ? 'Mois' : 'Libelle'}</ItemTitle>
                                        </ItemContent>
                                        <ItemActions >
                                            {
                                                recu?.payement === 'Salaire' || recu?.payement === 'Location' ?
                                                    new Date(recu?.mois).toLocaleString('fr-FR', { month: "long", year: "numeric" }) || "N/A"
                                                    : recu?.libelle || "N/A"
                                            }
                                            {/* {recu?.dossier_name || "N/A"} */}
                                        </ItemActions>
                                    </Item>
                                </>
                            ) : (

                                <>
                                    <Item >
                                        <ItemContent>
                                            <ItemTitle>{recu?.type === 'encaissement' ? 'Payé par' : 'Pour le Client'}</ItemTitle>
                                        </ItemContent>
                                        <ItemActions className="capitalize">
                                            {recu?.clientName}
                                        </ItemActions>
                                    </Item>
                                    <Item >
                                        <ItemContent>
                                            <ItemTitle>Dossier</ItemTitle>
                                        </ItemContent>
                                        <ItemActions >
                                            {recu?.dossier_name || "N/A"}
                                        </ItemActions>
                                    </Item>
                                </>

                            )
                        }


                        {
                            recu?.type === 'decaissement' && (
                                <Item >
                                    <ItemContent>
                                        <ItemTitle>Motif Paiement</ItemTitle>
                                    </ItemContent>
                                    <ItemActions >
                                        {recu?.payement || "N/A"}
                                    </ItemActions>
                                </Item>
                            )
                        }
                        <Item >
                            <ItemContent>
                                <ItemTitle>Date et heure</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {new Date(recu?.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </ItemActions>
                        </Item>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Référence</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {recu?.ref || recu?.id || "N/A"}
                            </ItemActions>
                        </Item>
                        <p className="hidden text-center text-xs print:text-muted-foreground mt-4 print:block ">
                            Reçu généré par Elite Transit Transport Logistique. Merci de votre confiance!
                        </p>
                    </DialogDescription>
                </DialogHeader >
                <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="print:hidden"
                >
                    <Printer className="mr-2 h-4 w-4" /> Imprimer le reçu
                </Button>
            </DialogContent >
        </Dialog >
    )
}