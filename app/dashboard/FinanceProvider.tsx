"use client"

import { useEffect } from "react"
import { useFinanceStore } from "@/store/financeStore"
import { useAppStore } from "@/store/useAppStore"
import { User } from "./clients/components/card-user"
import { useClientsStore } from "@/store/clientStore"
import { useAgentsStore } from "@/store/agentStore"

export default function FinanceProvider({ 
  children, 
  initialData, 
  user,
  clients,
  agents,
 }: { children: React.ReactNode, initialData: any[], user: any, clients?: any[], agents?: any[] }) {
  const setMouvements = useFinanceStore((state) => state.setMouvements)
  const setUsers = useAppStore((state) => state.setUser)
  const setClients = useClientsStore((state) => state.setClients)
  const setAgents = useAgentsStore((state) => state.setAgents)

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
  }, [initialData, user])

  return <>{children}</>
}
