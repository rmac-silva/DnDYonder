import React from 'react';

function PlayerStats() {
    return (
        <>
            {/* Top row: AC, Initiative, Speed */}
            <div className="flex  items-start space-x-12 justify-center mb-16 mt-1">
                <div className='flex flex-col items-center'>
                    <div className="relative bg-white inline-block">
                    <label htmlFor='ac-input' className="absolute left-13 text-3xl font-semibold">AC</label>
                    <input
                        type="text"
                        placeholder={"AC"}
                        id='ac-input'
                        className="w-36 h-36 text-center border-2 border-gray-400 text-5xl font-semibold rounded focus-visible:outline-none"
                    />
                    <input
                        type="text"
                        placeholder={"T. AC"}
                        id='temp-ac-input'
                        className="w-18 h-18 absolute -bottom-6 -right-8 text-center bg-zinc-100 border-2 border-gray-400 text-3xl font-semibold rounded focus-visible:outline-none"
                    />
                    </div>
                </div>

                <div className='flex bg-white flex-col items-center'>
                    <label htmlFor='ini-input' className="absolute text-3xl font-semibold">Initiative</label>
                    <input
                        type="text"
                        placeholder={"Ini."}
                        id='ini-input'
                        className="w-36 h-36 text-center border-2 border-gray-400 text-5xl font-semibold rounded focus-visible:outline-none"
                    />
                </div>

                <div className='flex bg-white flex-col items-center'>
                    <label htmlFor='ac-input' className="absolute text-3xl font-semibold">Speed</label>
                    <input
                        type="text"
                        placeholder={"Spd."}
                        id='ac-input'
                        className="w-36 h-36 text-center border-2 border-gray-400 text-5xl font-semibold rounded focus-visible:outline-none"
                    />
                </div>

            </div>

            {/*HP & Temporary Hitpoints*/}
            <div className="flex items-start space-x-12 justify-center mb-8">
                
                {/*HP*/}
                <div className="relative  inline-block">
                    <label htmlFor="hp-current" className="sr-only">Current HP</label>
                    <input
                        id="hp-current"
                        type="text"
                        placeholder="HP"
                        className="w-78 h-36 text-center border-2 bg-white border-gray-400 text-5xl font-semibold rounded-2xl focus-visible:outline-none"
                    />
                    <input
                        id="hp-max"
                        type="text"
                        placeholder=""
                        className="absolute -top-5 -left-7 w-24 h-26 text-center border-2 border-gray-400 bg-zinc-100 text-3xl font-semibold rounded z-10 focus-visible:outline-none"
                    />
                    <label htmlFor="hp-max" className="absolute -left-6 -top-5 z-20 text-2xl font-semibold">Max HP</label>
                </div>
                {/*Temporary HP*/}
                <div className="relative inline-block">
                <input
                        id="temp-hp-current"
                        type="text"
                        placeholder="Temp.HP"
                        className="w-56 h-36 text-pretty text-center bg-white border-2 border-gray-400 text-5xl font-semibold rounded-2xl focus-visible:outline-none"
                    />
                    <label htmlFor="temp-hp-current" className="w-28 absolute right-13.5 border-gray-400  border-2 bg-zinc-100 rounded -top-8 z-20 text-pretty text-center text-xl font-semibold">Temporary Hitpoints</label>
                </div>
            </div>
        </>
    )
}

export default PlayerStats;