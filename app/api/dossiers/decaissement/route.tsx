import { AddDecaissement, db } from "@/lib/firebase-admin";
import { fail, required, success } from "@/lib/utils";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const body = await req.json()

    try {
        required(body.id, "Le dossier est requis");

        await AddDecaissement({ formValues: body });

        return NextResponse.json(success("Mouvement ajouté", {}), { status: 201 });

    } catch (e: any) {
        return NextResponse.json({ ...fail(e.message) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { dossierId, decaissementId } = await req.json();

        if (!dossierId || !decaissementId) {
            return NextResponse.json(
                { message: "Missing params" },
                { status: 400 }
            );
        }


        const res = await db.dossiers()
            .where("id", "==", dossierId)
            .get();

        if (res.empty) {
            return NextResponse.json(
                { message: "Dossier not found" },
                { status: 404 }
            );
        }

        res.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .forEach(async (dossier: any) => {
                const updatedDecaissement = (dossier.payements || []).filter((v: any) => v.date !== decaissementId);
                await db.dossiers()
                    .doc(dossier.id)
                    .update({
                        payements: updatedDecaissement
                    });
            });


        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}