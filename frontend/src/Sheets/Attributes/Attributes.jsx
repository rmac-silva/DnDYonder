import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";

const AttributeRow = ({ skill, attributeModifier, proficiencyBonus, updateDraftFun,locked}) => {
    const grey400 = grey[400];

    function ChangeExpertise(e) {
        // Coerce to boolean and ensure expertise implies proficiency
        const isExpert = !!e.target.checked;
        skill.expertise = isExpert;

        if (skill.expertise) {
            skill.proficient = true;
        }

        // compute value but don't rely on it for controlled state — return for display
        const newVal = parseInt(attributeModifier + (skill.proficient ? proficiencyBonus : 0) + (skill.expertise ? proficiencyBonus : 0));
        skill.value = newVal;

        //Update the draft
        updateDraftFun(prev => ({ ...prev }));
    }

    function GetValue() {
        // compute on the fly without causing accidental undefined <-> defined flips
        const val = parseInt(attributeModifier + (skill.proficient ? proficiencyBonus : 0) + (skill.expertise ? proficiencyBonus : 0));
        // keep local cached value up-to-date for persistence if you like
        skill.value = val;
        return val;
    }

    function ChangeProficiency(e) {
        // if(locked) {
        //     alert("This skill's proficiency is locked by your class.");
        //     return; //Do nothing if the skill is from the class
        // }

        const isProf = !!e.target.checked;
        skill.proficient = isProf;

        if (!skill.proficient) {
            skill.expertise = false;
        }

        const newVal = parseInt(attributeModifier + (skill.proficient ? proficiencyBonus : 0) + (skill.expertise ? proficiencyBonus : 0));
        skill.value = newVal;

        updateDraftFun(prev => ({ ...prev }));
    }

    return (
        <div className="flex w-full items-center space-x-1">
            {/* Expertise slot - always occupies space so layout doesn't shift */}
            <Box
                sx={{
                    width: 36,
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
                    size="small"                      // use valid MUI size value
                    checked={!!skill.expertise}      // coerce to boolean to avoid uncontrolled->controlled
                    onChange={(e) => ChangeExpertise(e)}
                    sx={{
                        padding: 0,
                        marginBottom: 0.2,
                        marginRight: -1.5,
                        color: grey400,
                        visibility: skill.has_expertise ? "visible" : "hidden",
                        pointerEvents: skill.has_expertise ? "auto" : "none",
                        "&.Mui-checked": {
                            color: "#1a1a1a",
                        },
                    }}
                />
            </Box>

            {/* Main checkbox */}
            <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={!!skill.proficient} // coerce here as well
                onChange={(e) => ChangeProficiency(e)}
                sx={{
                    padding: 0,
                    color : grey400,
                    
                        "&.Mui-checked": {
                            color:  "#1a1a1a",
                        },
                }}
            />

            {/* Modifier */}
            <div className="mx-1 w-2/12 text-center border-2 rounded-lg focus-visible:outline-none py-1 font-semibold" style={{borderColor: '#db7f3d', backgroundColor: '#edeae8', color: '#1a1a1a'}}>{GetValue()}</div>

            {/* Label/Name */}
            <div className="mx-1 w-7/10 text-center border-2 rounded-lg focus-visible:outline-none py-1 transition-colors duration-200" style={{borderColor: '#db7f3d', backgroundColor: '#edeae8', color: '#1a1a1a'}}>
                {skill.name}
            </div>
        </div>
    );
};

export default AttributeRow;
