'use client'

import { useState } from "react";
import axios from "axios";
import { appConfig } from "@/config/config";

const backendServer = appConfig.backendUrl || appConfig.localhostUrl;

function UpdateMoviesPage() {

    const [imdbId, setImdbId] = useState("");

    const deleteMovieFromMongoDb = async () => {

        try {

            if (imdbId.length > 5) {

                const deleteResponse = await axios.delete(`${backendServer}/api/v1/admin/delete/${imdbId}`);

                alert(deleteResponse.data.message);

                console.log(deleteResponse.data);

            } else {
                alert("Imdb is is two short as expected");
            }

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            alert("An error occurred while adding movies");
        }
    };

    return (

        <main className="w-auto h-auto flex flex-wrap mt-10 bg-white min-h-screen justify-center">

            <div className="mx-10">

                <div className="flex flex-col my-3">
                    <label className="font-bold">Movie imdbId</label>
                    <input className="border border-black rounded-sm" type="text" value={imdbId} onChange={(e) => setImdbId(e.target.value)} />
                </div>

                <div onClick={deleteMovieFromMongoDb} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-red-pure rounded-md cursor-pointer">Delete</div>
            </div>

            <UpdateWatchLinkComponent />

        </main>
    );
}

function UpdateWatchLinkComponent() {

    const [imdbId, setImdbId] = useState("");
    const [watchLink, setWatchLink] = useState("");

    const handleWatchLinkChange = (e)=>{

        const inputValue = e.target.value;

        const inputWatchLink = inputValue.split('/');
        const extractedImdbId = inputWatchLink[inputWatchLink.length - 1];
          setImdbId(extractedImdbId);
          setWatchLink(inputValue);
    }

    const updateWatchLink = async () => {

        try {

            if (imdbId.length < 5) {
                return alert("Imdb Id must be at least 5 characters");
            } else if (watchLink.length < 10) {
                return alert("Watch Link must be at least 10 characters");
            };

            const updateResponse = await axios.put(`${backendServer}/api/v1/admin/update-watchlink/${imdbId}`, {
                watchLink
            }
            );

            alert(updateResponse.data.message);

            console.log(updateResponse.data);

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            alert("An error occurred while adding movies");
        }
    };

    return (

        <div className="mx-10">

            <div className="flex flex-col my-3">
                <label className="font-bold">Movie imdbId</label>
                <input className="border border-black rounded-sm" type="text" value={imdbId} onChange={(e) => setImdbId(e.target.value)} />
            </div>

            <div className="flex flex-col my-3">
                <label className="font-bold">Movie watchLink</label>
                <input className="border border-black rounded-sm" type="text" value={watchLink} onChange={handleWatchLinkChange} />
            </div>

            <div onClick={updateWatchLink} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">
                Update
            </div>
        </div>

    );

}

export default UpdateMoviesPage;
