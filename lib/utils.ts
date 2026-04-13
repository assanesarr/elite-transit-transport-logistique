import { clsx, type ClassValue } from "clsx"
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