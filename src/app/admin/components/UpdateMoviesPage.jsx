'use client'

import { useState } from "react";
import axios from "axios";
import { appConfig } from "@/config/config";

const backendServer = appConfig.backendUrl || appConfig.localhostUrl;

function UpdateMoviesPage() {

    const [id, setId] = useState("");

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

    return (
        <>
            <section className="mx-10 my-3 h-fit bg-white border border-blue-100 px-4 shadow-xl rounded-lg py-3">
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
        </>
    );
}



export default UpdateMoviesPage;
