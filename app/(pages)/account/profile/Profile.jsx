'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Pen, ShieldAlert, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { auth } from '@/firebase.config';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import EditUserNameDialog from '@/app/components/EditUserNameDialog';
import VerifyEmailDialog from '@/app/components/VerifyEmailDialog';
import ChangeEmailDialog from '@/app/components/ChangeEmailDialog';
import { Button } from '@/components/ui/button';
import ChangePasswordDialog from '@/app/components/ChangePasswordDialog';

const ProfileComponent = () => {
  const { user } = useSelector((state) => state.note);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [userNameDialog, setUserNameDialog] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, [mount]);

  return (
    <TooltipProvider>
      <section className={cn(isDesktop && 'container')}>
        <div className={cn(isDesktop && 'border rounded-md', 'p-2 mt-2 mx-1')}>
          <Label className="text-2xl font-bold">My Profile</Label>
          <div className="bg-muted p-3 rounded-md my-3 flex justify-start gap-3 items-center">
            {mount && user?.userData?.name && (
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?background=random&name=${user.userData.name}`}
                  alt={`${user.userData.name}`}
                />
              </Avatar>
            )}
            <div className="my-auto">
              <div
                className="text-2xl font-bold flex gap-1 items-center cursor-pointer"
                onClick={() => setUserNameDialog(true)}
              >
                {user?.userData?.name} <Pen className="h-4 w-4" />
              </div>
              <div className="flex gap-1 items-center">
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
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Label className="font-bold text-lg block">Email</Label>
              <Label className="text-muted-foreground">
                Change your email account.
              </Label>
            </div>
            <Button onClick={() => setChangeEmail(true)}>Change Email</Button>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <div>
              <Label className="font-bold text-lg block">Change Password</Label>
              <Label className="text-muted-foreground">
                Change your account password.
              </Label>
            </div>
            <Button onClick={() => setChangePassword(true)}>
              Change Password
            </Button>
          </div>
        </div>
        <EditUserNameDialog open={userNameDialog} setOpen={setUserNameDialog} />
        <VerifyEmailDialog open={verifyEmail} setOpen={setVerifyEmail} />
        <ChangeEmailDialog open={changeEmail} setOpen={setChangeEmail} />
        <ChangePasswordDialog
          open={changePassword}
          setOpen={setChangePassword}
        />
      </section>
    </TooltipProvider>
  );
};

export default ProfileComponent;
