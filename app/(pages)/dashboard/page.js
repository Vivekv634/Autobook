'use client';
import { setUser } from '@/app/redux/slices/noteSlice';
import { auth } from '@/firebase.config';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.note);
  const router = useRouter();
  const dispatch = useDispatch();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, [mount]);

  useEffect(() => {
    const fetchData = async (authID) => {
      const response = await axios.get(
        `${process.env.API}/api/account/user/${authID}`,
      );
      if (response?.data?.result) {
        dispatch(setUser(response.data.result));
        router.push(
          `/dashboard/${response.data.result.userData.defaultHomePage}`,
        );
      }
    };
    onAuthStateChanged(auth, (User) => {
      if (User) {
        if (mount) {
          if (Object.keys(user).length == 0) {
            fetchData(User.uid);
            console.log('fetch data from dashbaord page');
          }
        }
      } else {
        console.log('logged out');
        router.push('/login');
      }
    });
  }, [user, router, dispatch, mount]);

  return (
    <main className="flex justify-center items-center h-screen text-3xl">
      Loading...
    </main>
  );
};

export default Dashboard;
