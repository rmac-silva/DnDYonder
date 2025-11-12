import React from 'react';
import Button from '@mui/material/Button';
import { saveSheet,isSheetSaving,getDraftGlobal } from './SheetManager';
import COLORS from '../constants/colors.js';
function SheetSidebar() {
    return (
        //Sidebar
                <div className='p-4 h-auto mx-5 justify-self-center rounded w-full flex flex-col space-y-3' style={{backgroundColor: COLORS.primary, color: COLORS.secondary}}>

                    {/* Save button */}
                    <div className="relative inline-block w-full shadow ">
                        <Button 
                            onClick={() => { saveSheet() }} 
                            loading={isSheetSaving()} 
                            variant="contained" 
                            className='h-15 w-full text-6xl'
                            sx={{
                                backgroundColor: COLORS.accent,
                                color: COLORS.primary,
                                '&:hover': {
                                    backgroundColor: COLORS.accentHover,
                                },
                            }}
                        >
                            <span className='text-2xl font-bold'>Save</span>
                        </Button>
                    </div>
                    {/* Save button */}
                    <div className="relative inline-block w-full shadow">
                        <Button 
                            onClick={() => { console.log(getDraftGlobal()) }} 
                            variant="contained" 
                            className='h-15 w-full text-6xl'
                            sx={{
                                backgroundColor: COLORS.accent,
                                color: COLORS.primary,
                                '&:hover': {
                                    backgroundColor: COLORS.accentHover,
                                },
                            }}
                        >
                            <span className='text-2xl font-bold'>Debug</span>
                        </Button>
                    </div>

                </div>
        );
}

            export default SheetSidebar;