'use client'

import { useRef, useState } from "react";
import axios from "axios";
import { appConfig } from "@/config/config";
import { createToastAlert } from "@/utils";

const backendServer = appConfig.backendUrl || appConfig.localhostUrl;
// text or number input style properties
const inputStyle = "border-2 border-blue-700 rounded-md p-1";
// embedded video source url
const videoSource = process.env.VIDEO_SERVER_URL;

function UpdateMoviesPage() {

    const [id, setId] = useState("");

    const [audioVideoTypeState, setAudioVideoTypeState] = useState({
        imdbId: '',
        title: '',
        multiAudio: false,
        videoType: "hd",
    });

    const deleteMovieFromMongoDb = async () => {

        try {

            if (id.length >= 5) {

                const deleteResponse = await axios.delete(`${backendServer}/api/v1/admin/movie/delete/${id}`);
                if (deleteResponse.status === 200) {
                    alert(deleteResponse.data.message || "Delete success");
                    setId('')
                } else {
                    alert("Movie not found in database.");
                }

            } else {
                alert("id is two short as expected");
            };

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            if (error.response.data) {
                alert(error.response.data.message || "An error occurred while delete data");
            };
        };
    };

    const getMovieOneByOne = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/v1/admin/movies/one_by_one`);
            if (response.status === 200) {
                setAudioVideoTypeState(prevState => ({
                    ...prevState,
                    ...response.data.movie
                }))
            } else {
                alert("No more movies found with audioType and video typ no exist");
            }

        } catch (error) {
            console.log(error);
            alert("Error while getting movies one by one");
        }
    }
    const updateMoviesAudioVideoType = async () => {

        try {

            const imdbId = audioVideoTypeState.imdbId?.trim();

            if (audioVideoTypeState.imdbId === '' || audioVideoTypeState.imdbId === ' ' || imdbId.length <= 5) {
                alert("Imdb id in requred and its must be at least 6 characters");
                return;
            }
            const response = await axios.put(`${backendServer}/api/v1/admin/update/movies/audio_and_video_type`, {
                ...audioVideoTypeState
            });

            alert(response.data.message);

        } catch (error) {
            console.error('Error update server status:', error);
            alert("An error occurred while update server status: ");
        };
    };

    // all input fields handler
    const handleInputChange = (value, field) => {
        setAudioVideoTypeState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return (
        <>
            <section className="flex-none mx-10 my-3 h-fit bg-white border border-blue-100 px-2 shadow-xl rounded-lg py-3">
                <div className="max-w-sm">
                    <div className="mx-10">
                        <h3 className=" text-center text-lg text-gray-900 font-bold">Delete Movie or Series</h3>

                        <div className="flex flex-col my-3">
                            <label className="font-medium">Movie IMDB id</label>
                            <input className={inputStyle + ' placeholder:text-gray-700 text-sm'} type="text" placeholder="Enter movie or series IMDB id" value={id} onChange={(e) => setId(e.target.value)} />
                        </div>

                        <div onClick={deleteMovieFromMongoDb} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-red-pure rounded-md cursor-pointer">Delete</div>
                    </div>
                </div>
            </section>

            <section className="flex-none mx-2 my-3 h-fit bg-white border border-blue-100 px-4 shadow-xl rounded-lg py-3">
                <div className="max-w-sm">
                    <div className="mx-10">

                        <h3 className=" text-center text-lg text-gray-900 font-bold">Update Video Audio Type</h3>
                        {audioVideoTypeState.imdbId !== '' && audioVideoTypeState.imdbId?.length >= 6 && (
                            <iframe
                                className="w-full aspect-video border-none z-30"
                                src={videoSource + audioVideoTypeState.imdbId}
                                allowFullScreen="allowfullscreen" />
                        )}

                        <div className="flex flex-col my-3">
                            <label className="font-bold text-gray-800">IMDB ID</label>
                            <div className="flex items-center gap-1">
                                <input className={inputStyle + ' w-40'} type="text" value={audioVideoTypeState.imdbId} placeholder="Movie or series IMDB id" readOnly />
                                <button className="w-16 h-8 bg-green-700 text-sm text-white font-semibold text-center rounded-sm" type="button" onClick={getMovieOneByOne}>Get</button>
                            </div>
                        </div>
                        <strong>Title: <span>{audioVideoTypeState.title}</span></strong>
                        <div className="flex flex-col my-3 gap-2 space-y-2">
                            <label className="font-bold text-gray-800">Multi Audio</label>
                            <fieldset className="flex flex-wrap gap-3">
                                <div>
                                    <label
                                        htmlFor="multiAudio-update-false"
                                        className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${!audioVideoTypeState.multiAudio ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <input
                                            type="radio"
                                            id="multiAudio-update-false"
                                            value="false"
                                            className="sr-only"
                                            onChange={() => handleInputChange(false, 'multiAudio')}
                                            checked={audioVideoTypeState.multiAudio === false}
                                        />

                                        <p className="text-xs font-medium capitalize">No</p>
                                    </label>
                                </div>
                                <div>
                                    <label
                                        htmlFor="multiAudio-update-true"
                                        className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${audioVideoTypeState.multiAudio ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <input
                                            type="radio"
                                            id="multiAudio-update-true"
                                            value="true"
                                            className="sr-only"
                                            onChange={() => handleInputChange(true, 'multiAudio')}
                                            checked={audioVideoTypeState.multiAudio === true}
                                        />

                                        <p className="text-xs font-medium capitalize">Yes</p>
                                    </label>
                                </div>
                            </fieldset>
                        </div>


                        <div className="flex flex-col space-y-2">
                            <label className="font-bold text-gray-800">Video type</label>
                            <fieldset className="flex flex-wrap gap-3">
                                {["hd", "cam"].map((type) => (
                                    <div key={type}>
                                        <label
                                            htmlFor={`Video-type-update-${type}`}
                                            className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${audioVideoTypeState.videoType === type ? "border-blue-500 bg-blue-500 text-white" : "bg-white border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <input
                                                type="radio"
                                                id={`Video-type-update-${type}`}
                                                value={type}
                                                className="sr-only"
                                                onChange={(e) => handleInputChange(e.target.value, 'videoType')}
                                                checked={audioVideoTypeState.videoType === type}
                                            />

                                            <p className="text-xs font-medium capitalize">{type}</p>
                                        </label>
                                    </div>
                                ))}
                            </fieldset>
                        </div>

                        <button type="button" onClick={updateMoviesAudioVideoType} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Update status</button>
                    </div>
                </div>
            </section>

        </>
    );
};

export default UpdateMoviesPage;
