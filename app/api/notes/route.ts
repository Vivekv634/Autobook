import { notesDB } from "@/firebase.config";
import { NoteType } from "@/types/Note.type";
import {
  DocumentSnapshot,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const headersList = await headers();
    const uid = headersList.get("uid");
    const notes: NoteType[] = [];

    const q = query(notesDB, where("auth_id", "==", uid));
    const querySnapShot: QuerySnapshot = await getDocs(q);

    querySnapShot.forEach((docSnapShot: DocumentSnapshot) => {
      notes.push(docSnapShot.data() as NoteType);
    });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
