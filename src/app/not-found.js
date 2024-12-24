import notFoundImage from "../assets/images/error-404-not-found.png"
import NavigateBack from '@/components/NavigateBack';
import Image from 'next/image'

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

                <h1 className="text-xl font-bold tracking-tight text-gray-200 sm:text-3xl">Uh-oh! Page Not Found</h1>

                <p className="mt-4 text-gray-300 text-base mobile:text-sm">{"We can't find that page. It may have been removed from our site. Please go back and explore your favorite movies and series."}</p>
               
               <NavigateBack>
                <button 
                    type="button"
                    className="mt-6 inline-block rounded bg-teal-700 hover:bg-teal-600 px-4 py-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring focus:ring-teal-500"
                >
                   Back and explore
                </button>
                </NavigateBack>
            </div>
        </div>
    )
}


