import { db, sharedNotesDB } from "@/firebase.config";
import { NoteType } from "@/types/Note.type";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  runTransaction,
} from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RequestProps = {
  note: NoteType;
  day: string;
};

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const uid = headersList.get("uid");
    const { note, day }: RequestProps = await req.json();

    if (!uid || !note || !day) {
      return NextResponse.json(
        { error: "uid or note or day is not found" },
        { status: 404 },
      );
    }
    let URL: string = "";
    const daysToLive = parseInt(day);
    const expirationTime = new Date(
      Date.now() + daysToLive * 24 * 60 * 60 * 1000,
    );

    if (typeof daysToLive != "number" || !expirationTime) {
      return NextResponse.json({ error: "can't parse days" }, { status: 500 });
    }

    const sharedDocRef: DocumentReference = doc(sharedNotesDB, note.note_id);

    await runTransaction(db, async (transaction) => {
      const noteSnap: DocumentSnapshot = await transaction.get(sharedDocRef);
      if (noteSnap.exists()) {
        return NextResponse.json(
          { error: "Note already shared" },
          { status: 400 },
        );
      }

      const transactionResponse = transaction.set(sharedDocRef, {
        note,
        expirationTime,
      });

      if (transactionResponse) {
        URL = `${process.env.NEXT_PUBLIC_API}/dashboard/share/${note.note_id}`;
      } else {
        return NextResponse.json(
          { error: "Failed to generate link" },
          { status: 500 },
        );
      }
    });

    return NextResponse.json(
      { URL, sharedNote: note, expirationTime },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
