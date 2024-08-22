'use client';
import React, { useEffect, useState } from 'react';
import { Settings, UserRound, LogOutIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { auth } from '@/firebase.config';

import { pages } from '../utils/pageData';
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';

const DesktopSidebar = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.note);
  const [userTheme, setUserTheme] = useState(false);
  const pathName = usePathname();
  const { setTheme } = useTheme();

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setUserTheme(user?.userData?.theme);
        setTheme(user?.userData?.theme ? 'dark' : 'light');
      } else {
        router.push('/login');
      }
    });
  }, [setTheme, router, user?.userData?.theme]);

  useEffect(() => {
    setTheme(userTheme ? 'dark' : 'light');
  }, [userTheme, setTheme]);

  const LogOut = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <aside className="border border-neutral-300 dark:border-neutral-700  h-screen w-full max-w-52 rounded-md p-2 border-box sticky top-0 print:hidden">
      <div className="relative h-full">
        <div className="text-center mb-4 flex flex-col">
          <Label className="text-3xl">NotesNook</Label>
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
                    className="w-full my-1"
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
        <div className="bottom-0 absolute left-0">
          <div className="flex justify-between m-1 p-1">
            <Label className="text-xl my-auto">Dark Mode</Label>
            <Switch checked={userTheme} onCheckedChange={setUserTheme} />
          </div>
          <Link href="/account/profile">
            <Button className="w-full mb-1 text-lg" variant="outline">
              <UserRound className="h-5 mx-1 my-auto" />
              Profile
            </Button>
          </Link>
          <Link href="/account/settings">
            <Button className="w-full mb-1 text-lg" variant="outline">
              <Settings className="h-5 mx-1 my-auto" />
              Settings
            </Button>
          </Link>
          <Button
            className="w-full mb-1"
            variant="destructive"
            onClick={LogOut}
          >
            <div className="flex justify-center w-full text-lg">
              <LogOutIcon className="h-5 mx-1 my-auto" />
              Logout
            </div>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
