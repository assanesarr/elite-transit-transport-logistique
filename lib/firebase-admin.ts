import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { generatePayRef, isDossierSolde, parseNumber, required } from "./utils";
import { Dossier } from "@/app/type";
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
  generique: (col: string) => adminDb.collection(col),
  batch: () => adminDb.batch()
};

export const getCollection = async (col: string) => {
  const snap = await adminDb.collection(col).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// export async function createDossier({ clientId, formValues }: any) {
//   const montant = parseNumber(formValues.montant);
//   const total = parseNumber(formValues.montant_total);

//   required(total, "Montant total requis");
//   if (montant > total) throw new Error("Montant invalide");

//   const ref = db.dossiers().doc();

//   const snapshot = await adminDb.collection("dossiers").get();

//   const dossiers = snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));


//   const rf = getNextNumero(dossiers)

//   await ref.set({
//     id: ref.id,
//     clientId,
//     dossierName: formValues.dossier_name.trim().toUpperCase(),
//     reference: rf,
//     montant_total: total,
//     status: total === montant ? "PAYE" : "pending",
//     versement: [
//       {
//         montant,
//         method: formValues.payment_method,
//         date: Date.now(),
//       },
//     ],
//     createdAt: Date.now(),
//   });

//   return ref.id;
// }

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

/**
 * Dossier managers
 */
export async function createDossier({ formValues }: any) {
  const ref = db.dossiers().doc();
  const data = {
    id: ref.id,
    ...formValues,
    versement: [],
    payements: [],
    createdAt: formValues.createdAt ?? new Date().toISOString()
  }
  await ref.set(data);

  return data;
}
export async function deleteDossier(dossierId: string) {
  if (!dossierId) throw new Error("dossierId requis");

  const docRef = db.dossiers().doc(dossierId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Dossier introuvable");
  }

  const dossier = {
    id: doc.id,
    ...doc.data(),
  } as Dossier;

  // 🔴 Vérification
  if (!isDossierSolde(dossier)) {
    throw new Error(
      "Impossible de supprimer : dossier non soldé ou non clôturé"
    );
  }

  // 🟢 Suppression
  await docRef.delete();

  return {
    deleted: true,
    dossierId,
  };
}



export async function create({ formValues }: any) {
  const ref = db.generique(formValues.collection || "default").doc();

  await ref.set({
    ...formValues,
    id: ref.id,
    createdAt: Date.now(),
  });

  return ref.id;
}

export async function addPaiment({ formValues }: any) {
  const montant = parseNumber(formValues.montant);

  const snap = await db.dossiers()
    .where("id", "==", formValues.id)
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
    statut: (current + montant >= total) ? "solde" : "en_coure",
    versement: [
      ...(data.versement || []),
      {
        id: String(Date.now()),
        date: new Date().toISOString(),
        montant,
        mode: formValues.mode || "unknown",
        ref: formValues.ref || generatePayRef(),
        note: formValues.note || "",
      },
    ],
    updatedAt: Date.now(),
  });

  return data
}

export async function AddDecaissement({ formValues }: any) {


  const montant = parseNumber(formValues.montant);
  if (Number.isNaN(montant)) throw new Error("Montant invalide");
  required(formValues.payement, "Catégorie requise");


  // required(formValues.dossier_name, "Dossier requis");
  // required(formValues.agent, "Agent requis");
  const snap = await db.dossiers()
    .doc(formValues.id)
    .get();

  if (!snap.exists) throw new Error("Dossier introuvable");

  const data = snap.data();

  await snap.ref.update({
    payements: [
      ...(data?.payements || []),
      {
        id: String(Date.now()),
        date: new Date().toISOString(),
        montant,
        ref: formValues.ref || generatePayRef(),
        payement: formValues.payement,
        mode: formValues.mode || "unknown",
        // agent: formValues.agent,
        note: formValues.note || "",
      },
    ],
    updatedAt: Date.now(),
  });

  // const snap = await db.dossiers()
  //   // .where("clientId", "==", clientId)
  //   .where("id", "==", formValues.id)
  //   .get();

  // if (snap.empty) throw new Error("Dossier introuvable");

  // const doc = snap.docs[0];

  // await doc.ref.update({
  //   decaissements: [
  //     ...(doc.data().decaissements || []),
  //     {
  //       ...formValues,
  //       date: Date.now(),
  //     },
  //   ],
  //   updatedAt: Date.now(),
  // });

  return snap.data();
}

export async function deleteClientCascade(clientId: string) {
  if (!clientId) throw new Error("clientId requis");

  // 1. récupérer dossiers
  const snapshot = await db
    .dossiers()
    .where("clientId", "==", clientId)
    .get();

  if (snapshot.empty) {
    console.log("📭 Aucun dossier trouvé");

    await db.clients().doc(clientId).delete();

    return {
      deleted: true,
      dossiers: 0,
    };
  }


  const dossiers: Dossier[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Dossier[];

  // 2. vérifier soldé
  // const allSoldes = areAllDossiersSoldes(dossiers);
  const notSoldes = dossiers.filter((d) => !isDossierSolde(d));

  // if (!notSoldes) {
  //   throw new Error(
  //     "Impossible de supprimer : certains dossiers ne sont pas soldés"
  //   );
  // }
  if (notSoldes.length > 0) {
    throw new Error(
      `Impossible de supprimer : ${notSoldes.length} dossier(s) non soldé(s)`
    );
  }

  // 3. suppression batch
  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 4. supprimer client
  batch.delete(db.clients().doc(clientId));

  await batch.commit();

  return {
    deleted: true,
    dossiers: dossiers.length,
  };
}

