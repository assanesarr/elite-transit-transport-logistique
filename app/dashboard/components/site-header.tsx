"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUIStore } from "@/store/booleanStore"
import { useFinanceStore } from "@/store/financeStore"

export function SiteHeader() {
  const solde = useFinanceStore((state) => state.solde)
  const isOpen  = useUIStore((state) => state.isOpen);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
      </div>
      <div className="ml-auto flex w-full items-center justify-end gap-4 px-4 lg:px-6">
        <span className="hidden lg:inline">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <span className="flex justify-center gap-1 font-semibold">
          Solde: {isOpen ? <span className={solde >= 0 ? "text-green-600" : "text-red-600"}>{
            new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
            }).format(solde)

          }</span> : <span >••••••</span>}
        </span>
      </div>
    </header>
  )
}