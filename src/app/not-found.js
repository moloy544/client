import NavigateBack from '@/components/NavigateBack';
import Image from 'next/image'

export default function NotFound() {

    return (
        <div className="grid h-screen place-content-center bg-gray-800 px-4">
            <div className="text-center max-w-2xl">

                <div className="w-full h-auto flex justify-center">
                    <Image
                        priority
                        className="w-80 h-80 mobile:w-52 mobile:h-52"
                        src="https://res.cloudinary.com/moviesbazar/image/upload/v1726942506/404-notfound-picture.png"
                        width={280}
                        height={250}
                        alt="404 content not found"
                    />
                </div>

                <h1 className="text-xl font-bold tracking-tight text-gray-200 sm:text-3xl">Uh-oh page not found!</h1>

                <p className="mt-4 text-gray-300 text-base mobile:text-sm">{"We can't find that page maybe its removed from our site plese go back and explore your favorite movies and series."}</p>
               
               <NavigateBack>
                <button 
                    type="button"
                    className="mt-6 inline-block rounded bg-rose-600 px-4 py-3 text-sm font-medium text-gray-100 hover:bg-rose-700 focus:outline-none focus:ring"
                >
                   Back and explore
                </button>
                </NavigateBack>
            </div>
        </div>
    )
}


