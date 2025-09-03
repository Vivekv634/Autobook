import { autoNotesDB, db, notesDB, userDB } from "@/firebase.config";
import { getNextWeekdayTimestamp } from "@/lib/autonote-timestamp-helper";
import emailBodyHelper from "@/lib/emailbodyhelper";
import {
  dayNames,
  getNextDay,
  noteTitleFormatter,
} from "@/lib/noteTitleFormatter";
import { AutoNoteType } from "@/types/AutoNote.types";
import { NoteType } from "@/types/Note.type";
import { UserType } from "@/types/User.type";
import {
  doc,
  getDocs,
  query,
  Query,
  QuerySnapshot,
  where,
  writeBatch,
} from "firebase/firestore";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";


const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID as string;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  try {
    let notesCreated: number = 0;
    const noteID_set = new Set<string>();
    const autoNotes = new Array<AutoNoteType>();
    const notesMap = new Map<string, NoteType>();
    const user_map = new Map<string, UserType>();
    const email_map = new Map<
      string,
      { note: NoteType; autonote: AutoNoteType }
    >();

    // fetch all the active autonotes
    const activeAutoNotesQuery: Query = query(
      autoNotesDB,
      where("status", "==", "active")
    );
    const activeAutoNotesQuerySnapShot: QuerySnapshot = await getDocs(
      activeAutoNotesQuery
    );

    // If no active autonotes found, return early
    if (activeAutoNotesQuerySnapShot.size == 0)
      return NextResponse.json(
        { result: "No active autonotes" },
        { status: 200 }
      );
    // Iterate through each active autonote and check if it should be created
    // based on the current day and time
    activeAutoNotesQuerySnapShot.docs.map((doc) => {
      const autonote = doc.data() as AutoNoteType;
      const currentDay = dayNames[new Date().getDay()];
      if (autonote.days.includes(currentDay) && autonote.time <= Date.now()) {
        autoNotes.push(autonote);
      }
    });

    // If no autonotes are due for creation, return early
    if (autoNotes.length === 0) {
      return NextResponse.json(
        { result: "No autonotes due for creation" },
        { status: 200 }
      );
    }
    // fetch only those notes whose note_id is present in the autonotes array
    const noteIDs = autoNotes.map((autonote) => autonote.note_id);
    const notesQuery: Query = query(notesDB, where("note_id", "in", noteIDs));
    const notesQuerySnapshot: QuerySnapshot = await getDocs(notesQuery);
    // If no notes found for the autonotes, return early
    if (notesQuerySnapshot.size === 0) {
      return NextResponse.json(
        { result: "No notes found for the autonotes" },
        { status: 200 }
      );
    }
    // Iterate through each note and store it in the notesMap
    notesQuerySnapshot.docs.map((doc) => {
      const note = doc.data() as NoteType;
      notesMap.set(note.note_id, note);
      noteID_set.add(note.note_id);
    });

    // fetch all the users whose auth_id is present in the autonotes array
    const authIDs = autoNotes.map((autonote) => autonote.auth_id);
    const usersQuery: Query = query(userDB, where("auth_id", "in", authIDs));
    const usersQuerySnapshot: QuerySnapshot = await getDocs(usersQuery);

    // Iterate through each user and store it in the user_map
    usersQuerySnapshot.docs.map((doc) => {
      const user = doc.data() as UserType;
      user_map.set(doc.id, user);
    });

    // Create a batch writer to write the autonotes and notes
    const batchWriter = writeBatch(db);

    // Iterate through each autonote and create a note for it
    for (const autonote of autoNotes) {
      // If the note_id is not present in the notesMap, skip it
      if (!noteID_set.has(autonote.note_id)) continue;

      // Create a new note based on the autonote
      const note: NoteType = {
        note_id: v4(),
        title: noteTitleFormatter(autonote.noteTitleFormat),
        body: notesMap.get(autonote.note_id)?.body || "[{}]",
        created_at: Date.now(),
        updated_at: Date.now(),
        auth_id: autonote.auth_id,
      };

      // Add the note to the batch writer
      batchWriter.set(doc(notesDB, note.note_id), note);
      notesCreated++;

      // update the autonote details like updated_at
      // update time property to the next occurrence of the day with the specified hour and minute with the helper function
      const autonoteTime = new Date(autonote.time);

      autonote.time = getNextWeekdayTimestamp(
        new Date(),
        getNextDay(autonoteTime.getDay(), autonote.days),
        autonoteTime.getHours(),
        autonoteTime.getMinutes()
      );
      autonote.created_at = Date.now();
      autonote.updated_at = Date.now();

      const email = user_map.get(autonote.auth_id)?.email;
      if (email != null) email_map.set(email, { note, autonote });

      batchWriter.set(doc(autoNotesDB, autonote.autonote_id), autonote);
    }
    const values = Array.from(email_map).map(([email, { note, autonote }]) => [
      email,
      emailBodyHelper(
        user_map.get(note.auth_id) as UserType,
        note,
        autonote
      ),
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "email database",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: JSON.parse(JSON.stringify(values)),
      },
    });

    // Commit the batch writer
    await batchWriter.commit();

    return NextResponse.json(
      { result: `${notesCreated} autonotes created successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}
