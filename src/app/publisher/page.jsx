'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";
import { creatToastAlert, resizeImage } from "@/utils";
import { getTodayDate, isValidImageUrl, validateMovieDetailsInput } from "./utils/admin.utils";
import UpdateMoviesPage from "./components/UpdateMoviesPage";
import ActorControllerSection from "./components/ActorControllerSection";

// text or number input style properties
const inputStyle = "border-2 border-blue-700 rounded-md p-1 text-sm";

// all options arrays
const typeOptions = ["movie", "series"];
const videoType = ["hd", "cam"]
const statusOptions = ['released', 'coming soon']
const languageOptions = ['hindi', 'hindi dubbed', 'english', 'bengali', 'punjabi', 'tamil', 'telugu', 'malayalam'];
const industryOptions = ['bollywood', 'hollywood', 'south'];
const tagOptions = ['Netflix', 'Amazon Prime', 'Amazon Mini Tv', 'HotStar', 'Zee5', 'Marvel Studio', 'Cartoons'];
const videoSource = process.env.VIDEO_SERVER_URL;

const initialMoviesData = {
    imdbId: '',
    imdbRating: 1,
    title: '',
    displayTitle: '',
    releaseYear: 0,
    fullReleaseDate: '',
    status: 'released',
    category: 'bollywood',
    type: 'movie',
    language: 'hindi',
    genre: [],
    watchLink: [],
    multiAudio: false,
    videoType: "hd",
    castDetails: [],
    tags: [],
};

export default function AdminPage() {

    const [isAudioVideoTypeUpdate, setIsAudioVideoTypeUpdate] = useState("no");
    const [isCreatedDateUpdate, setIsCreatedDateUpdate] = useState(null);

    const [state, setState] = useState(initialMoviesData);

    const [imagePreview, setImagePreview] = useState("");
    const [processing, setProcessing] = useState(false);
    const dateInputRef = useRef(null);

    const getMovieOneByOne = async () => {
        try {
            const response = await axios.get(`${appConfig.backendUrl}/api/v1/admin/movies/one_by_one`);
            if (response.status === 200) {
                const data = response.data.movie;

                const originalDate = new Date(data.fullReleaseDate);

                const formattedDate = originalDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });

                setState(prevState => ({
                    ...prevState,
                    ...data,
                    imdbRating: data.imdbRating ? data.imdbRating : 0,
                    fullReleaseDate: formattedDate,
                }));
                setImagePreview(data.thumbnail);
                if (!isCreatedDateUpdate) {
                    setIsCreatedDateUpdate("no");
                }
            } else {
                alert("No more movies found with audioType and video typ no exist");
            }

        } catch (error) {
            console.log(error);
            alert("Error while getting movies one by one");
        }
    }

    const getImbdResponse = async () => {

        try {

            setState((prev) => ({
                ...prev,
                watchLink: [...state.watchLink.filter(link => !link.includes(videoSource)), videoSource + prev.imdbId]
            }));

            if (state.imdbId.length >= 8) {

                if (state._id || state.tags>0) {
                    setState(initialMoviesData)
                }

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
                    if (movieData._id) {
                        delete movieData._id;
                    };

                    setState(prevState => ({
                        ...prevState,
                        ...movieData,
                        imdbRating: movieData.imdbRating ? movieData.imdbRating : 0,
                        fullReleaseDate: formattedDate,
                    }));
                    setImagePreview(movieData.thumbnail);
                    if (!isCreatedDateUpdate) {
                        setIsCreatedDateUpdate("yes");
                    };

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
                    if (isCreatedDateUpdate) {
                        setIsCreatedDateUpdate(null);
                    };

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

            // validate movie details before sending to backend
            const validationMessage = validateMovieDetailsInput(state);
            if (validationMessage) {
                creatToastAlert({ message: validationMessage });
                return
            };

            setProcessing(true);

            // Create a FormData object to hold the form data
            const formData = new FormData();
            const details = state;

            if (imagePreview && isValidImageUrl(imagePreview)) {
                details.extranalImage_uri = imagePreview;
            }
            if (details.status === "coming soon") {
                delete details.videoType;
                delete details.multiAudio;
            };
            if(details.displayTitle.trim() === ""){
                delete details.displayTitle;
            }

            // add movie data sate in form data
            formData.append('data', JSON.stringify(details));

            // add file in from data 
            const fileInput = document.getElementById('thumbnail-file');

            if (fileInput && fileInput.files[0] && !details.extranalImage_uri) {
                formData.append('file', fileInput.files[0]);
            };
            if (isCreatedDateUpdate) {
                formData.append('createdDateUpdate', isCreatedDateUpdate)
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

                setState(initialMoviesData);
                fileInput.value = '';
                setImagePreview("");
                if (isAudioVideoTypeUpdate === 'yes') {
                    getMovieOneByOne()
                }

            } else {
                alert(responseMessage);
            }

        } catch (error) {
            console.error('Error sending movies to backend:', error);
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    creatToastAlert({ message: error.response.data.message });
                }
            } else {
                creatToastAlert({ message: "An error occurred while adding movies" });
            }
        } finally {
            setProcessing(false);
        }
    };

    // all input fields handler
    const handleInputChange = (value, field) => {

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

        // validate video source
        if (field === "watchLink") {
            
            const urlRegex = /^(https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,}\/)?([a-z0-9.-]+\.[a-z]{2,}\/)?([a-z0-9.-]+\.[a-z]{2,})\/?([^\/#?]+)(\#?([^\/#]*))?$/;
            const match = urlRegex.exec(value);
            if (!match) {
                creatToastAlert({ message: "Invalid video source URL format" });
                return
            };
            // remove extra spaces form video source
            value = value.trim();
        }

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
            const inputText = element.value?.trim().trimEnd() || "";

            if (!inputText || inputText === "") {

                creatToastAlert({ message: "Input value is required" });
                return;
            };

            // get filed name from provided id present element data attribute
            const arrayFiled = element.getAttribute('data-field');

            const isExist = state[arrayFiled]?.some(data => inputText?.toLowerCase() == data?.toLowerCase())

            if (isExist) {
                creatToastAlert({ message: `${inputText} in ${arrayFiled} filed is already exists` });
                return
            };

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
        const dateInputElement = dateInputRef.current;
        // Update max date when the component mounts
        if (dateInputElement && state.status === 'released') {
            dateInputElement.setAttribute('max', getTodayDate());
        } else {
            dateInputElement.removeAttribute('max');
        }
    }, [dateInputRef, state.status]);

    return (
        <>
            <header className="sticky top-0 z-30 flex items-center gap-2 w-full h-auto px-2.5 py-3.5 text-base text-gray-100 bg-purple-600 shadow-md">
                <h2 className="text-base text-white font-semibold">Moviesbazar admin</h2>
            </header>

            <main className="w-auto h-full min-h-screen bg-white text-gray-950 flex justify-center flex-wrap overflow-x-hidden py-2">

                <form onSubmit={sendMoviesToBackend} className="bg-slate-50 md:mx-10 md:mt-4 border-blue-100 px-3 md:px-10 shadow-xl rounded-lg py-2 overflow-hidden">
                    <h1 className="text-xl text-gray-900 text-center font-bold my-3">Add Movie Section</h1>
                    <div className="flex flex-col my-3 gap-2 space-y-2">
                        <label className="font-bold text-gray-800">Audio Video Type Update</label>
                        <fieldset className="flex flex-wrap gap-3">
                            {["yes", "no"].map((data) => (
                                <div key={data}>
                                    <label
                                        htmlFor={`audio-video-type-update-${data}`}
                                        className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${isAudioVideoTypeUpdate === data ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <input
                                            type="radio"
                                            id={`audio-video-type-update-${data}`}
                                            value={data}
                                            className="sr-only"
                                            onChange={() => setIsAudioVideoTypeUpdate(data)}
                                            checked={isAudioVideoTypeUpdate === data}
                                        />

                                        <p className="text-xs font-medium capitalize">{data}</p>
                                    </label>
                                </div>
                            ))}
                        </fieldset>
                    </div>
                    <div className="flex flex-wrap gap-5 md:gap-10">
                        {/** first row */}
                        <div className="w-full md:w-auto h-auto">

                            {state.imdbId !== '' && state.imdbId?.length >= 6 && (
                                <iframe
                                    className="w-full aspect-video border-none z-30"
                                    src={videoSource + state.imdbId}
                                    allowFullScreen="allowfullscreen" />
                            )}

                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">IMDB ID</label>
                                <div className="flex items-center gap-1">
                                    <input className={inputStyle + ' w-40'} type="text" value={state.imdbId} onChange={(e) => handleInputChange(e.target.value, 'imdbId')} placeholder="Enter IMDB id" />
                                    <button className="w-16 h-8 bg-green-700 text-sm text-white font-semibold text-center rounded-sm" type="button" onClick={isAudioVideoTypeUpdate !== "yes" ? getImbdResponse : getMovieOneByOne}>Get</button>
                                </div>
                            </div>

                            <div className="flex flex-col my-3">
                                {imagePreview && (
                                    <Image
                                        priority
                                        width={150}
                                        height={165}
                                        className="w-36 h-40 text-xs rounded-sm"
                                        src={resizeImage(imagePreview)} alt="thumbnail" />

                                )}
                                <label className="font-bold text-gray-800">Select image OR Add image url</label>
                                <input onChange={handleFileInputChnage} type="file" name="thumbnail-file" id="thumbnail-file" accept="image/*" />
                                <input className={inputStyle + ' my-1.5'} type="text" value={imagePreview}
                                    onChange={(e) => setImagePreview(e.target.value)}
                                    placeholder="Enter external image url" />
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
                                <input className={inputStyle} type="text" value={state.title} onChange={(e) => handleInputChange(e.target.value, 'title')} placeholder="Enter title" />
                            </div>
                            <div className="flex flex-col my-3">
                                <label className="font-bold text-gray-800">Display Title</label>
                                <input className={inputStyle} type="text" value={state.displayTitle} onChange={(e) => handleInputChange(e.target.value, 'displayTitle')} placeholder="Enter dispay title (Optional)" />
                            </div>

                            <div className="max-w-[200px] flex flex-col my-3">
                                <label className="font-bold text-gray-800">Imdb Rating</label>
                                <input className={inputStyle} type="number" value={state.imdbRating} onChange={(e) => handleInputChange(e.target.value, 'imdbRating')} placeholder="Enter imdb rating" step={0.1} max={10} />
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
                                                    onChange={(e) => handleInputChange(e.target.value, 'status')}
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
                                                htmlFor={`Content-type-${type}`}
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.type === type ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`Content-type-${type}`}
                                                    value={type}
                                                    className="sr-only"
                                                    onChange={(e) => handleInputChange(e.target.value, 'type')}
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
                                                    onChange={(e) => handleInputChange(e.target.value, 'category')}
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
                                                    onChange={(e) => handleInputChange(e.target.value, 'language')}
                                                    checked={state.language === lng}
                                                />

                                                <p className="text-xs font-medium capitalize">{lng}</p>
                                            </label>
                                        </div>
                                    ))}
                                </fieldset>
                            </div>

                            <div className="flex flex-col my-3 gap-2 space-y-2">
                                <label className="font-bold text-gray-800">Multi Audio</label>
                                <fieldset className="flex flex-wrap gap-3">
                                    <div>
                                        <label
                                            htmlFor="multiAudio-false"
                                            className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${!state.multiAudio ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <input
                                                type="radio"
                                                id="multiAudio-false"
                                                value="false"
                                                className="sr-only"
                                                onChange={() => handleInputChange(false, 'multiAudio')}
                                                checked={state.multiAudio === false}
                                            />

                                            <p className="text-xs font-medium capitalize">No</p>
                                        </label>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="multiAudio-true"
                                            className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.multiAudio ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <input
                                                type="radio"
                                                id="multiAudio-true"
                                                value="true"
                                                className="sr-only"
                                                onChange={() => handleInputChange(true, 'multiAudio')}
                                                checked={state.multiAudio === true}
                                            />

                                            <p className="text-xs font-medium capitalize">Yes</p>
                                        </label>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="font-bold text-gray-800">Video type</label>
                                <fieldset className="flex flex-wrap gap-3">
                                    {videoType.map((type) => (
                                        <div key={type}>
                                            <label
                                                htmlFor={`Video-type-${type}`}
                                                className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${state.videoType === type ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`Video-type-${type}`}
                                                    value={type}
                                                    className="sr-only"
                                                    onChange={(e) => handleInputChange(e.target.value, 'videoType')}
                                                    checked={state.videoType === type}
                                                />

                                                <p className="text-xs font-medium capitalize">{type}</p>
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
                                <div className="inline-flex">
                                <input type="text" id="tags-input" data-field="tags" className={inputStyle} placeholder="Enter tags" defaultValue="" />
                                <select
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value || value === '' || value === ' ') return

                                        const isExist = state.tags.some(data => data?.toLowerCase() == value?.toLowerCase())

                                        if (isExist) {
                                            creatToastAlert({ message: `${value} in tags filed is already exists` });
                                            return
                                        }

                                        setState((prevState) => ({
                                            ...prevState,
                                            tags: [...prevState.tags, value.toLowerCase()],
                                        }));
                                    }}
                                    className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                >
                                    <option value="">Options</option>
                                    {tagOptions.map((tag, i) => (
                                        <option key={i} value={tag}>{tag}</option>
                                    ))}
                                </select>
                                </div>
                                <button type="button" onClick={() => creatInputValueToArrayHandler('tags-input')} className="w-fit h-5 bg-blue-600 text-sm text-white px-2 my-1 rounded-sm">Add</button>
                            </div>

                            {isCreatedDateUpdate && (
                                <div className="flex flex-col space-y-2">
                                    <label className="font-bold text-gray-800">Can Update Created Date</label>
                                    <fieldset className="flex flex-wrap gap-3">
                                        {["yes", "no"].map((data) => (
                                            <div key={data}>
                                                <label
                                                    htmlFor={`update-created-date-${data}`}
                                                    className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${isCreatedDateUpdate === data ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`update-created-date-${data}`}
                                                        value={data}
                                                        className="sr-only"
                                                        onChange={() => setIsCreatedDateUpdate(data)}
                                                        checked={isCreatedDateUpdate === data}
                                                    />

                                                    <p className="text-xs font-medium capitalize">{data}</p>
                                                </label>
                                            </div>
                                        ))}
                                    </fieldset>
                                </div>
                            )}
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
                <ActorControllerSection />
                <UpdateMoviesPage />
            </main>
        </>
    );
};
