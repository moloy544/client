'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

function SomthingWrongError() {

    const router = useRouter();

    const reload = () => router.refresh();
    const back = () => router.back();

    return (

        <div className="grid min-h-screen place-content-center bg-white px-4">
            <div className="text-center">

                <Image
                    priority
                    className="w-96 h-72 mobile:w-80 mobile:h-64 block ml-auto mr-auto"
                    src="https://res.cloudinary.com/dxhafwrgs/image/upload/v1705937258/moviesbazaar/somthing_was_wrong.jpg"
                    width={280}
                    height={250}
                    alt="somthing was wrong message"
                />

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Something went wrong!
                </h1>

                <p className="mt-4 text-gray-500">Please reload the page and try again or go back to previews page page.</p>
                <div className="w-full h-auto flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={reload}
                        className="mt-6 inline-block rounded bg-rose-500 px-8 py-2 text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring">
                        <i className="bi bi-arrow-clockwise"></i> Reload
                    </button>
                    <button
                        type="button"
                        onClick={back}
                        className="mt-6 inline-block rounded bg-cyan-500 px-8 py-2 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring">
                        Go Back
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SomthingWrongError
