"use client"
import { SpotlightSearch } from "@/components/spotlight-search"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useBreadcrumb } from "@/hooks/use-breadcrumb"
import { useUIStore } from "@/store/booleanStore"
import { useDossiersStore } from "@/store/useDossiersStore"
import Link from "next/link"

export function SiteHeader() {
  const breadcrumb = useBreadcrumb()
  const stats = useDossiersStore(s => s.stats);
  const isOpen = useUIStore((state) => state.isOpen);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-6 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;

          return (
            <div key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-black">
                  {item.label}
                </Link>
              ) : (
                <span className="text-black font-medium">
                  {item.label}
                </span>
              )}

              {!isLast && <span>/</span>}
            </div>
          );
        })}
      </div>
      <div className="ml-auto flex w-full items-center justify-end gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-4 mb-1.5">
          <SpotlightSearch />
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <span className="flex justify-center gap-1 font-semibold">
          Solde: {isOpen ? <span className={stats.soldeNet >= 0 ? "text-green-600" : "text-red-600"}>{
            new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
            }).format(stats.soldeNet)

          }</span> : <span >••••••</span>}
        </span>
      </div>
    </header>
  )
}