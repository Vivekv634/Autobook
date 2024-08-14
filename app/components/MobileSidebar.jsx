'use client';
import {
  Hash,
  StickyNote,
  Star,
  Trash2,
  Menu,
  Clock4,
  Settings,
  LogOutIcon,
  UserRound,
  Book,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import { Switch } from '@/components/ui/switch';
import { usePathname } from 'next/navigation';
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

const pages = [
  {
    label: 'Notes',
    id: 'notes',
    address: '/dashboard/notes',
    icon: <StickyNote className="h-5" />,
  },
  {
    label: 'Notebooks',
    id: 'notebooks',
    address: '/dashboard/notebooks',
    icon: <Book className="h-5" />,
  },
  {
    label: 'Favorites',
    id: 'favorites',
    address: '/dashboard/favorites',
    icon: <Star className="h-5" />,
  },
  {
    label: 'Tags',
    id: 'tags',
    address: '/dashboard/tags',
    icon: <Hash className="h-5" />,
  },
  {
    label: 'Auto Note',
    id: 'auto-note',
    address: '/dashboard/auto-note',
    icon: <Clock4 className="h-5" />,
  },
  {
    label: 'Trash',
    id: 'trash',
    address: '/dashboard/trash',
    icon: <Trash2 className="h-5" />,
  },
];

const MobileSidebar = () => {
  const [userTheme, setUserTheme] = useState(false);
  const [name, setName] = useState('');
  const [fallbackName, setFallbackName] = useState('');
  const { setTheme } = useTheme();
  const pathName = usePathname();

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      const cookie = JSON.parse(getCookie('user-session-data'));
      setUserTheme(cookie?.userDoc?.dark_theme);
      setTheme(cookie?.userDoc?.dark_theme ? 'dark' : 'light');
      setName(cookie.userDoc.name);
      const temp = name
        .split(' ')
        .map((word) => word.substring(0, 1))
        .reduce((accumulator, currentValue) => accumulator + currentValue);
      setFallbackName(temp);
    }
  }, [setTheme, name]);

  useEffect(() => {
    setTheme(userTheme ? 'dark' : 'light');
  }, [userTheme, setTheme]);

  const LogOut = () => {
    deleteCookie('user-session-data');
    window.location.reload();
  };

  return (
    <nav className="border-b flex justify-between p-2 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={`https://source.boringavatars.com/beam/120/${name}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`}
              alt="@shadcn"
            />
            <AvatarFallback>{fallbackName}</AvatarFallback>
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="p-3">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="">
          <SheetHeader className="my-10">
            <SheetTitle className="text-3xl">NotesNook</SheetTitle>
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
    </nav>
  );
};

export default MobileSidebar;
