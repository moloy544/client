'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";
import ActressController from "./components/ActressController";
import UpdateMoviesPage from "./components/UpdateMoviesPage";
import { creatToastAlert } from "@/utils";
import { getTodayDate, validateMovieDetailsInput } from "./utils/admin.utils";

// text or number input style properties
const inputStyle = "border-2 border-blue-700 rounded-md p-1 text-sm";

// all options arrays
const typeOptions = ["movie", "series"];
const statusOptions = ['released', 'coming soon']
const languageOptions = ['hindi', 'hindi dubbed', 'bengali', 'punjabi'];
const industryOptions = ['bollywood', 'hollywood', 'south'];
const tagOptions = ['Netflix', 'Amazon Prime', 'Amazon Mini Tv', 'HotStar', 'Zee5', 'Marvel Studio', 'Cartoons'];
const videoSource = process.env.VIDEO_SERVER_URL;
export default function AdminPage() {

    const [state, setState] = useState({
        imdbId: '',
        imdbRating: 1,
        title: '',
        releaseYear: 0,
        fullReleaseDate: '',
        status: 'released',
        category: 'bollywood',
        type: 'movie',
        language: 'hindi',
        genre: [],
        watchLink: [],
        castDetails: [],
        tags: [],
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const dateInputRef = useRef(null);

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

                    creatToastAlert({ message: "Movie is already exist" });

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

                    const { imdbRating, Title, Released, Poster, Genre, Actors } = omdbApiResponse.data;

                    const genreAray = Genre.split(',').map(genre => genre.trim());

                    const actorsArray = Actors.split(',').map(actor => actor.trim());

                    setState(prevState => ({
                        ...prevState,
                        imdbRating: imdbRating !== "N/A" ? Number(imdbRating) : 0,
                        title: Title,
                        fullReleaseDate: Released,
                        genre: genreAray,
                        castDetails: actorsArray
                    }));
                    if (Released && Released !== "N/A") {
                        handleDateChange(Released)
                    }
                    if (Poster && Poster !== "N/A") {
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

            // update or add environment variables video source if is not exist
            const modifiedSources = state.watchLink.find(link => link.includes(videoSource))
                ? state.watchLink
                : [...state.watchLink, `${videoSource}${state.imdbId}`];

            // update state watchlink with new updated watchlink
            const modifiedState = {
                ...state,
                watchLink: modifiedSources
            };

            // validate movie details before sending to backend
            const validationMessage = validateMovieDetailsInput(state);
            if (validationMessage) {
                creatToastAlert({ message: validationMessage });
                return
            };

            setProcessing(true);

            // Create a FormData object to hold the form data
            const formData = new FormData();

            // add movie data sate in form data
            formData.append('data', JSON.stringify(modifiedState));

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

                creatToastAlert({ message: responseMessage || "Movie added successfully" });

                setState(prevState => ({
                    ...prevState,
                    imdbId: '',
                    imdbRating: 1,
                    title: '',
                    releaseYear: 0,
                    fullReleaseDate: '',
                    genre: [],
                    castDetails: [],
                    watchLink: [],
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

        let value = e.target?.value || null;

        if (field === "imdbRating") {
            value = Number(value);
        };

        if (field == 'category') {

            if (value === 'bollywood') {

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
            [field]: value
        }));
    };

    // input value to array data handler
    const creatInputValueToArrayHandler = (elementId) => {

        const element = document.getElementById(elementId);

        if (element) {

            // get input value from provided id present element
            const inputText = element.value || "";

            if (!inputText || inputText === "") {

                creatToastAlert({ message: "Input value is required" });
            };

            // get filed name from provided id present element data attribute
            const arrayFiled = element.getAttribute('data-field');

            const isExist = state[arrayFiled]?.some(data => inputText?.toLowerCase() == data?.toLowerCase())

            if (isExist) {
                creatToastAlert({ message: `${inputText} in ${arrayFiled} filed is already exists` });
                return
            };

            if (inputText.length < 2) {
                creatToastAlert({ message: "Value is very short" });
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

    // Handle changes for the date input
    const handleDateChange = (e) => {

        const selectedDate = e.target?.value || e;

        // check if date is null or empty empty the existing date
        if (!selectedDate) {
            setState(prevState => ({
                ...prevState,
                fullReleaseDate: '',
                releaseYear: 0,
            }));
            return;
        };
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
        // set selected date in state
        setState(prevState => ({
            ...prevState,
            releaseYear: year,
            fullReleaseDate: formattedDate
        }));
    };

    // remove image ptreview after componet mount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        // Update max date when the component mounts
        if (dateInputRef.current) {
            dateInputRef.current.setAttribute('max', getTodayDate());
        }
    }, []);

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

                            {state.imdbId !== '' && state.imdbId.length >= 6 && (
                                <iframe
                                    className="w-full aspect-video border-none z-30"
                                    src={videoSource + state.imdbId}
                                    allowFullScreen="allowfullscreen" />
                            )}

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">IMDB ID</label>
                                <div className="flex items-center gap-1">
                                    <input className={inputStyle + ' w-40'} type="text" value={state.imdbId} onChange={(e) => handleInputChange(e, 'imdbId')} placeholder="Enter IMDB id" />
                                    <button className="w-16 h-8 bg-green-700 text-sm text-white font-semibold text-center rounded-sm" type="button" onClick={getImbdResponse}>Get</button>
                                </div>
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

                            {state.watchLink?.length > 0 && (
                                <div className="text-sm flex gap-2 w-60 h-auto flex-row overflow-x-scroll whitespace-nowrap">
                                    {state.watchLink.map((source, index) => (
                                        <div key={index} className="w-auto h-auto relative py-2">
                                            <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                                                <span className="text-gray-800 text-sm ">{source}</span>
                                            </div>
                                            <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={() => removeFromCreatadArrayData('watchLink', source)}></i>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Video sources</label>
                                <input type="text" data-field="watchLink" id="video-source-input" className={inputStyle} placeholder="Enter video source" />
                                <button type="button" onClick={() => creatInputValueToArrayHandler('video-source-input')} className="w-fit h-5 bg-blue-600 text-sm text-white px-2 my-1 rounded-sm">Add</button>
                            </div>

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Title</label>
                                <input className={inputStyle} type="text" value={state.title} onChange={(e) => handleInputChange(e, 'title')} placeholder="Enter title" />
                            </div>

                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Imdb Rating</label>
                                <input className={inputStyle} type="number" value={state.imdbRating} onChange={(e) => handleInputChange(e, 'imdbRating')} placeholder="Enter imdb rating" step={0.1} max={10} min={1} />
                            </div>


                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Release Year</label>
                                <input className={inputStyle + ' bg-slate-100'} type="number" value={state.releaseYear} readOnly />
                            </div>

                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Full release date</label>
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    onChange={handleDateChange}
                                />
                                <input className={inputStyle + ' bg-slate-100'} type="text" value={state.fullReleaseDate} readOnly />
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
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.status === status ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
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

                            <div className="flex flex-col space-y-2">
                                <label className="font-bold text-gray-800">Type</label>
                                <fieldset className="flex flex-wrap gap-3">
                                    {typeOptions.map((type) => (
                                        <div key={type}>
                                            <label
                                                htmlFor={`Video-type-${type}`}
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.type === type ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`Video-type-${type}`}
                                                    value={type}
                                                    className="sr-only"
                                                    onChange={(e) => handleInputChange(e, 'type')}
                                                    checked={state.type === type}
                                                />

                                                <p className="text-xs font-medium capitalize">{type}</p>
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
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.category === industry ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
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
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.language === lng ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
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
                                <input type="text" data-field="genre" id="genre-input" className={inputStyle} placeholder="Enter genre name" />
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
                                <input type="text" data-field="castDetails" id="cast-details-input" className={inputStyle} placeholder="Enter cast name" />
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
                                <input type="text" list="tagOptions" id="tags-input" data-field="tags" className={inputStyle} placeholder="Enter tags" />
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
