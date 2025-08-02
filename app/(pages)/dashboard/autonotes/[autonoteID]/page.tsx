"use client";
import { RootState } from "@/redux/store";
import { AutoNoteType } from "@/types/AutoNote.types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AutoNoteComponent({}) {
  const pathName = usePathname();
  const { autonotes } = useSelector((state: RootState) => state.autonote);
  const [autonote, setAutonote] = useState<AutoNoteType | null>(null);

  useEffect(() => {
    if (autonotes.length > 0) {
      setAutonote(
        autonotes.find((note: AutoNoteType) =>
          pathName.includes(note.autonote_id)
        ) || null
      );
    }
  }, [autonotes, pathName]);

  return (
    <div>
      {autonote && (
        <div>
          <h2>{autonote.title}</h2>
        </div>
      )}
    </div>
  );
}
