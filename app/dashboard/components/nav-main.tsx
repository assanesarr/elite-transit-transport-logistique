"use client"

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import AddNewdossier from "@/components/addNewdossier"
import { usePathname, useRouter } from "next/navigation"
import { linkClass } from "@/lib/utils"
import { useDossiersStore } from "@/store/useDossiersStore"

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

  const route = useRouter();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="bg-slate-700 text-slate-50 font-semibold shadow-sm hover:bg-slate-800 hover:text-slate-50 active:bg-slate/90 active:text-slate-foreground"
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
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}