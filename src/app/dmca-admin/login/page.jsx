'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createToastAlert } from "@/utils";
import Image from "next/image";
import brandLogoIcon from "../../../assets/images/brand_logo.png";
import { appConfig } from "@/config/config";
import { AnimatePresence, motion } from "framer-motion";
import OtpInput from "react-otp-input";

//React OTP Input Styling
const inputStyle = {
    width: '42px',
    height: '42px',
    margin: '2px',
    padding: '10px',
    fontSize: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    textAlign: 'center',
    fontWeight: 'bold'
};


export default function DMCAAdminLoginPage() {
    const router = useRouter();
    const [process, setProcess] = useState(false);
    const [isOtpLogin, setIsOtpLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handalLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { username, password } = Object.fromEntries(formData.entries());

        if (!username || !password) {
            return createToastAlert({ message: "Please enter all required fields" });
        }

        try {
            setProcess(true);
            const res = await axios.post(`${appConfig.backendUrl}/api/v1/dmca-admin/login`, {
                username,
                password
            }, { withCredentials: true });

            if (res.status === 200) {
                router.replace("/dmca-admin");
            } else {
                createToastAlert({ message: res.data.message || "Invalid login details" });
            }
        } catch (error) {
            createToastAlert({ message: error?.response?.data?.message || "Login failed" });
        } finally {
            setProcess(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email) return createToastAlert({ message: "Enter your email first" });

        try {
            setProcess(true);
            const res = await axios.post(`${appConfig.backendUrl}/api/v1/dmca-admin/send-otp`, { email });
            if (res.status === 200) {
                setOtpSent(true);
                setResendTimer(60);
                createToastAlert({ message: "OTP sent to your email" });
            } else {
                createToastAlert({ message: res.data.message || "OTP not sent" });
            }
        } catch (err) {
            createToastAlert({ message: err?.response?.data?.message || "Failed to send OTP" });
        } finally {
            setProcess(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 4) return createToastAlert({ message: "Enter the 4-digit OTP" });

        try {
            setProcess(true);
            const res = await axios.post(`${appConfig.backendUrl}/api/v1/dmca-admin/verify-otp`, { email, otp }, { withCredentials: true });

            if (res.status === 200) {
                router.replace("/dmca-admin");
            } else {
                createToastAlert({ message: res.data.message || "Invalid OTP" });
            }
        } catch (err) {
            createToastAlert({ message: err?.response?.data?.message || "OTP verification failed" });
        } finally {
            setProcess(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 px-2">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mobile:p-6">
                <div className="text-center mb-6">
                    <Image
                        src={brandLogoIcon}
                        width={50}
                        height={50}
                        alt="Movies Bazar Logo"
                        className="mx-auto mb-4 rounded-md w-20 h-20"
                        priority
                    />
                    <h2 className="text-2xl mobile:text-xl font-bold text-gray-800">DMCA Admin Login</h2>
                    <p className="text-gray-600 text-base mobile:text-sm font-medium">Sign in to MoviesBazar DMCA Panel</p>
                </div>

                {/* Toggle Buttons */}
                <p className="text-sm font-semibold text-gray-800 mb-2 text-center">Login By</p>
                <div className="mb-6 flex justify-center gap-4">
                    <button
                        onClick={() => setIsOtpLogin(false)}
                        aria-pressed={!isOtpLogin}
                        className={`px-5 py-2 rounded-md text-sm font-medium border transition duration-200
      ${!isOtpLogin
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                        Password
                    </button>
                    <button
                        onClick={() => setIsOtpLogin(true)}
                        aria-pressed={isOtpLogin}
                        className={`px-5 py-2 rounded-md text-sm font-medium border transition duration-200
      ${isOtpLogin
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                        OTP
                    </button>
                </div>


                <AnimatePresence mode="wait">
                    {!isOtpLogin ? (
                        <motion.form
                            key="password-login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25 }}
                            onSubmit={handalLogin}
                        >
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter username"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={process}
                                className={`w-full h-10 flex items-center justify-center mt-6 bg-teal-700 hover:bg-teal-600 ${!process ? "text-white" : "opacity-70 cursor-not-allowed text-gray-300"} font-bold rounded`}>
                                {!process ? "Login" : <div className="three_dots_loading w-2 h-2"></div>}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="otp-login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="space-y-5">
                                {!otpSent ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                placeholder="Enter registered email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={process}
                                            className="w-full mt-2 h-10 bg-teal-700 hover:bg-teal-600 text-white font-semibold rounded">
                                            {!process ? "Login" : <div className="three_dots_loading w-2 h-2 justify-self-center"></div>}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-center">
                                            <OtpInput
                                                value={otp}
                                                onChange={setOtp}
                                                numInputs={4}
                                                inputType="text"
                                                inputStyle={inputStyle}
                                                renderSeparator={<span>-</span>}
                                                renderInput={(props) => <input {...props} />}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={process}
                                            className="w-full mt-4 h-10 bg-green-600 hover:bg-green-700 text-white font-semibold rounded">
                                            {process ? <div className="three_dots_loading w-2 h-2 justify-self-center"></div> : "Verify & Login"}
                                        </button>

                                        <div className="mt-4 text-center text-sm text-gray-600">
                                            {resendTimer > 0 ? (
                                                <p>Resend OTP in {resendTimer}s</p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}