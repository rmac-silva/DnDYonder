import React from 'react';
import COLORS from '../../constants/colors.js';

function HitDice({draft,setDraft}) {

    const[usedHitDice,setUsedHitDice]=React.useState(draft.stats.current_hit_dice);

    return (
        <>
            <div className="flex flex-col mr-4 items-center">

                <label className="text-3xl font-semibold" style={{color: COLORS.secondary}}>Hit Dice ({draft.class?.hit_die})</label>
                <div className='flex space-x-4 mt-2'>
                    <div className='relative inline-block'>

                        <label className="absolute left-10 text-xl font-semibold" style={{color: COLORS.secondary}}>Used</label>
                        <input

                            type="text"
                            defaultValue={draft.stats.current_hit_dice }
                            onChange={(e) => {setUsedHitDice(e.target.value);}}
                            onBlur={(e) => {draft.stats.current_hit_dice = parseInt(e.target.value); setDraft({...draft})}}
                            placeholder="Used"
                            className="w-30 h-30 text-center border-2 text-2xl md:text-6xl font-semibold rounded-2xl focus-visible:outline-none hover:shadow-md transition-all duration-200"
                            style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                        />
                    </div>
                    <div className='relative inline-block'>
                    <label className="absolute left-10 text-xl font-semibold" style={{color: COLORS.secondary}}>Total</label>
                    <input
                        readOnly
                        value={draft.stats.level}
                        type="text"
                        placeholder="Total"
                        className="w-30 h-30 text-center border-2 text-2xl md:text-6xl font-semibold rounded-2xl focus-visible:outline-none shadow-sm"
                        style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                    />
                    </div>
                </div>

            </div>
        </>

    )
}

export default HitDice;