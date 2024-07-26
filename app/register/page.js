"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerFailure, registerSuccess } from "../redux/slices/userRegisterSlice";
import axios from "axios";
import { isStrongPassword, isEmail } from "validator";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading, error } = useSelector(state => state.userRegister);
    const { user } = useSelector(state => state.userLogin);

    useEffect(() => {
        if (user) {
            router.push('/');
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
            dispatch(registerSuccess(response.data));
        } catch (error) {
            console.error(error);
            dispatch(registerFailure(error.response?.data?.error || 'An error occurred'));
        }
    }

    return (
        <>
            <Head>
                <title>Register - Notesnook</title>
                <meta name="description" content="Register to create an account on Notesnook." />
                <meta name="keywords" content="register, signup, create account, Notesnook" />
            </Head>
            <main className="h-screen flex justify-center items-center m-auto text-center bg-gray-50">
                <section className="w-full max-w-md p-6">
                    <h1 className="font-semibold text-2xl mb-4">Registration Form</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                        <Input value={name} onChange={setName} placeholder='Name' type='text' />
                        <Input value={email} onChange={setEmail} placeholder='Email' type='email' />
                        <Input value={password} onChange={setPassword} placeholder='Password' type='password' />
                        {error && <p className="text-red-600">{error}</p>}
                        <button type="submit" className={`bg-blue-400 border p-2 rounded-md ${isLoading ? 'cursor-not-allowed' : ''}`}>{isLoading ? 'Loading...' : 'Submit'}</button>
                    </form>
                    <span className="block mt-4">
                        Already have an account? <Link className="text-blue-700 font-semibold" href='/login'>Login here</Link>
                    </span>
                </section>
            </main>
        </>
    );
}