'use client';
import { setUser } from '@/app/redux/slices/noteSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import DesktopSidebar from './DesktopSidebar';
import MobileSidebar from './MobileSidebar';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase.config';
import { useRouter } from 'next/navigation';

const Menubar = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [mount, setMount] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.note);

  useEffect(() => {
    setMount(true);
  }, [mount]);

  useEffect(() => {
    const fetchData = async (authID) => {
      const response = await axios.get(
        `${process.env.API}/api/account/user/${authID}`,
      );
      if (response?.data?.result) {
        dispatch(setUser(response?.data?.result));
      }
    };
    onAuthStateChanged(auth, (User) => {
      if (!User) {
        router.push('/login');
      } else if (mount && Object.keys(user).length == 0) {
        fetchData(User.uid);
        console.log('fetch data from sidebar page');
      }
    });
  }, [dispatch, mount, router, user]);

  if (isDesktop) {
    return <DesktopSidebar />;
  }

  return <MobileSidebar />;
};

export default Menubar;
