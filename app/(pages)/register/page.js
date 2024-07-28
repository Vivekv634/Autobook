"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerFailure, registerSuccess } from "../../redux/slices/userRegisterSlice";
import axios from "axios";
import { isStrongPassword, isEmail } from "validator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AlertRegisterSuccess, AlertDestructive } from "@/app/components/Alert";
import InputField from "../../components/Input";


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
            validationError = 'Email must be valid';
        }
        if (password && !isStrongPassword(password)) {
            validationError = 'Password must be min 8 characters and alphanumeric';
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
            <main className="h-screen flex justify-center items-center text-center bg-white relative">
                <section className="w-full max-w-md p-6 rounded-2xl md:border md:shadow-2xl md:border-[#d4cdcd]">
                    <h1 className="font-semibold text-3xl mb-4 text-black py-5  ">Welcome to Notesbook</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                        <InputField id='name' label='Name' value={name} onChange={setName} placeholder='John Doe' type='text' />
                        <InputField id='email' label='Email' value={email} onChange={setEmail} placeholder='john@example.com' type='email' />
                        <InputField id='password' label='Password' value={password} onChange={setPassword} placeholder='' type='password' />
                        <p className="text-red-400 h-10 md:h-5">{error}</p>
                        {
                            !error && name && email && password ?
                                (
                                    isLoading ?
                                        <Button disabled variant='primary' className='bg-black text-white disabled:bg-black'>
                                            <Loader2 className="h-[18px] animate-spin" />
                                            Loading...
                                        </Button> :
                                        <Button variant='primary' className='bg-black text-white'>Register</Button>
                                ) :
                                <Button variant='primary' disabled className='bg-black disabled:bg-black text-white'>Register</Button>
                        }
                    </form>
                    <span className="block mt-4 text-black">
                        Already have an account? <Link className="underline font-semibold" href='/login'>Login here</Link>
                    </span>
                </section>
            </main>
            {alert && (<AlertRegisterSuccess message='Your registration is successful, now login to access the power of the application.' />)}
            {apiError && (<AlertDestructive variant='destructive' message={apiError} />)}
        </>
    );
}
