import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";

import { Box, useTheme } from '@mui/material';


function PlayerStats({draft,setDraft}) {
    const theme = useTheme();
    
    function handleDeathSaveChange(type, checked) {
        // console.log("Death save change:", type, checked);
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
                <Box className=" p-4 rounded-2xl shadow border-2 py-6 mt-2 hover:shadow-md"
                    sx={{
                        borderColor: theme.palette.baseColor.main,
                        
                    }}>


                    <div className='flex  justify-items-end items-center '>
                        <label className="text-lg font-medium ml-2 mr-2">Successes</label>

                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_success >= 1}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color:  theme.palette.baseColor.main,
                                "&.Mui-checked": {
                                    color: "#1e590a",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_success >= 2}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color:  theme.palette.baseColor.main,
                                "&.Mui-checked": {
                                    color: "#1e590a",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_success >= 3}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}

                            sx={{
                                padding: 0,


                                color:  theme.palette.baseColor.main,
                                "&.Mui-checked": {
                                    color: "#1e590a",
                                },
                            }} />
                    </div>
                    <div className='flex justify-items-end items-center mt-2'>
                        <label className=" text-lg font-medium ml-2 mr-2 ">Failures</label>

                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_failure >= 1}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color:  theme.palette.baseColor.main,
                                "&.Mui-checked": {
                                    color: "#bf1f1f",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_failure >= 2}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color:  theme.palette.baseColor.main,
                                "&.Mui-checked": {
                                    color: "#bf1f1f",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '1.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '1.5rem' }} />}
                            checked={draft.stats.death_saves_failure >= 3}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                padding: 0,


                                color:  theme.palette.baseColor.main,
                                "&.Mui-checked": {
                                    color: "#bf1f1f",
                                },
                            }} />
                    </div>
                </Box>

                
            </div>
        </>
    )
}

export default PlayerStats;