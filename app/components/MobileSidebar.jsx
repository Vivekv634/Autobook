'use client';
import { Menu, Settings, LogOutIcon, UserRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sheet,
  SheetFooter,
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

const MobileSidebar = () => {
  const { user } = useSelector((state) => state.note);
  const [userTheme, setUserTheme] = useState(false);
  const [name, setName] = useState('');
  const { setTheme } = useTheme();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setUserTheme(user?.userData?.theme);
        setTheme(user?.userData?.theme ? 'dark' : 'light');
        setName(user?.userData?.name);
      } else {
        router.push('/login');
      }
    });
  }, [setTheme, name, user?.userData?.theme, user?.userData?.name, router]);

  useEffect(() => {
    setTheme(userTheme ? 'dark' : 'light');
  }, [userTheme, setTheme]);

  const LogOut = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="border-b flex justify-between p-2 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="p-3">
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
            <SheetFooter className="mt-6">
              <div className="flex justify-between m-1 p-1">
                <Label className="text-xl my-auto">Dark Mode</Label>
                <Switch checked={userTheme} onCheckedChange={setUserTheme} />
              </div>
            </SheetFooter>
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
