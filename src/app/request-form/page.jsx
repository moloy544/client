"use client";

import { useState } from 'react';
import axios from 'axios';
import { appConfig } from '@/config/config';
import { creatToastAlert } from '@/utils';
import Footer from '@/components/Footer';
import NavigateBackTopNav from '@/components/NavigateBackTopNav';
import NavigateBack from '@/components/NavigateBack';

export default function RequestContentPage() {
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formElement = e.target; // Get the form element from the event

            // Create a FormData object to hold the form data
            const formData = new FormData(formElement);

            // Create an object to hold the form data
            const requestData = {};
            for (let [key, value] of formData.entries()) {
                const trimmedValue = value.trim(); // Trim the value to remove any leading/trailing whitespace
                if (trimmedValue !== "") {  // Only add the key if the value is not an empty string
                    requestData[key] = trimmedValue; // Populate the requestData object with valid, non-empty values
                }
            };

            // Validate specific fields after creating the requestData object
            const contentTitle = requestData.contentTitle?.trim();
            const industry = requestData.industery?.trim();
            const languageNeed = requestData.languageNeed?.trim();
            const userEmail = requestData.userEmail?.trim();

            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            // Form validation
            if (!contentTitle || !industry || !languageNeed || !userEmail) {
                creatToastAlert({
                    message: "Please enter title, industry, your preferred language and your email."
                });
                return;
            };

            if (!isValidEmail(userEmail)) {
                creatToastAlert({
                    message: "Please enter valid email."
                });
                return;
            }

            setProcessing(true);
            const response = await axios.create({
                baseURL: appConfig.backendUrl,
                withCredentials: true
            }).post('/api/v1/user/action/request', requestData);

            if (response.status === 200) {
                setSuccessMessage(response.data.message || "Your request was successfully received.");

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            } else {
                creatToastAlert({
                    message: "An error occurred while submitting your request."
                });
            }
        } catch (error) {
            console.error(error);
            creatToastAlert({
                message: "An error occurred while submitting your request."
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <NavigateBackTopNav title="Request Content" />
            <div className="flex items-center justify-center min-h-screen bg-custom-dark-bg py-4 px-2.5 border-b border-b-gray-700">
                <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-2xl">
                    {!successMessage ? (
                        <div>
                            <h2 className="text-2xl mobile:text-xl font-semibold text-white mb-4">Request Content Form</h2>
                            {/* New Heading Message */}
                            <div className="bg-gray-700 text-gray-300 p-4 mb-4 rounded">
                                <p className="mobile:text-xs text-sm font-semibold">
                                    We get many requests every day, so it may take up to 1 day to add your content. If we have fewer requests, we&lsquo;ll add it within 6 hours. If the content is available, we will add it right away.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                {/* Content Title */}
                                <div className="mb-4">
                                    <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-300">
                                        Content Title
                                    </label>
                                    <input
                                        type="text"
                                        id="movieTitle"
                                        name="contentTitle"
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-white"
                                        placeholder="Enter the content title"
                                    />
                                </div>

                                {/* Industry */}
                                <div className="mb-4">
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-300">
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        id="industry"
                                        name="industery"
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-white"
                                        placeholder="e.g., Bollywood, Hollywood"
                                    />
                                </div>

                                {/* Preferred Language */}
                                <div className="mb-4">
                                    <label htmlFor="language-need" className="block text-sm font-medium text-gray-300">
                                        Preferred Language
                                    </label>
                                    <input
                                        type="text"
                                        id="language-need"
                                        name="languageNeed"
                                        className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-white"
                                        placeholder="Enter your preferred language"
                                    />
                                    <p className="text-xs my-1 font-medium text-gray-400">If your requested language is available for this content, our team will definitely add it.</p>
                                </div>

                                {/* Release Year */}
                                <div className="mb-4">
                                    <label htmlFor="release-year" className="block text-sm font-medium text-gray-300">
                                        Release Year (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        id="release-year"
                                        name="contentYear"
                                        minLength={4}
                                        maxLength={4}
                                        className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-white"
                                        placeholder="Enter Release Year if you know"
                                    />
                                </div>

                                {/* Optional Message */}
                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                                        Optional Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-white"
                                        placeholder="Add any additional comments (optional)"
                                        rows={3}
                                    ></textarea>
                                </div>

                                {/* Release Year */}
                                <div className="mb-4">
                                    <label htmlFor="release-year" className="block text-sm font-medium text-gray-300">
                                        Your Email (Required)
                                    </label>
                                    <input
                                        type="email"
                                        id="user-email"
                                        name="userEmail"
                                        className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-white"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <p className="text-xs my-1 font-medium text-gray-400">We will notify you by email with the content link if it is available. <span className="text-yellow-500">Invalid email address will be rejected.</span></p>
                                </div>
                                <p className="text-xs font-medium text-gray-300 my-4">
                                    For any queries, feel free to email us at:
                                    <span className="cursor-pointer text-blue-500 hover:underline ml-1" onClick={() => window.location.href = "mailto:moviesbazarorg@gmail.com"}>
                                        moviesbazarorg@gmail.com
                                    </span>
                                </p>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="rounded bg-blue-600 hover:bg-blue-700 w-28 h-10 px-2 flex justify-center items-center text-xs font-medium text-white"
                                    >
                                        {!processing ? "Submit Request" : <div className="three_dots_loading w-2 h-2"></div>}
                                    </button>
                                    <NavigateBack>
                                        <button
                                            disabled={processing}
                                            type="button"
                                            className="ml-4 text-gray-300 hover:text-white transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </NavigateBack>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center text-white">
                            <div className="text-center mb-3">
                                <i className="bi bi-check-circle-fill text-5xl text-green-500"></i>
                            </div>
                            <h2 className="text-base font-semibold mb-4">
                                {successMessage}
                            </h2>
                            <p className="text-sm text-gray-300 mb-4 font-normal">
                                <span className="font-bold text-white">Note:</span> If your requested content is available, our team will add it as soon as possible. Thank you for your patience!
                            </p>
                            <button
                                onClick={() => {
                                    setSuccessMessage(null); // Reset success message
                                }}
                                className="rounded bg-blue-600 hover:bg-blue-700 w-28 h-10 px-2 flex justify-center items-center text-xs font-medium text-white"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
