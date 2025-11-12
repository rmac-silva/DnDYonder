import {useState} from 'react';

import TextField from '@mui/material/TextField';
import COLORS from '../../constants/colors.js';

function PersonalityTraits({ draft, setDraft }) {

    const [personalityTraits, setPersonalityTraits] = useState(draft.char_info.personality_traits);
    const [ideals, setIdeals] = useState(draft.char_info.ideals);
    const [bonds, setBonds] = useState(draft.char_info.bonds);
    const [flaws, setFlaws] = useState(draft.char_info.flaws);
    
    return (
        <div className="flex flex-col space-y-2 items-center w-full rounded-xl shadow-md p-5 border-2 transition-shadow duration-200" style={{backgroundColor: COLORS.primary, borderColor: COLORS.accent}} onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover} onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}>
            <div className="text-3xl font-semibold mt-2">
                Personality Traits
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField 
                    className=' border-2 !w-full !px-2' 
                    sx={{ 
                        minWidth: 400, 
                        maxWidth: 800,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: COLORS.primary,
                            '& fieldset': {
                                borderColor: COLORS.accent,
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                        },
                    }} 
                    value={personalityTraits} 
                    rows={4} 
                    multiline 
                    onChange={(e) => setPersonalityTraits(e.target.value)} 
                    onBlur={(e) => { draft.char_info.personality_traits = e.target.value; setDraft({ ...draft }); }} 
                />
            </div>
            <div className="text-3xl font-semibold mt-2">
                Ideals
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField 
                    className=' border-2 !w-full !px-2' 
                    sx={{ 
                        minWidth: 400, 
                        maxWidth: 800,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: COLORS.primary,
                            '& fieldset': {
                                borderColor: COLORS.accent,
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                        },
                    }} 
                    value={ideals} 
                    rows={4} 
                    multiline 
                    onChange={(e) => setIdeals(e.target.value)} 
                    onBlur={(e) => { draft.char_info.ideals = e.target.value; setDraft({ ...draft }); }} 
                />
            </div>
            <div className="text-3xl font-semibold mt-2">
                Bonds
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField 
                    className=' border-2 !w-full !px-2' 
                    sx={{ 
                        minWidth: 400, 
                        maxWidth: 800,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: COLORS.primary,
                            '& fieldset': {
                                borderColor: COLORS.accent,
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                        },
                    }} 
                    value={bonds} 
                    rows={4} 
                    multiline 
                    onChange={(e) => setBonds(e.target.value)} 
                    onBlur={(e) => { draft.char_info.bonds = e.target.value; setDraft({ ...draft }); }} 
                />
            </div>
            <div className="text-3xl font-semibold mt-2">
                Flaws
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField 
                    className=' border-2 !w-full !px-2' 
                    sx={{ 
                        minWidth: 400, 
                        maxWidth: 800,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: COLORS.primary,
                            '& fieldset': {
                                borderColor: COLORS.accent,
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.accentHover,
                            },
                        },
                    }} 
                    value={flaws} 
                    rows={4} 
                    multiline 
                    onChange={(e) => setFlaws(e.target.value)} 
                    onBlur={(e) => { draft.char_info.flaws = e.target.value; setDraft({ ...draft }); }} 
                />
            </div>
        </div>
    )
}
export default PersonalityTraits;