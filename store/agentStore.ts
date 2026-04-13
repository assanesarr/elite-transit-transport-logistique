import { create } from "zustand"

type Agent = {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: Date
}

type AgentState = {
  agents: Agent[]
  setAgents: (data: Agent[]) => void
  reset: () => void
}

export const useAgentsStore = create<AgentState>((set, get) => ({
  agents: [],
  
  setAgents: (data) => {
    set({ agents: data })
  },

  reset: () => {
    set({
      agents: [],
    })
  },
}))
