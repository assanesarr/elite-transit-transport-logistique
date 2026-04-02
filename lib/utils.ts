import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, local="en-US"): string {
  return date.toLocaleDateString(local, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

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
  })  ;
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