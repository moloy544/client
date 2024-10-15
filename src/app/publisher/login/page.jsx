'use client'

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { creatToastAlert } from "@/utils";
import Image from "next/image";

export default function AdminLoginPage() {

    const router = useRouter();
    const [process, setProcess] = useState(false);

    const handalLogin = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const { username, password } = formJson;

        try {
            if (password?.trim() === "" || username?.trim() === "") {
                creatToastAlert({
                    message: "Please enter all required fields"
                });
                return;
            };
            setProcess(true);
            const res = await axios.post('/api/publisher/login', {
                user: username,
                password
            });
            if (res.status === 200) {
                router.replace('/publisher');
            } else {
                creatToastAlert({
                    message: res.data.message || "Invalid login details"
                });
            }

        } catch (error) {
            //console.log(error);
            if (error.response.data.message) {
                creatToastAlert({
                    message: error.response.data.message || "Failed to login"
                });
            }
        } finally {
            setProcess(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 px-2">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mobile:p-6">
                <div className="text-center mb-6">
                    <Image
                        src="https://res.cloudinary.com/moviesbazar/image/upload/v1722170830/logos/brand_log.jpg"
                        width={50}
                        height={50}
                        alt="Movies Bazar Logo"
                        className="mx-auto mb-4 rounded-md"
                    />
                    <h2 className="text-2xl mobile:text-xl font-bold text-gray-800">Publisher Login</h2>
                    <p className="text-gray-600 text-base mobile:text-sm font-medium">Sign in to moviesbazar publisher account</p>
                </div>

                <form onSubmit={handalLogin}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                className="mt-1 block w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="mt-1 block w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={process}
                        className={`cursor-pointer w-full h-10 flex items-center justify-center p-6 mt-8 bg-gray-900 ${!process ? "text-white" : "bg-opacity-70 cursor-not-allowed text-gray-300"} font-bold text-center rounded`}>
                        {!process ? "Login" : <div className="three_dots_loading w-2 h-2"></div>}
                    </button>
                </form>
            </div>
        </div>
    );
}
