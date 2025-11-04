import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";
function PlayerStats({draft,setDraft}) {
    const grey400 = grey[400]; // assuming you want to use MUI's grey[400]
    
    function handleDeathSaveChange(type, checked) {
        console.log("Death save change:", type, checked);
        if(type === "SUCCESS") {
            if(checked) { //Adding a success
                draft.stats.death_saves_success += 1;
            } else {
                draft.stats.death_saves_success -= 1;
            }
        } else if(type === "FAILURE") {
            if(checked) { //Adding a failure
                draft.stats.death_saves_failure += 1;
            } else {
                draft.stats.death_saves_failure -= 1;
            }

        }
        setDraft({...draft});
    }
    
    return (
        <>
            <div className="flex flex-col mr-8 items-center">
                <label className="text-3xl font-semibold ">Death Saves</label>
                <div className='w-45 bg-white h-26 mt-2 text-center border-2 border-gray-400 md:text-6xl place-content-center rounded-xl flex flex-col '>

                    <div className='flex  justify-items-end items-center '>
                        <label className="text-lg font-medium ml-2 mr-2">Successes</label>

                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_success >= 1}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_success >= 2}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_success >= 3}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}

                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                    </div>
                    <div className='flex justify-items-end items-center mt-2'>
                        <label className=" text-lg font-medium ml-2 mr-2 ">Failures</label>

                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_failure >= 3}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_failure >= 3}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_failure >= 3}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                    </div>

                </div>
            </div>
        </>
    )
}

export default PlayerStats;