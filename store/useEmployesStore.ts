import { EmployeState } from "@/app/type"
import { create } from "zustand"



export const useEmployesStore = create<EmployeState>((set, get) => ({
  employes: [],
  
  setEmployes: (data) => {
    set({ employes: data })
  },

  reset: () => {
    set({
      employes: [],
    })
  },
}))
