import { useRouter } from "next/navigation";
import LazyLoadingImage from "./LazyLoadingImage";

export default function MoviesCard({ isLoading, serverMovies }) {

    const router = useRouter();

    const navigatePage = (url) => {

        const encoded = encodeURIComponent(url);

        router.push(`/watch?movie=${encoded}`, {scroll: false});
    };

    if (isLoading && serverMovies.length < 1) {

        return (
            <>
                {Array.from({ length: 20 }, (_, index) => (
                    <div key={index} className="bg-gray-300 w-full object-cover h-64 rounded-[4px]">
                    </div>
                ))}
            </>
        )
    };

    return (
        <>
            {serverMovies?.map((data) => (
                <div key={data._id} onClick={()=> navigatePage(data.watchLink)} className="bg-yellow-800 cursor-pointer movies_image_container">
                    <div className="relative w-full object-cover h-60 bg-white text-white">
                        <LazyLoadingImage imageStyle="w-full h-full object-fill pointer-events-none select-none rounded-t-[1px]" actualSrc={data.thambnail} alt="Movies poster" />
                    </div>
                    <div className="flex items-center px-2 py-1.5 w-full h-[40px] bg-yellow-900 text-white text-xs">
                        <span className="w-auto truncate-lines-2">{data.title + " (" + data.releaseYear + ")"}</span>
                    </div>
                </div>
            ))}
        </>
    )
}