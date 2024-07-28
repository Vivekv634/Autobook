"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const { user } = useSelector(state => state.userLogin);
    const router = useRouter();

    useEffect(() => {
        if (user && user.userDoc.defaultHomePage) {
            router.push(`/dashboard/${user.userDoc.defaultHomePage}`);
        } else {
            router.push('/login');
        }
    }, [user, router]);

    return (
        <main className='flex justify-center items-center h-screen bg-[#222831] text-[#EEE] text-xl'>Redirecting...</main>
    )
}

export default Dashboard;