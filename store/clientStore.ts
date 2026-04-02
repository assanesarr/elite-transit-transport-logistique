import { create } from "zustand"

type Client = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
  dossiers: any[]
}

type ClientState = {
  clients: Client[]
  setClients: (data: Client[]) => void
  reset: () => void
}

export const useClientsStore = create<ClientState>((set, get) => ({
  clients: [],
  
  setClients: (data) => {
    set({ clients: data })
  },

  reset: () => {
    set({
      clients: [],
    })
  },
}))
