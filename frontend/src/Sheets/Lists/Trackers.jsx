import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
function Trackers({ draft, setDraft }) {


    const [trackers, setTrackers] = useState(draft.misc.trackers);



    const syncToDraft = (newArray) => {
        draft.misc.trackers = newArray;
        setDraft(draft);
    };

    const handleAdd = () => {
        trackers.push({ name: "", value: 0, max_value: 0 });
        setTrackers([...trackers]); //Update local
        syncToDraft(trackers); //Update draft
    };

    const handleRemove = (idx) => {
        const newTrackers = trackers.filter((_, i) => i !== idx);
        setTrackers(newTrackers); //Update local
        syncToDraft(newTrackers); //Update draft
    };

    const handleChange = (idx, field, raw) => {
        if(field === "value" || field === "max_value") {
            raw = parseInt(raw);
        }
        trackers[idx][field] = raw;
        setTrackers([...trackers]); //Update local
    };

    return (
        <div className="flex flex-col p-2 mt-6 justify-center border-2 border-gray-400 rounded-md items-center w-full">
            <div className="w-full flex items-center text-center mb-4 place-content-center">
                <h2 className="text-4xl font-bold">Trackers</h2>

            </div>



            {trackers.map((tracker, index) => (
                <div
                    key={index}
                    className="w-full md:w-3/4 p-4 mb-4 flex flex-col items-center border-2 rounded-xl"
                >
                        <CancelIcon className=" relative basis-full  bottom-2 -mb-8 -right-45  !text-red-600 cursor-pointer" fontSize="medium" onClick={() => handleRemove(index)}></CancelIcon>

                    <div className="w-full flex  flex-wrap items-center ml-2 mb-4 align-middle place-content-center">
                        <div className="relative inline-block  text-center">
                            
                            <input
                                type="text"
                                value={tracker.name}
                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                onBlur={() => {syncToDraft(trackers)}}

                                placeholder="Tracker Name"
                                className="w-3/4 bg-white text-center border-2 border-gray-400  text-2xl font-semibold rounded-4xl -mb-12 focus-visible:outline-none"
                            />
                        </div>

                    </div>

                    <div className="flex space-x-6 items-center">
                        <div className="relative inline-block">
                            <label className="absolute left-10 text-2xl font-semibold">Used</label>
                            <input
                                type="text"
                                value={tracker.value}
                                onChange={(e) => handleChange(index, "value", e.target.value)}
                                onBlur={() => {syncToDraft(trackers)}}

                                placeholder="Used"
                                className="w-34 h-28 -mt-2 bg-white text-center border-2 border-gray-400 text-4xl font-semibold rounded-4xl focus-visible:outline-none"
                            />
                        </div>

                        <div className="relative inline-block">
                            <label className="absolute left-10 text-2xl font-semibold">Total</label>
                            <input
                                type="text"
                                value={tracker.max_value}
                                onChange={(e) => handleChange(index, "max_value", e.target.value)}
                                onBlur={() => {syncToDraft(trackers)}}
                                placeholder="Total"
                                className="w-34 h-28 -mt-2 bg-white text-center border-2 border-gray-400 text-4xl font-semibold rounded-4xl focus-visible:outline-none"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <Button className="!mt-4 !p-2" variant="contained" onClick={handleAdd} >
                <AddIcon></AddIcon>
            </Button>
        </div>
    );
}

export default Trackers;