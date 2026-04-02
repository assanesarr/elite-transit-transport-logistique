import { adminDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()

    const dossierRef = adminDb.collection("dossiers")
        .where("clientId", "==", body.clientId)

       

    const snapshot = await dossierRef.get();


    // console.log('Received data:', snapshot.docs.map(doc => doc.data()));
    return NextResponse.json(
        snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})),
        { status: 200 }
    )
}