'use client'
import { appConfig } from "@/config/config";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

function UpdateMoviesPage() {

    const searchParams = useSearchParams()
 
  const id = searchParams.get('id') || "";

    const backendServer = appConfig.backendUrl || appConfig.localhostUrl;

    const [state, setState] = useState({
        movieId: id
    });

    const castRef = useRef(null)

    const sendMoviesToBackend = async () => {

        try {

            const updateResponse = await axios.delete(`${backendServer}/api/v1/admin/delete/${state.movieId}`);

            if (updateResponse.status === 200) {
                alert(updateResponse.data.message);
            } else {
                alert(updateResponse.data.message);
            }

            console.log(updateResponse.data);

        } catch (error) {
            console.error('Error delete movies to backend:', error);
            alert("An error occurred while adding movies");
        }
    };

    const handleInputChange = (e, field) => {
        setState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };
    
    return (

        <div className="w-auto h-auto flex justify-center">

            <div className="mx-10 mt-5">

                <div className="flex flex-col my-3">
                    <label className="font-bold">Movie Id</label>
                    <input className="border border-black rounded-sm" type="text" value={state.movieId} onChange={(e) => handleInputChange(e, 'movieId')} />
                </div>

                <div onClick={sendMoviesToBackend} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-red-pure rounded-md cursor-pointer">Delete</div>
            </div>

        </div>
    );
}

export default UpdateMoviesPage;
