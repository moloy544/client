import { useState } from "react"

function MoviesUserActionWarper({ initialLike, initialDislike, initialIsUser, totalLike }) {
    
    //All user data state
    const [isUser, setIsUser] = useState(initialIsUser || false);
    const [like, setLike] = useState(initialLike || false);
    const [disLike, setDislike] = useState(initialDislike || false);
    const totalLikeCounter = isUser && like ? totalLike + 1 : totalLike;

     //Share movie function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: 'Watch lastest movies online moviesbazaar',
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
  
    return (

        <div className="my-2 flex gap-3">

        <div onClick={handleShare} role="button" className="flex gap-1.5 items-center bg-gray-200 hover:bg-gray-300 px-3.5 py-1 rounded-2xl">
              <i className="bi bi-share"></i>
          <div className="text-xs text-gray-600 font-semibold">Share</div>
        </div>

        <div className="w-auto h-auto flex items-center">

            <div onClick={addLike} role="button" className="w-16 h-auto flex gap-1.5 bg-gray-200 hover:bg-gray-300 items-center py-1 px-2 border-r border-r-gray-400 rounded-l-2xl">
                <i className={`bi bi-hand-thumbs${like && isUser ? "-up-fill" : "-up"} text-base`}></i>
                <div className="text-xs text-gray-600 font-semibold">{totalLikeCounter}</div>
            </div>

            <div onClick={addDisLike} role="button" className="w-12 h-auto flex items-center justify-center bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded-r-2xl">
                <i className={`bi bi-hand-thumbs${disLike && isUser ? "-down-fill" : "-down"} text-base`}></i>
            </div>

        </div>
        </div>
    )
}

export default MoviesUserActionWarper;
