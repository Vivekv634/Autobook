"use client";
import SideMenubar from '@/app/components/Sidebar';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import React, { useEffect, useState } from 'react'


const LayoutComponent = ({ children }) => {
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, [])

    if (!mount) {
        return null
    }

    if (isDesktop) {
        return (
            <main className='flex p-1 gap-1 box-border'>
                <SideMenubar />
                <section className='w-full h-screen border border-neutral-300 rounded-md p-3'>{children}</section>
            </main>
        )
    }

    return (
        <main>
            <SideMenubar />
            <section className=''>{children}</section>
        </main>
    )
}

export default LayoutComponent;