"use client"

import { useEffect } from "react"
import { useFinanceStore } from "@/store/financeStore"
import { useAppStore } from "@/store/useAppStore"
import { User } from "./clients/components/card-user"
import { useClientsStore } from "@/store/clientStore"
import { useAgentsStore } from "@/store/agentStore"
import { Dossier, EMPLOYE } from "../type"
import { useEmployesStore } from "@/store/useEmployesStore"
import { useDossiersStore } from "@/store/useDossiersStore"
import EncaissementDialog from "@/components/EncaissementDialog"
import { useModalStore } from "@/store/modal/paiement"
import { AlertDialogView } from '@/components/alertDialogView';
import AddDecaissement from '@/components/addDecaissement'
import AddNewdossier from "@/components/addNewdossier"

export default function FinanceProvider({
  children,
  initialData,
  user,
  clients,
  agents,
  employes,
  dossiers
}: { children: React.ReactNode, initialData: any[], user: any, clients?: any[], agents?: any[], employes?: EMPLOYE[], dossiers: Dossier[] }) {
  const setMouvements = useFinanceStore((state) => state.setMouvements)
  const setUsers = useAppStore((state) => state.setUser)
  const setClients = useClientsStore((state) => state.setClients)
  const setAgents = useAgentsStore((state) => state.setAgents)
  const setEmployes = useEmployesStore((state) => state.setEmployes)
  const setDossiers = useDossiersStore(s => s.setDossiers)
  const {isOpen, close} = useModalStore()

  useEffect(() => {
    setMouvements(initialData)
    if (user) {
      setUsers(user)
    }
    if (clients) {
      setClients(clients)
    }
    if (agents) {
      setAgents(agents)
    }
    if (employes) {
      setEmployes(employes)
    }
    if (dossiers) {
      setDossiers(dossiers)
    }
  }, [initialData, user, employes, dossiers])

  return <>
    {children}
    <EncaissementDialog
      open={isOpen}
      onOpenChange={close}
      // onSuccess={handleSuccess}
    />
    <AddDecaissement />
       <AlertDialogView />
       <AddNewdossier />
  </>
}
