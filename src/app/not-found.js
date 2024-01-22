import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {

    return (
        <div className="grid h-screen place-content-center bg-white px-4">
            <div className="text-center">

                <div className="w-full h-auto flex justify-center">
                    <Image
                        priority
                        className="w-96 h-80 mobile:w-80 mobile:h-72"
                        src="https://res.cloudinary.com/dxhafwrgs/image/upload/v1705938283/page-found-with-people-connecting-plug-concept-illustration.jpg"
                        width={280}
                        height={250}
                        alt="somthing was wrong message"
                    />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh page not found!</h1>

                <p className="mt-4 text-gray-500">{"We can't find that page plese back to home page and explore movies or series."}</p>

                <Link
                    href="/"
                    className="mt-6 inline-block rounded bg-cyan-600 px-5 py-3 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring"
                >
                    Go Back Home page
                </Link>
            </div>
        </div>
    )
}


