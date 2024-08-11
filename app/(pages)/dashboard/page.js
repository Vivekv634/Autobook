"use client"
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const { user } = useSelector(state => state.userLogin);
    const router = useRouter();

    useEffect(() => {
        if (hasCookie('user-session-data')) {
            const cookie = JSON.parse(getCookie('user-session-data'))
            const homePage = cookie.userDoc.defaultHomePage;
            router.push(`/dashboard/${homePage}`);
        } else {
            router.push('/login');
        }
    }, [user, router]);

    return (
        <main className='flex justify-center items-center h-screen text-3xl'>Redirecting...</main>
    )
}

export default Dashboard;