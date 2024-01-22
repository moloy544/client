'use client'

import Image from "next/image";

function SomthingWrongError() {

    const reload = () => window.location.reload();

    return (

        <div className="grid min-h-screen place-content-center bg-white px-4">
            <div className="text-center">
                
                <Image
                    priority
                    className="w-96 h-72 mobile:w-80 mobile:h-64"
                    src="https://res.cloudinary.com/dxhafwrgs/image/upload/v1705937258/moviesbazaar/somthing_was_wrong.jpg"
                    width={280}
                    height={250}
                    alt="somthing was wrong message"
                />

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Somthing was worng!
                </h1>

                <p className="mt-4 text-gray-500">Please reload the page and try again.</p>

                <button
                    type="button"
                    onClick={reload}
                    className="mt-6 inline-block rounded bg-rose-500 px-14 py-3 text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring">
                    Reload
                </button>
            </div>
        </div>
    )
}

export default SomthingWrongError
