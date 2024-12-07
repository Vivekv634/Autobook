'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import EditUserNameDialog from '@/app/components/EditUserNameDialog';
import VerifyEmailDialog from '@/app/components/VerifyEmailDialog';
import ChangeEmailDialog from '@/app/components/ChangeEmailDialog';
import ChangePasswordDialog from '@/app/components/ChangePasswordDialog';
import Image from 'next/image';
import { Camera, Pen, ShieldAlert, ShieldCheck } from 'lucide-react';
import { auth } from '@/firebase.config';
import ProfileImageUpdateDialog from '@/app/components/ProfileImageUpdateDialog';
import { themeColors } from '@/app/utils/pageData';

const ProfileComponent = () => {
  const { user } = useSelector((state) => state.note);
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [userNameDialog, setUserNameDialog] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [mount, setMount] = useState(false);
  const [updateImage, setUpdateImage] = useState(false);
  const [profileURL, setProfileURL] = useState();

  useEffect(() => {
    setMount(true);
  }, [mount]);

  useEffect(() => {
    if (user?.userData?.profileURL) {
      setProfileURL(user?.userData?.profileURL);
    } else {
      setProfileURL(
        `https://api.dicebear.com/9.x/lorelei/webp?seed=${user?.userData?.name ?? 'default'}`,
      );
    }
  }, [user?.userData?.name, user?.userData?.profileURL]);

  return (
    <TooltipProvider>
      <section className={cn(isDesktop && 'container')}>
        <div className="border m-2 p-2 rounded-xl flex flex-col items-center gap-2 md:max-w-72">
          <div
            className={cn(`border w-fit rounded-full mx-auto my-8 relative`)}
          >
            <div
              className={cn(
                `h-9 w-9 flex justify-center items-center cursor-pointer absolute right-1 bottom-1 z-10 rounded-full ${themeColors[user?.userData?.theme]}`,
              )}
              onClick={() => setUpdateImage((open) => !open)}
            >
              <Camera className="h-5 w-5" />
            </div>
            <Image
              src={profileURL}
              alt=""
              width={150}
              height={150}
              className="border p-1 rounded-full mx-auto aspect-square"
            />
          </div>
          <div
            className="text-2xl font-bold flex gap-1 items-center cursor-pointer"
            onClick={() => setUserNameDialog(true)}
          >
            {user?.userData?.name} <Pen className="h-4 w-4" />
          </div>
          <div className="flex gap-1 items-center mb-8">
            {auth?.currentUser?.email}
            {auth?.currentUser?.emailVerified ? (
              <Tooltip>
                <TooltipTrigger>
                  <ShieldCheck className="text-green-600 h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent>Your email is verified.</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <ShieldAlert
                    className="text-yellow-600 h-5 w-5"
                    onClick={() => setVerifyEmail(true)}
                  />
                </TooltipTrigger>
                <TooltipContent>Your email is not verified.</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <EditUserNameDialog open={userNameDialog} setOpen={setUserNameDialog} />
        <VerifyEmailDialog open={verifyEmail} setOpen={setVerifyEmail} />
        <ChangeEmailDialog open={changeEmail} setOpen={setChangeEmail} />
        <ChangePasswordDialog
          open={changePassword}
          setOpen={setChangePassword}
        />
        <ProfileImageUpdateDialog open={updateImage} setOpen={setUpdateImage} />
      </section>
    </TooltipProvider>
  );
};

export default ProfileComponent;
