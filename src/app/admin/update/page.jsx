'use client'

import { useState } from "react";
import axios from "axios";
import { appConfig } from "@/config/config";

const backendServer = appConfig.backendUrl || appConfig.localhostUrl;

function UpdateMoviesPage() {

    const [id, setId] = useState("");

    const deleteMovieFromMongoDb = async () => {

        try {

            if (id.length >=15) {

                const deleteResponse = await axios.delete(`${backendServer}/api/v1/admin/delete/${id}`);

                alert(deleteResponse.data.message);

            } else {
                alert("id is two short as expected");
            };

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            alert("An error occurred while adding movies");
        };
    };

    return (

        <main className="w-auto h-auto flex flex-wrap mt-10 bg-white min-h-screen justify-center">

            <div className="mx-10">

                <h3 className=" text-center text-lg text-gray-900 font-bold">Delete Movie or Series</h3>

                <div className="flex flex-col my-3">
                    <label className="font-medium">Movie id</label>
                    <input className="border border-black rounded-sm px-2 py-1 placeholder:text-gray-700 text-sm" type="text" placeholder="Enter movie or series id" value={id} onChange={(e) => setId(e.target.value)} />
                </div>

                <div onClick={deleteMovieFromMongoDb} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-red-pure rounded-md cursor-pointer">Delete</div>
            </div>

            <UpdateWatchLinkComponent />

        </main>
    );
}

function UpdateWatchLinkComponent() {

    const [newWatchLink, setNewWatchLink] = useState("");

    const [oldWatchLink, setOldWatchLink] = useState("");

    const updateWatchLink = async () => {

        try {

            if (newWatchLink.length <= 20 && oldWatchLink.length <= 20) {
                return alert("Both watchlink must be at least 20 characters");
            };

            if (newWatchLink === oldWatchLink) {
                return alert("Please add a new watchlink");
            };

            const updateResponse = await axios.put(`${backendServer}/api/v1/admin/movie/update_watchlink`, {
                newWatchLink,
                oldWatchLink
            });

            alert(updateResponse.data.message);

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            alert("An error occurred while update watchlink");
        }
    };

    return (

        <div className="mx-10">

            <h3 className=" text-center text-lg text-gray-900 font-bold">Update soucre watch link</h3>

            <div className="flex flex-col my-3">
                <label className="font-medium">Old watch link</label>
                <input className="border border-black rounded-sm px-2 py-1 placeholder:text-gray-700 text-sm" type="text" placeholder="Enter old watch link" value={oldWatchLink} onChange={(e) => setOldWatchLink(e.target.value)} />
            </div>

            <div className="flex flex-col my-3">
                <label className="font-medium">New watch link</label>
                <input className="border border-black rounded-sm px-2 py-1 placeholder:text-gray-700 text-sm" type="text" placeholder="Enter new watch link" value={newWatchLink} onChange={(e) => setNewWatchLink(e.target.value)} />
            </div>

            <div onClick={updateWatchLink} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">
                Update
            </div>
        </div>

    );

}

export default UpdateMoviesPage;
