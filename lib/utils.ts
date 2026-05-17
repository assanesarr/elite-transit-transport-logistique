import { CATEGORIES_DECAISSEMENT } from "@/app/data";
import { Dossier } from "@/app/type";
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, local = "en-US"): string {
  return date.toLocaleDateString(local, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const fmtDate = (s?: string): string => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export async function Commit(url: string, saved: any, method?: string) {
  if (!url) return //"/api/users"
  const res = await fetch(url + (saved.id ? `/${saved.id}` : ""), {
    method: method ? method : (saved.id ? "PUT" : "POST"),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...saved }),
  })
  if (!res.ok) {
    const errorData = await res.json();
    const errorMessage = errorData?.message || "Une erreur est survenue lors de l'enregistrement du personnel.";
    toast.error(errorMessage);
  }
  return await res.json();
}



export const generateFileName = () => {
  const now = new Date();

  const date = now.toISOString().split("T")[0];
  const ref = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `RAPPORT_CLIENTS_${date}_${ref}.pdf`;
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function capitalizeFirstLetter(text: string): string {
  if (text?.length === 0) return text
  return text?.charAt(0).toUpperCase() + text?.slice(1)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function authenticate() {
  // Placeholder authentication logic
  // In a real application, check cookies, headers, or session here
  const isAuthenticated = false; // Change this based on actual auth logic
  return isAuthenticated;
}

export async function saltAndHashPassword(): Promise<string> {

  return await new Promise((resolve) => {
    setTimeout(() => {
      const hashedPassword = "hashed_password_example" // Replace with actual hashing logic
      resolve(hashedPassword)
    }, 100) // Simulate async operation
  });
}

// export const formatSNPhone = (value: string) => {
//   // Sépare les numéros s'il y en a plusieurs (séparés par /, espace, virgule, etc.)
//   const numbers = value.split(/[\s\/,]+/);
  
//   // Formate chaque numéro individuellement
//   const formattedNumbers = numbers
//     .map(number => formatSingleSNPhone(number))
//     .filter(formatted => formatted !== "");
  
//   // Rejoint les numéros formatés avec " / "
//   return formattedNumbers.join(" / ");
// };

export const formatSNPhone = (value: string) => {
  // Supprime tout sauf chiffres
  let digits = value.replace(/\D/g, "");

  // Supprime le 221 si déjà saisi
  if (digits.startsWith("221")) {
    digits = digits.slice(3);
  }

  // Limite à 9 chiffres
  digits = digits.slice(0, 9);

  // Vérifie si le numéro a exactement 9 chiffres (optionnel)
  if (digits.length !== 9) {
    return "";
  }

  // Formatage: XX XXX XX XX
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);

  return `+221 ${parts.join(" ")}`;
};

export const linkClass = (path: string, pathname: string) =>
  ` rounded  transition-all ${pathname === path
    ? "bg-slate-800 text-slate-50 font-semibold shadow-sm hover:bg-slate-700 hover:text-slate-50"
    : "text-slate-400 hover:text-white hover:bg-slate-800"
  }`;

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password: string): boolean {
  // Example criteria: at least 8 characters
  return password.length >= 8
}

export function validateUsername(username: string): boolean {
  // Example criteria: alphanumeric and between 3 to 16 characters
  const regex = /^[a-zA-Z0-9]{3,16}$/
  return regex.test(username)
}

export const formatNumber = (n: number): string => {
  const units = ["", "K", "M", "B"];
  let i = 0;

  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }

  return `${parseFloat(n.toFixed(1))}${units[i]}`;
};

export const getInitials = (name: string): string => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

export function avatarColor() {
  const randomIndex = Math.floor(Math.random() * avatarColors.length);
  return avatarColors[randomIndex];
}

function generateMonths(year: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i);

    return {
      value: date.toISOString().slice(0, 7), // YYYY-MM
      label: date.toLocaleString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    };
  });
}

const getMonthsFromStartOfYear = () => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Jan
  const year = now.getFullYear();

  const months = [];

  for (let i = 0; i <= currentMonth; i++) {
    const date = new Date(year, i);

    months.push({
      value: `${year}-${String(i + 1).padStart(2, "0")}`, // 2026-04
      label: date.toLocaleString("fr-FR", { month: "short" }) // avr.
    });
  }

  return months;
};

export const getRangeLabel = () => {
  const months = getMonthsFromStartOfYear();

  const first = months[0].label;
  const last = months[months.length - 1].label;
  const year = new Date().getFullYear();

  return `${first} → ${last} ${year}`;
};


export function getMonthsUntilNow(year: number) {
  const now = new Date();

  return generateMonths(year).filter((m, i) => {
    if (year < now.getFullYear()) return true;
    return i <= now.getMonth();
  });
}

export function generatePayRef() {
  const date = new Date();

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `REF-${yyyy}${mm}${dd}-${random}`;
}


export const parseNumber = (value: any): number => {
  const n = Number(String(value).replace(/\s+/g, ""));
  return Number.isNaN(n) ? NaN : n;
};

export const required = (value: any, message: string) => {
  if (!value) throw new Error(message);
};

export const formatFormData = (formData: FormData) => {
  return Object.fromEntries(formData.entries());
};

export const success = (message: string, data?: any) => ({
  success: true,
  message,
  error: null,
  data,
});

export const fail = (message: string) => ({
  success: false,
  message,
  error: message,
});

export const getNextNumero = (dossiers: any[]) => {
  const currentYear = new Date().getFullYear();

  const numeros = dossiers
    .map(d => {
      if(!d.reference) return null
      
      const parts = d.reference.split("-");
      
      // Vérifie structure valide
      if (parts.length !== 3) return null;

      const [prefix, year, num] = parts;

      // On filtre uniquement l'année en cours
      if (prefix !== "DOS" || Number(year) !== currentYear) return null;

      return Number(num);
    })
    .filter((n): n is number => n !== null);

  const max = numeros.length ? Math.max(...numeros) : 0;

  const next = String(max + 1).padStart(3, "0");

  return `DOS-${currentYear}-${next}`;
};

export const totalPaye = (dossier: Dossier): number => {
  if (!dossier.versement || dossier.versement.length === 0) {
    return 0;
  }
  
  return dossier.versement.reduce((total, vers) => {
    return total + (vers.montant || 0);
  }, 0);
};

export const fmt = (n: number | string) => Number(n).toLocaleString("fr-FR") + " FCFA";
export const fmtM = (n: number) => (n >= 1000000 ? (n / 1000000).toFixed(2) + " M" : (n / 1000).toFixed(0) + "k") + " FCFA";
export const initials = (s: string) => s.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
export const today = new Date().toISOString().split("T")[0];
export const fmtDT = (d: any) => d ? new Date(d).toLocaleString("fr-SN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—";

// export const totalPaye = (d: Dossier) => d.versement.reduce((s, p) => s + p.montant, 0);
export const resteApayer = (d: Dossier) => (d.tva ? d.montant_total * 1.18 : d.montant_total) - totalPaye(d);
export const tauxPaiement = (d: Dossier) => d.montant_total ? Math.round((totalPaye(d) / d.montant_total) * 100) : 0;
export const totalDecaisse = (d: Dossier) => (d.payements || []).reduce((s, x) => s + Number(x.montant), 0);
export const soldeDecaisse = (d: Dossier) => totalPaye(d) - totalDecaisse(d);
export const getCatDecaiss = (key: string) => CATEGORIES_DECAISSEMENT.find(c => c.key === key) || { label: key, icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

export const isDossierSolde = (d: Dossier): boolean => {
  const totalPaiements = d.versement.reduce(
    (sum, p) => sum + p.montant,
    0
  );

  const isSold = totalPaiements >= d.montant_total
  // const isValidStatus = ["cloture", "nouveau", "annule"].includes(d.statut)

  return isSold;
};

type BLResult = {
  valid: boolean;
  formatted: string | undefined;
  error?: string;
};

/**
 * Valide et formate un numéro de Bill of Lading
 */
export function formatBLNumber(input: string): BLResult {
  if (!input) {
    return { valid: false, formatted: undefined, error: "Numéro vide" };
  }

  // Nettoyage (espaces, majuscules)
  const cleaned = input.trim().toUpperCase();

  // Regex : 4 lettres + 8 à 12 chiffres
  const regex = /^[A-Z]{4}\d{8,12}$/;

  if (!regex.test(cleaned)) {
    return {
      valid: false,
      formatted: cleaned,
      error: "Format invalide. Exemple attendu: MSCU123456789",
    };
  }

  // Extraction des parties
  const prefix = cleaned.slice(0, 4);
  const number = cleaned.slice(4);

  // Formatage lisible (optionnel)
  const formatted = `${prefix}-${number}`;

  return {
    valid: true,
    formatted,
  };
}
