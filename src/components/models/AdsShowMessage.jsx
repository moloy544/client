"use client";

import { ModelsController } from '@/lib/EventsHandler';
import { safeLocalStorage } from '@/utils/errorHandlers';
import { useEffect, useState } from 'react';

function AdsShowMessage() {

    const [showMessage, setShowMessage] = useState(false);
    const [isStorageAccessible, setIsStorageAccessible] = useState(true);

    useEffect(() => {
        const acceptAds = safeLocalStorage.get('acceptAds', () => setIsStorageAccessible(false));
        if (!acceptAds) {
            setShowMessage(true);
            const body = document.querySelector('body');
            body.setAttribute('class', 'scrollbar-hidden');
            body.style.overflow = 'hidden';
        }
    }, []);

    const handleAccept = () => {
        safeLocalStorage.set('acceptAds', 'true');
        setShowMessage(false);
        const body = document.querySelector('body');
        body.removeAttribute('class', 'scrollbar-hidden');
        body.style.overflow = '';
    };

    // Check if running in the browser before accessing window
    const isBrowser = typeof window !== 'undefined';

    return (
        <ModelsController
            visibility={showMessage || !isStorageAccessible}
            transformEffect={isBrowser && window.innerWidth <= 769}
        >
            <div className="bg-gray-950 bg-opacity-80 w-full h-full fixed left-0 top-0 z-[100] flex justify-center items-center mobile:items-end">
                <div className="bg-white rounded-lg mobile:rounded-t-xl shadow-lg h-fit w-full max-w-full md:max-w-lg mx-2.5 my-3 mobile:m-0 px-5 py-6 mobile:px-3 mobile:py-5 text-center">
                    {isStorageAccessible ? (
                        <>
                            <h2 className="text-2xl mobile:text-xl font-bold mb-4 text-gray-800">
                                <i className="bi bi-heart-fill mr-2 text-red-600"></i>
                                Support Us to Keep the Site Running
                            </h2>

                            <p className="mb-6 text-base mobile:text-sm text-gray-700 font-medium">
                                Our site has high maintenance costs. By allowing ads, you help us keep the site running and improve it.
                                While watching movies, some ads may appear. Just ignore them and enjoy your movie experience!
                            </p>
                            <button
                                onClick={handleAccept}
                                className="bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-base my-3 transition duration-200"
                            >
                                Understand
                            </button>
                            <p className="text-xs text-gray-500 font-semibold mt-1">This message may show again if you clear your browser or site data for www.moviesbazar.online. Thank you for your support!</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl mobile:text-xl font-bold mb-4 text-gray-800">
                                <i className="bi bi-exclamation-triangle-fill mr-2 text-yellow-500"></i>
                                Action Needed to Continue
                            </h2>

                            <p className="mb-4 text-base mobile:text-sm text-gray-700 font-medium">
                                We need your help to keep our site running smoothly. It looks like your browser settings are blocking access to certain features needed for the best experience. Please follow the steps below to fix this:
                            </p>
                            <ul className="text-left mb-6 list-disc list-inside">
                                <li className="mb-2">Click on the padlock icon or site info icon located next to the URL in the address bar of your browser.</li>
                                <li className="mb-2">Find the section labeled <strong>“Cookies and Site Data”</strong> or something similar.</li>
                                <li className="mb-2">Make sure cookies and site data for our site <strong>www.moviesbazar.online</strong> are allowed. If they are blocked, select <strong>“Allow”</strong> or <strong>“Unblock”</strong>.</li>
                                <li className="mb-2">Refresh the page or click the button below after making the changes to continue using our site.</li>
                            </ul>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-base my-2.5 transition duration-200"
                            >
                                I Have Unblocked
                            </button>
                        </>
                    )}
                </div>
            </div>
        </ModelsController>
    );
}

export default AdsShowMessage;
