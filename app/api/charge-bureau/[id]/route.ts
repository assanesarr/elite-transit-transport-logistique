import { NextResponse } from "next/server";
import { db } from '@/lib/firebase-admin'

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; 
  try {
   await db.chargeBureau().doc(id).delete()
   
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}