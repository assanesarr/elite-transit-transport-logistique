import { NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin'

export async function DELETE(req: Request) {
  try {
    const { dossierId, payementDate } = await req.json();

    // console.log("Received data:", { dossierId, payementDate });

    if (!dossierId || !payementDate) {
      return NextResponse.json(
        { message: "Missing params" },
        { status: 400 }
      );
    }


   const res = await adminDb.collection("dossiers")
    .where("id", "==", dossierId)
    .get();

    if (res.empty) {
      return NextResponse.json(
        { message: "Dossier not found" },
        { status: 404 }
      );
    }

    res.docs.map(doc => ({id: doc.id, ...doc.data()}))    
    .forEach(async (dossier: any) => {
        const updatedPayement = (dossier.payements || []).filter((v: any) => v.date !== payementDate);
        await adminDb.collection("dossiers")
        .doc(dossier.id)
        .update({
            payements: updatedPayement
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