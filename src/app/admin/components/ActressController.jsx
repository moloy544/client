import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { appConfig } from "@/config/config";

function ActressController() {

    const [actorState, setActorState] = useState({
        imdbId: '',
        avatar: '',
        name: '',
        industry: '',
    });

    const availableIndusters = ['bollywood', 'hollywood', 'south']

    const handleInputChange = (e, field) => {

        setActorState(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    //Send Actor Data to server 
    const sendActorData = async () => {

        try {

            const { imdbId, avatar, name, industry } = actorState;

            const fieldsToValidate = [imdbId, avatar, name, industry];
            // Check if any field is missing or undefined
            const isAnyFieldMissing = fieldsToValidate.some(field => field === '');

            if (isAnyFieldMissing) {
                alert('Some fields are missing');
                return;
            };

            const addResponse = await axios.post(`${appConfig.backendUrl}/api/v1/admin/actor/add`, {
                actorData: actorState
            });

            const { message } = addResponse.data;

            alert(message);

            console.log(addResponse.data);

        } catch (error) {
            console.error('Error sending actor to backend:', error);
            alert("An error occurred while adding actor");
        }
    };

    return (
        <>
        
                <section className="w-auto h-fit flex-none mx-10 my-3 bg-white border border-blue-100 px-8 shadow-xl rounded-lg py-3">

                    <h1 className="text-amber-700 text-xl text-center font-semibold">Add Actor Section</h1>
                    <div className="flex flex-col my-3">
                        <label className="font-bold">Imdb id</label>
                        <input className="border border-black rounded-sm" type="text" value={actorState.imdbId} onChange={(e) => handleInputChange(e, 'imdbId')} />
                    </div>

                    <div className="flex flex-col my-3">
                        <label className="font-bold">Name</label>
                        <input className="border border-black rounded-sm" type="text" value={actorState.name} onChange={(e) => handleInputChange(e, 'name')} />
                    </div>

                    {actorState.avatar !== '' && (
                        <div className="w-auto h-auto my-2">
                            <Image
                            priority
                            width={145}
                            height={145}
                             className="w-36 h-40 rounded-sm" src={actorState.avatar} alt="actor image" />
                        </div>
                    )}

                    <div className="flex flex-col my-3">
                        <label className="font-bold">Image link</label>
                        <input className="border border-black rounded-sm" type="text" value={actorState.avatar} onChange={(e) => handleInputChange(e, 'avatar')} />
                    </div>

                    <div className="flex flex-col my-3">
                        <label className="font-bold">
                            Industry
                            {actorState.industry !== '' && (
                                <span className="text-xs text-gray-500 font-medium">{"(" + actorState.industry + ")"}</span>)}
                        </label>
                        <div className="flex gap-5">
                            {availableIndusters.map((industry) => (
                                <label key={industry} className="text-gray-700 text-sm cursor-pointer flex items-center gap-1 capitalize">
                                    {industry}
                                    <input onChange={(e) => handleInputChange(e, 'industry')} type="radio" value={industry} name="industry" checked={actorState.industry === industry} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div onClick={sendActorData} className="my-8 w-auto h-auto px-10 py-3 text-sm text-center text-white bg-purple-600 rounded-md cursor-pointer">Send server</div>

                </section>
        </>

    )
}

export default ActressController
