import React from 'react';
import Button from '@mui/material/Button';
import { saveSheet, isSheetSaving, getDraftGlobal } from './SheetManager';
import { useNotification } from '../Utils/NotificationContext';
function SheetSidebar() {
    const { showNotification } = useNotification();

    async function handleSave() {
        var res = await saveSheet(); // return (true,"Save successful");
        if (res?.res === true) {
            showNotification(res.msg, "success");
        } else if (res?.msg) {
            showNotification(res.msg, "error");
        }
    }

    return (
        //Sidebar
        <div className='p-4 h-auto mx-5 justify-self-center rounded w-full text-gray-700 flex flex-col space-y-3'>

            {/* Save button */}
            <div className="relative inline-block w-full shadow ">
                <Button onClick={() => { handleSave(); }} loading={isSheetSaving()} variant="contained" className='h-15 w-full text-6xl' color="success">
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