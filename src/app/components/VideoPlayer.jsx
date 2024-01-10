'use client'
import { useRouter } from "next/navigation";
import { useEffect, useRef} from "react";
import CategoryGroupSlider from "./CategoryGroupSlider";

export default function Videoplayer({ movieDetails }) {

  const playerRef = useRef(null);

  const router = useRouter();
  if (!movieDetails) {
    router.push('/');
  };

  const {
    title,
    thambnail,
    releaseYear,
    fullReleaseDate,
    genre,
    watchLink,
    castDetails,
    language
  } = movieDetails || {};

  const showPlayer = () => {

    window.location.hash = "player"

  };

  useEffect(() => {
    const handleHashChange = () => {

      const playerElement = playerRef.current;

      if (window.location.hash === "#player") {
       
        playerElement.classList.add('block');
        playerElement.classList.remove('hidden');
      } else {
        playerElement.classList.remove('block');
        playerElement.classList.add('hidden');
      }
    };

    // Initial check on mount
    handleHashChange();

    // Add event listener to listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); 

  return (
    <>
      <CategoryGroupSlider />

      <div className="w-full h-full min-h-[90vh] bg-gray-800 py-6 flex justify-center items-center">

        <div className="w-fit h-fit mx-2 px-4 py-5 flex mobile:flex-col gap-2 bg-cyan-50 rounded-sm shadow-xl">

          <div className="w-[260px] h-[340px] mobile:w-[240px] mobile:h-[300px] border-2 border-cyan-500 bg-white rounded-md relative overflow-hidden">

            <ZoomImage thumbnail={thambnail} title={thambnail} />

            <div role="button" onClick={showPlayer}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-gray-100 w-12 h-12 flex justify-center items-center rounded-full pl-0.5 transition-transform duration-300 hover:scale-110">
              <i className="bi bi-play text-3xl"></i>
            </div>

          </div>

          <div className="w-auto h-auto max-w-sm min-w-[320px] mobile:min-w-[280px] px-2 py-3">

            <div className="text-base text-gray-900 font-bold my-3.5">Title: <span className="text-sm text-gray-600 font-semibold">{title}</span></div>
            <div className="text-base text-gray-900 font-bold my-3.5">Year: <span className="text-sm text-gray-600 font-semibold">{releaseYear}</span></div>
            {fullReleaseDate && (
              <div className="text-base text-gray-900 font-bold my-3.5">Released: <span className="text-sm text-gray-600 font-semibold">{fullReleaseDate}</span></div>
            )}

            <div className="text-base text-gray-900 font-bold my-3.5">Language: <span className="text-sm text-gray-600 font-semibold">{language?.charAt(0).toUpperCase() + language?.slice(1)}</span></div>

            {castDetails?.length > 0 && (
              <>
                <div className="w-auto h-auto flex flex-wrap gap-1 items-center my-3.5">
                  <div className="text-base text-gray-900 font-bold">Star cast: </div>
                  {castDetails?.map((cast, index) => (
                    <div key={index} className="text-gray-600 text-xs font-semibold rounded-md">
                      {cast}
                      {index !== castDetails.length - 1 && ','}
                    </div>
                  ))}
                </div>

              </>
            )}

            <div className="w-auto h-auto flex flex-wrap gap-1.5 items-center my-3.5 mt-6">
              <div className="text-base text-gray-900 font-bold">Genre: </div>
              {genre?.map((genre) => (
                <div key={genre} className="bg-gray-200 text-gray-600 w-fit h-auto px-2 py-1 text-xs font-semibold rounded-md">
                  {genre}
                </div>
              ))}
            </div>

          </div>
        </div>
  
          <iframe ref={playerRef} className="fixed top-0 left-0 w-full h-full border-none z-[600] hidden" src={watchLink} allowFullScreen="allowfullscreen">
          </iframe>

      </div>
    </>
  )
}


const ZoomImage = ({ thumbnail, title }) => {
  return (
    <div className="w-full h-full overflow-hidden relative group">
      <img
        className="w-full h-full object-cover transition-transform duration-8000 transform-gpu animate-zoom"
        src={thumbnail}
        alt={title}
      />
    </div>
  );
};

