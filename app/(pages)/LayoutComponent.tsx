"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth, userDB } from "@/firebase.config";
import { useIsMobile } from "@/hooks/use-mobile";
import applyFont from "@/lib/apply-font";
import { cn } from "@/lib/utils";
import { setProfile } from "@/redux/slices/profile.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { UserType } from "@/types/User.type";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export function PagesLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    onAuthStateChanged(auth, async (User: User | null) => {
      if (!User) {
        router.push("/login");
      } else {
        const uid: string = User.uid;
        const docRef: DocumentReference = doc(userDB, uid);
        const docSnap: DocumentSnapshot = await getDoc(docRef);

        if (!docSnap.exists()) {
          toast.error("User profile not found. Please create a profile.");
          router.push("/login");
        }

        const user = docSnap.data() as UserType;

        const theme = user.theme ?? "default";
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `/themes/${theme}.css`;
        link.id = "theme-style";
        document.head.appendChild(link);

        dispatch(setProfile({ user: user, uid: uid }));
      }
    });
  }, [dispatch, router]);

  return (
    <main
      className={cn(
        user != null ? user.themeScope == "app" && applyFont(user.theme) : ""
      )}
    >
      <SidebarProvider
        open={!isMobile && sidebarOpen}
        defaultOpen={!isMobile && sidebarOpen}
        onOpenChange={(e) => setSidebarOpen(e)}
      >
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
            <SidebarTrigger className={cn("-ml-1", isMobile && "border")} />
            <Button
              className="rounded-full"
              size="icon"
              variant={"outline"}
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
              {theme == "light" ? <Moon /> : <Sun />}
            </Button>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
