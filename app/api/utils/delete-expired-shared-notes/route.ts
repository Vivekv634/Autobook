import { db, sharedNotesDB } from "@/firebase.config";
import { ShareNoteProps } from "@/redux/features/notes.features";
import { DocumentSnapshot, getDocs, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PUT(req: NextRequest) {
  try {
    const batchWriter = writeBatch(db);
    const nowTime = new Date();
    let expiredNotes = 0;
    const sharedNotesCollectionSnap = await getDocs(sharedNotesDB);

    sharedNotesCollectionSnap.forEach((docSnap: DocumentSnapshot) => {
      const docData = docSnap.data() as ShareNoteProps;
      if (docData.expirationTime > nowTime) {
        batchWriter.delete(docSnap.ref);
        expiredNotes++;
      }
    });

    await batchWriter.commit();
    return NextResponse.json(
      { res: `No. of expired notes deleted : ${expiredNotes}` },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
