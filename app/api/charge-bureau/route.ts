import { adminDb, db, handleDecaissement } from "@/lib/firebase-admin";
import { generatePayRef, parseNumber, success } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json()

    const r = await handleDecaissement(body.clientId, body)

    const docRef = await db.mouvement().add({
        ...body,
        mois: body.mois, // ? `${body.annee}-${String(body.mois).padStart(2, "0")}` : undefined,
        montant: parseNumber(body.montant),
        // clientName: client.data()?.name || "",
        ref: generatePayRef(),
        createdAt: Date.now(),
    });
    const docSnap = await docRef.get()

    // return ;

    console.log('Received data:', body);
    return NextResponse.json(
        success("Mouvement ajouté", {
            id: docRef.id,
            ...docSnap.data()
        }),
        { status: 200 }
    )
}