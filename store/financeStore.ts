import { create } from "zustand"

type Mouvement = {
  id: string
  type: "encaissement" | "decaissement"
  montant: number
  createdAt: string
  agent?: string
  numero_cheque?: string
  payement?: string
}

type FinanceState = {
  mouvements: Mouvement[]
  totalDebit: number
  totalCredit: number
  solde: number

  setMouvements: (data: Mouvement[]) => void
  calculateTotals: () => void
  reset: () => void
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  mouvements: [],
  totalDebit: 0,
  totalCredit: 0,
  solde: 0,

  setMouvements: (data) => {
    set({ mouvements: data })
    get().calculateTotals()
  },

  calculateTotals: () => {
    const { mouvements } = get()

    let totalDebit = 0
    let totalCredit = 0

    mouvements.forEach((m) => {
      if (m.type === "decaissement") {
        totalDebit += Number(m.montant)
      }

      if (m.type === "encaissement") {
        totalCredit += Number(m.montant)
      }
    })

    set({
      totalDebit,
      totalCredit,
      solde: totalCredit - totalDebit,
    })
  },

  reset: () => {
    set({
      mouvements: [],
      totalDebit: 0,
      totalCredit: 0,
      solde: 0,
    })
  },
}))
