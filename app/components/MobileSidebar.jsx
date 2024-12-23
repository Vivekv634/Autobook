'use client';
import { LogOutIcon, Menu, Settings, UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/firebase.config';
import { bgThemeColors, pages } from '../utils/pageData';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import setTheme from '../utils/theme';
import { poppins } from '@/public/fonts';
import { cn } from '@/lib/utils';
import fontClassifier from '../utils/font-classifier';

const MobileSidebar = () => {
  const { user } = useSelector((state) => state.note);
  const [profileURL, setProfileURL] = useState();
  const [name, setName] = useState('');
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setTheme(user?.userData?.theme);
        setName(user?.userData?.name);
        if (user?.userData?.profileURL) {
          setProfileURL(user?.userData?.profileURL);
        } else {
          setProfileURL(
            `https://api.dicebear.com/9.x/lorelei/webp?seed=${
              name ?? 'default'
            }`,
          );
        }
      } else {
        router.push('/login');
      }
    });
  }, [
    name,
    user?.userData?.theme,
    user?.userData?.name,
    router,
    user?.userData?.profileURL,
  ]);

  const LogOut = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <nav
      className={cn(
        bgThemeColors[user?.userData?.theme],
        'border-b flex justify-between p-2 px-4 fixed top-0 left-0 z-10 w-full',
      )}
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="px-4" aria-label="sidemenu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={poppins.className}>
          <SheetHeader className="my-10">
            <SheetTitle className="text-3xl">AutoBook</SheetTitle>
            <SheetDescription>
              Take your notes more efficiently.
            </SheetDescription>
          </SheetHeader>
          <div>
            <section>
              <div className="mt-6 flex flex-col gap-4">
                {pages.map((page, index) => {
                  return (
                    <SheetClose key={index} asChild>
                      <Link href={page.address}>
                        <Button
                          className="text-xl w-full"
                          variant={
                            page.label === 'Trash'
                              ? 'destructive'
                              : pathName.split('/')[2] === page.id
                                ? 'secondary'
                                : 'ghost'
                          }
                        >
                          {page.icon} {page.label}
                        </Button>
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              className="border rounded-full"
              src={profileURL}
              alt="@shadcn"
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn('mr-3 mt-1', fontClassifier(user?.userData?.font))}
        >
          <DropdownMenuItem>
            <Link
              className="flex justify-between text-xl w-40 items-center"
              href="/account/profile"
            >
              Profile
              <UserRound className="h-5" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              className="flex justify-between text-xl w-40 items-center"
              href="/account/settings"
            >
              Settings
              <Settings className="h-5" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={LogOut}
            className="text-red-500 flex justify-between text-xl w-full items-center"
          >
            Logout
            <LogOutIcon className="h-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default MobileSidebar;
