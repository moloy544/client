import notFoundImage from "../assets/images/404-notfound-picture.png";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    
    return (
        <div className="grid h-screen place-content-center bg-gray-800 px-4 overflow-hidden">
            <div className="text-center max-w-2xl">

                <div className="w-full h-auto flex justify-center">
                    <Image
                        priority
                        className="w-80 h-80 mobile:w-52 mobile:h-52"
                        src={notFoundImage}
                        width={280}
                        height={250}
                        alt="404 content not found"
                    />
                </div>

                <h1 className="text-xl font-bold tracking-tight text-gray-200 sm:text-3xl">
                    Uh-oh! We couldn&lsquo;t find that page
                </h1>

                <p className="mt-4 text-gray-300 text-base mobile:text-sm">
                    This page may have been removed or the link is broken.
                    <br />
                    Please click the button below to go back and explore other movies and series.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-block rounded bg-teal-700 hover:bg-teal-600 px-4 py-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring focus:ring-teal-500"
                >
                    Back and explore
                </Link>
            </div>
        </div>
    );
}
