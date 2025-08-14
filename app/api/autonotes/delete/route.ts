import { autoNotesDB, db } from "@/firebase.config";
import { AutoNoteType } from "@/types/AutoNote.types";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  runTransaction,
  Transaction,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { user_id, autonote_id }: { user_id: string; autonote_id: string } =
      await req.json();
    let autonoteToBeDeleted: AutoNoteType | null = null;

    if (!user_id || !autonote_id)
      return NextResponse.json(
        { error: "missing required parameters" },
        { status: 404 }
      );

    const docRef: DocumentReference = doc(autoNotesDB, autonote_id);

    await runTransaction(db, async (transaction: Transaction) => {
      const docSnap: DocumentSnapshot = await transaction.get(docRef);
      if (!docSnap.exists())
        return NextResponse.json(
          { error: "document not found" },
          { status: 404 }
        );

      autonoteToBeDeleted = docSnap.data() as AutoNoteType;
      if (autonoteToBeDeleted.auth_id != user_id)
        return NextResponse.json(
          { error: "user_id didn't match." },
          { status: 400 }
        );

      transaction.delete(docRef);
    });
    return NextResponse.json({ result: autonoteToBeDeleted }, { status: 200 });
  } catch (error) {
    console.error(error as string);
    return NextResponse.json({ error }, { status: 500 });
  }
}
