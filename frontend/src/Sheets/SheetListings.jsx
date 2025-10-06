import React from 'react'

import CreateNewSheet from './CreateNewSheet.jsx';
import Navbar from '../Navbar/Navbar.jsx';
function SheetListings() {
    return (
        <>
        <Navbar />
        
        <div className='m-4 flex flex-wrap w-auto space-x-4'>
            {/* Show the option to create a single listing */}
            <CreateNewSheet />
            {/* Fetch the sheets from the user, list them here */}
            SheetListings
        </div>
        </>
    )
}

export default SheetListings