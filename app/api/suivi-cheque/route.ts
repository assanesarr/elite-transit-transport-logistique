import { db } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formValues = await req.json()
  const ref = db.generique('suiviCheques').doc();
  const data = {
    id: ref.id,
    ...formValues,
    createdAt: formValues.createdAt ?? new Date().toISOString()
  }
  await ref.set(data);

  return NextResponse.json(
    data,
    { status: 200 }
  )
}

export async function PUT(req: Request) {
  const formValues = await req.json()
  const { editId, valide } = formValues

  if (!editId) return NextResponse.json({}, { status: 400 })

  if (valide) {
    await db.generique('suiviCheques').doc(editId)
      .update({
        valide,
        validatAt: Date.now(),
        updatedAt: Date.now(),
      });
    return NextResponse.json({}, { status: 200 })
  }

  await db.generique('suiviCheques').doc(editId)
    .update({
      ...formValues,
      updatedAt: Date.now(),
    });

  return NextResponse.json({}, { status: 200 })
}

export async function DELETE(req: Request) {
  try {
    const { deletedId } = await req.json();

    if (!deletedId) {
      return NextResponse.json(
        { message: "Missing params" },
        { status: 400 }
      );
    }

    // ignore-listed
    await db.generique('suiviCheques')
      .doc(deletedId)
      .delete()


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

