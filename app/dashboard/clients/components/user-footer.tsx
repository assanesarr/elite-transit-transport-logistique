'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import TrashBtn from "./trash-btn";
import TrashDossier from "./trash-dossier";
import { BadgeCheckIcon, Divide, Folder, Folders, Printer } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { IconTrash } from "@tabler/icons-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";



export default function FooterUser({ user, docs }: { user: any, docs: any[] }) {

    const isMobile = useIsMobile();
    const [dossiers, setDossiers] = useState<any[]>(docs)

    useEffect(() => {
        setDossiers(docs)
    }, [user])



    return (
        <Drawer direction={isMobile ? "bottom" : "right"} >
            <DrawerTrigger asChild>
                <Button variant="ghost" className="font-bold hover:underline text-sm w-fit px-0 text-left capitalize">
                    <Folders /> {user.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-xl">
                <DrawerHeader className="gap-1">
                    <DrawerTitle className="text-xl font-bold">{user.name}</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <h1 className="text-xl font-bold">Encaissement </h1>
                    <Accordion type="single" collapsible >
                        {
                            dossiers.length === 0 ? (
                                <p>No dossiers found for this client.</p>
                            ) :
                                dossiers.map((dossier: any, index: number) => {
                                    const totalVersement = dossier.versement.reduce((sum: number, v: any) => Number(sum) + (Number(v.montant) || 0), 0);

                                    return (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <div className="flex gap-1 justify-between">
                                                <TrashDossier dossierId={dossier.id} setDossiers={setDossiers} />
                                                <AccordionTrigger>
                                                    <Badge><Folder /> Dossier {dossier.dossierName}</Badge>
                                                </AccordionTrigger>
                                            </div>
                                            <AccordionContent>

                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Action</TableHead>
                                                            <TableHead className="w-[100px]">Invoice</TableHead>
                                                            <TableHead>Method</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {dossier.versement.map((versement: any, vIndex: number) => (
                                                            <TableRow key={vIndex}>
                                                                <TableCell>
                                                                    <TrashBtn
                                                                        dossierName={dossier.dossierName}
                                                                        versementDate={versement.date}
                                                                        setDossiers={setDossiers}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-medium">{versement.invoice || `INV${String(vIndex + 1).padStart(3, '0')}`}</TableCell>
                                                                <TableCell>{versement.payment_method}</TableCell>
                                                                <TableCell className="text-right">{new Intl.NumberFormat("fr-FR").format(versement.montant || 0)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow>
                                                            <TableCell className="font-medium text-right" colSpan={3}>TOTAL ACOUNT:</TableCell>
                                                            <TableCell className="text-right">
                                                                {
                                                                    totalVersement >= dossier.montant_total
                                                                        ? (<Badge className="bg-green-500 text-white rounded-none">{new Intl.NumberFormat("fr-FR").format(totalVersement)}</Badge>)
                                                                        : (<Badge className="bg-red-500 text-white rounded-none">{new Intl.NumberFormat("fr-FR").format(totalVersement)}</Badge>)
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium text-right" colSpan={3}>NET A PAIE:</TableCell>
                                                            <TableCell className="text-right">{new Intl.NumberFormat("fr-FR").format(dossier.montant_total)}</TableCell>
                                                        </TableRow>

                                                        <TableRow >
                                                            <TableCell className="font-medium text-right" colSpan={3}>{(dossier.montant_total - totalVersement) <= 0 ? '' : 'Restes à payer:'}</TableCell>
                                                            <TableCell className="text-right">{dossier.montant_total - totalVersement <= 0 ? (<Badge className="bg-green-600 text-white">PAYÉ</Badge>) : new Intl.NumberFormat("fr-FR").format(dossier.montant_total - totalVersement)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })
                        }

                    </Accordion>
                    <Separator />
                    <h1 className="text-xl font-bold">Decaissement Paiements</h1>
                    <div>
                        <Accordion type="single" collapsible >
                            {
                                dossiers.length === 0 ? (
                                    <p>No dossiers found for this client.</p>
                                ) :
                                    dossiers.map((dossier: any, index: number) => {
                                        const totalVersement = dossier.versement.reduce((sum: number, v: any) => Number(sum) + (Number(v.montant) || 0), 0);
                                        const totalPayement = dossier?.payements && dossier.payements.reduce((sum: number, p: any) => Number(sum) + (Number(p.montant) || 0), 0);
                                        return (
                                            <AccordionItem key={index} value={`item-${index}`}>
                                                <AccordionTrigger >
                                                    <div className="flex items-center gap-1"><Folder /> Dossier {dossier.dossierName}</div>
                                                    <div className="font-bold">
                                                         Versement   {new Intl.NumberFormat("fr-FR").format(totalVersement || 0)}
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent  >
                                                    {
                                                        dossier.payements && dossier.payements.length > 0 ?
                                                            <>
                                                                {
                                                                    dossier.payements.map((payement: any, pIndex: number) => (
                                                                        <ContextMenu key={pIndex}>
                                                                            <ContextMenuTrigger>
                                                                                <Item variant="outline" size="sm" key={pIndex} onClick={() => { console.log("clicked...", dossier) }}>
                                                                                    <ItemMedia>
                                                                                        <BadgeCheckIcon className="size-5 text-green-500" />
                                                                                    </ItemMedia>
                                                                                    <ItemContent>
                                                                                        <ItemTitle>{payement.payement}</ItemTitle>
                                                                                    </ItemContent>
                                                                                    <ItemActions>
                                                                                        {new Intl.NumberFormat("fr-FR").format(payement.montant || 0)}
                                                                                    </ItemActions>
                                                                                </Item>
                                                                            </ContextMenuTrigger>
                                                                            <ContextMenuContent>
                                                                                {/* <ContextMenuItem>
                                                                                    <IconEye className="size-4 mr-2" />
                                                                                    View Details
                                                                                </ContextMenuItem> */}
                                                                                <ContextMenuItem>
                                                                                    <DeleteDecaissementBtn
                                                                                        dossierId={dossier.id}
                                                                                        payementDate={payement.date}
                                                                                        setDossiers={setDossiers}
                                                                                    />
                                                                                </ContextMenuItem>
                                                                            </ContextMenuContent>
                                                                        </ContextMenu>

                                                                    ))
                                                                }

                                                                <Item variant="muted" size="sm">
                                                                    <ItemContent>
                                                                        <ItemTitle>Total Payements</ItemTitle>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        {new Intl.NumberFormat("fr-FR").format(totalPayement || 0)}
                                                                    </ItemActions>
                                                                </Item>
                                                                {/* <Item variant="muted" size="sm">
                                                                    <ItemContent>
                                                                        <ItemTitle className="font-bold">Total Versement</ItemTitle>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        {new Intl.NumberFormat("fr-FR").format(totalVersement || 0)}
                                                                    </ItemActions>
                                                                </Item> */}
                                                                <Item variant="muted" size="sm">
                                                                    <ItemContent>
                                                                        <ItemTitle className="font-bold">Résultat</ItemTitle>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        <Badge variant="outline" className={cn((totalVersement - totalPayement) >= 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-600 text-white dark:bg-red-600 dark:text-white")}>
                                                                            {new Intl.NumberFormat("fr-FR").format((totalVersement - totalPayement) || 0)}
                                                                        </Badge>
                                                                    </ItemActions>
                                                                </Item>
                                                            </>

                                                            : (
                                                                <p className="text-sm text-muted-foreground">No payements found for this dossier.</p>
                                                            )

                                                    }

                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })
                            }
                        </Accordion>
                    </div>
                </div>
                <DrawerFooter>
                    <Button
                        variant="outline"
                        onClick={() => window.print()}
                        className="print:hidden"
                    >
                        <Printer className="mr-2 h-4 w-4" /> Imprimer le reçu
                    </Button>
                    <DrawerClose asChild>
                        <p className="hidden text-center text-xs print:text-muted-foreground mt-4 print:block ">
                            Reçu généré par Elite Transit Transport Logistique. Merci de votre confiance!
                        </p>
                        {/* <>
                            
                            <Button variant="outline" className="print:hidden">Done</Button>
                        </> */}
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >

    );
}

const DeleteDecaissementBtn = ({ dossierId, payementDate, setDossiers }: { dossierId: string, payementDate: string, setDossiers: any }) => {

    const handleDelete = () => {
        fetch('/api/dossiers/delete-payement', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dossierId, payementDate }),
        })
            .then(response => response.json())
            .then(() => {
                // Refresh dossiers after deletion
                setDossiers((prevDossiers: any[]) => {
                    return prevDossiers.map((dossier: any) => {
                        if (dossier.id === dossierId) {
                            return {
                                ...dossier,
                                payements: dossier.payements.filter((p: any) => p.date !== payementDate)
                            }
                        }
                        return dossier;
                    })
                });
                toast.success('Payement deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting payement:', error);
                toast.error('Failed to delete payement');
            });
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleDelete}>
            <IconTrash className="text-red-500 hover:text-red-700 " size={21} />
            Supprimer
        </Button>
    )
}