
export const CHARGES_RATE = 0.22;
export const MONTHS = [
  { value: "04-2026", label: "Avril 2026" },
  { value: "03-2026", label: "Mars 2026" },
  { value: "02-2026", label: "Février 2026" },
  { value: "01-2026", label: "Janvier 2026" },
];

//"IT",
export const DEPARTEMENTS = ["Ressources humaines", "Finance", "Commercial", "Opérations"];
export const STATUTS = ["Actif", "Congé", "Période d'essai"];

export const initialEmployes = [
  { id: 1, prenom: "Aminata", nom: "Diallo", dept: "IT", poste: "Développeuse senior", salaire: 850000, statut: "Actif", date: "2021-03-15" },
  { id: 2, prenom: "Moussa", nom: "Traoré", dept: "Finance", poste: "Comptable", salaire: 620000, statut: "Actif", date: "2019-07-01" },
  { id: 3, prenom: "Fatou", nom: "Sow", dept: "Ressources humaines", poste: "Chargée RH", salaire: 480000, statut: "Congé", date: "2022-01-10" },
  { id: 4, prenom: "Ibrahima", nom: "Ba", dept: "Commercial", poste: "Responsable ventes", salaire: 750000, statut: "Actif", date: "2020-05-20" },
  { id: 5, prenom: "Mariama", nom: "Ndiaye", dept: "IT", poste: "Analyste données", salaire: 520000, statut: "Période d'essai", date: "2026-02-01" },
  { id: 6, prenom: "Ousmane", nom: "Fall", dept: "Opérations", poste: "Chef de projet", salaire: 690000, statut: "Actif", date: "2018-11-12" },
];

export const emptyForm = { prenom: "", nom: "", dept: "IT", poste: "", salaire: "", statut: "Actif", date: "" };