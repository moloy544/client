import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";
import { creatToastAlert } from "@/utils";

// text or number input style properties
const inputStyle = "border-2 border-blue-700 rounded-md p-1";
const industryOptions = ['bollywood', 'hollywood', 'south'];

export default function ActorControllerSection() {

    const [actorState, setActorState] = useState({
        imdbId: '',
        name: '',
        industry: 'bollywood',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleInputChange = (e, field) => {

        setActorState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    // get actor data from database
    const getActorData = async () => {
        try {

            if (actorState.imdbId.length <= 5) {
                alert('Invalid IMDB ID or its too short');
            }
            const response = await axios.post(`${appConfig.backendUrl}/api/v1/admin/actor/get`, {
                imdbId: actorState.imdbId
            });

            if (response.status !== 200) {
                alert(response.data.message || "Somthing went wrong!")
            };
            const { actor } = response.data;
            setActorState(actor);
            const { avatar } = actor;
            if (avatar){
                setImagePreview(avatar);
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Send Actor Data to server 
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const { imdbId, name, industry } = actorState;

            const fieldsToValidate = [imdbId, name, industry];
            // Check if any field is missing or undefined
            const isAnyFieldMissing = fieldsToValidate.some(field => field === '');

            if (isAnyFieldMissing) {
                creatToastAlert({ message: 'Some fields are missing' });
                return;
            } else if (imdbId.length < 5) {
                creatToastAlert({ message: 'Invalid IMDB ID or its too short' });
                return;
            };

            setProcessing(true);

            // Create a FormData object to hold the form data
            const formData = new FormData();

            // add movie data sate in form data
            formData.append('data', JSON.stringify(actorState));

            // add file in from data 
            const fileInput = document.getElementById('actor-avatar-file');

            if (fileInput && fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            };

            // send the form data to the backend API
            const addResponse = await axios.post(`${appConfig.backendUrl}/api/v1/admin/actor/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { message } = addResponse.data;

            if (addResponse.status === 200) {
                creatToastAlert({ message });
                setActorState({
                    imdbId: '',
                    name: '',
                    industry: '',
                });
                fileInput.value = '';
                setImagePreview(null);
            } else {
                creatToastAlert({ message: message || "An error occurred while adding actor" });
            };


        } catch (error) {
            console.error('Error sending actor to backend:', error);
            alert("An error occurred while adding actor");
        } finally {
            setProcessing(false);
        }
    };

    // creat image ptreview 
    const handleFileInputChnage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const blobUri = URL.createObjectURL(file);
            setImagePreview(blobUri);
        }
    };

    // remove image ptreview after componet mount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <section className="w-full md:w-fit h-fit flex-none my-3 ">
            <form onSubmit={handleSubmit} className="bg-white border border-blue-100 px-3 shadow-xl rounded-lg py-3 overflow-hidden">

                <h1 className="text-amber-700 text-xl text-center font-semibold">Add Actor Section</h1>
                <div className="flex flex-col my-3">
                    <label className="font-bold">Actor IMDB ID</label>
                    <div className="flex gap-1">
                        <input className={inputStyle + ' w-40'} type="text" value={actorState.imdbId} onChange={(e) => handleInputChange(e, 'imdbId')} />
                        <button className="w-16 h-8 bg-green-700 text-sm text-white font-semibold text-center rounded-md" type="button" onClick={getActorData}>Get</button>
                    </div>
                </div>

                <div className="flex flex-col my-3 max-w-[250px]">
                    <label className="font-bold text-gray-800">Name</label>
                    <input className={inputStyle} type="text" value={actorState.name} onChange={(e) => handleInputChange(e, 'name')} />
                </div>

                {imagePreview && (
                    <div className="w-auto h-auto my-2">
                        <Image
                            priority
                            width={145}
                            height={145}
                            className="w-36 h-40 rounded-sm" src={imagePreview} alt="actor image" />
                    </div>
                )}

                <div className="flex flex-col my-3">
                    <label className="font-bold text-gray-800">Select image</label>
                    <input onChange={handleFileInputChnage} type="file" id="actor-avatar-file" accept="image/*" />
                    <input className={inputStyle + ' my-1.5'} type="text" value={imagePreview || ""}
                                    onChange={(e) => setImagePreview(e.target.value)}
                                    placeholder="Enter external image url" />
                </div>

                <div className="flex flex-col my-3">
                    <label className="font-bold text-gray-800">Industry</label>

                    <fieldset className="flex flex-wrap gap-3">
                        {industryOptions.map((industry) => (
                            <div key={industry}>
                                <label
                                    htmlFor={`Actor-${industry}`}
                                    className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 text-gray-900 ${actorState.industry === industry ? "border-blue-500 bg-blue-500 text-white": "bg-white border-gray-200 hover:border-gray-300"}`}
                                >
                                    <input
                                        type="radio"
                                        id={`Actor-${industry}`}
                                        value={industry}
                                        className="sr-only"
                                        onChange={(e) => handleInputChange(e, 'industry')}
                                        checked={actorState.category === industry}
                                    />

                                    <p className="text-xs font-medium capitalize">{industry}</p>
                                </label>
                            </div>
                        ))}

                    </fieldset>

                </div>
                <div className="w-full flex justify-center">
                <button type="submit" disabled={processing} className="my-3.5 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">
                    {!processing ? "Uploaded" : "Uploading..."}
                </button>
                </div>
            </form>
        </section>
    )
};
