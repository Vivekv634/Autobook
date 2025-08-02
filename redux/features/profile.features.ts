import { apiInstance } from "@/axios.instance";
import { auth, userDB } from "@/firebase.config";
import { registerUserSchema, RegisterUserType } from "@/types/Register.types";
import { UserSchema, UserType } from "@/types/User.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface Props {
  email: string;
  password: string;
}

export const loginUserProfile = createAsyncThunk<
  { user: UserType; uid: string },
  Props
>("profile/loginUserProfile", async ({ email, password }: Props, thunkAPI) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(userDB, response.user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue("User not found");
    }
    return { user: docSnap.data() as UserType, uid: docSnap.data().uid };
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message.includes("invalid-credential")
          ? "Invalid Credentials"
          : error.message
        : "An error occurred"
    );
  }
});

export const registerUser = createAsyncThunk<UserCredential, RegisterUserType>(
  "profile/register",
  async (
    { name, email, password, confirmPassword }: RegisterUserType,
    thunkAPI
  ) => {
    try {
      const parsedForm = registerUserSchema.safeParse({
        name,
        email,
        password,
        confirmPassword,
      });

      if (!parsedForm.success) {
        return thunkAPI.rejectWithValue(parsedForm.error.errors[0].message);
      }

      const response = await apiInstance.post("/api/register", {
        name,
        email,
        password,
      });

      return response.data.result as UserCredential;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(
        error instanceof AxiosError
          ? error.response?.data.error.code
          : "An error occurred"
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  UserType,
  { userData: UserType; uid: string }
>("user/update", async ({ userData, uid }, thunkAPI) => {
  try {
    const parsedUserData = UserSchema.safeParse(userData);
    if (!parsedUserData.success)
      return thunkAPI.rejectWithValue(parsedUserData.error.errors[0].message);

    const apiResponse = await apiInstance.put(
      "/api/user/update",
      { userData: parsedUserData.data },
      { headers: { uid } }
    );

    return apiResponse.data.result as UserType;
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error as string);
  }
});
