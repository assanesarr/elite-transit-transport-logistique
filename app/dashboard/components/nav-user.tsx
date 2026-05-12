"use client"

import {
    IconLogout,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { handleSignout } from "@/lib/actions"
import { useAppStore } from "@/store/useAppStore"
import { useAlertStore } from "@/store/alertStore"

export function NavUser() {
    const openAlert = useAlertStore((state) => state.open);
    const user = useAppStore((state) => state.user)
    const version = process.env.NEXT_PUBLIC_APP_VERSION;
    const appName = process.env.APP_NAME;

    const handleSignoutClick = async () => {
        if (!await openAlert({
            message: "Êtes-vous sûr de vouloir vous déconnecter ?",
            buttonText: "Se déconnecter",
        })) return;


        await handleSignout();
    }

    return (
        <SidebarMenu >
            <SidebarMenuItem >
                <SidebarMenuButton
                    onClick={handleSignoutClick}
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-slate-900 hover:bg-slate-800 hover:text-white"
                >
                    <Avatar className="h-8 w-8 rounded-lg  bg-slate-700 ">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="rounded-lg bg-slate-700 text-slate-50">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight text-slate-50 ml-2">
                        <span className="truncate font-medium">{user?.name}</span>
                        <span className="text-muted-foreground truncate text-xs">
                            {user?.email}
                        </span>
                    </div>
                    <IconLogout className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}