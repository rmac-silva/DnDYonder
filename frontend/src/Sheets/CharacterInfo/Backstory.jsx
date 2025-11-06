import { useState } from 'react';
import TextField from '@mui/material/TextField';
function Backstory({ draft, setDraft }) {

    const [backstory, setBackstory] = useState(draft.char_info.backstory);

    return (
        <div className="flex flex-col items-center w-full bg-white rounded shadow p-4 h-full">
            <div className="text-4xl font-semibold">
                Backstory
            </div>

            <div className='w-full justify-center flex  mt-2 px-4'>

                <TextField className='!mt-2 border-2 !w-full !px-2' sx={{ minWidth: 400, maxWidth: 800 }} value={backstory} rows={28} multiline onChange={(e) => setBackstory(e.target.value)} onBlur={(e) => { draft.char_info.backstory = e.target.value; setDraft({ ...draft }); }} />
            </div>



        </div>
    )
}

export default Backstory;

