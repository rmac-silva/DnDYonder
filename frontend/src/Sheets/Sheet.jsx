import './Sheet.css'
import React from 'react';
import Navbar from '../Navbar/Navbar.jsx'
function GetSheet() {

    const textClasses = "focus-visible:outline-none";
    return (
        <>
            <Navbar />
            <div className="p-4 bg-zinc-200 mx-5 rounded">

                {/* Header */}
                <div className="flex bg-white rounded shadow p-4 justify-between">
                    <div className="flex-1 mr-4">
                        <label htmlFor="characterName" className=" block text-xl text-gray-700">Character Name:</label>
                        <input
                            type="text"
                            id="characterName"
                            name="characterName"
                            placeholder='Grommisk'
                            className={`mt-1 px-2 py-2 block w-full border-b-2 !text-3xl ${textClasses}`}
                        />
                    </div>
                    <div className="flex-2 grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Class"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                        <input
                            type="text"
                            placeholder="Background"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                        <input
                            type="text"
                            placeholder="Race"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                        <input
                            type="text"
                            placeholder="Alignment"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                    </div>
                </div>

                {/* Three Columns - First column is stats - Second column is Health attacks etc... - Third Column is Traits and features*/}
                <div className="flex mt-6">

                    {/* First Column - Stats */}
                    <div className="w-1/4 bg-white p-4 rounded shadow">

                        {/* STR */}
                        <div className="flex items-center mb-4">

                            <div className="flex flex-col mr-8 items-center">

                                {/* Stat */}
                                <input
                                    type="text"
                                    placeholder="STR"
                                    className="w-24 h-24 text-center border-2 border-gray-300 rounded focus-visible:outline-none"
                                />
                                {/* Modifier */}
                                <input
                                    type="text"
                                    placeholder="STR"
                                    className="w-12 h-8 text-center border-2 border-gray-300 rounded focus-visible:outline-none"
                                />
                            </div>

                            {/* STR Attributes */}
                            <div className="flex w-full">
                                <div className="flex  items-center">
                                    
                                </div>

                                <input type="text" className="mx-1 w-1/8 h-auto text-center border-2 border-gray-300 rounded focus-visible:outline-none flex-auto" />
                                <input type="text" className="  w-auto h-auto text-center border-2 border-gray-300 rounded focus-visible:outline-none flex-auto" />
                            </div>
                        </div>

                        {/* DEX */}
                        <div className="flex items-center mb-4">

                            {/* Stat */}
                            <input
                                type="text"
                                placeholder="DEX"
                                className="w-12 h-12 text-center border-2 border-gray-300 rounded mr-4 focus-visible:outline-none"
                            />

                            {/* Attributes */}
                            <div className="flex space-x-2">
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                            </div>
                        </div>

                        {/* CON */}
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                placeholder="CON"
                                className="w-12 h-12 text-center border-2 border-gray-300 rounded mr-4 focus-visible:outline-none"
                            />
                            <div className="flex space-x-2">
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                            </div>
                        </div>

                        {/* INT */}
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                placeholder="INT"
                                className="w-12 h-12 text-center border-2 border-gray-300 rounded mr-4 focus-visible:outline-none"
                            />
                            <div className="flex space-x-2">
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                            </div>
                        </div>

                        {/* WIS */}
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                placeholder="WIS"
                                className="w-12 h-12 text-center border-2 border-gray-300 rounded mr-4 focus-visible:outline-none"
                            />
                            <div className="flex space-x-2">
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                            </div>
                        </div>

                        {/* CHA */}
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                placeholder="CHA"
                                className="w-12 h-12 text-center border-2 border-gray-300 rounded mr-4 focus-visible:outline-none"
                            />
                            <div className="flex space-x-2">
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                                <input type="text" className="w-12 h-12 text-center border-2 border-gray-300 rounded focus-visible:outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Second Column - Health, Attacks, etc. */}
                    <div className="w-2/5 bg-white mx-4 p-4 rounded shadow">

                    </div>

                    {/* Third Column - Traits and Features */}
                    <div className="flex-1 bg-white p-4 rounded shadow">

                    </div>
                </div>

            </div>
        </>
    )
}

export default GetSheet