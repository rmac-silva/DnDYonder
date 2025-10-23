import React from 'react';

function HitDice({draft}) {
    return (
        <>
            <div className="flex flex-col mr-8 items-center">

                <label className="text-3xl font-semibold ">Hit Dice ({draft.class?.hit_die})</label>
                <div className='flex space-x-4 mt-2'>
                    <div className='relative inline-block'>

                        <label className="absolute left-13 text-3xl font-semibold">Used</label>
                        <input

                            type="text"
                            defaultValue={draft.class?.used_hit_dice ? draft.class?.used_hit_dice : 0}
                            placeholder="Used"
                            className="w-42 h-36 bg-white  text-center border-2 border-gray-400 text-4xl md:text-6xl font-semibold rounded-4xl focus-visible:outline-none"
                        />
                    </div>
                    <div className='relative inline-block'>
                    <label className="absolute left-13 text-3xl font-semibold">Total</label>
                    <input
                        readOnly
                        value={draft.stats.level}
                        type="text"
                        placeholder="Total"
                        className="w-42 h-36 bg-white text-center border-2 border-gray-400 text-4xl md:text-6xl font-semibold rounded-4xl focus-visible:outline-none"
                    />
                    </div>
                </div>

            </div>
        </>

    )
}

export default HitDice;