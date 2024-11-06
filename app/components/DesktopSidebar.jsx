'use client';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import React, { useEffect, useState } from 'react';
import { Settings, UserRound, LogOut } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/firebase.config';

import { pages } from '../utils/pageData';
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import LogOutAlertDialog from './LogOutAlertDialog';
import setTheme from '../utils/theme';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const DesktopSidebar = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.note);
  const pathName = usePathname();
  const [profileURL, setProfileURL] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setTheme(user?.userData?.theme);
        if (user?.userData?.profileURL) {
          setProfileURL(user?.userData?.profileURL);
        } else {
          setProfileURL(
            `https://api.dicebear.com/9.x/lorelei/webp?seed=${user?.userData?.name ?? 'default'}`,
          );
        }
      } else {
        router.push('/login');
      }
    });
  }, [
    router,
    user?.userData?.name,
    user?.userData?.profileURL,
    user?.userData?.theme,
  ]);

  return (
    <aside className="h-screen w-full max-w-52 border-r p-2 border-box sticky top-0 print:hidden">
      <div className="relative h-full">
        <div className="text-center mb-4 flex flex-col">
          <Label className="text-3xl font-semibold">AutoBook</Label>
          <Label className="text-[.7rem]">
            Take your notes more efficiently.
          </Label>
        </div>
        <div className="mt-6">
          <ScrollArea>
            {pages.map((page, index) => {
              return (
                <Link href={page.address} key={index} className="">
                  <Button
                    variant={
                      page.label === 'Trash'
                        ? 'destructive'
                        : pathName.split('/')[2] === page.id
                          ? 'secondary'
                          : 'ghost'
                    }
                    className="w-full my-1 font-semibold"
                  >
                    <div className="w-full flex text-xl p-1">
                      {page.icon}
                      {page.label}
                    </div>
                  </Button>
                </Link>
              );
            })}
            <ScrollBar />
          </ScrollArea>
        </div>
        <div className="bottom-0 absolute left-0 w-full">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger asChild className="w-full p-0">
                <div className="flex justify-center items-center">
                  <Avatar>
                    <AvatarImage src={profileURL} alt={user?.userData?.name} />
                  </Avatar>
                  <Label className="truncate ml-2">
                    {user?.userData?.name}
                  </Label>
                </div>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/account/profile">
                    <UserRound className="h-4 mx-1 my-auto" /> Profile
                  </Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link href="/account/settings">
                    <Settings className="h-4 mx-1 my-auto" />
                    Settings
                  </Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <LogOutAlertDialog className="text-red-600 w-full">
                    <LogOut className="h-4 mx-1 my-auto" />
                    Logout
                  </LogOutAlertDialog>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
