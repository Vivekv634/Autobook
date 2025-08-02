import { sharedNotesDB } from "@/firebase.config";
import { ShareNoteProps } from "@/redux/features/notes.features";
import { NoteType } from "@/types/Note.type";
import {
  getDocs,
  query,
  Query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const headersList = await headers();
    const auth_id = headersList.get("auth_id");
    const sharedNotes: ShareNoteProps[] = [];

    if (auth_id == null) {
      return NextResponse.json(
        { error: "auth_id is not found" },
        { status: 404 },
      );
    }

    const q: Query = query(sharedNotesDB, where("note.auth_id", "==", auth_id));

    const querySnapshot: QuerySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data() as { note: NoteType; expirationTime: Date };
      sharedNotes.push({
        expirationTime: data.expirationTime,
        sharedNote: data.note,
        URL: `${process.env.NEXT_PUBLIC_API}/dashboard/share/${data.note.note_id}`,
      });
    });

    return NextResponse.json({ sharedNotes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
