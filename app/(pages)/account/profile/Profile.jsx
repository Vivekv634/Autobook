'use client';
import {
  LogOut,
  User,
  Camera,
  ShieldAlert,
  ShieldCheck,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EditUserNameDialog from '@/app/components/EditUserNameDialog';
import VerifyEmailDialog from '@/app/components/VerifyEmailDialog';
import ChangeEmailDialog from '@/app/components/ChangeEmailDialog';
import ChangePasswordDialog from '@/app/components/ChangePasswordDialog';
import { auth } from '@/firebase.config';
import ProfileImageUpdateDialog from '@/app/components/ProfileImageUpdateDialog';
import { themeColors } from '@/app/utils/pageData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LogOutAlertDialog from '@/app/components/LogOutAlertDialog';
import DeleteAccountPermanentlyDialog from '@/app/components/DeleteAccountPermanentlyDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileComponent = () => {
  const { user } = useSelector((state) => state.note);
  const [userNameDialog, setUserNameDialog] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [mount, setMount] = useState(false);
  const [updateImage, setUpdateImage] = useState(false);
  const [profileURL, setProfileURL] = useState();
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  useEffect(() => {
    setMount(true);
  }, [mount]);

  useEffect(() => {
    if (user?.userData?.profileURL) {
      setProfileURL(user?.userData?.profileURL);
    } else {
      setProfileURL(
        `https://api.dicebear.com/9.x/lorelei/webp?seed=${
          user?.userData?.name ?? 'default'
        }`,
      );
    }
  }, [user?.userData?.name, user?.userData?.profileURL]);

  return (
    <>
      <div className="bg-background p-4 md:p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileURL} alt="Profile picture" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn(
                    'absolute bottom-0 right-0 h-8 w-8 rounded-full',
                    themeColors[user?.userData?.theme],
                  )}
                  onClick={() => setUpdateImage((open) => !open)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">{user?.userData?.name}</h2>
                <Button
                  onClick={() => setUserNameDialog(true)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="flex flex-wrap gap-3 items-center">
                  <span>{user?.userData?.email}</span>
                  {auth?.currentUser?.emailVerified ? (
                    <ShieldCheck className="text-green-600 h-5 w-5" />
                  ) : (
                    <>
                      <ShieldAlert className="h-5 w-5 text-yellow-600" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVerifyEmail(true)}
                      >
                        Verify Email
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Logout account</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
                <LogOutAlertDialog className="w-full sm:w-auto">
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </LogOutAlertDialog>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Delete account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
                <Button
                  onClick={() => setDeleteAccountDialog(true)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
          <DeleteAccountPermanentlyDialog
            open={deleteAccountDialog}
            setOpen={setDeleteAccountDialog}
          />
          <EditUserNameDialog
            open={userNameDialog}
            setOpen={setUserNameDialog}
          />
          <VerifyEmailDialog open={verifyEmail} setOpen={setVerifyEmail} />
          <ChangeEmailDialog open={changeEmail} setOpen={setChangeEmail} />
          <ChangePasswordDialog
            open={changePassword}
            setOpen={setChangePassword}
          />
          <ProfileImageUpdateDialog
            open={updateImage}
            setOpen={setUpdateImage}
          />
        </Card>
      </div>
    </>
  );
};

export default ProfileComponent;
