"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/firebase.config";
import { cn } from "@/lib/utils";
import { setProfile } from "@/redux/slices/profile.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export function SidebarUserMenuComponent() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  if (!user)
    return (
      <div className="flex justify-start m-3">
        <Skeleton className="rounded-full h-10 w-10" />
        <div className="flex flex-col justify-center ml-3">
          <Skeleton className="w-[100px] h-3 mb-2" />
          <Skeleton className="w-[150px] h-3" />
        </div>
      </div>
    );

  return (
    <AlertDialog>
      <SidebarMenu className="px-3 pb-3">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={""} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/account");
                  }}
                >
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/settings");
                  }}
                >
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/notifications");
                  }}
                >
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm logout</AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                signOut(auth);
                dispatch(
                  setProfile({
                    user: {
                      email: "",
                      name: "",
                      theme: "default",
                      themeScope: "editor",
                    },
                    uid: "",
                  })
                );
              }}
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "cursor-pointer"
              )}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
