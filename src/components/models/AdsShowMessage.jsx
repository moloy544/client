"use client"

import axios from 'axios';
import { useEffect, useState } from 'react';

function AdsShowMessage({ user }) {
    const [showMessage, setShowMessage] = useState(false);

    const setUserCookie = async () => {
        if (user) return;
        try {
            await axios.post('/api/user');
        } catch (error) {
            console.log("Error while setting user");
        }
    };

    useEffect(() => {
        const acceptAds = localStorage.getItem('acceptAds');
        if (!acceptAds) {
            setShowMessage(true);
            const body = document.querySelector('body');
            body.setAttribute('class', 'scrollbar-hidden');
            body.style.overflow = 'hidden';
        };
        setUserCookie();
    }, []);

    const handleAccept = () => {
        localStorage.setItem('acceptAds', 'true');
        setShowMessage(false);
        const body = document.querySelector('body');
        body.removeAttribute('class', 'scrollbar-hidden');
        body.style.overflow = '';
    };

    if (!showMessage) return null;

    return (
        <div className="bg-gray-950 bg-opacity-60 w-full h-full fixed left-0 top-0 z-50 flex justify-center items-center">
            <div className="bg-white px-4 py-4 mobile:px-2.5 mobile:py-4 rounded-lg shadow-lg max-w-lg text-center mx-2 my-3">
                <div className="text-2xl mobile:text-xl font-bold mb-4">Support Us to Keep the Site Running</div>
                <p className="mb-6 text-base text-gray-700 font-medium">
                    Our site maintenance costs are very high. By enabling ads, you help us maintain and improve the site. While exploring movies, some ads will show up just ignore them and enjoy your movies watching experience!
                </p>
                <button
                    onClick={handleAccept}
                    className="bg-blue-900 hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-base my-2.5"
                >
                    Understand
                </button>
            </div>
        </div>
    );
}

export default AdsShowMessage;
