'use client';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TagsComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const [notesDocID, setNotesDocID] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      const cookie = JSON.parse(getCookie('user-session-data'));
      setNotesDocID(cookie.userDoc.notesDocID);
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div>
      {console.log(notesDocID)}
      TagsComponent
    </div>
  );
};

export default TagsComponent;

