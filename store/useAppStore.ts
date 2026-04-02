import { create } from "zustand"

type AppState = {
  user: {
    id: string
    name: string
    avatar: string
    email: string
  } | null
  loading: boolean
  setUser: (user: AppState["user"]) => void
  setLoading: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),
  setLoading: (value) => set({ loading: value }),
}))
