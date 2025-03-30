'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import NavigateBack from "../NavigateBack";
import errorImage from "../../assets/images/status500_error_message.png"

function SomthingWrongError({
    onclickEvent,
    reportSubject = 'Issue Encountered on MoviesBazar',
    reportMessage = `Hello MoviesBazar Team,\n\nI am experiencing an error while exploring the site. The error occurred on the following page: ${window.location.href}.\n\nThank you for your assistance!`
}) {

    const router = useRouter();

    const onclickAction = () => {
        if (!onclickEvent) {
            router.refresh();
        } else {
            onclickEvent();
        }
    };

    const handleEmail = () => {
        const email = 'moviesbazarorg@gmail.com';
        const encodedSubject = encodeURIComponent(reportSubject);
        const encodedBody = encodeURIComponent(reportMessage);

        window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    };

    const isNavigateHistory = (window.history.length > 1);

    return (

        <div className="w-full min-h-screen place-content-center bg-gray-800 px-4 overflow-hidden">
            <button
                type="button"
                onClick={() => handleEmail()}
                className="absolute top-2 right-2 rounded bg-slate-600 px-4 bg-opacity-20 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none">
                <i className="bi bi-bug"></i> Report us
            </button>
            <div className="text-center">

                <Image
                    priority
                    className="w-96 h-auto mobile:w-72 xl:w-[500px] block ml-auto mr-auto"
                    src={errorImage}
                    width={300}
                    height={280}
                    alt="Somthing went wrong picture"
                />

                <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                    Something went wrong!
                </h1>

                <p className="mt-4 text-gray-200 font-semibold">
                    {`Please reload the page and try again or go back to ${isNavigateHistory ? "previews page." : "home page."}`}
                </p>

                <small className="text-gray-300 mt-2.5 font-medium">
                    Help us fix the problem! Please click the report button at the top right to let us know.
                </small>

                <div className="w-full h-auto flex justify-center flex-wrap space-x-3">
                    <button
                        type="button"
                        onClick={onclickAction}
                        className="mt-6 inline-block rounded bg-yellow-600 bg-opacity-80 px-8 py-2 text-sm font-medium text-gray-100 hover:text-gray-50 hover:bg-yellow-700 focus:outline-none">
                        <i className="bi bi-arrow-clockwise"></i> Reload
                    </button>

                    <NavigateBack>
                        <button
                            type="button"
                            className="mt-6 inline-block rounded bg-cyan-600 bg-opacity-80 px-8 py-2 text-sm font-medium text-gray-100 hover:bg-cyan-700 focus:outline-none">
                            <i className="bi bi-arrow-left"></i> {`${isNavigateHistory ? " Go Back" : "Go home"}`}
                        </button>
                    </NavigateBack>
                </div>

            </div>
        </div>
    )
}

export default SomthingWrongError
