import { adminDb, createDossier, db } from '@/lib/firebase-admin'
import { getNextNumero, parseNumber } from '@/lib/utils';
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const formValues = await req.json()

    const snapshot = await createDossier({formValues})
    // const ref = db.dossiers().doc();
    // const rf = getNextNumero(dossiers)
    // const snapshot = {
    //     id: ref.id,
    //     ...formValues,
    //     versement: [],
    //     payements: [],
    //     createdAt: Date.now(),
    // }
    // await ref.set(snapshot);
    // const dossierRef = adminDb.collection("dossiers")
    //     .where("clientId", "==", body.clientId)



    // const snapshot = await dossierRef.get();


    // console.log('Received data:', snapshot.docs.map(doc => doc.data()));
    return NextResponse.json(
        snapshot,
        { status: 200 }
    )
}

// await createDossier({ clientId, formValues });