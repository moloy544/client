'use client'
import { appConfig } from "@/config/config";
import axios from "axios";
import { useState } from "react";

function AddMoviesPage() {

    const [state, setState] = useState({
        thambnail: '',
        title: '',
        releaseYear: 2021,
        category: 'bollywood',
        type: 'movie',
        language: 'hindi',
        genre: [], // Change genre to an array
        watchLink: ''
    });

    const sendMoviesToBackend = async () => {

        try {

            const checkAllFields = Object.entries(state).some(([key, data]) => {
                if (key === 'genre') {
                    // If the key is 'genre', check if it's an array
                    return Array.isArray(data) && data.length === 0;
                }
                // For other fields, check if data is a string and empty
                return typeof data === 'string' && data.trim() === '';
            });

            if (checkAllFields) {
                console.log("All fields are required");
                return;
            }

            const addResponse = await axios.post(`${appConfig.backendUrl}/api/v1/seller/movies/add`, state);

            if (addResponse.status === 200) {
                alert("Movies Add Successful");
            } else {
                alert("Can't Add Movies");
            }

            console.log(addResponse.data);


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

    const handleGenreInputChange = (e) => {
        // Split the input based on commas and spaces
        const genreArray = e.target.value.split(/[, ]+/).map(item => item.trim());
        setState(prevState => ({
            ...prevState,
            genre: genreArray
        }));
    };

    return (

        <div className="w-auto h-auto flex justify-center">

            <div className="mx-10 mt-5">
                <div className="flex flex-col my-3">
                    <label className="font-bold">Thambnail</label>
                    <input className="border border-black rounded-sm" type="text" value={state.thambnail} onChange={(e) => handleInputChange(e, 'thambnail')} />
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Title</label>
                    <input className="border border-black rounded-sm" type="text" value={state.title} onChange={(e) => handleInputChange(e, 'title')} />
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Release Year</label>
                    <input className="border border-black rounded-sm" type="text" value={state.releaseYear} onChange={(e) => handleInputChange(e, 'releaseYear')} />
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Category</label>
                    <div className="flex gap-5">
                        <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                            Bollywood
                            <input onChange={(e) => handleInputChange(e, 'category')} type="radio" value="bollywood" name="category" checked={state.category === 'bollywood'} />
                        </label>
                        <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                            Hollywood
                            <input onChange={(e) => handleInputChange(e, 'category')} type="radio" value="hollywood" name="category" checked={state.category === 'hollywood'} />
                        </label>
                        <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                            South
                            <input onChange={(e) => handleInputChange(e, 'category')} type="radio" value="south" name="category" checked={state.category === 'south'} />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Type</label>
                    <input className="border border-black rounded-sm" type="text" value={state.type} onChange={(e) => handleInputChange(e, 'type')} />
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Language</label>
                    <div className="flex gap-5">
                        <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                            Hindi
                            <input onChange={(e) => handleInputChange(e, 'language')} type="radio" value="hindi" name="language" checked={state.category === 'bollywood'}  />
                        </label>
                        <label className="text-gray-700 text-sm cursor-pointer flex items-center gap-1">
                            Hindi Dubbed
                            <input onChange={(e) => handleInputChange(e, 'language')} type="radio" value="hindi dubbed" name="language" checked={state.category !== 'bollywood'}  />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">Genre</label>
                    <input className="border border-black rounded-sm" type="text"
                        value={state.genre.join(', ')} // Join the array values for display
                        onChange={handleGenreInputChange}
                    />         </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold">WatchLink</label>
                    <input className="border border-black rounded-sm" type="text" value={state.watchLink} onChange={(e) => handleInputChange(e, 'watchLink')} />
                </div>

                <div onClick={sendMoviesToBackend} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Add</div>
                <p>Page 8 complete Bollywood movies</p>
            </div>

        </div>
    );
}

export default AddMoviesPage;
