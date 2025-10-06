import React from 'react'
import { Button } from "@material-tailwind/react";

function CreateNewSheet() {
    return (
        <div className="bg-slate-300 w-58 h-72 mx-4 rounded flex flex-col items-center justify-center">
            <Button className='w-full h-full flex flex-col items-center justify-center' href='/NewSheet'>

            <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mt-5 block w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <div className='text-3xl'>New</div>
            <div className='text-3xl'>Sheet</div>
            </Button>
        </div>

    )
}

export default CreateNewSheet