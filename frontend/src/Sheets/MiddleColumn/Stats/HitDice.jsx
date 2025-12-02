import React from 'react';
import { Box, useTheme } from '@mui/material';

function HitDice({draft,setDraft}) {
    const theme = useTheme();
    const[usedHitDice,setUsedHitDice]=React.useState(draft.stats.current_hit_dice);

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                
                sx={{
                    mr: { xs: 1, sm: 2, md: 3, lg: 4 },
                    width: 'auto', // was '100%' — allow content width so it can sit side-by-side
                    flexShrink: 0,
                    flexWrap: 'nowrap',
                }}
            >
                <Box
                    component="label"
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
                        fontWeight: 600,
                        textAlign: 'center',
                    }}
                >
                    Hit Dice ({draft.class?.hit_die})
                </Box>

                <Box
                    display="flex"
                    flexDirection={'row'}
                    gap={{ xs: 2, sm: 3, md: 4 }}
                    sx={{
                        width: 'auto', // was '100%' — prevent stretching inside flex row
                        justifyContent: 'center',
                        
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box
                            component="label"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                fontWeight: 600,
                                flexWrap: 'nowrap',
                                
                            }}
                        >
                            Used
                        </Box>
                        <Box
                            component="input"
                            type="text"
                            defaultValue={draft.stats.current_hit_dice}
                            onChange={(e) => { setUsedHitDice(e.target.value); }}
                            onBlur={(e) => { draft.stats.current_hit_dice = parseInt(e.target.value) || 0; setDraft({ ...draft }); }}
                            placeholder="Used"
                            sx={{
                                width: { xs: 72, sm: 88, md: 100, lg: 112, xl: 120 },
                                height: { xs: 56, sm: 64, md: 72, lg: 84, xl: 92 },
                                bgcolor: 'white',
                                textAlign: 'center',
                                fontSize: { xs: '1.5rem', md: '2rem', lg: '2.5rem' },
                                fontWeight: 600,
                                borderRadius: 2,
                                outline: 'none',
                                border: `2px solid ${theme.palette.baseColor.main}`,
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: 1,
                                },
                                '&:focus': {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: 2,
                                },
                            }}
                        />
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box
                            component="label"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                fontWeight: 600,
                                
                            }}
                        >
                            Total
                        </Box>
                        <Box
                            component="input"
                            readOnly
                            value={draft.stats.level}
                            type="text"
                            placeholder="Total"
                            sx={{
                                pointerEvents: 'none',
                                width: { xs: 72, sm: 88, md: 100, lg: 112, xl: 120 },
                                height: { xs: 56, sm: 64, md: 72, lg: 84, xl: 92 },
                                bgcolor: 'white',
                                textAlign: 'center',
                                fontSize: { xs: '1.5rem', md: '2rem', lg: '2.5rem' },
                                fontWeight: 600,
                                borderRadius: 2,
                                outline: 'none',
                                border: `2px solid ${theme.palette.baseColor.main}`,
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default HitDice;