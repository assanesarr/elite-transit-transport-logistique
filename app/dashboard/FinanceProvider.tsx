"use client"

import { useEffect } from "react"
import { useFinanceStore } from "@/store/financeStore"
import { useAppStore } from "@/store/useAppStore"
import { User } from "./clients/components/card-user"
import { useClientsStore } from "@/store/clientStore"
import { useAgentsStore } from "@/store/agentStore"
import { EMPLOYE } from "../type"
import { useEmployesStore } from "@/store/useEmployesStore"

export default function FinanceProvider({ 
  children, 
  initialData, 
  user,
  clients,
  agents,
  employes
 }: { children: React.ReactNode, initialData: any[], user: any, clients?: any[], agents?: any[], employes?: EMPLOYE[] }) {
  const setMouvements = useFinanceStore((state) => state.setMouvements)
  const setUsers = useAppStore((state) => state.setUser)
  const setClients = useClientsStore((state) => state.setClients)
  const setAgents = useAgentsStore((state) => state.setAgents)
  const setEmployes = useEmployesStore((state) => state.setEmployes)

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
    if(employes){
      setEmployes(employes)
    }
  }, [initialData, user, employes])

  return <>{children}</>
}
