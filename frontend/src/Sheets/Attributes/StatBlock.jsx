import React from 'react';
import AttributeRow from './Attributes.jsx';
import { Box, useTheme } from '@mui/material';

function StatBlock({ label, attribute, proficiencyBonus, updateDraftFun }) {
    const theme = useTheme();
    
    function GetModOfStat() {
        let val = parseInt(Math.floor((parseInt(attribute.value) - 10) / 2));
        return val;
    }

    function GetStringifiedModOfStat() {
        let val = parseInt(Math.floor((parseInt(attribute.value) - 10) / 2));
        if(val >= 0) {
            return `+${val}`;
        } else {
            return `${val}`;
        }
    }

    function GetSkillsOfStat() {
        return attribute.skills;
    }

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="flex flex-col md:mr-8 items-center flex-shrink-0">
                <label className="-mb-10 text-3xl font-semibold">{label}</label>
                <Box
                    component="input"
                    type="text"
                    placeholder={label}
                    defaultValue={attribute.value}
                    onBlur={(e) => {attribute.value = parseInt(e.target.value); updateDraftFun(prev => ({...prev}));}}
                    className="w-28 h-28 md:w-36 md:h-36 text-center text-4xl md:text-6xl pt-2 font-semibold rounded focus-visible:outline-none hover:shadow-sm transition-all duration-200"
                    sx={{
                        border: `2px solid ${theme.palette.baseColor.main}`,
                        '&:hover': {
                            borderColor: theme.palette.primary.main,
                        },
                        '&:focus': {
                                    borderColor: theme.palette.primary.main,
                                },
                        transition: 'border-color 0.2s ease',
                    }}
                />
                
                <Box
                    component="div"
                    className="w-12 md:w-16 h-8 text-center font-semibold text-lg md:text-xl rounded mt-1 pointer-events-none"
                    sx={{
                        border: `2px solid ${theme.palette.baseColor.main}`,
                    }}
                >
                    {GetStringifiedModOfStat()}
                </Box>
            </div>

            <div className="flex flex-col w-full flex-1 min-w-0">
                {GetSkillsOfStat().map(skill => {
                    return <AttributeRow key={skill.name} skill={skill} attributeModifier={GetModOfStat()} proficiencyBonus={proficiencyBonus} updateDraftFun={updateDraftFun} locked={skill.locked} />;
                })}
            </div>
            
            
        </div>
    );
}

export default StatBlock;