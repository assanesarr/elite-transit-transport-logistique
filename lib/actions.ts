'use server'

import { adminDb } from "@/lib/firebase-admin";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export type FormState = {
    success: boolean
    message: string
    error: string | null
    data?: any
}

export async function loadMouvement() {
    const snap = await adminDb.collection("mouvement").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function loadClient() {
    const snap = await adminDb.collection("clients").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function LoginSubmit(prevState: FormState | null, formData: FormData): Promise<FormState> {

    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            throw new Error("Email and password are required.");
        }

        console.log("Attempting to sign in with email:", email, "and password:", password);

        await signIn("credentials", {
            identifier: email,
            password: password,
            redirect: false,
            callbackUrl: "/dashboard",
        });

        return { success: true, message: "Login successful.", error: null };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Les identifiants ne correspond pas a nos enregistrement.", error: (error as any)?.message || "An error occurred during login." };
    }

}

export async function deleteItem(prevState: FormState | null, formData: FormData) {

    const itemId = formData.get("id") as string;

    await adminDb.collection("mouvement").doc(itemId).delete();

    revalidatePath("/dashboard/tables");
    return { success: true, message: "history deleted successfully.", error: null }
}

export async function addMouvement(prevState: FormState | null, formData: FormData): Promise<FormState> {

    try {

        const formValues = { ...Object.fromEntries(formData.entries()) };
        if (!formValues.montant) return { success: false, message: "Le montant est obligatoire", error: "Le montant est obligatoire" };


        const clientId = formValues.clients as string;
        const mode = formValues.mode as string;
        const normalizedName = (formValues.dossier_name as string).trim().toUpperCase();
        const payment_method = formValues.payment_method
        if (!normalizedName) return { success: false, message: "Le dossier est obligatoire pour un client", error: "Le dossier est obligatoire pour un client" }
        if (!payment_method) return { success: false, message: "Method de paiement est obligatoire pour un client", error: "Le method de p[aiement est obligatoire pour un client" }
        // const clientId = formData.get("clients") as string;
        if (!clientId) return { success: false, message: "Le Client est obligatoire", error: "Le Client est obligatoire" };




        if (formValues.type === "encaissement") {

            if (mode === "NOUVEAU") {
                if (!mode) return { success: false, message: "Le mode de paiement est obligatoire", error: "Le mode de paiement est obligatoire" }

                const netPaye = Number((formValues.montant_total as string).replace(/\s+/g, ""))
                const montant = Number((formValues.montant as string).replace(/\s+/g, ""))

                if (Number.isNaN(montant)) return { success: false, message: "Montant invalide ", error: "Montant invalide" }
                if (Number.isNaN(netPaye)) return { success: false, message: "NetPaye invalide ", error: "Montant invalide" }



                if (!netPaye) return { success: false, message: "Montant total requis pour les nouveaux dossiers", error: "Montant total requis pour les nouveaux dossiers" };
                if (montant > netPaye) return { success: false, message: "Montant doit être inférieur ou égal au montant total pour les nouveaux dossiers", error: "Montant doit être inférieur ou égal au montant total pour les nouveaux dossiers" };

                // const normalizedName = dossierName.trim().toLowerCase().replace(/\s+/g, '-');
                const dossierRef = adminDb.collection("dossiers")
                    .where("clientId", "==", clientId)
                    .where("dossierName", "==", formValues.dossier_name as string);


                const resps = await dossierRef.get();

                if (!resps.empty) { throw new Error("Un dossier avec ce nom existe déjà pour ce client."); } // const last = resps.docs.length > 0 ? resps.docs[resps.docs.length - 1].data().dossierRef : 0;

                // const next = last + 1;
                // const formatted = String(next).padStart(3, "0");
                const ref = adminDb.collection("dossiers").doc();


                if (!normalizedName) return { success: false, message: "Le nom du dossier est requis pour les nouveaux dossiers.", error: "Le nom du dossier est requis pour les nouveaux dossiers." };

                formValues.dossier_name = normalizedName;
                // const normalizedName = normalizedName.concat(`-${normalizedName + 1}`);

                console.log("Number of existing dossiers for this client:", ref.id);
                await ref.set({
                    id: ref.id,
                    clientId: clientId,
                    dossierName: normalizedName,
                    montant_total: netPaye,
                    status: netPaye === montant ? "paid" : "pending",
                    versement: [
                        {
                            montant: montant,
                            method: formData.get("payment_method") as string,
                            date: Date.now(),
                        },
                    ],
                    mode: formData.get("mode") as string,
                    createdAt: Date.now(),
                });

            } else if (mode === "ACOMPTE") {

                // Adding versement to existing dossier 
                const dossierId = formData.get("dossier_name") as string;
                const dossierRef = adminDb.collection("dossiers")
                    .where("clientId", "==", clientId)
                    .where("id", "==", dossierId);

                const snapshot = await dossierRef.get();
                if (!snapshot.empty) {
                    const dossierDoc = snapshot.docs[0];
                    const versement = dossierDoc.data().versement || [];
                    const totalVersement = versement.reduce((sum: number, v: any) => Number(sum) + (Number(v.montant) || 0), 0);

                    const montant = Number((formValues.montant as string).replace(/\s+/g, ""))

                    if (Number.isNaN(montant)) return { success: false, message: "Montant invalide ", error: "Montant invalide" }

                    const montantTotal = dossierDoc.data().montant_total || "0";
                    //   const netPaye = Number((formValues.montant_total as string).replace(/\s+/g, ""))

                    if (Number(totalVersement) + Number(montant) > Number(montantTotal)) {
                        return { success: false, message: "Le montant total des versements ne peut pas dépasser le montant total du dossier.", error: "Le montant total des versements ne peut pas dépasser le montant total du dossier." };
                    }
                    versement.push({
                        montant: montant,
                        method: formData.get("payment_method") as string,
                        date: Date.now(),
                    });

                    await adminDb.collection("dossiers").doc(dossierDoc.id).update({
                        versement: versement,
                        updatedAt: Date.now(),
                    });
                }
            }
        } else if (formValues.type === "decaissement") {
            const clientId = formValues.clients as string;
            if (!clientId) return { success: false, message: "Le Client est obligatoire", error: "Le Client est obligatoire" };

            const dossierId = formValues.dossier_name as string;
            const payement = formValues.payement as string;
            const montant = (formValues.montant as string).replace(/\s+/g, "");
            const agent = formValues.agent as string;

            if (!dossierId) return { success: false, message: "Dossier ID is required for decaissement", error: "Dossier ID is required for decaissement" };
            if (!payement) return { success: false, message: "Le type de payement est requis pour les décaissements", error: "Le type de payement est requis pour les décaissements" };
            if (!montant) return { success: false, message: "Le montant est requis pour les décaissements", error: "Le montant est requis pour les décaissements" };
            if (!agent) return { success: false, message: "L'agent est obligatoire", error: "L'agent est obligatoire" }
            if (Number.isNaN(Number(montant))) return { success: false, message: "Montant invalide ", error: "Montant invalide" }

            const dossierRef = adminDb.collection("dossiers")
                .where("clientId", "==", clientId)
                .where("id", "==", dossierId);

            const snapshot = await dossierRef.get();
            if (!snapshot.empty) {
                const dossierDoc = snapshot.docs[0];
                const payements = dossierDoc.data().payements || [];


                payements.push({
                    montant: montant,
                    payement: payement,
                    date: Date.now(),
                });

                await adminDb.collection("dossiers")
                    .doc(dossierDoc.id)
                    .update({
                        payements: payements,
                        updatedAt: Date.now(),
                    });
            }

            // Handle decaissement logic if needed TODO
        }

        // formValues.dossier_name = normalizedName;
        if (formValues.type === "decaissement" || mode === "ACOMPTE") {
            const ds = await adminDb.collection("dossiers")
                .where("clientId", "==", clientId)
                .where("id", "==", formValues.dossier_name as string)
                .get()
                .then((snapshot) => {
                    if (!snapshot.empty) {
                        return snapshot.docs[0].data();
                    }
                    return null;
                });

            formValues.dossier_name = ds?.dossierName;
            if (!formValues.dossier_name) return { success: false, message: "Le dossier est obligatoire pour un client", error: "Le dossier est obligatoire pour un client" }

            // console.log("Dossier data for decaissement/acompte:", formValues);
            // return { success: true, message: "decaissement added successfully.", error: null };
        }

        const snap = await adminDb.collection("clients").doc(clientId).get();
        formValues.clientName = snap.data()?.name || "";
        formValues.montant = (formValues.montant as string).replace(/\s+/g, "")


        const docRef = await adminDb.collection("mouvement").add({
            ...formValues,
            createdAt: Date.now(),
        });

        // 🔥 Get inserted document
        const docSnap = await docRef.get()
        // if (docSnap.exists) {
        //     console.log("Inserted data:", docSnap.data())
        // }

        revalidatePath("/dashboard/tables");
        revalidatePath("/dashboard/clients");
        revalidatePath("/dashboard");
        return { success: true, message: "Mouvement added successfully.", error: null, data: { id: docRef.id, ...docSnap.data() } };

    } catch (error) {
        console.error("Error adding mouvement:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred.",
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred.",
        }; // Rethrow the error to be caught by the caller
    }

}

export async function handleSignout(formData: FormData) {
    await signOut()
}

export async function addClient(prevState: FormState | null, formData: FormData): Promise<FormState> {

    // console.log("Form data received in addClient:", prevState); // Log the form data to see if it's being received correctly

    try {
        if (!formData.get("name")) {
            return { success: false, message: "Le nom du client est obligatoire.", error: "Le nom du client est obligatoire." };
        }
        const dossierRef = adminDb.collection("clients")
            .where("name", "==", formData.get("name") as string);

        const values = {
            name: formData.get("name") as string,
            // role: formData.get("role") as string,
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            // avatar: formData.get("avatar") as string,
        };
        const resps = await dossierRef.get();

        if (!resps.empty) { throw new Error("Un client avec ce nom existe déjà."); }

        await adminDb.collection("clients").add({
            ...values,
            createdAt: Date.now(),
        });

        revalidatePath("/dashboard/clients");
        return { success: true, message: "Client added successfully.", error: null };
    } catch (error) {
        console.error("Error adding client:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred.", error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
}

export async function updateClient(formData: FormData) {

    try {
        const clientId = formData.get("id") as string;
        if (!clientId) return { success: false, message: "Client ID is required", error: "Client ID is required" };

        const values = {
            name: formData.get("name") as string,
            // role: formData.get("role") as string,
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            // avatar: formData.get("avatar") as string,
            updatedAt: Date.now(),
        };

        await adminDb.collection("clients").doc(clientId).update(values);

        revalidatePath("/dashboard/clients");
        return { success: true, message: "Client updated successfully.", error: null };
    } catch (error) {
        console.error("Error updating client:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred.", error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
}

export async function deleteClient(clientId: string) {
    try {
        const res = await adminDb.collection("mouvement").where("clients", "==", clientId).get()
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    adminDb.collection("mouvement").doc(doc.id).delete();
                });
            });
        await adminDb.collection("dossiers").where("clientId", "==", clientId).get()
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    adminDb.collection("dossiers").doc(doc.id).delete();
                });
            });
        await adminDb.collection("clients").doc(clientId).delete();

        revalidatePath("/dashboard/clients");

        return { success: true, message: "Client supprimé avec succès.", error: null }
    } catch (error) {
        console.error("Error deleting client:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred.", error: error instanceof Error ? error.message : "An unknown error occurred." }
    }
}


export async function addUser(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    if (!email) return { success: false, message: "Email is required.", error: "Email is required." };
    if (!name) return { success: false, message: "Name is required.", error: "Name is required." };

    const usersRef = adminDb.collection("users");


    const docId = await adminDb.runTransaction(async (transaction) => {
        // 1) Vérifier si email existe déjà
        const q = usersRef.where("email", "==", email);
        const snapshot = await transaction.get(q);

        if (!snapshot.empty) return null

        const rq = usersRef.where("name", "==", name);
        const snap = await transaction.get(rq)

        if (!snap.empty) return null

        // 2) Ajouter l’utilisateur
        const docRef = usersRef.doc();
        transaction.set(docRef, { ...Object.fromEntries(formData.entries()), createdAt: Date.now() });

        return docRef.id;
    });

    if (!docId) {
        return { success: false, message: "Failed to add user. L'adresse e-mail ou le nom existe déjà.", error: "Failed to add user." };
    }


    revalidatePath("/dashboard/settings");
    return { success: true, message: "User added successfully.", error: null };
}

export async function updateUser(prevState: FormState | null, formData: FormData) {
    const id = formData.get("id");
    const name = formData.get("name") as string;
    if (!id) return { success: false, message: "User ID is required.", error: "User ID is required." };
    if (!name) return { success: false, message: "Name is required.", error: "Name is required." };

    // update DB
    await adminDb.collection("users").doc(id as string).update({ name });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "User updated successfully.", error: null };
}

export async function deleteUser(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const userId = formData.get("id") as string;
    if (!userId) return { success: false, message: "User ID is required.", error: "User ID is required." };
    // await adminDb.collection("users").where("email", "==", formData.get("email"))
    const usersRef = adminDb.collection("users").doc(userId);
    const list = await adminDb.collection("users").get().then((snapshot) => {

        return snapshot.docs.filter((doc) => (doc.data().role === "admin" && { id: doc.id, ...doc.data() }) as
            { id: string; name: string; role: string; email: string });
    });

    const u = await usersRef.get()
    // if (list.length === 1 ) return;

    const data = u.data();
    if (list.length === 1 && data?.role === "ADMIN") return { success: false, message: "At least one admin user is required.", error: "At least one admin user is required." };


    await usersRef.delete();
    revalidatePath("/dashboard/settings");
    return { success: true, message: "User deleted successfully.", error: null };
}

