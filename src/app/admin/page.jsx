'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";
import ActressController from "./components/ActressController";
import UpdateMoviesPage from "./components/UpdateMoviesPage";
import { creatToastAlert } from "@/utils";

// text or number input style properties
const inputStyle = "border-2 border-blue-700 rounded-md p-1";

// all options arrays
const statusOptions = ['released', 'coming soon']
const languageOptions = ['hindi', 'hindi dubbed', 'bengali', 'punjabi'];
const industryOptions = ['bollywood', 'hollywood', 'south'];
const tagOptions = ['Netflix', 'Amazon Prime', 'Amazon Mini Tv', 'HotStar', 'Zee5', 'Marvel Studio', 'Cartoons'];

export default function AdminPage() {

    const [state, setState] = useState({
        imdbId: '',
        imdbRating: 0,
        title: '',
        releaseYear: 0,
        fullReleaseDate: '',
        status: 'released',
        category: 'bollywood',
        type: 'movie',
        language: 'hindi',
        genre: [],
        watchLink: '',
        castDetails: [],
        tags: [],
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [processing, setProcessing] = useState(false);

    const getImbdResponse = async () => {

        try {

            if (state.imdbId.length >= 8) {

                const mongodbApiResponse = await axios.get(`${appConfig.backendUrl}/api/v1/admin/movie/get/${state.imdbId}`);

                const { movieData } = mongodbApiResponse.data;

                if (movieData && mongodbApiResponse.status === 200) {

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
                        tags: movieData.tags
                    }));
                    setImagePreview(movieData.thambnail)
                    return;
                };

                const omdbApiResponse = await axios.get(`https://www.omdbapi.com/?&apikey=5422c8e9&plot=full&i=${state.imdbId}`);

                if (omdbApiResponse.data.Title) {

                    const { imdbRating, Title, Year, Released, Poster, Genre, Actors } = omdbApiResponse.data;

                    const genreAray = Genre.split(',').map(genre => genre.trim());

                    const actorsArray = Actors.split(',').map(actor => actor.trim());

                    setState(prevState => ({
                        ...prevState,
                        imdbRating: imdbRating !== "N/A" ? imdbRating : 0,
                        thambnail: Poster,
                        title: Title,
                        releaseYear: Year,
                        fullReleaseDate: Released,
                        genre: genreAray,
                        castDetails: actorsArray
                    }));
                    if (Poster && Poster!== "N/A") {
                        setImagePreview(Poster)
                    }
                } else {
                    alert(omdbApiResponse.data.Error)
                };;
            };
        } catch (error) {
            console.log(error)
        }
    };

    const sendMoviesToBackend = async (e) => {
        e.preventDefault();

        try {

            if (processing) {
                return
            };

            setProcessing(true);

            // Create a FormData object to hold the form data
            const formData = new FormData();

            // add movie data sate in form data
            formData.append('data', JSON.stringify(state));

            // add file in from data 
            const fileInput = document.getElementById('thambnail-file');

            if (fileInput && fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            };

            // send the form data to the backend API
            const addResponse = await axios.post(`${appConfig.backendUrl}/api/v1/admin/movie/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const responseMessage = addResponse.data?.message;

            if (addResponse.status === 200) {

                creatToastAlert({message: responseMessage || "Movie added successfully"});

                setState(prevState => ({
                    ...prevState,
                    imdbId: '',
                    imdbRating: 0,
                    title: '',
                    releaseYear: 0,
                    fullReleaseDate: '',
                    genre: [],
                    castDetails: [],
                    watchLink: '',
                    tags: []
                }));
                fileInput.value = '';
                setImagePreview(null);
            } else {
                alert(responseMessage);
            }

        } catch (error) {
            console.error('Error sending movies to backend:', error);
            alert("An error occurred while adding movies");
        } finally {
            setProcessing(false);
        }
    };

    // all input fields handler
    const handleInputChange = (e, field) => {

        if (field == 'imdbId') {

            const creatWatchLink = process.env.VIDEO_SERVER_URL + e.target.value;

            setState(prevState => ({
                ...prevState,
                watchLink: creatWatchLink
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
            };
        };

        setState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    // input value to array data handler
    const creatInputValueToArrayHandler = (elementId) => {

        const element = document.getElementById(elementId);

        if (element) {

            // get input value from provided id present element
            const inputText = element.value || "";

            if (!inputText || inputText === "") {

                alert("Input value is required");
            };

            // get filed name from provided id present element data attribute
            const arrayFiled = element.getAttribute('data-field');

            const isExist = state[arrayFiled]?.some(data => inputText?.toLowerCase() == data?.toLowerCase())

            if (isExist) {
                alert(`${inputText} in ${arrayFiled} filed is already exists`);
                return
            };

            if (inputText.length < 2) {
                alert("Value is very short");
                return
            }

            setState(prevState => ({
                ...prevState,
                [arrayFiled]: [...state[arrayFiled], arrayFiled === "tags" ? inputText?.toLowerCase() : inputText]
            }));

            element.value = '';
        }
    };

    //Remove cast
    const removeFromCreatadArrayData = (field, value) => {

        const updateData = state[field]?.filter(data => data !== value)

        setState(prevState => ({
            ...prevState,
            [field]: updateData
        }));
    };

    // creat image ptreview 
    const handleFileInputChnage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const blobUri = URL.createObjectURL(file);
            setImagePreview(blobUri);
        }
    };

    // remove image ptreview after componet mount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <>
            <header className="sticky top-0 z-30 flex items-center gap-2 w-full h-auto px-2.5 py-3.5 text-base text-gray-100 bg-purple-600 shadow-md">
                <h2 className="text-base text-white font-semibold">Moviesbazar admin</h2>
            </header>

            <main className="w-auto h-full min-h-screen bg-white text-gray-950 flex justify-center flex-wrap overflow-x-hidden py-2">

                <form onSubmit={sendMoviesToBackend} className="bg-slate-50 md:mx-10 md:mt-4 border-blue-100 px-3 md:px-10 shadow-xl rounded-lg py-2 overflow-hidden">
                    <h1 className="text-xl text-gray-900 text-center font-bold my-3">Add Movie Section</h1>

                    <div className="flex flex-wrap gap-5 md:gap-10">
                        {/** first row */}
                        <div className="w-full md:w-auto h-auto">

                            {state.watchLink !== "" && (
                                <iframe
                                    className="w-full aspect-video border-none z-30"
                                    src={state.watchLink}
                                    allowFullScreen="allowfullscreen" />
                            )}
                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">IMDB ID</label>
                                <div className="flex items-center gap-1">
                                    <input className={inputStyle+' w-40'} type="text" value={state.imdbId} onChange={(e) => handleInputChange(e, 'imdbId')} />
                                    <button className="w-16 h-8 bg-green-700 text-sm text-white font-semibold text-center rounded-sm" type="button" onClick={getImbdResponse}>Get</button>
                                </div>
                            </div>

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">WatchLink</label>
                                <input className={inputStyle} type="text" value={state.watchLink} onChange={(e) => handleInputChange(e, 'watchLink')} />
                            </div>

                            <div className="flex flex-col my-3">
                                {imagePreview && (
                                    <Image
                                        priority
                                        width={150}
                                        height={165}
                                        className="w-36 h-40 text-xs rounded-sm"
                                        src={imagePreview} alt="thambnail" />

                                )}
                                <label className="font-bold text-gray-800">Select image</label>
                                <input onChange={handleFileInputChnage} type="file" name="thambnail-file" id="thambnail-file" accept="image/*" />
                            </div>

                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Imdb Rating</label>
                                <input className={inputStyle} type="number" value={state.imdbRating} onChange={(e) => handleInputChange(e, 'imdbRating')} />
                            </div>

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Title</label>
                                <input className={inputStyle} type="text" value={state.title} onChange={(e) => handleInputChange(e, 'title')} />
                            </div>

                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Release Year</label>
                                <input className={inputStyle} type="number" value={state.releaseYear} onChange={(e) => handleInputChange(e, 'releaseYear')} />
                            </div>

                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Full release date</label>
                                <input className={inputStyle} type="text" value={state.fullReleaseDate} onChange={(e) => handleInputChange(e, 'fullReleaseDate')} />
                            </div>

                        </div>

                        {/** Second row **/}
                        <div className="w-full md:w-auto h-auto">

                            <div className="flex flex-col space-y-2">
                                <label className="font-bold text-gray-800">Release status</label>
                                <fieldset className="flex flex-wrap gap-3">
                                    {statusOptions.map((status) => (
                                        <div key={status}>
                                            <label
                                                htmlFor={status}
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.status === status ? "border-blue-500 bg-blue-500 text-white": "bg-white border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={status}
                                                    value={status}
                                                    className="sr-only"
                                                    onChange={(e) => handleInputChange(e, 'status')}
                                                    checked={state.status === status}
                                                />

                                                <p className="text-xs font-medium capitalize">{status}</p>
                                            </label>
                                        </div>
                                    ))}
                                </fieldset>
                            </div>

                            <div className="flex flex-col my-3 space-y-2">
                                <label className="font-bold text-gray-800">Industry</label>
                                <fieldset className="flex flex-wrap gap-3">
                                    {industryOptions.map((industry) => (
                                        <div key={industry}>
                                            <label
                                                htmlFor={industry}
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.category === industry ? "border-blue-500 bg-blue-500 text-white": "bg-white border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={industry}
                                                    value={industry}
                                                    className="sr-only"
                                                    onChange={(e) => handleInputChange(e, 'category')}
                                                    checked={state.category === industry}
                                                />

                                                <p className="text-xs font-medium capitalize">{industry}</p>
                                            </label>
                                        </div>
                                    ))}
                                </fieldset>
                            </div>

                            <div className="flex flex-col my-3 gap-2 space-y-2">
                                <label className="font-bold text-gray-800">Language</label>
                                <fieldset className="flex flex-wrap gap-3">
                                    {languageOptions.map((lng) => (
                                        <div key={lng}>
                                            <label
                                                htmlFor={lng}
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.language === lng ? "border-blue-500 bg-blue-500 text-white": "bg-white border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={lng}
                                                    value={lng}
                                                    className="sr-only"
                                                    onChange={(e) => handleInputChange(e, 'language')}
                                                    checked={state.language === lng}
                                                />

                                                <p className="text-xs font-medium capitalize">{lng}</p>
                                            </label>
                                        </div>
                                    ))}
                                </fieldset>
                            </div>

                            {state.genre?.length > 0 && (
                                <div className="text-sm flex gap-2 w-60 h-auto flex-row overflow-x-scroll whitespace-nowrap">
                                    {state.genre?.map((genre) => (
                                        <div key={genre} className="w-auto h-auto relative py-2">
                                            <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                                                <span className="text-gray-800 text-sm ">{genre}</span>
                                            </div>
                                            <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={() => removeFromCreatadArrayData('genre', genre)}></i>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Genre Details</label>
                                <input type="text" data-field="genre" id="genre-input" className={inputStyle} />
                                <button type="button" onClick={() => creatInputValueToArrayHandler('genre-input')} className="w-fit h-5 bg-blue-600 text-sm text-white px-2 my-1 rounded-sm">Add</button>
                            </div>

                            {state.castDetails?.length > 0 && (
                                <div className="text-sm flex gap-2 w-60 h-auto flex-row overflow-x-scroll whitespace-nowrap">
                                    {state.castDetails?.map((cast) => (
                                        <div key={cast} className="w-auto h-auto relative py-2">
                                            <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                                                <span className="text-gray-800 text-sm ">{cast}</span>
                                            </div>
                                            <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={() => removeFromCreatadArrayData('castDetails', cast)}></i>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Cast Details</label>
                                <input type="text" data-field="castDetails" id="cast-details-input" className={inputStyle} />
                                <button type="button" onClick={() => creatInputValueToArrayHandler('cast-details-input')} className="w-fit h-5 bg-blue-600 text-sm text-white px-2 my-1 rounded-sm">Add</button>
                            </div>

                            {state.tags?.length > 0 && (
                                <div className="text-sm flex gap-2 w-60 h-auto flex-row overflow-x-scroll whitespace-nowrap">
                                    {state.tags?.map((tag) => (
                                        <div key={tag} className="w-auto h-auto relative py-2">
                                            <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                                                <span className="text-gray-800 text-sm ">{tag}</span>
                                            </div>
                                            <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={() => removeFromCreatadArrayData('tags', tag)}></i>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Adition tags</label>
                                <input type="text" list="tagOptions" id="tags-input" data-field="tags" className={inputStyle} />
                                <datalist id="tagOptions">
                                    {tagOptions.map((tag) => (
                                        <option key={tag} value={tag} />
                                    ))}
                                </datalist>
                                <button type="button" onClick={() => creatInputValueToArrayHandler('tags-input')} className="w-fit h-5 bg-blue-600 text-sm text-white px-2 my-1 rounded-sm">Add</button>
                            </div>

                            <button
                                disabled={processing}
                                type="submit"
                                className="my-4 w-full max-w-[300px] h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer font-semibold">
                                {!processing ? "Upload" : "Uploading..."}
                            </button>
                        </div>
                    </div>
                </form>

                {/** Other Update or Add Data Section **/}
                <ActressController />
                <UpdateMoviesPage />
            </main>
        </>
    );
};
