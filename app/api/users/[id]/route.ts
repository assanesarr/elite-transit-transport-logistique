import { adminDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const body = await req.json()

    const { id } = await context.params; // 👈 IMPORTANT
    // console.log("Received data:", id, body);

    if (!id) {
        return NextResponse.json(
            { message: "Missing required fields " },
            { status: 400 }
        )
    }

    if (!body.name) {
        return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 }
        )
    }


    const usersRef = adminDb.collection("users").doc(id)
    .update({
        name: body.name,
    })

    // console.log('Received data:', snapshot.docs.map(doc => doc.data()));
    return NextResponse.json(
        { success: true, message: "User updated successfully" },
        { status: 200 }
    )
}