"use client";

import { previewTheme, THEMES } from "@/lib/apply-theme";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUser } from "@/redux/features/profile.features";
import { ThemeTypes } from "@/types/Theme.types";
import { toast } from "sonner";
import ButtonLoader from "@/components/app/ButtonLoader";
import { APIInput } from "@/components/app/APIInput";
import { Separator } from "@/components/ui/separator";
import { responseType, UserType } from "@/types/User.type";

const ResponseTypes: responseType[] = ["concise", "balanced", "detailed"];

export default function SettingsPage() {
  const { user, uid, loading } = useSelector((state: RootState) => state.user);

  const [userData, setUserData] = useState<UserType | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleChange = (value: ThemeTypes) => {
    previewTheme(value);
    if (userData) {
      setUserData({ ...userData, theme: value });
    }
  };

  async function saveChanges() {
    if (!user) return null;

    toast.info("updating changes...");

    const dispatchResponse = await dispatch(
      updateUser({
        userData: {
          ...user,
          ...userData,
        },
        uid,
      })
    );
    if (dispatchResponse.meta.requestStatus == "fulfilled") {
      toast.success("Changes updated!");
    } else {
      toast.error("Something went wrong. Try again!");
    }
  }

  if (userData == null) return null;

  return (
    <section className="relative p-2 max-w-4xl mt-10 w-full mx-auto">
      <h2 className="text-4xl font-bold">Settings</h2>
      <p className="text-muted-foreground">
        Always save changes before leaving.
      </p>
      <hr className="border-2 my-2" />

      {/* General settings section */}
      <section className="my-10">
        <section className="md:flex md:justify-between md:items-center">
          <div>
            <h3 className="text-lg font-semibold">App Theme</h3>
            <p className="text-muted-foreground">
              Select the app theme from the dropdown
            </p>
          </div>
          <div>
            <Select onValueChange={handleChange} value={userData.theme}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(THEMES).map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>
      </section>

      <Separator className="border" />

      {/* LLM settings section */}
      <section className="my-10 mb-24">
        <h2 className="text-2xl font-bold mb-2">Gemini settings</h2>
        <section className="md:flex md:justify-between md:items-center mb-7">
          <div>
            <h3 className="text-lg font-semibold">Gemini API key</h3>
            <p className="text-muted-foreground">
              Upload your Gemini API key for max privacy and full control.
            </p>
          </div>
          <div>
            <APIInput
              className="pr-10"
              value={userData.gemini_api_key}
              onChange={(e) =>
                setUserData({ ...userData, gemini_api_key: e.target.value })
              }
            />
          </div>
        </section>

        <section className="md:flex md:justify-between md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Gemini response</h3>
            <p className="text-muted-foreground">
              Select the type of response you want Gemini to generate the
              content.
            </p>
          </div>
          <div>
            <Select
              value={userData.responseType}
              onValueChange={(e) =>
                setUserData({ ...userData, responseType: e as responseType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ResponseTypes.map((r, i) => {
                  return (
                    <SelectItem key={i} value={r}>
                      {r[0].toUpperCase() + r.slice(1)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </section>
      </section>

      <section className="absolute right-2 bottom-0">
        <ButtonLoader
          onClick={saveChanges}
          disabled={loading || userData == user}
          label="Apply changes"
          loading={loading}
          loadingLabel={"Applying changes..."}
        />
      </section>
    </section>
  );
}
