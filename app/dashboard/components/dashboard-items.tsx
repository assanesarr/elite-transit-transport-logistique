'use client'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Card, CardContent } from "@/components/ui/card";
import ShowRecu from "./show-recu";
import { use, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/store/financeStore";




export default function DashboardItems() {
    const [open, setOpen] = useState(false)
    const [id, setId] = useState<string | undefined>()
    const [recu, setRecu] = useState<any>(undefined)
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const mouvement = useFinanceStore(state => state.mouvements)
 
    mouvement.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

    useEffect(() => {
        setRecu(mouvement.find(d => d.id === id) || undefined)
    }, [id])


    return (
        <>
            <ShowRecu open={open} setOpen={setOpen} recu={recu} />
            <Card className="@container/card">
                <CardContent className="grid gap-2">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-semibold">Derniers mouvements</h2>
                        <Button variant="outline" size="sm" onClick={() => { startTransition(() => router.push("/dashboard/tables")) }} className="ml-auto">
                            Voir tous
                        </Button>
                    </div>
                    {mouvement.slice(0, 5).map(mouv => (
                        <Item key={mouv.id} variant="outline" onClick={() => { setId(mouv.id); setOpen(true) }}>
                            <ItemContent>
                                <ItemTitle>{mouv.type === 'encaissement' ? 'Encaissement' : 'Decaissement'} {mouv.payement}</ItemTitle>
                                <ItemDescription>
                                    {new Date(mouv.createdAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions className={mouv.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}>
                                {mouv.type === 'decaissement' ? '-' : ''}
                                {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "XOF",
                                }).format(mouv.montant || 0)}
                            </ItemActions>
                        </Item>
                    ))}

                </CardContent>
            </Card>
        </>
    );
}