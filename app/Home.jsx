'use client';
import React, { useEffect, useState } from 'react';
import '@/app/globals.css';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/redux/slices/userLoginSlice';
import Link from 'next/link';
import QuillEditor from '@/app/components/TextEditor.jsx';
import { getCookie, hasCookie } from 'cookies-next';

const HomeComponent = () => {
    const dispatch = useDispatch();
    const [cookie, setCookie] = useState(null);

    useEffect(() => {
        if (hasCookie('user-session-data')) {
            setCookie(getCookie('user-session-data'));
        }
    }, [])

    const Logout = () => {
        dispatch(logout());
        window.location.reload();
    }
    return (
        <>
            <main className='container m-auto *:p-0 *:m-0'>
                <QuillEditor />
                <section className=''>
                    {cookie && <button type="button" className='py-1 px-2 m-2 bg-slate-300 rounded' onClick={Logout}>Logout</button>}
                    <Link className='py-1 px-2 m-2 bg-slate-300 rounded' href='/register'><button>Register</button></Link>
                    <Link className='py-1 px-2 m-2 bg-slate-300 rounded' href='/login'><button>Login</button></Link>
                </section>
            </main>
        </>
    );
}

export default HomeComponent;