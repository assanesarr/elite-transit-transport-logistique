
import { DossiersState } from "@/app/type"
import { totalDecaisse, totalPaye } from "@/lib/utils"
import { create } from "zustand"



export const useDossiersStore = create<DossiersState>((set, get) => ({
  dossiers: [],
  isOpenDos: false,
  stats: {
    total: 0,
    paye: 0,
    reste: 0,
    totalDecaiss: 0,
    soldeNet: 0,
    enCours: 0,
    urgents: 0,
    aTraiter: 0,
  },

  setIsOpenDos: (b: boolean) => set({ isOpenDos: b }),
  setDossiers: (update) => {
     // Si update est une fonction, l'appeler avec l'état actuel des dossiers
  const dossiers = typeof update === 'function' 
    ? update(get().dossiers)  // get() donne accès à l'état actuel
    : update;
    
    const total = dossiers.reduce((s, d) => s + Number(d.montant_total), 0)
    const paye = dossiers.reduce((s, d) => s + totalPaye(d), 0)
    const totalDecaiss = dossiers.reduce((s, d) => s + totalDecaisse(d), 0)

    const reste = total - paye
    const soldeNet = paye - totalDecaiss

    const enCours = dossiers.filter(
      (d) => !["cloture", "annule"].includes(d.statut)
    ).length

    const urgents = dossiers.filter(
      (d) =>
        d.priorite === "urgente" &&
        !["cloture", "annule"].includes(d.statut)
    ).length

    const aTraiter = dossiers.filter((d) =>
      ["nouveau", "attente_doc"].includes(d.statut)
    ).length

    set({
      dossiers,
      stats: {
        total,
        paye,
        reste,
        totalDecaiss,
        soldeNet,
        enCours,
        urgents,
        aTraiter,
      },
    })
  },

  reset: () => {
    set({
      dossiers: [],
    })
  },
}))
