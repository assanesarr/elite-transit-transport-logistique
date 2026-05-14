"use client"

import { useEffect } from "react"
import { useFinanceStore } from "@/store/financeStore"
import { useAppStore } from "@/store/useAppStore"
import { useClientsStore } from "@/store/clientStore"
import { useAgentsStore } from "@/store/agentStore"
import { Dossier, EMPLOYE } from "../type"
import { useEmployesStore } from "@/store/useEmployesStore"
import { useDossiersStore } from "@/store/useDossiersStore"
import EncaissementDialog from "@/components/EncaissementDialog"
import { AlertDialogView } from '@/components/alertDialogView';
import AddDecaissement from '@/components/addDecaissement'
import AddNewdossier from "@/components/addNewdossier"
import { useChequesStore } from "@/store/useChequesStore"

export default function FinanceProvider({
  children,
  user,
  clients,
  agents,
  employes,
  dossiers,
  cheques
}: { children: React.ReactNode, user: any, clients?: any[], agents?: any[], employes?: EMPLOYE[], dossiers: Dossier[], cheques: any[] }) {
  const setUsers = useAppStore((state) => state.setUser)
  const setClients = useClientsStore((state) => state.setClients)
  const setAgents = useAgentsStore((state) => state.setAgents)
  const setEmployes = useEmployesStore((state) => state.setEmployes)
  const setDossiers = useDossiersStore(s => s.setDossiers)
  const setCheques = useChequesStore((state) => state.setCheques)


  useEffect(() => {
    // setMouvements(initialData)
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
    if (cheques) {
      setCheques(cheques)
    }
  }, [// initialData,
    user, employes, dossiers, cheques])

  return <>
    {children}
    <EncaissementDialog />
    <AddDecaissement />
    <AlertDialogView />
    <AddNewdossier />
  </>
}
