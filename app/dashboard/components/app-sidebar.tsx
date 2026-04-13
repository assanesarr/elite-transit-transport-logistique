"use client"

import * as React from "react"
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavMain } from "@/app/dashboard/components/nav-main"
import { NavSecondary } from "@/app/dashboard/components/nav-secondary"
import { NavUser } from "@/app/dashboard/components/nav-user"
import Link from "next/link"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Suivi Clients",
            url: "/dashboard/clients",
            icon: IconUsers,
        },
        {
            title: "Comptabilité",
            url: "/dashboard/tables",
            icon: IconListDetails,
        },
        {
          title: "Charge Bureau",
          url: "/dashboard/charge-bureau",
          icon: IconChartBar,
          items: []
        },
        // {
        //   title: "Projects",
        //   url: "#",
        //   icon: IconFolder,
        // },
        
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: IconSettings,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: IconDatabase,
        },
        {
            name: "Reports",
            url: "#",
            icon: IconReport,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: IconFileWord,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    React.useEffect(() => {
        
    }, []);

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link href="#">
                                <IconInnerShadowTop className="size-5!" />
                                <span className="text-base font-semibold">ETTL</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}  />
                {/* <NavDocuments items={data.documents} /> */}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}

{/* <aside className="w-56 min-h-screen bg-slate-900 flex flex-col md:flex shrink-0">
          <div className="px-5 py-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-slate-900 font-black text-sm">T</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">TransitPro</p>
                <p className="text-slate-500 text-xs">Gestionnaire clients</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {[
              { key:"dashboard", icon:"⊞", label:"Tableau de bord" },
              { key:"dossiers",  icon:"📁", label:"Dossiers" },
              { key:"clients",   icon:"👥", label:"Clients" },
            ].map(n => (
              <button key={n.key} onClick={() => setVue(n.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  vue === n.key || (vue === "dossier_detail" && n.key === "dossiers")
                    ? "bg-amber-400 text-slate-900 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                <span className="text-base">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center text-xs text-white font-bold">MD</div>
              <div>
                <p className="text-white text-xs font-medium">Moussa Diaw</p>
                <p className="text-slate-500 text-xs">Transitaire senior</p>
              </div>
            </div>
          </div>
        </aside> */}