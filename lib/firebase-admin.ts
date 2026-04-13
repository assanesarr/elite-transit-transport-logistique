import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { generatePayRef, parseNumber, required } from "./utils";
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

export const db = {
  mouvement: () => adminDb.collection("mouvement"),
  clients: () => adminDb.collection("clients"),
  dossiers: () => adminDb.collection("dossiers"),
  users: () => adminDb.collection("users"),
  employes: () => adminDb.collection("employes"),
  chargeBureau: () => adminDb.collection("charge_bureau"),
};

export const getCollection = async (col: string) => {
  const snap = await adminDb.collection(col).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export async function createDossier({ clientId, formValues }: any) {
  const montant = parseNumber(formValues.montant);
  const total = parseNumber(formValues.montant_total);

  required(total, "Montant total requis");
  if (montant > total) throw new Error("Montant invalide");

  const ref = db.dossiers().doc();

  await ref.set({
    id: ref.id,
    clientId,
    dossierName: formValues.dossier_name.trim().toUpperCase(),
    montant_total: total,
    status: total === montant ? "paid" : "pending",
    versement: [
      {
        montant,
        method: formValues.payment_method,
        date: Date.now(),
      },
    ],
    createdAt: Date.now(),
  });

  return ref.id;
}

export async function addVersement({ clientId, formValues }: any) {
  const montant = parseNumber(formValues.montant);

  const snap = await db.dossiers()
    .where("clientId", "==", clientId)
    .where("id", "==", formValues.dossier_name)
    .get();

  if (snap.empty) throw new Error("Dossier introuvable");

  const doc = snap.docs[0];
  const data = doc.data();

  const total = data.montant_total || 0;
  const current = (data.versement || []).reduce(
    (sum: number, v: any) => sum + Number(v.montant),
    0
  );

  if (current + montant > total) {
    throw new Error("Dépassement du montant total");
  }

  await doc.ref.update({
    versement: [
      ...(data.versement || []),
      {
        montant,
        method: formValues.payment_method,
        date: Date.now(),
      },
    ],
    updatedAt: Date.now(),
  });

  return data.dossierName
}

export async function handleDecaissement(clientId: string, formValues: any) {


  const montant = parseNumber(formValues.montant);
  if (Number.isNaN(montant)) throw new Error("Montant invalide");
   required(formValues.payement, "Paiement requis");

  if (clientId === "OTHER") {
    const ref = db.chargeBureau().doc();
    ref.set({
      id: ref.id,
      ...formValues,
      ref: generatePayRef(),
      createdAt: Date.now()
    })

    return ""
  };




  required(formValues.dossier_name, "Dossier requis");
  required(formValues.agent, "Agent requis");
 
  const snap = await db.dossiers()
    .where("clientId", "==", clientId)
    .where("id", "==", formValues.dossier_name)
    .get();

  if (snap.empty) throw new Error("Dossier introuvable");

  const doc = snap.docs[0];

  await doc.ref.update({
    payements: [
      ...(doc.data().payements || []),
      {
        montant,
        payement: formValues.payement,
        date: Date.now(),
      },
    ],
    updatedAt: Date.now(),
  });

  return doc.data().dossierName
}

