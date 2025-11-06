import {useState} from 'react';

import TextField from '@mui/material/TextField';

function PersonalityTraits({ draft, setDraft }) {

    const [personalityTraits, setPersonalityTraits] = useState(draft.char_info.personality_traits);
    const [ideals, setIdeals] = useState(draft.char_info.ideals);
    const [bonds, setBonds] = useState(draft.char_info.bonds);
    const [flaws, setFlaws] = useState(draft.char_info.flaws);
    
    return (
        <div className="flex flex-col space-y-2 items-center w-full bg-white rounded shadow p-4">
            <div className="text-3xl font-semibold mt-2">
                Personality Traits
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField className=' border-2 !w-full !px-2' sx={{ minWidth: 400, maxWidth: 800 }} value={personalityTraits} rows={4} multiline onChange={(e) => setPersonalityTraits(e.target.value)} onBlur={(e) => { draft.char_info.personality_traits = e.target.value; setDraft({ ...draft }); }} />
            </div>
            <div className="text-3xl font-semibold mt-2">
                Ideals
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField className=' border-2 !w-full !px-2' sx={{ minWidth: 400, maxWidth: 800 }} value={ideals} rows={4} multiline onChange={(e) => setIdeals(e.target.value)} onBlur={(e) => { draft.char_info.ideals = e.target.value; setDraft({ ...draft }); }} />
            </div>
            <div className="text-3xl font-semibold mt-2">
                Bonds
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField className=' border-2 !w-full !px-2' sx={{ minWidth: 400, maxWidth: 800 }} value={bonds} rows={4} multiline onChange={(e) => setBonds(e.target.value)} onBlur={(e) => { draft.char_info.bonds = e.target.value; setDraft({ ...draft }); }} />
            </div>
            <div className="text-3xl font-semibold mt-2">
                Flaws
            </div>
            <div className='w-full justify-center flex  px-4'>

                <TextField className=' border-2 !w-full !px-2' sx={{ minWidth: 400, maxWidth: 800 }} value={flaws} rows={4} multiline onChange={(e) => setFlaws(e.target.value)} onBlur={(e) => { draft.char_info.flaws = e.target.value; setDraft({ ...draft }); }} />
            </div>
        </div>
    )
}
export default PersonalityTraits;