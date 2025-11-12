import React from 'react';

function HitDice({draft,setDraft}) {

    const[usedHitDice,setUsedHitDice]=React.useState(draft.stats.current_hit_dice);

    return (
        <>
            <div className="flex flex-col mr-4 items-center">

                <label className="text-3xl font-semibold" style={{color: '#1a1a1a'}}>Hit Dice ({draft.class?.hit_die})</label>
                <div className='flex space-x-4 mt-2'>
                    <div className='relative inline-block'>

                        <label className="absolute left-10 text-xl font-semibold" style={{color: '#1a1a1a'}}>Used</label>
                        <input

                            type="text"
                            defaultValue={draft.stats.current_hit_dice }
                            onChange={(e) => {setUsedHitDice(e.target.value);}}
                            onBlur={(e) => {draft.stats.current_hit_dice = parseInt(e.target.value); setDraft({...draft})}}
                            placeholder="Used"
                            className="w-30 h-30 text-center border-2 text-2xl md:text-6xl font-semibold rounded-2xl focus-visible:outline-none hover:shadow-md transition-all duration-200"
                            style={{borderColor: '#db7f3d', backgroundColor: '#edeae8', color: '#1a1a1a'}}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                        />
                    </div>
                    <div className='relative inline-block'>
                    <label className="absolute left-10 text-xl font-semibold" style={{color: '#1a1a1a'}}>Total</label>
                    <input
                        readOnly
                        value={draft.stats.level}
                        type="text"
                        placeholder="Total"
                        className="w-30 h-30 text-center border-2 text-2xl md:text-6xl font-semibold rounded-2xl focus-visible:outline-none shadow-sm"
                        style={{borderColor: '#db7f3d', backgroundColor: '#edeae8', color: '#1a1a1a'}}
                    />
                    </div>
                </div>

            </div>
        </>

    )
}

export default HitDice;