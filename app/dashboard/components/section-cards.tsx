
'use client'

import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOffIcon, EyeIcon, ReceiptEuro } from "lucide-react";
import { useState } from "react";
import { useFinanceStore } from "@/store/financeStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUIStore } from "@/store/booleanStore";


export function SectionCards() {
  // const [isVisible, setIsVisible] = useState(false);
   const { isOpen, toggle } = useUIStore();
  const { solde, totalCredit, totalDebit } = useFinanceStore();
  const isMobile = useIsMobile();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-4 @5xl/main:grid-cols-4">
      <Card className="@container/card col-span-4 @xl/main:col-span-2">
        <CardHeader>
          <CardDescription ><span className="hidden items-center lg:flex"><ReceiptEuro className=" w-4 h-4 mr-2 " /> Solde</span> </CardDescription>
          <CardTitle className="font-semibold tabular-nums @[250px]/card:text-3xl">
            <div className='relative'>
              <Button
                variant='ghost'
                size='icon'
                onClick={toggle}
                className='absolute inset-y-0 left-0 rounded-none hover:bg-transparent'
              >
                {isOpen ? <EyeOffIcon /> : <EyeIcon />}
                <span className='sr-only'>{isOpen ? 'Hide password' : 'Show password'}</span>
              </Button>
              <Input
                type={isOpen ? 'text' : 'password'}
                className='border-none shadow-none focus-visible:ring-0 pl-8 font-semibold tabular-nums @[250px]/card:text-3xl'
                value={isOpen ? new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                }).format(solde || 0) : "••••••"}
                readOnly />
            </div>

          </CardTitle>
          <CardAction>
            <QRCodeCanvas
              value={`${window.location.origin}/dashboard/?solde=${solde}&totalCredit=${totalCredit}&totalDebit=${totalDebit}`}
              size={isMobile ? 50 : 70}
            />
          </CardAction>
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
 
        <Card className="@container/card col-span-2 @xl/main:col-span-1 ">
          <CardHeader>
            <CardDescription>Encaissements</CardDescription>
            <CardTitle className="font-semibold tabular-nums @[250px]/card:text-3xl">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
              }).format(totalCredit || 0)}
            </CardTitle>
            <CardAction>
              {/* <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge> */}
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="@container/card col-span-2 @xl/main:col-span-1">
          <CardHeader>
            <CardDescription>Decaissements</CardDescription>
            <CardTitle className="font-semibold tabular-nums @[250px]/card:text-3xl">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
              }).format(totalDebit || 0)}
            </CardTitle>
          </CardHeader>
        </Card>
    
      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Taux de croissance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
            {/* {tauxCroissance.toFixed(2)}% }
          </CardTitle>

        </CardHeader>

      </Card> */}
    </div>
  )
}