
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
  poste?: string;
  salaire?: number;
  statut?: string;
  createdAt: string;
}

type Employe = {
  id: string
  name: string
  email?: string
  phone?: string
  poste?: string
  statut?: string
  createdAt: Date
}

export type EmployeState = {
  employes: EMPLOYE[]
  setEmployes: (data: EMPLOYE[]) => void
  reset: () => void
}