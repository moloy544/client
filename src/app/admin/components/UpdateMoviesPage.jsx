'use client'

import { useRef, useState } from "react";
import axios from "axios";
import { appConfig } from "@/config/config";

const backendServer = appConfig.backendUrl || appConfig.localhostUrl;

function UpdateMoviesPage() {

    const [id, setId] = useState("");

    const [serverStatus, setServerStatus] = useState("work");

    const deleteMovieFromMongoDb = async () => {

        try {

            if (id.length >= 15) {

                const deleteResponse = await axios.delete(`${backendServer}/api/v1/admin/movie/delete/${id}`);

                alert(deleteResponse.data.message);

            } else {
                alert("id is two short as expected");
            };

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            alert("An error occurred while adding movies");
        };
    };

    const updateServerStatus = async () => {

        try {
            const response = await axios.put(`${backendServer}/api/v1/admin/server/status`, {
                serverStatus,
                watchLink: process.env.VIDEO_SERVER_URL
            });

            alert(response.data.message);

        } catch (error) {
            console.error('Error update server status:', error);
            alert("An error occurred while update server status: ");
        };
    };

    return (
        <>
            <section className="flex-none mx-10 my-3 h-fit bg-white border border-blue-100 px-2 shadow-xl rounded-lg py-3">
                <div className="max-w-sm">
                    <div className="mx-10">

                        <h3 className=" text-center text-lg text-gray-900 font-bold">Delete Movie or Series</h3>

                        <div className="flex flex-col my-3">
                            <label className="font-medium">Movie id</label>
                            <input className="border border-black rounded-sm px-2 py-1 placeholder:text-gray-700 text-sm" type="text" placeholder="Enter movie or series id" value={id} onChange={(e) => setId(e.target.value)} />
                        </div>

                        <div onClick={deleteMovieFromMongoDb} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-red-pure rounded-md cursor-pointer">Delete</div>
                    </div>
                </div>
            </section>

            <section className="flex-none mx-2 my-3 h-fit bg-white border border-blue-100 px-4 shadow-xl rounded-lg py-3">
                <div className="max-w-sm">
                    <div className="mx-10">

                        <h3 className=" text-center text-lg text-gray-900 font-bold">Update server status</h3>

                        <div className="flex justify-around mt-3">
                            <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1 capitalize">
                                Work
                                <input onChange={() => setServerStatus("work")} type="radio" value="work" name="status" checked={serverStatus === "work"} />
                            </label>
                            <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1 capitalize">
                                Down
                                <input onChange={() => setServerStatus("down")} type="radio" value="down" name="status" checked={serverStatus === "down"} />
                            </label>
                        </div>

                        <div onClick={updateServerStatus} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Update status</div>
                    </div>
                </div>
            </section>
            <UpdateVideoSource />
        </>
    );
}

function UpdateVideoSource() {

    const [loading, setLoading] = useState(false);
    const videoSourceInputRef = useRef(null)

    const updateVideoSource = async () => {

        try {

            const videoSource = videoSourceInputRef.current.value?.trim();

            if (!videoSource.includes('https://') || videoSource.length < 20) {

                alert("Please enter a valid video source");
                return;
            }
            setLoading(true);
            const response = await axios.put(`${backendServer}/api/v1/admin/update/videosource`, {
                videoSource,
                oldVideoSource: process.env.VIDEO_SERVER_URL
            });

            alert(response.data.message);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    };

    return (
        <section className="flex-none mx-10 my-3 h-fit bg-white border border-blue-100 px-2 shadow-xl rounded-lg py-3">
            <div className="max-w-sm">
                <div className="mx-10">

                    <h3 className=" text-center text-lg text-gray-900 font-bold">Update video source</h3>

                    <div className="flex flex-col my-3">
                        <label className="font-medium">Video source</label>
                        <input ref={videoSourceInputRef} className="border border-black rounded-sm px-2 py-1 placeholder:text-gray-700 text-sm" type="text" placeholder="Enter movies video source" />
                    </div>

                    <button
                        type="button"
                        onClick={updateVideoSource} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-green-600 rounded-md cursor-pointer">
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default UpdateMoviesPage;
