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
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                    mr: { xs: 2, md: 3 },
                    width: 'auto', // was '100%' — keep compact so it sits beside HitDice
                    flexShrink: 0,
                }}
            >
                <Box
                    component="label"
                    sx={{
                        fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.6rem', lg: '2.2rem' },
                        marginBottom: { xs: .25, sm: .5, md: 1 },
                        fontWeight: 600,
                        textAlign: 'center',
                    }}
                >
                    Death Saves
                </Box>

                <Box
                    sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderRadius: 2,
                        boxShadow: { xs: 1, sm: 2 },
                        border: '2px solid',
                        borderColor: theme.palette.baseColor.main,
                        transition: 'box-shadow 0.2s ease',
                        '&:hover': { boxShadow: { xs: 2, sm: 3 } },
                        width: 'auto',
                        maxWidth: { xs: 300, sm: 340, md: 360, lg: 320, xl: 320 },
                    }}
                >
                    <Box display="flex" alignItems="center" gap={.5}>
                        <Box
                            component="label"
                            sx={{
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                fontWeight: 500,
                                minWidth: { xs: 64, sm: 80 },
                            }}
                        >
                            Successes
                        </Box>
                        <Checkbox
                            icon={<CircleOutlinedIcon />}
                            checkedIcon={<AdjustIcon />}
                            checked={draft.stats.death_saves_success >= 1}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                p: 0,
                                color: theme.palette.baseColor.main,
                                "&.Mui-checked": { color: "#1e590a" },
                                "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 20, md: 22 } },
                            }}
                        />
                        <Checkbox
                            icon={<CircleOutlinedIcon />}
                            checkedIcon={<AdjustIcon />}
                            checked={draft.stats.death_saves_success >= 2}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                p: 0,
                                color: theme.palette.baseColor.main,
                                "&.Mui-checked": { color: "#1e590a" },
                                "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 20, md: 22 } },
                            }}
                        />
                        <Checkbox
                            icon={<CircleOutlinedIcon />}
                            checkedIcon={<AdjustIcon />}
                            checked={draft.stats.death_saves_success >= 3}
                            onChange={(e) => {handleDeathSaveChange("SUCCESS", e.target.checked)}}
                            sx={{
                                p: 0,
                                color: theme.palette.baseColor.main,
                                "&.Mui-checked": { color: "#1e590a" },
                                "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 20, md: 22 } },
                            }}
                        />
                    </Box>

                    <Box display="flex" alignItems="center" gap={.5} sx={{ mt: { xs: 1, sm: 1.5 } }}>
                        <Box
                            component="label"
                            sx={{
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                fontWeight: 500,
                                minWidth: { xs: 64, sm: 80 },
                            }}
                        >
                            Failures
                        </Box>
                        <Checkbox
                            icon={<CircleOutlinedIcon />}
                            checkedIcon={<AdjustIcon />}
                            checked={draft.stats.death_saves_failure >= 1}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                p: 0,
                                color: theme.palette.baseColor.main,
                                "&.Mui-checked": { color: "#bf1f1f" },
                                "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 20, md: 22 } },
                            }}
                        />
                        <Checkbox
                            icon={<CircleOutlinedIcon />}
                            checkedIcon={<AdjustIcon />}
                            checked={draft.stats.death_saves_failure >= 2}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                p: 0,
                                color: theme.palette.baseColor.main,
                                "&.Mui-checked": { color: "#bf1f1f" },
                                "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 20, md: 22 } },
                            }}
                        />
                        <Checkbox
                            icon={<CircleOutlinedIcon />}
                            checkedIcon={<AdjustIcon />}
                            checked={draft.stats.death_saves_failure >= 3}
                            onChange={(e) => {handleDeathSaveChange("FAILURE", e.target.checked)}}
                            sx={{
                                p: 0,
                                color: theme.palette.baseColor.main,
                                "&.Mui-checked": { color: "#bf1f1f" },
                                "& .MuiSvgIcon-root": { fontSize: { xs: 16, sm: 20, md: 22 } },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default PlayerStats;