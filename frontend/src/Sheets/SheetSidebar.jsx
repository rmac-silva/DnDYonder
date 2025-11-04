import React from 'react';
import Button from '@mui/material/Button';
import { saveSheet,isSheetSaving,getDraftGlobal } from './SheetManager';
function SheetSidebar() {
    return (
        //Sidebar
                <div className='p-4 h-auto mx-5 justify-self-center rounded w-full text-gray-700 flex flex-col space-y-3'>

                    {/* Save button */}
                    <div className="relative inline-block w-full shadow ">
                        <Button onClick={() => { saveSheet() }} loading={isSheetSaving()} variant="contained" className='h-15 w-full text-6xl' color="success">
                            <span className='text-2xl font-bold text-gray-100'>Save</span>
                        </Button>
                    </div>
                    {/* Save button */}
                    <div className="relative inline-block w-full shadow">
                        <Button onClick={() => { console.log(getDraftGlobal()) }} variant="contained" className='h-15 w-full text-6xl' color="primary">
                            <span className='text-2xl font-bold text-gray-100'>Debug</span>
                        </Button>
                    </div>

                </div>
        );
}

            export default SheetSidebar;