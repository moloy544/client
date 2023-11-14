import { useRouter } from "next/navigation";
import LazyLoadingImage from "./LazyLoadingImage";

export default function MoviesCard({ movies }) {

    const router = useRouter();

    const navigatePage = (url) => {

        router.push(`/watch?watchurl=${url}`);
      };    

    return (
        <>
         {movies?.map((data) => (
        <div key={data._id} onClick={() => navigatePage(data?.sourceUrl)} className="bg-yellow-800 cursor-pointer movies_image_container">
            <div className="relative w-full object-cover h-60 bg-white text-white">
                <LazyLoadingImage imageStyle="w-full h-full object-fill pointer-events-none select-none rounded-t-[1px]" actualSrc={data.images[0].publicUrl} alt="Movies poster" />
            </div>
            <div className="flex items-center px-2 py-1.5 w-full h-[40px] bg-yellow-900 text-white text-xs">
                <span className="w-auto truncate-lines-2">{data.title + " (" + data.release.split('-')[0] + ")"}</span>
            </div>
        </div>
         ))}
        </>
    )
}