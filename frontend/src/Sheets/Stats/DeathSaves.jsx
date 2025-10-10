import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";
function PlayerStats() {
    const grey400 = grey[400]; // assuming you want to use MUI's grey[400]
    return (
        <>
            <div className="flex flex-col mr-8 items-center">
                <label className="text-3xl font-semibold ">Death Saves</label>
                <div className='w-70 bg-white h-36 mt-2 text-center border-2 border-gray-400 md:text-6xl place-content-center rounded-xl flex flex-col '>

                    <div className='flex  justify-items-end items-center '>
                        <label className="text-2xl font-medium ml-4 mr-2">Successes</label>

                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '2.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '2.5rem' }} />}

                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '2.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '2.5rem' }} />}

                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '2.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '2.5rem' }} />}

                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                    </div>
                    <div className='flex justify-items-end items-center mt-2'>
                        <label className=" text-2xl font-medium ml-4 mr-2 pr-6">Failures</label>

                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '2.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '2.5rem' }} />}

                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '2.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '2.5rem' }} />}

                            sx={{
                                padding: 0,


                                color: grey400,
                                "&.Mui-checked": {
                                    color: "#363636ff",
                                },
                            }} />
                        <Checkbox
                            icon={<CircleOutlinedIcon style={{ fontSize: '2.5rem' }} />}
                            checkedIcon={<AdjustIcon style={{ fontSize: '2.5rem' }} />}

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