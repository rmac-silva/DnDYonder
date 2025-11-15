import React from 'react';
import MainProfs from './Proficiencies/MainProfs.jsx';
import MiscProfs from './Proficiencies/MiscProfs.jsx';
import StatBlock from './Attributes/StatBlock.jsx';
import { Box, useTheme,Link } from '@mui/material';


function SheetLeftColumn({draft,setDraft}) {
    const theme = useTheme();
    const textClasses = 'focus-visible:outline-none';

    //Proficiency bonus calculation
    function GetProficiencyBonus(level) {
        let val = Math.ceil(level / 4) + 1;
        draft.stats.proficiency_bonus = val;
        return val;
    }

    return (
        <div className="w-2/7 bg-white p-4 rounded shadow">
            <div className="flex justify-between mb-4">
                <div className="flex flex-col items-center bg-zinc-50 p-4 rounded shadow w-1/2 mr-2">
                    <label className="text-2xl font-semibold text-gray-700">Level</label>
                    <Box
                        component="input"
                        className={`mt-2 px-2 py-1 text-center font-semibold text-gray-700 text-3xl w-1/2 ${textClasses}`}
                        placeholder='1'
                        min={1}
                        max={20}
                        type='text'
                        defaultValue={draft.stats.level}
                        onBlur={(e) => { draft.stats.level = e.target.value; setDraft({ ...draft }) }}
                        sx={{
                            borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                </div>
                <div className="flex flex-col items-center bg-zinc-50 p-4 rounded shadow w-1/2 mr-2">
                    <label className="text-2xl font-semibold text-gray-700">Prof. Bonus</label>
                    <Box
                        component="input"
                        className={`mt-2 px-2 py-1 text-center font-semibold text-gray-700 text-3xl w-1/2 ${textClasses}`}
                        placeholder='1'
                        min={1}
                        max={20}
                        type='text'
                        value={GetProficiencyBonus(draft.stats.level)}
                        sx={{
                            borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                </div>
            </div>

            {/* Stat Blocks */}
            <StatBlock label="STR"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Strength} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="DEX"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Dexterity} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="CON"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Constitution} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="INT"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Intelligence} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="WIS"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Wisdom} updateDraftFun={setDraft}>

            </StatBlock>

            <StatBlock label="CHA"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Charisma} updateDraftFun={setDraft}>

            </StatBlock>
            
            {/* Link to point buy calculator */}
            <Link className='!text-md !font-semibold !mb-4 !ml-2 ' href={`https://dnd5e.wikidot.com/spells`} 
            sx={{}}>Point-Buy Calculator</Link>            

            <MainProfs draft={draft} setDraft={setDraft} />
            <MiscProfs draft={draft} setDraft={setDraft} />
        </div>
    )
}

export default SheetLeftColumn;