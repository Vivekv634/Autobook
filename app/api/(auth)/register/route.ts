import { auth, userDB } from "@/firebase.config";
import { UserType } from "@/types/User.type";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";
import { doc, DocumentReference, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

interface RequestDataType {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    let res;
    const { name, email, password }: RequestDataType = await req.json();
    const accountResponse = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUserRef: DocumentReference = doc(userDB, accountResponse.user.uid);
    const newUser: UserType = {
      name,
      email,
      theme: "default",
      themeScope: "editor",
    };
    await setDoc(newUserRef, newUser)
      .then(async () => {
        await sendEmailVerification(accountResponse.user).then(() =>
          console.log("Email verification send!")
        );
        res = accountResponse.user;
        console.log(res);
      })
      .catch(async (error) => {
        await deleteUser(accountResponse.user);
        return NextResponse.json(error, { status: 500 });
      });
    return NextResponse.json({ result: accountResponse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
