'use client'

import { useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { appConfig } from "@/config/config";
import { getMovieDeatils } from "@/utils";

const backendServer = appConfig.backendUrl;

function AddMoviesPage() {

    const [state, setState] = useState({
        imdbId: '',
        imdbRating: 0,
        thambnail: '',
        title: '',
        releaseYear: 0,
        fullReleaseDate: '',
        status: 'released',
        category: 'bollywood',
        type: 'movie',
        language: 'hindi',
        genre: [], // Change genre to an array
        watchLink: '',
        castDetails: [],
        searchKeywords: '',
    });

    const genreRef = useRef(null);
    const castRef = useRef(null);

    const getImbdResponse = async () => {

        if (state.imdbId.length >= 8) {

            const mongodbApiResponse = await getMovieDeatils(state.imdbId);

            const { movieData, status } = mongodbApiResponse;

            if (movieData && status === 200) {

                const originalDate = new Date(movieData.fullReleaseDate);

                const formattedDate = originalDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });

                alert("Movie is already exist");

                setState(prevState => ({
                    ...prevState,
                    imdbRating: movieData.imdbRating ? movieData.imdbRating : 0,
                    thambnail: movieData.thambnail,
                    title: movieData.title,
                    releaseYear: movieData.releaseYear,
                    fullReleaseDate: formattedDate,
                    category: movieData.category,
                    language: movieData.language,
                    status: movieData.status,
                    type: movieData.type,
                    genre: movieData.genre,
                    castDetails: movieData.castDetails,
                    watchLink: movieData.watchLink,
                    searchKeywords: movieData.searchKeywords ? movieData.searchKeywords : ''
                }));
                return;
            };

            const omdbApiResponse = await axios.get(`https://www.omdbapi.com/?&apikey=5422c8e9&plot=full&i=${state.imdbId}`);

            const { imdbRating, Title, Year, Released, Poster, Genre, Actors } = omdbApiResponse.data;

            const genreAray = Genre.split(',').map(genre => genre.trim());

            const actorsArray = Actors.split(',').map(actor => actor.trim());

            const originalDate = Released ? new Date(Released) : null;

            // Format the date without the time portion
            const formattedDate = originalDate?.toISOString().split('T')[0];

            setState(prevState => ({
                ...prevState,
                imdbRating: imdbRating !== "N/A" ? imdbRating : 0,
                thambnail: Poster,
                title: Title,
                releaseYear: Year,
                fullReleaseDate: formattedDate,
                genre: genreAray,
                castDetails: actorsArray,
                searchKeywords: ''
            }));

        }
    };


    const sendMoviesToBackend = async () => {

        try {


            const addResponse = await axios.post(`${backendServer}/api/v1/admin/add_movie`, {

                data: { ...state }
            }
            );
            const responseMessage = addResponse.data?.message;

            if (addResponse.status === 200) {

                alert(responseMessage);

                setState(prevState => ({
                    ...prevState,
                    imdbId: '',
                    imdbRating: 0,
                    thambnail: '',
                    title: '',
                    releaseYear: 0,
                    fullReleaseDate: '',
                    genre: [],
                    castDetails: [],
                    watchLink: '',
                    searchKeywords: ''
                }));
            } else {
                alert(responseMessage);
            }
            console.log(addResponse.data);

        } catch (error) {
            console.error('Error sending movies to backend:', error);
            alert("An error occurred while adding movies");
        }
    };

    const handleInputChange = (e, field) => {

        if (field == 'watchLink') {

            const watchLink = e.target.value.split('/');
            const imdbId = watchLink[watchLink.length - 1];

            setState(prevState => ({
                ...prevState,
                imdbId: imdbId
            }));

        };

        if (field == 'category') {

            if (e.target.value === 'bollywood') {

                setState(prevState => ({
                    ...prevState,
                    language: 'hindi'
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    language: 'hindi dubbed'
                }));
            }

        };

        setState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };


    //Add Genre Array In State
    const addGenreToArray = (e) => {

        const inputText = genreRef.current.value;

        if (inputText.length >= 2) {

            setState(prevState => ({
                ...prevState,
                genre: [...state.genre, inputText]
            }));

            genreRef.current.value = '';

        }
    };

    //Remove genre from state 
    const removeGenreFromArray = (genreName) => {

        const updateGenre = state.genre?.filter(genre => genre !== genreName)

        setState(prevState => ({
            ...prevState,
            genre: updateGenre
        }));
    }

    //Add Cast details Array in State
    const addCastToArray = () => {

        const inputText = castRef.current.value;

        if (inputText.length >= 2) {

            setState(prevState => ({
                ...prevState,
                castDetails: [...state.castDetails, inputText]
            }));

            castRef.current.value = '';

        }
    };

    //Remove cast
    const removeCastFromArray = (castName) => {

        const updateCast = state.castDetails?.filter(cast => cast !== castName)

        setState(prevState => ({
            ...prevState,
            castDetails: updateCast
        }));
    };

    return (
        <>
            <div className="sticky top-0 z-30 flex items-center gap-2 w-full h-auto px-2 py-3 text-base text-gray-100 bg-purple-600 shadow-md">
                <Link href="/admin/update">Update</Link>
            </div>
            <main className="w-auto h-full min-h-screen bg-white text-gray-950 flex justify-center py-2">

                <div className="mx-10 mt-5 md:flex md:gap-10">

                    <div className="w-auto h-auto">

                        <div className="flex flex-col my-3">
                            <label className="font-bold">IMDB ID</label>
                            <div className="flex gap-1">
                                <input className="border border-black rounded-sm w-32" type="text" value={state.imdbId} onChange={(e) => handleInputChange(e, 'imdbId')} />
                                <button className="w-16 h-6 bg-green-700 text-sm text-white font-semibold text-center" type="button" onClick={getImbdResponse}>Get</button>
                            </div>
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">WatchLink</label>
                            <input className="border border-black rounded-sm" type="text" value={state.watchLink} onChange={(e) => handleInputChange(e, 'watchLink')} />
                        </div>

                        <div className="flex flex-col my-3">
                            {state.thambnail !== '' && (
                                <img className="w-36 h-36 text-xs" src={state.thambnail} alt="thambnail" />
                            )}
                            <label className="font-bold">Thambnail</label>
                            <input className="border border-black rounded-sm" type="text" value={state.thambnail} onChange={(e) => handleInputChange(e, 'thambnail')} />
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Imdb Rating</label>
                            <input className="border border-black rounded-sm" type="number" value={state.imdbRating} onChange={(e) => handleInputChange(e, 'imdbRating')} />
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Title</label>
                            <input className="border border-black rounded-sm" type="text" value={state.title} onChange={(e) => handleInputChange(e, 'title')} />
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Release Year</label>
                            <input className="border border-black rounded-sm" type="number" value={state.releaseYear} onChange={(e) => handleInputChange(e, 'releaseYear')} />
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Full release date</label>
                            <input className="border border-black rounded-sm" type="text" value={state.fullReleaseDate} onChange={(e) => handleInputChange(e, 'fullReleaseDate')} />
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Release status {"(" + state.status + ")"}</label>
                            <div className="flex gap-5">
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Released
                                    <input onChange={(e) => handleInputChange(e, 'status')} type="radio" value="released" name="status" checked={state.status === 'released'} />
                                </label>
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Coming Soon
                                    <input onChange={(e) => handleInputChange(e, 'status')} type="radio" value="coming soon" name="status" checked={state.status === 'coming soon'} />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Category {"(" + state.category + ")"}</label>
                            <div className="flex gap-5">
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Bollywood
                                    <input onChange={(e) => handleInputChange(e, 'category')} type="radio" value="bollywood" name="category" checked={state.category === 'bollywood'} />
                                </label>
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Hollywood
                                    <input onChange={(e) => handleInputChange(e, 'category')} type="radio" value="hollywood" name="category" checked={state.category === 'hollywood'} />
                                </label>
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    South
                                    <input onChange={(e) => handleInputChange(e, 'category')} type="radio" value="south" name="category" checked={state.category === 'south'} />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Type {"(" + state.type + ")"}</label>
                            <div className="flex gap-5">
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Movie
                                    <input onChange={(e) => handleInputChange(e, 'type')} type="radio" value="movie" name="type" checked={state.type === 'movie'} />
                                </label>
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Series
                                    <input onChange={(e) => handleInputChange(e, 'type')} type="radio" value="series" name="type" checked={state.type === 'series'} />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Language {"(" + state.language + ")"}</label>
                            <div className="flex gap-5">
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Hindi
                                    <input onChange={(e) => handleInputChange(e, 'language')} type="radio" value="hindi" name="language" checked={state.language === 'hindi'} />
                                </label>
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Hindi Dubbed
                                    <input onChange={(e) => handleInputChange(e, 'language')} type="radio" value="hindi dubbed" name="language" checked={state.language === 'hindi dubbed'} />
                                </label>
                                <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                    Bengali
                                    <input onChange={(e) => handleInputChange(e, 'language')} type="radio" value="bengali" name="language" checked={state.language === 'bengali'} />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {state.genre?.map((genre) => (
                                <div key={genre} className="w-auto h-auto relative py-3">
                                    <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                                        <span className="text-gray-800 text-sm ">{genre}</span>
                                    </div>
                                    <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={() => removeGenreFromArray(genre)}></i>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="w-auto h-auto">

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Genre Details</label>
                            <input ref={genreRef} className="border border-black rounded-sm" type="text" />
                            <button type="button" onClick={addGenreToArray} className="w-fit h-5 bg-blue-600 text-sm text-white px-1.5 my-1">Add</button>
                        </div>

                        <div className="text-sm flex gap-2 w-60 h-auto flex-row overflow-x-scroll whitespace-nowrap">
                            {state.castDetails?.map((cast) => (
                                <div key={cast} className="w-auto h-auto relative py-3">
                                    <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                                        <span className="text-gray-800 text-sm ">{cast}</span>
                                    </div>
                                    <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={() => removeCastFromArray(cast)}></i>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">Cast Details</label>
                            <input ref={castRef} className="border border-black rounded-sm" type="text" />
                            <button type="button" onClick={addCastToArray} className="w-fit h-5 bg-blue-600 text-sm text-white px-1.5 my-1">Add</button>
                        </div>

                        <div className="flex flex-col my-3">
                            <label className="font-bold">SearchKeywords</label>
                            <input className="border border-black rounded-sm" type="text" value={state.searchKeywords} onChange={(e) => handleInputChange(e, 'searchKeywords')} />
                        </div>

                        <div onClick={sendMoviesToBackend} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Add movie</div>

                    </div>
                </div>

            </main>

            {/** Add Actor Section **/}
            <AddActorSertion />
        </>
    );
}

export default AddMoviesPage;


function AddActorSertion() {

    const [actorState, setActorState] = useState({
        avatar: '',
        name: '',
        industry: '',
    });

    const handleInputChange = (e, field) => {

        setActorState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    //Send Actor Data to server 
    const sendActorData = async () => {

        try {

            const addResponse = await axios.post(`${backendServer}/api/v1/admin/add_actor`, {
                actorData: actorState
            });

            const { message } = addResponse.data;

            alert(message);

            console.log(addResponse.data);

        } catch (error) {
            console.error('Error sending actor to backend:', error);
            alert("An error occurred while adding actor");
        }
    };

    return (
        <>
            <div className="w-full h-0.5 bg-gray-200"></div>

            <section className="w-auto h-full flex justify-center bg-white py-2">

                <div className="mx-10 mt-2">

                    <h1 className="text-amber-700 text-xl text-center font-semibold">Add Actor Section</h1>

                    <div className="flex flex-col my-3">
                        <label className="font-bold">Actor name</label>
                        <input className="border border-black rounded-sm" type="text" value={actorState.name} onChange={(e) => handleInputChange(e, 'name')} />
                    </div>

                    <div className="flex flex-col my-3">
                        <label className="font-bold">Actor image</label>
                        <input className="border border-black rounded-sm" type="text" value={actorState.avatar} onChange={(e) => handleInputChange(e, 'avatar')} />
                    </div>

                    <div className="flex flex-col my-3">
                        <label className="font-bold">Actor industry {"(" + actorState.industry + ")"}</label>
                        <div className="flex gap-5">
                            <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                Bollywood
                                <input onChange={(e) => handleInputChange(e, 'industry')} type="radio" value="bollywood" name="industry" checked={actorState.industry === 'bollywood'} />
                            </label>
                            <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                Hollywood
                                <input onChange={(e) => handleInputChange(e, 'industry')} type="radio" value="hollywood" name="industry" checked={actorState.industry === 'hollywood'} />
                            </label>
                            <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                                South
                                <input onChange={(e) => handleInputChange(e, 'industry')} type="radio" value="south" name="industry" checked={actorState.industry === 'south'} />
                            </label>
                        </div>
                    </div>
                    <div onClick={sendActorData} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Add actor</div>

                </div>

            </section>
        </>

    )
}
