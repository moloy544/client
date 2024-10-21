import Link from "next/link"
import Image from "next/image"
import NavigateBack from "./NavigateBack"
import { resizeImage } from "@/utils"

function NavigateBackTopNav({ title, titleImage = null }) {

    return (
        <header className="sticky top-0 z-50 w-full h-auto flex justify-between items-center bg-gray-900 text-gray-300 px-3 border-b border-b-cyan-800">

            <div className="w-auto h-auto flex gap-4 mobile:gap-2.5 items-center py-2.5 mobile:py-1.5">
                <NavigateBack>
                    <button className=" bg-transparent px-1.5 py-1 text-3xl mobile:text-[25px]" type="button" title="Back">
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </NavigateBack>
                <div className="flex items-center gap-2">
                    {titleImage && titleImage.src && titleImage.alt && (
                        <Image
                            priority
                            className="w-12 h-12 mobile:w-8 mobile:h-8 border border-gray-500 rounded-full"
                            width={30}
                            height={30}
                            src={resizeImage(titleImage.src)}
                            alt={titleImage.alt} />
                    )}
                    <div className="text-xl mobile:text-base text-center justify-self-center truncate">
                        {title}
                    </div>
                </div>
            </div>
            <Link href="/search" title="Search" className="mr-10 mobile:mr-2 p-1 text-2xl mobile:text-xl">
                <i className="bi bi-search"></i>
            </Link>

        </header>
    )
}

export default NavigateBackTopNav
