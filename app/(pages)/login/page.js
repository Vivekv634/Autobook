"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/slices/userLoginSlice";
import axios from "axios";
import { isStrongPassword, isEmail } from "validator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AlertDestructive } from "@/app/components/Alert";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isLoading, error } = useSelector(state => state.userLogin);

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        let validationError = null;
        if (email && !isEmail(email)) {
            validationError = 'Invalid Email';
        }
        if (password && !isStrongPassword(password)) {
            validationError = 'Weak password';
        }
        dispatch(loginFailure(validationError));
    }, [email, password, dispatch]);

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
        } catch (error) {
            console.error(error);
            setApiError(error.response?.data?.error || 'An error occurred');
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
            <Head>
                <title>Login - Notesnook</title>
                <meta name="description" content="Login to access features of Notesnook." />
                <meta name="keywords" content="login, signin, Notesnook" />
            </Head>
            <main className="h-screen flex justify-center items-center m-auto text-center bg-[#222831] relative">
                <section className="w-full max-w-md p-6 rounded-2xl md:border md:border-[#31363F] md:bg-[#31363F]">
                    <h1 className="font-semibold text-2xl mb-4 text-[#EEEEEE]">Login Form</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                        <Input value={email} onChange={setEmail} placeholder='Email' type='email' />
                        <Input value={password} onChange={setPassword} placeholder='Password' type='password' />
                        {error && <p className="text-red-600">{error}</p>}
                        {
                            !error && email && password ?
                                (
                                    isLoading ?
                                        <Button disabled variant='primary' className='bg-[#EEEEEE] text-[#333]'>
                                            <Loader2 className="h-[18px] animate-spin" />
                                            Loading...
                                        </Button> :
                                        <Button variant='primary' className='bg-[#76ABAE]'>Log In</Button>
                                ) :
                                <Button variant='primary' disabled className='bg-[#76ABAE]'>Log In</Button>
                        }
                    </form>
                    <span className="block mt-4 text-[#EEE]">
                        Don&apos;t have an account? <Link className="text-blue-300" href='/register'>Create here</Link>
                    </span>
                </section>
                {apiError && (<AlertDestructive variant='destructive' message={apiError} />)}
            </main>
        </>
    );
}
