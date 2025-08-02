import { autoNotesDB } from "@/firebase.config";
import { AutoNoteType } from "@/types/AutoNote.types";
import { getDocs, query, QuerySnapshot, where } from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const headersList = await headers();
    const uid = headersList.get("uid");
    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const q: QuerySnapshot = await getDocs(
      query(autoNotesDB, where("auth_id", "==", uid))
    );

    if (q.empty) {
      return NextResponse.json({ result: [] }, { status: 200 });
    }
    const autonotes = q.docs.map((doc) => doc.data() as AutoNoteType);

    return NextResponse.json({ result: autonotes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
