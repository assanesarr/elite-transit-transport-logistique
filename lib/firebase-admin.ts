import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
// import serviceAccount from "@/ssni-a6391-firebase-adminsdk-rdgg2-886649d1f1.json";

const serviceKey = JSON.parse(process.env.FIREBASE_ADMIN_KEY as string);

export const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceKey),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })
    : getApps()[0];

export const adminDb = getFirestore(adminApp);
export const adminRtdb = getDatabase(adminApp);

