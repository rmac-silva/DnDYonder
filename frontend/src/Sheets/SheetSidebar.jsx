import React from 'react';
import Button from '@mui/material/Button';
function SheetSidebar({ saveSheet, saving, draft }) {
    return (
        //Sidebar
                <div className='mt-4 p-4 h-auto bg-zinc-200 mx-5 justify-self-center rounded w-1/8 text-gray-700 flex flex-col space-y-3'>

                    {/* Save button */}
                    <div className="relative inline-block w-full">
                        <Button onClick={() => { saveSheet() }} loading={saving} variant="contained" className='h-15 w-full text-6xl' color="success">
                            <span className='text-2xl font-bold text-gray-100'>Save</span>
                        </Button>
                    </div>
                    {/* Save button */}
                    <div className="relative inline-block w-full">
                        <Button onClick={() => { console.log(draft) }} variant="contained" className='h-15 w-full text-6xl' color="primary">
                            <span className='text-2xl font-bold text-gray-100'>Debug</span>
                        </Button>
                    </div>

                </div>
        );
}

            export default SheetSidebar;