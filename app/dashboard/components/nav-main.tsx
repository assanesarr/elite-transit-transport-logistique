"use client"

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { linkClass } from "@/lib/utils"
import { useDossiersStore } from "@/store/useDossiersStore"
import { useChequesStore } from "@/store/useChequesStore"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[],
}) {
  const setIsOpen = useDossiersStore((state) => state.setIsOpenDos);
 const  nbAttente  = useChequesStore(s => s.stats.enAttente);
  const route = useRouter();
  const pathname = usePathname();

  // const nbAttente = 1;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 font-medium "
              onClick={() => {
                console.log("Add new dossier");
                setIsOpen(true);
              }}
            >
              <IconCirclePlusFilled />
              <span>Ajouter un dossier</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={linkClass(item.url, pathname)}
                tooltip={item.title}
                onClick={() => route.push(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.url === "/dashboard/suivi-cheques" && nbAttente > 0 && (
                  <span className="bg-red-500 text-slate-50 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-5 text-center ml-auto">{nbAttente}</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}