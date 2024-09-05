'use client';
import { cn } from '@/lib/utils';
import { Pen, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { auth } from '@/firebase.config';
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
} from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { setUser } from '@/app/redux/slices/noteSlice';

const ProfileComponent = () => {
  const { user } = useSelector((state) => state.note);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [newName, setNewName] = useState(
    user?.userData?.name && user.userData.name,
  );
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, [mount]);

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (!User) {
        router.push('/login');
      }
    });
  }, [router, user, dispatch]);

  const sendVerificationEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        toast({
          description: 'Verification email sent!',
          className: 'bg-green-500',
        });
      })
      .catch((error) => {
        toast({
          description: 'Oops! something went wrong!',
          variant: 'destructive',
        });
        console.log(error);
      });
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.API}/api/account/update/${user.userID}`,
        { name: newName },
      );
      dispatch(setUser({ ...user, ...response.data.result }));
      toast({ description: 'Name updated!', className: 'bg-green-500' });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password,
    );

    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update the email in Firebase
      await updateEmail(auth.currentUser, newEmail);

      // Send a verification email to the new email address
      await sendEmailVerification(auth.currentUser);

      // Notify the user to check their new email for a verification link
      toast({
        description:
          'A verification email has been sent to your new email address. Please verify it to complete the change.',
        className: 'bg-blue-400',
      });
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        description: `Oops! ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <section className={cn(isDesktop && 'container')}>
      <div className="p-2 border rounded-md mt-2 mx-1">
        {/* my profile section */}
        <Label className="text-2xl font-bold">My Profile</Label>
        <div className="bg-neutral-800 p-3 rounded-md my-3 flex justify-start gap-3">
          {mount && user?.userData?.name && (
            <Image
              src={`https://ui-avatars.com/api/?background=random&name=${user?.userData?.name}`}
              width={isDesktop ? 90 : 50}
              height={isDesktop ? 90 : 50}
              className="rounded-full"
              alt="User profile image"
            />
          )}
          <div className="my-auto">
            <div className="text-2xl font-bold flex gap-1 items-center">
              {user?.userData?.name}
              <Dialog>
                <DialogTrigger>
                  <Pen className="h-4 w-4" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change your name</DialogTitle>
                    <DialogDescription>
                      Change your name for the app. Save changes when you are
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNameChange}>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                    <DialogFooter>
                      <DialogClose
                        className={buttonVariants({ variant: 'secondary' })}
                      >
                        Cancel
                      </DialogClose>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-1 items-center">
              {auth?.currentUser?.email}
              {!auth?.currentUser?.emailVerified && (
                <Dialog>
                  <DialogTrigger>
                    <TriangleAlert className="h-4 w-4 text-yellow-500 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verify your email</DialogTitle>
                      <DialogDescription>
                        Please verify your email to use the app at its full
                        power. Click on the button below to send a verification
                        email to your email account.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose
                        className={buttonVariants({ variant: 'secondary' })}
                      >
                        Cancel
                      </DialogClose>
                      <Button onClick={sendVerificationEmail}>
                        Send Email
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="">
            <Label className="font-bold text-lg block">Email</Label>
            <Label>Change your email account.</Label>
          </div>
          <Dialog>
            <DialogTrigger>
              <Button>Change Email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change your email</DialogTitle>
                <DialogDescription>
                  Change your present email to the new one. If can&apos;t, try
                  logout and re-login again.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEmailChange}>
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
                <Input
                  value={password}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <DialogFooter>
                  <DialogClose
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    Cancel
                  </DialogClose>
                  <Button type="submit">Change Email</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
      </div>
    </section>
  );
};

export default ProfileComponent;
