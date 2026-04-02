// lib/firebase.ts (client SDK)
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCGly3bIjSeL1At6NbTdTSTudCwlrliyXc",
//   authDomain: "ssni-a6391.firebaseapp.com",
//   projectId: "ssni-a6391",
//   storageBucket: "ssni-a6391.firebasestorage.app",
//   messagingSenderId: "1068207516264",
//   appId: "1:1068207516264:web:751b6ba14ff606b22ca9dd",
//   measurementId: "G-967ZE7PHCC"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);


export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const rtdb = getDatabase(app);
// export const analytics = getAnalytics(app);
