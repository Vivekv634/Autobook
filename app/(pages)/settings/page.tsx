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

export default function SettingsPage() {
  const { user, uid, loading } = useSelector((state: RootState) => state.user);
  const [selected, setSelected] = useState<ThemeTypes>("default");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setSelected(user ? user.theme : "default");
  }, [user]);

  const handleChange = (value: ThemeTypes) => {
    previewTheme(value);
    setSelected(value);
  };

  async function saveChanges() {
    if (!user) return null;

    toast.info("Setting theme change...");

    const dispatchResponse = await dispatch(
      updateUser({ userData: { ...user, theme: selected }, uid }),
    );
    if (dispatchResponse.meta.requestStatus == "fulfilled") {
      toast.success("Theme updated!");
    } else {
      toast.error("Something went wrong. Try again!");
    }
  }

  return (
    <section className="relative p-2 max-w-4xl mt-10 w-full mx-auto">
      <h2 className="text-4xl font-bold">Settings</h2>
      <hr className="border-2 my-2" />

      {/* app theme */}
      <section className="md:flex md:justify-between md:items-center my-7 mb-14">
        <div>
          <h3>App Theme</h3>
          <p className="text-muted-foreground">
            Select the app theme from the dropdown
          </p>
        </div>
        <div>
          <Select onValueChange={handleChange} value={selected}>
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

      {/* universal apply button */}
      <section className="absolute right-2 bottom-0">
        <ButtonLoader
          onClick={saveChanges}
          disabled={loading}
          label="Apply changes"
          loading={loading}
        />
      </section>
    </section>
  );
}
