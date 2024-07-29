"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "@/app/redux/slices/userLoginSlice";
import axios from "axios";
import { isEmail } from "validator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AlertDestructive } from "@/app/components/Alert";
import InputField from "@/app/components/Input";
import { hasCookie } from 'cookies-next';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading, error } = useSelector(state => state.userLogin);

    useEffect(() => {
        if (hasCookie('user-session-data')) {
            router.push('/dashboard');
        }
    }, [router]);

    useEffect(() => {
        let validationError = null;
        if (email && !isEmail(email)) {
            validationError = 'Invalid Email';
        }
        dispatch(loginFailure(validationError));
    }, [email, dispatch]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await axios.post(`${process.env.API}/api/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            dispatch(loginSuccess(response.data));
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            setApiError(error.message || 'An error occurred');
            dispatch(loginFailure(null));
        }
    }

    if (apiError) {
        setTimeout(() => {
            setApiError(null);
        }, 5000);
    }

    return (
        <>
            <main className="h-screen flex flex-col justify-center items-center text-center bg-white">
                <section className="w-full max-w-md p-6 rounded-md md:border md:shadow-2xl md:border-[#d4cdcd] md:bg-white">
                    <h1 className="font-semibold text-3xl mb-4 text-black py-5">Welcome to Notebook</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                        <InputField id='email' label='Email' value={email} onChange={setEmail} placeholder='john@example.com' type='email' />
                        <InputField id='password' label='Password' value={password} onChange={setPassword} placeholder='' type='password' />
                        <p className="text-red-600 h-5">{error}</p>
                        {
                            !error && email && password ?
                                (
                                    isLoading ?
                                        <Button disabled variant='primary' className='bg-black text-white disabled:bg-black'>
                                            <Loader2 className="h-[18px] animate-spin" />
                                            Loading...
                                        </Button> :
                                        <Button variant='primary' className='bg-black text-white'>Sign In</Button>
                                ) :
                                <Button variant='primary' disabled className='bg-black disabled:bg-black text-white'>Sign In</Button>
                        }
                    </form>
                    <span className="block mt-4 text-black">
                        Don&apos;t have an account? <Link className="underline font-semibold" href='/register'>Create here</Link>
                    </span>
                </section>
                {apiError && (<AlertDestructive variant='destructive' message={apiError} />)}
            </main>
        </>
    );
}

export default LoginComponent;