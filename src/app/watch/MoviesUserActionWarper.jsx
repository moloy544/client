import { useEffect, useState } from "react";

function MoviesUserActionWarper({ usersReactionData, movieData }) {

  const { initialLike, initialDislike, initialIsUser, totalLike, totalDislike } = usersReactionData;

  //All user data state
  const [isUser, setIsUser] = useState(initialIsUser || false);
  const [like, setLike] = useState(initialLike || false);
  const [disLike, setDislike] = useState(initialDislike || false);
  const [isSaved, setIsSaved] = useState(false);
  const totalLikeCount = isUser && like ? totalLike + 1 : totalLike;
  const totalDisLikeCount = isUser && disLike ? totalDislike + 1 : totalDislike;

  //Share movie function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: `Watch ${movieData.title + " " + movieData.type} online moviesbazaar`,
        url: window.location.href,
      })
        .catch((error) => console.error('Error sharing movie:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API

      console.log('Movie URL copied to clipboard');
    }
  };

  const addLike = () => {
    setLike((prevStatus) => !prevStatus);
    if (isUser && disLike) {
      setDislike(false);
    }
  };

  const addDisLike = () => {
    setDislike((prevStatus) => !prevStatus);
    if (isUser && like) {
      setLike(false);
    }
  };

  const saveInLocalStorage = () => {

    const localStorageData = localStorage.getItem('saved-movies-data');

    const parseData = localStorageData ? JSON.parse(localStorageData) : [];

    const checkIsAvailable = parseData?.some((data) => data === movieData._id);

    let updateData;

    if (checkIsAvailable) {

      updateData = parseData.filter((data) => data !== movieData._id);
      setIsSaved(false);
      if (updateData.length === 0) {
        localStorage.removeItem('saved-movies-data');
        return;
      }
    } else {
      setIsSaved(true);
      updateData = [...parseData, movieData._id];
    }

    localStorage.setItem('saved-movies-data', JSON.stringify(updateData));
  };

  useEffect(() => {

    const localStorageData = localStorage.getItem('saved-movies-data');

    const parseData = localStorageData ? JSON.parse(localStorageData) : [];

    const checkIsAvailable = parseData?.some((data) => data === movieData._id);

    if (checkIsAvailable) {

      setIsSaved(true);

    } else {

      setIsSaved(false);

    }

  }, [])

  return (

    <div className="w-auto h-auto mobile:mt-1 mt-4 mobile:pr-4 flex gap-3 overflow-x-scroll scrollbar-hidden">

      <div className="w-auto h-auto flex items-center">

        <div onClick={addLike} role="button" className="w-16 h-auto flex gap-1 bg-gray-200 hover:bg-gray-300 items-center py-1 px-3 border-r border-r-gray-400 rounded-l-2xl">
          <i className={`bi bi-hand-thumbs${like && isUser ? "-up-fill" : "-up"} text-base text-gray-600`}></i>

          <div className="text-xs text-gray-700 font-semibold">{totalLikeCount}</div>
        </div>

        <div onClick={addDisLike} role="button" className="w-16 h-auto flex gap-1 bg-gray-200 hover:bg-gray-300 items-center py-1 px-2 border-r-gray-400 rounded-r-2xl">
          <i className={`bi bi-hand-thumbs${disLike && isUser ? "-down-fill" : "-down"} text-base text-gray-600`}></i>

          <div className="text-xs text-gray-700 font-semibold">{totalDisLikeCount}</div>
        </div>

      </div>

      <div onClick={handleShare} role="button" className="flex gap-1.5 items-center bg-gray-200 hover:bg-gray-300 px-3.5 py-1 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
          <path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"></path>
        </svg>
        <div className="text-xs text-gray-700 font-semibold">Share</div>
      </div>

      <div onClick={saveInLocalStorage} role="button" className="w-auto h-auto flex gap-1 justify-center items-center bg-gray-200 hover:bg-gray-300 py-1 px-2.5 rounded-xl">
        {isSaved ? (
          <i className="bi bi-check2"></i>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false">
            <path d="M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z"></path>
          </svg>
        )}

        <div className="text-xs text-gray-700 font-semibold">{isSaved ? "Saved" : "Save"}</div>

      </div>

      <div role="button" className="flex gap-1.5 items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="22" viewBox="0 0 24 24" width="22" focusable="false">
          <path d="m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z"></path>
        </svg>

        <div className="text-xs text-gray-700 font-semibold">Report</div>
      </div>

    </div>
  )
}

export default MoviesUserActionWarper;
