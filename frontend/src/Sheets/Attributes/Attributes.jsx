import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";
import { useState } from "react";

const AttributeRow = ({ labelName, showExpertise , modifier, proficiencyBonus}) => {
    const grey400 = grey[400]; // assuming you want to use MUI's grey[400]
    console.log("Rendering AttributeRow:", { labelName, showExpertise, modifier, proficiencyBonus });
    const [expertise, setExp] = useState(false);
    const [proficient, setProf] = useState(false);


    function setProficiency(value) {

        if(value === false) {
            setExp(false);
            setProf(false);
        } else {
            setProf(true);
        }

    }

    function setExpertise(value) {
        if(value === true) {
            setProf(true);
            setExp(true);
        } else {
            setExp(false);
        }
    }

    function getFinalModifier() {
        if(expertise) {
            return modifier + (2 * proficiencyBonus);
        }

        else if(proficient) {
            return modifier + proficiencyBonus;
        }


        return modifier;
    }

    return (
        <div className="flex w-full items-center space-x-1">
            {/* Expertise slot - always occupies space so layout doesn't shift */}
            <Box
                sx={{
                    width: 36, // reserve checkbox width (adjust if you want more/less)
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 2,
                    marginRight: -1,
                }}
            >
                <Checkbox
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<AdjustIcon />}
                    size="sm"
                    checked={expertise}
                    onChange={(e) => setExpertise(e.target.checked)}
                    // keep in DOM but hide when not needed
                    sx={{
                        padding: 0,
                        marginBottom: 0.2,
                        marginRight: -1.5,
                        color: grey400,
                        visibility: showExpertise ? "visible" : "hidden",
                        pointerEvents: showExpertise ? "auto" : "none",
                        "&.Mui-checked": {
                            color: "#363636ff",
                        },
                    }}
                    inputProps={{ tabIndex: showExpertise ? 0 : -1, "aria-hidden": !showExpertise }}
                />
            </Box>

            {/* Main checkbox */}
            <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={proficient}
                onChange={(e) => setProficiency(e.target.checked)}
                sx={{
                    padding: 0,
                    color: grey400,
                    "&.Mui-checked": {
                        color: "#363636ff",
                    },
                }}
            />

            {/* Modifier */}
            <div className="mx-1 w-2/12 text-center border-2 border-gray-400 rounded focus-visible:outline-none">{getFinalModifier()}</div>

            {/* Label/Name */}
            <div className="mx-1 w-7/10 text-center border-2 border-gray-400 rounded focus-visible:outline-none">
                {labelName}
            </div>
        </div>
    );
};

export default AttributeRow;
