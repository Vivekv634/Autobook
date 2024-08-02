"use client";
import React from 'react'
import { Notebook, Hash, Star, Trash2, Clock4, FileText, Settings, UserRound, LogOutIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { deleteCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';

const pages = [
    {
        label: 'Notes',
        id: 'notes',
        address: '/dashboard/notes',
        icon: (<FileText className='h-5 my-auto mx-1' />)
    },
    {
        label: 'Notebooks',
        id: 'notebooks',
        address: '/dashboard/notebooks',
        icon: (<Notebook className='h-5 my-auto mx-1' />)
    },
    {
        label: 'Favorites',
        id: 'favorites',
        address: '/dashboard/favorites',
        icon: (<Star className='h-5 my-auto mx-1' />)
    },
    {
        label: 'Tags',
        id: 'tags',
        address: '/dashboard/tags',
        icon: (<Hash className='h-5 my-auto mx-1' />)
    },
    {
        label: 'Auto Note',
        id: 'auto-note',
        address: '/dashboard/auto-note',
        icon: (<Clock4 className='h-5 my-auto mx-1' />)
    },
    {
        label: 'Trash',
        id: 'trash',
        address: '/dashboard/trash',
        icon: (<Trash2 className='h-5 my-auto mx-1' />)
    },
]

const DesktopSidebar = () => {
    const pathName = usePathname();

    const LogOut = () => {
        deleteCookie('user-session-data');
        window.location.reload();
    }

    return (
        <aside className='border border-neutral-300 h-screen w-full max-w-52 rounded-md p-2'>
            <div className="relative h-full">
                <div className='text-center mb-4'><Label className='text-3xl'>NotesNook</Label></div>
                <div className='mt-6'>
                    <ScrollArea>
                        {pages.map((page, index) => {
                            return (
                                <Link href={page.address} key={index} className=''>
                                    <Button variant={pathName.split('/')[2] === page.id ? 'secondary' : 'ghost'} className='w-full my-1'>
                                        <div className='w-full flex text-xl p-1'>{page.icon}{page.label}</div>
                                    </Button>
                                </Link>
                            )
                        })}
                    </ScrollArea>
                </div>
                <div className="bottom-0 absolute left-0">
                    <Link href='/account/profile'>
                        <Button className='w-full mb-1 text-lg' variant='outline'>
                                <UserRound className='h-5 mx-1 my-auto' />Profile
                        </Button>
                    </Link>
                    <Link href='/account/settings'>
                        <Button className='w-full mb-1 text-lg' variant='outline'>
                                <Settings className='h-5 mx-1 my-auto' />Settings
                        </Button>
                    </Link>
                    <Button className='w-full mb-1' variant='destructive' onClick={LogOut}>
                        <div className='flex justify-center w-full text-lg'>
                            <LogOutIcon className='h-5 mx-1 my-auto' />Logout
                        </div>
                    </Button>
                </div>
            </div>
        </aside>
    )
}

export default DesktopSidebar;