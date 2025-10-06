import Navbar from '../Navbar/Navbar.jsx'
import React from 'react';

/// The homepage component

function Homepage() {
    return (
    <div className="">
        <Navbar />
        <div className="w-full grid grid-cols-5 my-10 content-center">
            <div>Welcome to the homepage!</div>
        </div>
    </div>
    
    )
}

export default Homepage