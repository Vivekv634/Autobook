"use client";
import React from 'react';
import './globals.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/slices/userLoginSlice';
import Link from 'next/link';
import QuillEditor from './components/TextEditor';

export default function Home() {
  const { isAuthenticated } = useSelector(state => state.userLogin);
  const dispatch = useDispatch();
  return (
    <>
      <main className='container m-auto *:p-0 *:m-0'>
        <QuillEditor />
        <section className=''>
          {isAuthenticated && <button type="button" className='py-1 px-2 m-2 bg-slate-300 rounded' onClick={() => dispatch(logout())}>Logout</button>}
          <Link className='py-1 px-2 m-2 bg-slate-300 rounded' href='/register'><button>Register</button></Link>
          <Link className='py-1 px-2 m-2 bg-slate-300 rounded' href='/login'><button>Login</button></Link>
        </section>
      </main>
    </>
  );
}