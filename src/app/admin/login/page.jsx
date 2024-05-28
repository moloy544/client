'use client'

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState(null);

    const handalLogin = async (event) => {
        event.preventDefault();

        // getting form data
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const { username, password } = formJson;
        
        try {
            // validate all fielsa
            if (password?.trim() === "" || username?.trim() === "") {
                setErrorMessage("Please enter all required fields");
                return;
            };
            const res = await axios.post('/api/admin/login', {
                user: username,
                password
            });
            if (res.status === 200) {
                router.replace('/admin');
            } else {
                setErrorMessage(res.data.message);
            }

        } catch (error) {
            console.log(error);
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-white flex justify-center items-center">
            <div className="max-w-xl py-10 px-14 h-80 mt-20 bg-white rounded shadow-xl border border-gray-200 mx-3">
                {errorMessage && (
                    <div className="text-xs text-center text-red-600 font-semibold">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handalLogin}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-gray-800 font-bold">User name:</label>
                        <input type="text" name="username" placeholder="username" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-800 font-bold">Password:</label>
                        <input type="text" name="password" placeholder="password" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
                    </div>
                    <button type="submit" className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded">Login</button>
                </form>
            </div>
        </div>
    )
};
