import React from 'react';
import MainProfs from './Proficiencies/MainProfs.jsx';
import MiscProfs from './Proficiencies/MiscProfs.jsx';
import StatBlock from './Attributes/StatBlock.jsx';
import { Box, useTheme, Link } from '@mui/material';


function SheetLeftColumn({ draft, setDraft }) {
    const theme = useTheme();
    const textClasses = 'focus-visible:outline-none';

    //Proficiency bonus calculation
    function GetProficiencyBonus(level) {
        let val = Math.ceil(level / 4) + 1;
        draft.stats.proficiency_bonus = val;
        return val;
    }

    function GetPassivePerception() {
        let val = 10 + Math.floor((draft.attributes.Wisdom.value - 10) / 2);
        
        // Add perception proficiency if applicable
        draft.attributes.Wisdom.skills.forEach(element => {
            if(element.name === 'Perception' && element.proficient) {
                val += draft.stats.proficiency_bonus;
            }
        });
        return val;
    }

    function GetPassiveInsight() {
        let val = 10 + Math.floor((draft.attributes.Wisdom.value - 10) / 2);
        
        // Add insight proficiency if applicable
        draft.attributes.Wisdom.skills.forEach(element => {
            if(element.name === 'Insight' && element.proficient) {
                val += draft.stats.proficiency_bonus;
            }
        });
        return val;
    }

    return (
        <Box
            sx={{
                width: '100%',
                minWidth: { xs: 0, sm: '220px' },
                background: 'white',
                p: { xs: 1.5, sm: 3, md: 4 },
                borderRadius: 2,
                boxShadow: 2,
                margin: '0',
            }}
        >
            <Box sx={{ mb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column' }} >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'row' },
                        justifyContent: 'space-between',
                        mb: 3,
                        gap: { xs: 2, sm: 0 },
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#f8fafc',

                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            boxShadow: 1,
                            mr: { sm: 2, xs: 0 },
                            mb: { xs: 2, sm: 0 },
                            width: { xs: '70px', sm: '100px', md: 'auto' }
                        }}
                    >
                        <Box component="label"
                            className="font-semibold text-gray-700"
                            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.3rem', lg: '1.15rem', xl: '1.8rem' } }}
                        >
                            Level
                        </Box>
                        <Box
                            component="input"
                            className={`mt-2 px-2 py-1 text-center font-semibold text-gray-700 w-full ${textClasses}`}
                            placeholder='1'
                            min={1}
                            max={20}
                            type='text'
                            defaultValue={draft.stats.level}
                            onBlur={(e) => { draft.stats.level = e.target.value; setDraft({ ...draft }) }}
                            sx={{
                                fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.4rem', lg: '1.4rem', xl: '1.8rem' },
                                borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                                width: { xs: '60%', sm: '60%', md: '65%' },
                                '&:hover': {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#f8fafc',
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            boxShadow: 1,
                            mr: { sm: 2, xs: 0 },
                            width: { xs: '100px', sm: '100px', md: 'auto' }
                        }}
                    >
                        <Box component="label"
                            className="font-semibold text-gray-700"
                            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.3rem', lg: '1.4rem', xl: '1.8rem' } }}
                        >
                            Prof. Bonus
                        </Box>
                        <Box
                            component="input"
                            className={`mt-2 px-2 py-1 text-center font-semibold text-gray-700 w-full ${textClasses}`}
                            placeholder='1'
                            min={1}
                            max={20}
                            type='text'
                            value={GetProficiencyBonus(draft.stats.level)}
                            sx={{
                                fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.4rem', lg: '1.6rem', xl: '1.8rem' },
                                borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                                width: { xs: '60%', sm: '60%', md: '65%' },
                                '&:hover': {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                    </Box>

                </Box>

                {/*Passive perception and insight */}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'row' },
                        justifyContent: 'space-between',
                        mb: 3,
                        gap: { xs: 2, sm: 0 },
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#f8fafc',

                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            boxShadow: 1,
                            mr: { sm: 2, xs: 0 },
                            mb: { xs: 2, sm: 0 },
                            width: { xs: '70px', sm: '100px', md: 'auto' }
                        }}
                    >
                        <Box component="label"
                            className="font-semibold text-gray-700"
                            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.3rem', lg: '1.15rem', xl: '1.5rem' } }}
                        >
                            Passive Perception
                        </Box>
                        <Box
                            component="input"
                            className={`mt-2 px-2 py-1 text-center font-semibold text-gray-700 w-full ${textClasses}`}
                            placeholder='1'
                            min={1}
                            max={20}
                            type='text'
                            value={GetPassivePerception()}
                            onBlur={(e) => { draft.stats.level = e.target.value; setDraft({ ...draft }) }}
                            sx={{
                                fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.4rem', lg: '1.4rem', xl: '1.8rem' },
                                borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                                width: { xs: '60%', sm: '60%', md: '65%' },
                                '&:hover': {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#f8fafc',
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            boxShadow: 1,
                            mr: { sm: 2, xs: 0 },
                            width: { xs: '100px', sm: '100px', md: 'auto' }
                        }}
                    >
                        <Box component="label"
                            className="font-semibold text-gray-700"
                            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.3rem', lg: '1.4rem', xl: '1.5rem' } }}
                        >
                            Passive Insight
                        </Box>
                        <Box
                            component="input"
                            className={`mt-2 px-2 py-1 text-center font-semibold text-gray-700 w-full ${textClasses}`}
                            placeholder='1'
                            min={1}
                            max={20}
                            type='text'
                            value={GetPassiveInsight()}
                            sx={{
                                fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.4rem', lg: '1.6rem', xl: '1.8rem' },
                                borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                                width: { xs: '60%', sm: '60%', md: '65%' },
                                '&:hover': {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                    </Box>

                </Box>

                {/* Link to point buy calculator */}
                {draft.stats.level == 1 &&
                <Link
                className='!text-md !font-semibold !mb-4 !ml-2'
                href={`https://chicken-dinner.com/5e/5e-point-buy.html`}
                sx={{
                    fontSize: { xs: '1rem', sm: '1.3rem', md: '1.5rem' },
                    ml: 1,
                    mt:2,
                }}
                >
                    Point-Buy Calculator
                </Link>
                }
            </Box>



            {/* Stat Blocks */}
            <StatBlock label="STR" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Strength} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="DEX" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Dexterity} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="CON" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Constitution} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="INT" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Intelligence} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="WIS" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Wisdom} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="CHA" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Charisma} updateDraftFun={setDraft}>

            </StatBlock>



            <MainProfs draft={draft} setDraft={setDraft} />
            <MiscProfs draft={draft} setDraft={setDraft} />
        </Box>
    )
}

export default SheetLeftColumn;