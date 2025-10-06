
import React from 'react';
import Navbar from '../Navbar/Navbar.jsx'
import CreateNewSheet from './CreateNewSheet.jsx';
import SheetListings from './SheetListings.jsx';

function SheetLayout() {
    return (
        <div>
            <Navbar />
            <div className='flex'>
                {/* Add the option to create a new sheet */}
                <CreateNewSheet />
                {/* List pre-existing sheets if applicable (logged in, or if the user has any) */}
                <SheetListings />
            </div>
        </div>
    )
}

export default SheetLayout