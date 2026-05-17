
export type STATECARD = {
  label: string,
  value: string,
  sub: string,
  accent: string
}

export type EMPLOYE = {
  id: string;
  name: string;
  email?: string;
  phone?: string
  dept?: string;
  role?: string;
  poste?: string;
  salaire?: number;
  statut?: string;
  createdAt: string;
}

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
  dossiers: Dossier[]
}

// export type Employe = {
//   id: string
//   name: string
//   email?: string
//   phone?: string
//   poste?: string
//   statut?: string
//   createdAt: Date
// }

export type EmployeState = {
  employes: EMPLOYE[]
  setEmployes: (data: EMPLOYE[]) => void
  reset: () => void
}
export type Stats = {
  total: number
  paye: number
  reste: number
  totalDecaiss: number
  soldeNet: number
  enCours: number
  urgents: number
  aTraiter: number
}

export type DossiersState = {
  dossiers: Dossier[]
  isOpenDos: boolean;
  setIsOpenDos: (b: boolean) => void;

  // 🔥 soit tu utilises le getter
  readonly stats: Stats
  setDossiers: (data: Dossier[] | ((prev: Dossier[]) => Dossier[])) => void
  // setDossiers: (data: Dossier[]) => void
  reset: () => void
}

export type Dossier = {
  id: string;
  tva?: boolean;
  dossierName?: string;
  reference: string;
  clientId: string;
  type?: string;
  description?: string;
  dateOuverture?: string;
  dateEcheance?: string;
  priorite?: string;
  responsable?: string;
  port?: string;
  bl?: string;
  montant_total: number;
  montant_paye?: number;
  versement: {
    date: string;
    montant: number;
    method: string;
    mode?: string;
    ref?: string;
  }[];
  payements: {
    date: string;
    montant: number;
    ref?: string;
    method?: string;
    mode?: string; 
    payement: string; //categorie 
    note?: string;
  }[];
  statut: "nouveau" | "attente_doc" | "en_cours" | "cloture" | "solde"
  createdAt: string;
  prestations: {
    label?: string;
    montant?: number;
  }[];

}