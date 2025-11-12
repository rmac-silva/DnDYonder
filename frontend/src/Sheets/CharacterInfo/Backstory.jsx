import { useState } from 'react';
import TextField from '@mui/material/TextField';
function Backstory({ draft, setDraft }) {

    const [backstory, setBackstory] = useState(draft.char_info.backstory);

    return (
        <div className="flex flex-col items-center w-full rounded-xl shadow-md p-5 h-full border-2 transition-shadow duration-200" style={{backgroundColor: '#edeae8', borderColor: '#db7f3d'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c46d2f'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#db7f3d'}>
            <div className="text-4xl font-semibold">
                Backstory
            </div>

            <div className='w-full justify-center flex  mt-2 px-4'>

                <TextField 
                    className='!mt-2 border-2 !w-full !px-2' 
                    sx={{ 
                        minWidth: 400, 
                        maxWidth: 800,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#edeae8',
                            '& fieldset': {
                                borderColor: '#db7f3d',
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: '#c46d2f',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#c46d2f',
                            },
                        },
                    }} 
                    value={backstory} 
                    rows={28} 
                    multiline 
                    onChange={(e) => setBackstory(e.target.value)} 
                    onBlur={(e) => { draft.char_info.backstory = e.target.value; setDraft({ ...draft }); }} 
                />
            </div>



        </div>
    )
}

export default Backstory;

