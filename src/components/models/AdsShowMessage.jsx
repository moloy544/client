"use client"

import { ModelsController } from '@/lib/EventsHandler';
//import axios from 'axios';
import { useEffect, useState } from 'react';

function AdsShowMessage() {

    const [showMessage, setShowMessage] = useState(false);

    /**const setUserCookie = async () => {
        try {
            await axios.post('/api/user');
        } catch (error) {
            console.log("Error while setting user");
        }
    };**/

    useEffect(() => {
        const acceptAds = localStorage.getItem('acceptAds');
        if (!acceptAds) {
            setShowMessage(true);
            const body = document.querySelector('body');
            body.setAttribute('class', 'scrollbar-hidden');
            body.style.overflow = 'hidden';
            //setUserCookie();
        };
    }, []);

    const handleAccept = () => {
        localStorage.setItem('acceptAds', 'true');
        setShowMessage(false);
        const body = document.querySelector('body');
        body.removeAttribute('class', 'scrollbar-hidden');
        body.style.overflow = '';
    };

    // Check if running in the browser before accessing window
    const isBrowser = typeof window !== 'undefined';
    
    return (
        <ModelsController visibility={showMessage} transformEffect={isBrowser && window.innerWidth <= 769}>
        <div className="bg-gray-950 bg-opacity-80 w-full h-full fixed left-0 top-0 z-50 flex justify-center items-center mobile:items-end">
            <div className="bg-white rounded-lg mobile:rounded-t-xl shadow-lg h-fit w-full max-w-full md:max-w-lg mx-2.5 my-3 mobile:m-0 px-5 py-6 mobile:px-3 mobile:py-5 text-center">
                <h2 className="text-2xl mobile:text-xl font-bold mb-4 text-gray-800">Support Us to Keep the Site Running</h2>
                <p className="mb-6 text-base mobile:text-sm text-gray-700 font-medium">
                    Our site has high maintenance costs. By allowing ads, you help us keep the site running and improve it.
                    While watching movies, some ads may appear. Just ignore them and enjoy your movie experience!
                </p>
                <button
                    onClick={handleAccept}
                    className="bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-base my-2.5 transition duration-200"
                >
                    Understand
                </button>
            </div>
        </div>
    </ModelsController>
    );
}

export default AdsShowMessage;
