import { db, userDB } from "@/firebase.config";
import { UserSchema, UserType } from "@/types/User.type";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  runTransaction,
  Transaction,
} from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const headersList = await headers();
    const { userData }: { userData: UserType } = await request.json();
    const uid = headersList.get("uid") as string;
    let updatedUserDocument: UserType,
      updatedUserData: UserType | null = null;

    if (!uid)
      return NextResponse.json({ error: "uid not given" }, { status: 404 });

    const docRef: DocumentReference = doc(userDB, uid);
    await runTransaction(db, async (transaction: Transaction) => {
      const docSnap: DocumentSnapshot = await transaction.get(docRef);

      if (!docSnap.exists())
        return NextResponse.json(
          { error: "document not found" },
          { status: 404 }
        );

      updatedUserDocument = {
        ...(docSnap.data() as UserType),
        ...userData,
      };
      const parsedUpdatedUserDocument =
        UserSchema.safeParse(updatedUserDocument);
      if (!parsedUpdatedUserDocument.success)
        return NextResponse.json(
          { error: "can't parse updated user data" },
          { status: 400 }
        );
      transaction.update(docRef, { ...parsedUpdatedUserDocument.data });
      updatedUserData = parsedUpdatedUserDocument.data;
    });
    return NextResponse.json({ result: updatedUserData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}
