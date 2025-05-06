"use client"

import { useState } from "react";
import axios from "axios";

export default function DmcaAdminPage() {
    const [url, setUrl] = useState("");
    const [disableDate, setDisableDate] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return alert("Please enter a valid URL.");

        try {
            await axios.post("/api/disable-content", {
                url,
                disableFrom: disableDate || null
            });
            setShowSuccess(true);
            setUrl("");
            setDisableDate("");
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    CMCA Takedown Dashboard
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Infringing Content URL
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Infringing Content URL"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Disable Access From (optional)
                        </label>
                        <input
                            type="date"
                            value={disableDate}
                            onChange={(e) => setDisableDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit Takedown
                    </button>
                </form>

                {showSuccess && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
                            <h2 className="text-lg font-semibold text-green-600 mb-2">✅ Takedown Submitted</h2>
                            <p className="text-gray-700 mb-4">The content has been marked for disable or removed.</p>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
