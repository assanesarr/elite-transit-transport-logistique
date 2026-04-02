import { NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin'

export async function DELETE(req: Request) {
  try {
    const { dossierName, versementDate } = await req.json();

    if (!dossierName || !versementDate) {
      return NextResponse.json(
        { message: "Missing params" },
        { status: 400 }
      );
    }


   const res = await adminDb.collection("dossiers")
    .where("dossierName", "==", dossierName).get();

    if (res.empty) {
      return NextResponse.json(
        { message: "Dossier not found" },
        { status: 404 }
      );
    }

    res.docs.map(doc => ({id: doc.id, ...doc.data()}))    
    .forEach(async (dossier: any) => {
        const updatedVersements = (dossier.versement || []).filter((v: any) => v.date !== versementDate);
        await adminDb.collection("dossiers")
        .doc(dossier.id)
        .update({
            versement: updatedVersements
        });
    });

    console.log('Received data:', res.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // await admin
   
    //   .collection("dossiers")
    //   .doc(dossierId)
    //   .collection("versements")
    //   .doc(versementId)
    //   .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}