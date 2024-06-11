import Link from "next/link"
import NavigateBack from "./NavigateBack"
import Image from "next/image"

function NavigateBackTopNav({ title, titleImage = null }) {
    return (
        <header className="sticky top-0 z-[300] w-full h-auto flex justify-between items-center bg-gray-900 text-gray-300 px-3 border-b border-b-cyan-800">

            <div className="w-auto h-auto flex gap-4 mobile:gap-2.5 items-center py-4 mobile:py-2">
                <NavigateBack>
                    <i className="bi bi-arrow-left text-3xl mobile:text-[25px] cursor-pointer"></i>
                </NavigateBack>
                <div className="flex items-center gap-2">
                    {titleImage && titleImage.src && titleImage.alt && (
                        <Image
                            priority
                            className="w-12 h-12 mobile:w-8 mobile:h-8 border border-gray-500 rounded-full"
                            width={30}
                            height={30}
                            src={titleImage.src}
                            alt={titleImage.alt} />
                    )}
                    <div className="text-xl mobile:text-base text-center justify-self-center truncate">
                        {title}
                    </div>
                </div>
            </div>
            <Link href="/search" className="mr-10 mobile:mr-2 p-1 text-2xl mobile:text-xl">
                <i className="bi bi-search"></i>
            </Link>

        </header>
    )
}

export default NavigateBackTopNav
