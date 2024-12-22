"use client";
import Menubar from "../../components/Sidebar";
import { useMediaHook } from "@/app/utils/mediaHook";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import GlobalSearchDialog from "@/app/components/GlobalSearchDialog";
import { useSelector } from "react-redux";
import fontClassifier from "@/app/utils/font-classifier";

const LayoutComponent = ({ children }) => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [mount, setMount] = useState(false);
  const { user } = useSelector((state) => state.note);
  let userFont = null, FONT;
  if (user && user?.userData) {
    userFont = user?.userData?.font;
    FONT = fontClassifier(userFont);
  }

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <main
      className={cn(
        !isDesktop && "h-screen",
        isDesktop && "flex gap-1",
        FONT,
      )}
    >
      <GlobalSearchDialog />
      <Menubar />
      <section
        className={cn(
          !isDesktop && "mt-14",
          isDesktop && "w-full h-screen p-3 border-box overflow-auto",
        )}
      >
        {children}
      </section>
    </main>
  );
};

export default LayoutComponent;
