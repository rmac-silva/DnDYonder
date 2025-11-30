import React from 'react';
import { Box, useTheme } from '@mui/material';

function HitDice({draft,setDraft}) {
    const theme = useTheme();
    const[usedHitDice,setUsedHitDice]=React.useState(draft.stats.current_hit_dice);

    return (
        <>
            <div className="flex flex-col mr-4 items-center">
                <label className="text-3xl font-semibold ">Hit Dice ({draft.class?.hit_die})</label>
                <div className='flex space-x-4 mt-2'>
                    <div className='relative inline-block'>
                        <label className="absolute left-10 text-xl font-semibold">Used</label>
                        <Box
                            component="input"
                            type="text"
                            defaultValue={draft.stats.current_hit_dice}
                            onChange={(e) => {setUsedHitDice(e.target.value);}}
                            onBlur={(e) => {draft.stats.current_hit_dice = parseInt(e.target.value); setDraft({...draft})}}
                            placeholder="Used"
                            className="w-30 h-30 bg-white text-center text-2xl md:text-6xl font-semibold rounded-2xl focus-visible:outline-none hover:shadow-md transition-all duration-200"
                            sx={{
                                border: `2px solid ${theme.palette.baseColor.main}`,
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&:focus': {
                                    borderColor: theme.palette.primary.main,
                                },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                    </div>
                    <div className='relative inline-block'>
                        <label className="absolute left-10 text-xl font-semibold">Total</label>
                        <Box
                            component="input"
                            readOnly
                            value={draft.stats.level}
                            type="text"
                            placeholder="Total"
                            className="w-30 h-30 bg-white pointer-events-none text-center text-2xl md:text-6xl font-semibold rounded-2xl focus-visible:outline-none"
                            
                            sx={{
                                border: `2px solid ${theme.palette.baseColor.main}`,
                                
                                
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HitDice;