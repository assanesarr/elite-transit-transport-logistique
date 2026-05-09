// @ts-nocheck
import { useState } from "react"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react"
import EncaissementDialog from "./EncaissementDialog"
import DecaissementDialog from "./DecaissementDialog"
import ShowRecu from "@/app/dashboard/components/show-recu"

// Composant principal
export function DialogSaisis() {
    const [openEncaissement, setOpenEncaissement] = useState(false)
    const [openDecaissement, setOpenDecaissement] = useState(false)
    const [openRecu, setOpenRecu] = useState(false)
    const [recuData, setRecuData] = useState(null)

    const handleSuccess = (data: any) => {
        setRecuData(data?.data)
        setOpenRecu(true)
    }

    return (
        <>
            <ShowRecu 
                open={openRecu} 
                setOpen={setOpenRecu} 
                recu={recuData} 
            />
            
            <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                    tooltip="Nouvel encaissement"
                    className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    onClick={() => setOpenEncaissement(true)}
                >
                    <BanknoteArrowUp className="w-4 h-4" />
                    <span>Encaissement</span>
                </SidebarMenuButton>
                
                <SidebarMenuButton
                    tooltip="Nouveau décaissement"
                    className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    onClick={() => setOpenDecaissement(true)}
                >
                    <BanknoteArrowDown className="w-4 h-4" />
                    <span>Décaissement</span>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <EncaissementDialog 
                open={openEncaissement}
                onOpenChange={setOpenEncaissement}
                onSuccess={handleSuccess}
            />

            <DecaissementDialog 
                open={openDecaissement}
                onOpenChange={setOpenDecaissement}
                onSuccess={handleSuccess}
            />
        </>
    )
}