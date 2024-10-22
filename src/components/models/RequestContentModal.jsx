import { appConfig } from '@/config/config';
import { ModelsController } from '@/lib/EventsHandler';
import { creatToastAlert } from '@/utils';
import axios from 'axios';
import { useState } from 'react';

export default function RequestContentModal({ onClose, isOpen = false }) {

    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formElement = e.target; // Get the form element from the event

            // Create a FormData object to hold the form data
            const formData = new FormData(formElement);

            // Create an object to hold the form data
            const requestData = {};
            for (let [key, value] of formData.entries()) {
                requestData[key] = value; // Populate the requestData object
            }

            const contentTitle = requestData.contentTitle.trim();
            const industery = requestData.industery.trim()

            if (contentTitle === "" || industery === "") {
                creatToastAlert({
                    message: "Please enter both content title and industery."
                });
                return;
            }
            setProcessing(true);
            const response = await axios.create({
                baseURL: appConfig.backendUrl,
                withCredentials: true
            }).post('/api/v1/user/action/request', requestData);
            if (response.status === 200) {
                creatToastAlert({
                    message: response.data.message || "Your request was successfully received."
                })
                onClose(); // Close the mmeodal after submission  
            } else {
                creatToastAlert({
                    message: "An error occurred while submitting your request."
                });
            }
        } catch (error) {
            console.error(error);
            creatToastAlert({
                message: "An error occurred while submitting your request."
            })
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ModelsController visibility={isOpen} windowScroll={false}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full h-auto max-w-md mx-2">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Request a content</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Movie Title */}
                        <div className="mb-4">
                            <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-700">
                                Content Title
                            </label>
                            <input
                                type="text"
                                id="movieTitle"
                                name="contentTitle"
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter the movie title"
                            />
                        </div>

                        {/* Industry */}
                        <div className="mb-4">
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                                Industry
                            </label>
                            <input
                                type="text"
                                id="industry"
                                name="industery"
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Bollywood, Hollywood"
                            />
                        </div>

                        {/* Optional Message */}
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Optional Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add any additional comments (optional)"
                                rows={3}
                            ></textarea>
                        </div>

                        {/* Note */}
                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Note:</strong> If the content you're requesting is available, our team will add it as soon as possible. Please check the recently added or updated listings section for updates.
                        </p>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded bg-gray-800 hover:bg-gray-900 w-28 h-10 px-2 flex justify-center items-center text-xs font-medium text-gray-50"
                            >
                                {!processing ? "Submit request" : <div className="three_dots_loading w-2 h-2"></div>}
                            </button>
                            <button
                                disabled={processing}
                                type="button"
                                onClick={onClose}
                                className="ml-4 text-gray-600 hover:text-gray-900 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModelsController>
    );
};
