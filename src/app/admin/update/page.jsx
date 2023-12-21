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
        movieId: id,
        castDetails: [],
    });

    const castRef = useRef(null)

    const sendMoviesToBackend = async () => {

        try {

            const updateResponse = await axios.put(`${backendServer}/api/v1/admin/update/${state.movieId}`, {
                updateData:{
                    castDetails: state.castDetails
                }
            });

            if (updateResponse.status === 200) {
                alert("Movies Update Successful");
            } else {
                alert("Can't Update Movies");
            }

            console.log(updateResponse.data);

        } catch (error) {
            console.error('Error sending movies to backend:', error);
            alert("An error occurred while adding movies");
        }
    };

    const handleInputChange = (e, field) => {
        setState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    //Add Cast details Array in State
    const addCastToArray = (e) => {

        const inputText = castRef.current.value;

        setState(prevState => ({
            ...prevState,
            castDetails: [...state.castDetails, inputText]
        }));

        castRef.current.value = '';
    };

    //Remove cast
    const removeCastFromArray = (castName) => {

      const updateCast = state.castDetails?.filter(cast=> cast !== castName)

        setState(prevState => ({
            ...prevState,
            castDetails: updateCast
        }));
    };

    const resetCastArray = () => {
        setState(prevState => ({
            ...prevState,
            castDetails: []
        }));
    };
    
    return (

        <div className="w-auto h-auto flex justify-center">

            <div className="mx-10 mt-5">

                <div className="flex flex-col my-3">
                    <label className="font-bold">Movie Id</label>
                    <input className="border border-black rounded-sm" type="text" value={state.movieId} onChange={(e) => handleInputChange(e, 'movieId')} />
                </div>

                <div className="text-sm flex gap-2 w-60 h-auto flex-row overflow-x-scroll whitespace-nowrap">
                    {state.castDetails?.map((cast) => (
                        <div key={cast} className="w-auto h-auto relative py-3">
                        <div className="bg-gray-300 w-auto h-auto px-1.5 py-0.5 rounded-md">
                            <span className="text-gray-800 text-sm ">{cast}</span>
                              </div>
                              <i className="bi bi-x absolute top-0 right-0 cursor-pointer text-lg" onClick={()=>removeCastFromArray(cast)}></i>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Cast Details</label>
                    <input ref={castRef} className="border border-black rounded-sm" type="text" />
                    <div className="flex gap-5 my-1">
                    <button type="button" onClick={addCastToArray} className="w-auto h-5 bg-blue-600 text-sm text-white px-2 rounded-sm">Add</button>
                    <button type="button" onClick={resetCastArray} className="w-auto h-5 bg-blue-600 text-sm text-white px-2 rounded-sm">Reset</button>
                    </div>
                </div>

                <div onClick={sendMoviesToBackend} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Update</div>
            </div>

        </div>
    );
}

export default UpdateMoviesPage;
