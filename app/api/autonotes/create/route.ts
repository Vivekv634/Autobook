import { autoNotesDB } from "@/firebase.config";
import { AutoNoteSchema, AutoNoteType } from "@/types/AutoNote.types";
import { doc, DocumentReference, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { autonote }: { autonote: AutoNoteType } = await req.json();

    const parsedAutoNoteData = AutoNoteSchema.safeParse(autonote);
    if (!parsedAutoNoteData.success) {
      console.error("AutoNote validation failed:", parsedAutoNoteData?.error);
      return NextResponse.json(
        { error: parsedAutoNoteData.error.errors[0].message },
        { status: 400 }
      );
    }

    const DocRef: DocumentReference = doc(
      autoNotesDB,
      parsedAutoNoteData.data.autonote_id
    );
    await setDoc(DocRef, parsedAutoNoteData.data);

    return NextResponse.json(
      { result: parsedAutoNoteData.data },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
