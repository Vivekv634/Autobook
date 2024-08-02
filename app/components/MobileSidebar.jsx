"use client"
import { Hash, StickyNote, Star, Trash2, Menu, Clock4, Settings, LogOutIcon, UserRound, Book } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import { Switch } from '@/components/ui/switch';
import { usePathname } from 'next/navigation';


const pages = [
    {
        label: 'Notes',
        address: '/dashboard/notes',
        icon: (<StickyNote className='h-5' />)
    },
    {
        label: 'Notebooks',
        address: '/dashboard/notebooks',
        icon: (<Book className='h-5' />)
    },
    {
        label: 'Favorites',
        address: '/dashboard/favorites',
        icon: (<Star className='h-5' />)
    },
    {
        label: 'Tags',
        address: '/dashboard/tags',
        icon: (<Hash className='h-5' />)
    },
    {
        label: 'Auto Note',
        address: '/dashboard/auto-note',
        icon: (<Clock4 className='h-5' />)
    },
    {
        label: 'Trash',
        address: '/dashboard/trash',
        icon: (<Trash2 className='h-5' />)
    },
]


const MobileSidebar = () => {
    const [isDark, setIsDark] = useState(false);
    const [name, setName] = useState('');
    const [fallbackName, setFallbackName] = useState('');
    const { setTheme } = useTheme();
    const pathName = usePathname();

    useEffect(() => {
        setTheme(isDark ? 'dark' : 'light');
        if (hasCookie('user-session-data')) {
            const cookie = JSON.parse(getCookie('user-session-data'));
            setName(cookie.userDoc.name);
            const temp = name.split(' ').map(word => word.substring(0, 1)).reduce((accumulator, currentValue) => accumulator + currentValue);
            setFallbackName(temp);
        }
    }, [isDark, setTheme, name]);

    const LogOut = () => {
        deleteCookie('user-session-data');
        window.location.reload();
    }

    return (
        <nav className='border-b flex justify-between p-2 px-4'>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline"><Menu /></Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className='text-3xl'>NotesNook</DrawerTitle>
                        <DrawerDescription>Take your notes more efficiently.</DrawerDescription>
                    </DrawerHeader>
                    <section className='my-8 space-y-8 mx-1'>
                        <div>
                            <Label className='text-xl mx-1'>Travel Between Pages</Label>
                            <ScrollArea className='border w-auto rounded-md overflow-x-auto p-1 m-1'>
                                <div className='flex scroll'>
                                    {pages.map((page, index) => {
                                        return (
                                            <Link href={page.address} key={index}>
                                                <Button className='text-lg w-fit mr-1' variant={`${page.label === 'Trash' ? 'destructive' : pathName.split('/')[2] === page.id ? 'secondary' : 'outline'}`}>
                                                    {page.icon} {page.label}
                                                </Button>
                                            </Link>
                                        )
                                    })}
                                </div>
                                <Scrollbar orientation='horizontal' />
                            </ScrollArea>
                        </div>
                        <div className='flex justify-between m-1 p-1'>
                            <Label className='text-xl my-auto'>Toggle Themes</Label>
                            <Switch checked={isDark} onCheckedChange={setIsDark} />
                        </div>
                        <DrawerClose className='w-full'>
                            <Button variant='outline' className='w-full'>Close</Button>
                        </DrawerClose>
                    </section>
                </DrawerContent>
            </Drawer>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={`https://source.boringavatars.com/beam/120/${name}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`} alt="@shadcn" />
                        <AvatarFallback>{fallbackName}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mr-3 mt-1'>
                    <DropdownMenuItem><Link className='flex justify-between text-xl w-40 items-center' href='/account/profile'>Profile<UserRound className='h-5' /></Link></DropdownMenuItem>
                    <DropdownMenuItem><Link className='flex justify-between text-xl w-40 items-center' href='/account/settings'>Settings<Settings className='h-5' /></Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={LogOut} className='text-red-500 flex justify-between text-xl w-full items-center'>Logout<LogOutIcon className='h-5' /></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}

export default MobileSidebar;