'use client';
import { Menu, Settings, LogOutIcon, UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
// import { Switch } from '@/components/ui/switch';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/firebase.config';
import { pages } from '../utils/pageData';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import setTheme from '../utils/theme';

const MobileSidebar = () => {
  const { user } = useSelector((state) => state.note);
  const [name, setName] = useState('');
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setTheme(user?.userData?.theme);
        setName(user?.userData?.name);
      } else {
        router.push('/login');
      }
    });
  }, [name, user?.userData?.theme, user?.userData?.name, router]);

  const LogOut = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="border-b flex justify-between p-2 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="p-3" aria-label="sidemenu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="">
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
              src={`https://ui-avatars.com/api/?background=random&name=${name}`}
              alt="@shadcn"
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-3 mt-1">
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
