// store/clientStore.ts
import { Client } from '@/app/type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ClientsStore {
  clients: Client[];
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void;
  
  // Nouvelles méthodes pour des mises à jour ciblées
  addPaiementToDossier: (clientId: string, dossierId: string, paiement: any) => void;
  updateDossierStatut: (clientId: string, dossierId: string, statut: "nouveau" | "attente_doc" | "en_cours" | "cloture" | "solde") => void;
  deletePaiementFromDossier: (clientId: string, dossierId: string, paiementId: string) => void;
  updateDossierDecaissement: (clientId: string, dossierId: string, decaissement: any, isAdding: boolean) => void;
  deleteDossierFromClient: (clientId: string, dossierId: string) => void;
  
  // Flag pour contrôler le refresh global
  shouldRefreshGlobal: boolean;
  setShouldRefreshGlobal: (value: boolean) => void;
}

export const useClientsStore = create<ClientsStore>()(
  devtools((set, get) => ({
    clients: [],
    shouldRefreshGlobal: true, // Par défaut, on refresh globalement
    
    setClients: (clients) => {
      if (typeof clients === 'function') {
        set(state => ({ clients: clients(state.clients) }));
      } else {
        set({ clients });
      }
    },
    
    setShouldRefreshGlobal: (value) => set({ shouldRefreshGlobal: value }),
    
    addPaiementToDossier: (clientId, dossierId, paiement) => {
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? {
                ...client,
                dossiers: client.dossiers.map(dossier =>
                  dossier.id === dossierId
                    ? { 
                        ...dossier, 
                        versement: [...dossier.versement, paiement],
                        // Mettre à jour le montant_paye si nécessaire
                        montant_paye: (dossier.montant_paye || 0) + paiement.montant
                      }
                    : dossier
                )
              }
            : client
        )
      }));
    },
    
    updateDossierStatut: (clientId, dossierId, statut) => {
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? {
                ...client,
                dossiers: client.dossiers.map(dossier =>
                  dossier.id === dossierId
                    ? { ...dossier, statut }
                    : dossier
                )
              }
            : client
        )
      }));
    },
    
    deletePaiementFromDossier: (clientId, dossierId, paiementId) => {
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? {
                ...client,
                dossiers: client.dossiers.map(dossier => {
                  if (dossier.id === dossierId) {
                    const paiementToDelete = dossier.versement.find((p: any) => p.date === paiementId);
                    const newVersements = dossier.versement.filter((p: any) => p.date !== paiementId);
                    return {
                      ...dossier,
                      versement: newVersements,
                      montant_paye: (dossier.montant_paye || 0) - (paiementToDelete?.montant || 0)
                    };
                  }
                  return dossier;
                })
              }
            : client
        )
      }));
    },
    
    updateDossierDecaissement: (clientId, dossierId, decaissement, isAdding) => {
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? {
                ...client,
                dossiers: client.dossiers.map(dossier =>
                  dossier.id === dossierId
                    ? {
                        ...dossier,
                        payements: isAdding 
                          ? [...(dossier.payements || []), decaissement]
                          : (dossier.payements || []).filter((d: any) => d.date !== decaissement.date)
                      }
                    : dossier
                )
              }
            : client
        )
      }));
    },
    
    deleteDossierFromClient: (clientId, dossierId) => {
      set(state => ({
        clients: state.clients.map(client =>
          client.id === clientId
            ? {
                ...client,
                dossiers: client.dossiers.filter((dossier: any) => dossier.id !== dossierId)
              }
            : client
        )
      }));
    }
  }))
);