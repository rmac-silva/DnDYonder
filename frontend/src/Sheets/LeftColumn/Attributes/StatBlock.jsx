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
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // stack on small, row on larger
                alignItems: 'center',
                gap: 2,
                mb: 4,
                width: '100%',
                boxSizing: 'border-box',
                flexWrap: 'wrap' // allow children to wrap under when no space
            }}
        >
            {/* Left: stat label + value + modifier */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: '0 0 auto',
                    minWidth: { xs: 120, md: 150, lg: 180, xl: 200 },
                    maxWidth: { xs: 180, md: 200, lg: 260, xl: 300 },
                    gap: 1,
                }}
            >
                <Box component="span" sx={{ mb: -1, fontSize: { xs: '1.25rem', md: '1.5rem', lg: '2rem', xl: '2.35rem' }, fontWeight: 600 }}>
                    {label}
                </Box>

                <Box
                    component="input"
                    type="text"
                    placeholder={label}
                    defaultValue={attribute.value}
                    onBlur={(e) => {attribute.value = parseInt(e.target.value); updateDraftFun(prev => ({...prev}));}}
                    className="text-center pt-2 font-semibold rounded focus-visible:outline-none hover:shadow-sm transition-all duration-200"
                    sx={{
                        border: `2px solid ${theme.palette.baseColor.main}`,
                        '&:hover': { borderColor: theme.palette.primary.main },
                        '&:focus': { borderColor: theme.palette.primary.main },
                        transition: 'border-color 0.2s ease',
                        width: { xs: '72px', md: '96px', lg: '160px', xl: '180px' },
                        height: { xs: '72px', md: '96px', lg: '160px', xl: '180px' },
                        fontSize: { xs: '1.9rem', md: '2.9rem', lg: '4rem', xl: '4.3rem' },
                        textAlign: 'center',
                    }}
                />

                <Box
                    component="div"
                    sx={{
                        width: { xs: 48, md: 64, lg: 80, xl: 96 },
                        height: { xs: 28, md: 36, lg: 44, xl: 52 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.25rem', lg: '1.35rem', xl: '1.5rem' },
                        border: `2px solid ${theme.palette.baseColor.main}`,
                        borderRadius: 1,
                    }}
                >
                    {GetStringifiedModOfStat()}
                </Box>
            </Box>

            {/* Right: skills list */}
            <Box
                sx={{
                    flex: '1 1 auto',
                    minWidth: 0, // allow children to shrink
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    // ensure each AttributeRow lines layout stays consistent and doesn't push checkbox out
                    '& > *': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        minWidth: 0,
                        width: '100%',
                    },
                }}
            >
                {GetSkillsOfStat().map(skill => {
                    return (
                        <Box key={skill.name} sx={{ minWidth: 0 }}>
                            <AttributeRow
                                skill={skill}
                                attributeModifier={GetModOfStat()}
                                proficiencyBonus={proficiencyBonus}
                                updateDraftFun={updateDraftFun}
                                locked={skill.locked}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default StatBlock;