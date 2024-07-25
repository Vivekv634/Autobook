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
    <div className='container m-auto'>
      <QuillEditor />
      {isAuthenticated ?
        <div>
          <button type="button" onClick={() => dispatch(logout())}>Logout</button>
          <Link href='/login'>Login</Link>
          <Link href='/register'>Register</Link>
        </div>
        :
        <div>
          <Link href='/register'>Register</Link>
          <Link href='/login'>Login</Link>
        </div>}
    </div>
  );
}