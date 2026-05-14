import { create } from "zustand"

export interface Cheque {
  id?: string;
  date?: string;
  banque?: string;
  numero?: string;
  destinataire?: string;
  montant: number;
  description?: string;
  valide?: boolean;
}

export interface ChequesStats {
  total: number           // Nombre total de chèques
  montantTotal: number    // Montant total
  valides: number         // Nombre de chèques validés
  enAttente: number       // Nombre de chèques en attente
  montantValide: number   // Montant des chèques validés
  montantEnAttente: number // Montant des chèques en attente
  tauxValidation: number  // Taux de validation (%)
}

interface ChequesStore {
  cheques: Cheque[]
  stats: ChequesStats
  
  // Actions principales
  setCheques: (cheques: Cheque[] | ((prev: Cheque[]) => Cheque[])) => void
  updateStats: () => void
  reset: () => void
  
  // Helpers
  getStats: () => ChequesStats
}

// Fonction pure pour calculer les stats
const calculateStats = (cheques: Cheque[]): ChequesStats => {
  const total = cheques.length;
  const montantTotal = cheques.reduce((s, c) => s + Number(c.montant || 0), 0);
  const montantValide = cheques
    .filter(c => c.valide === true)
    .reduce((s, c) => s + Number(c.montant || 0), 0);
  const montantEnAttente = cheques
    .filter(c => c.valide !== true)
    .reduce((s, c) => s + Number(c.montant || 0), 0);
  const tauxValidation = montantTotal > 0 ? (montantValide / montantTotal) * 100 : 0;

  return {
    total,
    montantTotal,
    valides: cheques.filter(c => c.valide === true).length,
    enAttente: cheques.filter(c => c.valide !== true).length,
    montantValide,
    montantEnAttente,
    tauxValidation: Math.round(tauxValidation),
  };
};

export const useChequesStore = create<ChequesStore>()(
  (set, get) => ({
      cheques: [],
      stats: {
        total: 0,
        montantTotal: 0,
        valides: 0,
        enAttente: 0,
        montantValide: 0,
        montantEnAttente: 0,
        tauxValidation: 0,
      },

      setCheques: (update) => {
        const newCheques = typeof update === 'function' 
          ? update(get().cheques) 
          : update;
        
        const stats = calculateStats(newCheques);
        
        set({ cheques: newCheques, stats });
      },

      updateStats: () => {
        const { cheques } = get();
        const stats = calculateStats(cheques);
        set({ stats });
      },

      reset: () => {
        set({ 
          cheques: [], 
          stats: calculateStats([]) 
        });
      },

      getStats: () => {
        return get().stats;
      },
    })
);