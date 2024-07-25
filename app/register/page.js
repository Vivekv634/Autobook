"use client";
import { useEffect, useState } from "react";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerFailure, registerSuccess } from "../redux/slices/userRegisterSlice";
import axios from "axios";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector(state => state.userRegister);

    useEffect(() => {
        if (password) {
            if (!isStrongPassword(password)) {
                dispatch(registerFailure('Weak password'));
            } else {
                dispatch(registerFailure(null));
            }
        } else {
            dispatch(registerFailure(null));
        }
    }, [password, dispatch]);

    useEffect(() => {
        if (email) {
            if (!isEmail(email)) {
                dispatch(registerFailure('Invalid Email'));
            } else {
                dispatch(registerFailure(null));
            }
        } else {
            dispatch(registerFailure(null));
        }
    }, [email, dispatch]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        dispatch(registerStart());
        try {
            const response = await axios.post(`${process.env.API}/api/register`, { name, email, password }, {
                headers: {
                    'Content-Type': 'application/json'
            }});
            dispatch(registerSuccess(JSON.stringify(response)));
        } catch (error) {
            console.error(error);
            dispatch(registerFailure(error.response.data.error));
        }
    }

    return (
        <main className="h-screen flex flex-col justify-center items-center m-auto">
            <h1 className="font-semibold text-2xl mb-4">Registration Form</h1>
            <form className="flex-col flex gap-1" onSubmit={handleFormSubmit} method="post">
                <Input value={name} onChange={setName} placeholder='Name' type='text' />
                <Input value={email} onChange={setEmail} placeholder='Email' type='email' />
                <Input value={password} onChange={setPassword} placeholder='Password' type='password' />
                {error && <p className="">{error}</p>}
                <button type="submit" className={`bg-blue-400 border p-2 rounded-md m-1 ${isLoading && 'cursor-not-allowed'}`}>{isLoading ? 'Loading...' : 'Submit Form'}</button>
            </form>
            USER : {user}
        </main>
    );
}