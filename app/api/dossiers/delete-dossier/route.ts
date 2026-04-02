import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";



export async function DELETE(req: Request) {
       try {
    const { dossierId } = await req.json();

    if (!dossierId) {
        return NextResponse.json(
            { message: "Missing params" },
            { status: 400 }
        );
    }

    // ignore-listed
    await adminDb.collection("dossiers")
        .doc(dossierId)
        .delete()

    // console.log('Received data:', res.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // await admin

    //   .collection("dossiers")
    //   .doc(dossierId)
    //   .collection("versements")
    //   .doc(versementId)
    //   .delete();

    // revalidatePath("/dashboard/clients")

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error(error);

        return NextResponse.json(
          { message: "Server error" },
          { status: 500 }
        );
      }
}