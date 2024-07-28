"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerFailure, registerSuccess } from "../../redux/slices/userRegisterSlice";
import axios from "axios";
import { isStrongPassword, isEmail } from "validator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AlertRegisterSuccess, AlertDestructive } from "@/app/components/Alert";


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState(null);
    const [alert, setAlert] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading, error } = useSelector(state => state.userRegister);
    const { user } = useSelector(state => state.userLogin);

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
        dispatch(registerFailure(validationError));
    }, [email, password, dispatch]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        dispatch(registerStart());
        try {
            const response = await axios.post(`${process.env.API}/api/register`, { name, email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setAlert(true);
            dispatch(registerSuccess(response.data));
        } catch (error) {
            setApiError(error.response?.data?.error || 'An error occurred');
            dispatch(registerFailure(null));
        }
    }

    if (apiError) {
        setTimeout(() => {
            setApiError(null);
        }, 5000);
    }

    if (alert) {
        setTimeout(() => {
            setAlert(false);
        }, 5000);
    }

    return (
        <>
            <Head>
                <title>Register - Notesnook</title>
                <meta name="description" content="Register to create an account on Notesnook." />
                <meta name="keywords" content="register, signup, create account, Notesnook" />
            </Head>
            <main className="h-screen flex justify-center items-center m-auto text-center bg-[#222831] relative">
                <section className="w-full max-w-md p-6 rounded-2xl md:border md:border-[#31363F] md:bg-[#31363F]">
                    <h1 className="font-semibold text-2xl mb-4 text-[#EEEEEE]">Registration Form</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                        <Input value={name} onChange={setName} placeholder='Name' type='text' />
                        <Input value={email} onChange={setEmail} placeholder='Email' type='email' />
                        <Input value={password} onChange={setPassword} placeholder='Password' type='password' />
                        {error && <p className="text-red-400">{error}</p>}
                        {
                            !error && name && email && password ?
                                (
                                    isLoading ?
                                        <Button disabled variant='primary' className='bg-[#EEEEEE] text-[#333]'>
                                            <Loader2 className="h-[18px] animate-spin" />
                                            Loading...
                                        </Button> :
                                        <Button variant='primary' className='bg-[#76ABAE]'>Register</Button>
                                ) :
                                <Button variant='primary' disabled className='bg-[#76ABAE]'>Register</Button>
                        }
                    </form>
                    <span className="block mt-4 text-[#EEE]">
                        Already have an account? <Link className="text-blue-300" href='/login'>Login here</Link>
                    </span>
                </section>
            </main>
            {alert && (<AlertRegisterSuccess message='Your registration is successful, now login to access the power of the application.' />)}
            {apiError && (<AlertDestructive variant='destructive' message={apiError} />)}
        </>
    );
}
