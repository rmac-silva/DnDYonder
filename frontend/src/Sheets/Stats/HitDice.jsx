import React from 'react';

function HitDice({draft,setDraft}) {

    const[usedHitDice,setUsedHitDice]=React.useState(draft.stats.current_hit_dice);

    return (
        <>
            <div className="flex flex-col mr-4 items-center">

                <label className="text-3xl font-semibold ">Hit Dice ({draft.class?.hit_die})</label>
                <div className='flex space-x-4 mt-2'>
                    <div className='relative inline-block'>

                        <label className="absolute left-10 text-xl font-semibold">Used</label>
                        <input

                            type="text"
                            defaultValue={draft.stats.current_hit_dice }
                            onChange={(e) => {setUsedHitDice(e.target.value);}}
                            onBlur={(e) => {draft.stats.current_hit_dice = parseInt(e.target.value); setDraft({...draft})}}
                            placeholder="Used"
                            className="w-30 h-30 bg-white  text-center border-2 border-gray-400 text-2xl md:text-6xl font-semibold rounded-4xl focus-visible:outline-none"
                        />
                    </div>
                    <div className='relative inline-block'>
                    <label className="absolute left-10 text-xl font-semibold">Total</label>
                    <input
                        readOnly
                        value={draft.stats.level}
                        type="text"
                        placeholder="Total"
                        className="w-30 h-30 bg-white text-center border-2 border-gray-400 text-2xl md:text-6xl font-semibold rounded-4xl focus-visible:outline-none"
                    />
                    </div>
                </div>

            </div>
        </>

    )
}

export default HitDice;