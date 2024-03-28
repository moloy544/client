import { appConfig } from "@/config/config";
import axios from "axios";
import { useState } from "react";


function AdminLoginPage({ functions }) {

    const { setLoginSuccess } = functions;

    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handalLogin = async () => {

        try {
            if (password?.trim() === "" || userName?.trim() === "") {
                setErrorMessage("Please enter all required fields");
                return;
            };
            const res = await axios.post(`${appConfig.backendUrl}/api/v1/admin/login`, {
                user: userName,
                password
            });
            if (res.status === 200) {
                setLoginSuccess(true);
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
        }
    };

    const handalInputChange = (e) => {

        if (errorMessage) {
            setErrorMessage(null);
        };
        if (e.target.name === "username") {
            setUserName(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        };
    };

    return (
        <div className="w-full min-h-screen bg-white flex justify-center items-center">
            <div className="max-w-xl py-10 px-14 h-80 mt-20 bg-white rounded shadow-xl border border-gray-200">
                {errorMessage && (
                    <div className="text-xs text-center text-red-600 font-semibold">
                        {errorMessage}
                    </div>
                )}
                <div className="mb-6">
                    <label htmlFor="username" className="block text-gray-800 font-bold">Name:</label>
                    <input onChange={handalInputChange} type="text" name="username" id="username" placeholder="username" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-800 font-bold">Password:</label>
                    <input onChange={handalInputChange} type="text" name="password" placeholder="password" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
                </div>
                <button type="button" onClick={handalLogin} className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded">Login</button>
            </div>
        </div>
    )
}

export default AdminLoginPage
