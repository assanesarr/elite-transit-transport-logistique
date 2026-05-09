import { adminDb, deleteDossier } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()

    const dossierRef = adminDb.collection("dossiers")
        .where("clientId", "==", body.clientId)
       
    const snapshot = await dossierRef.get();
    return NextResponse.json(
        snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})),
        { status: 200 }
    )
}

export async function DELETE(req: Request) {
    try {
        const { dossierId } = await req.json();

        if (!dossierId) {
            return NextResponse.json(
                { message: "Missing params" },
                { status: 400 }
            );
        }

        await deleteDossier(dossierId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}