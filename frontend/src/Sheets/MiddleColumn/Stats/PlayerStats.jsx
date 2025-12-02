import { React, useState } from 'react';
import { Box, useTheme } from '@mui/material';

function PlayerStats({ draft, setDraft }) {
    const theme = useTheme();
    const [maxHP, setMaxHP] = useState(draft.stats.max_hp);
    const [currentHP, setCurrentHP] = useState(draft.stats.current_hp);
    const [tempHP, setTempHP] = useState(draft.stats.temporary_hp);
    const [ac, setAC] = useState(parseInt(draft.stats.armor_class));
    const [tempAC, setTempAC] = useState(parseInt(draft.stats.armor_class_temp));
    const [iniBonus, setIniBonus] = useState(parseInt(draft.stats.initiative_bonus));
    const [speed, setSpeed] = useState(parseInt(draft.stats.speed));

    function GetMaxHP() {
        let startingHitpoints = parseInt(draft.class?.starting_hitpoints);
        let hpPerLevel = parseInt(draft.class?.hitpoints_per_level);
        let level = parseInt(draft.stats.level);
        let conMod = Math.floor((draft.attributes.Constitution.value - 10) / 2);
        let maxHP = (startingHitpoints + conMod) + ((hpPerLevel + conMod) * (level - 1));
        if (isNaN(maxHP) || !isFinite(maxHP)) {
            return "";
        }
        return maxHP;
    }

    return (
        <>
            {/* Top row: AC / Initiative / Speed */}
            <div className="flex w-full flex-wrap items-start justify-center gap-4 sm:gap-6 md:gap-8 mb-8 mt-1 min-w-0 max-w-full ">
                <div className='flex flex-col items-center'>
                    <div className="relative bg-white inline-block">
                        <label htmlFor='ac-input' className="absolute left-6 sm:left-7 md:left-9 xl:left-10 text-lg sm:text-xl md:text-xl xl:text-2xl font-semibold">AC</label>
                        <Box
                            component="input"
                            type="text"
                            placeholder={"AC"}
                            id='ac-input'
                            value={parseInt(ac)}
                            onChange={(e) => { setAC(parseInt(e.target.value)) }}
                            onBlur={(e) => { draft.stats.armor_class = parseInt(e.target.value); setDraft({ ...draft }) }}
                            className="text-center font-semibold rounded focus-visible:outline-none hover:shadow-md transition-all duration-200"
                            sx={{
                                // responsive box size and font
                                width: { xs: '4.5rem', sm: '5.25rem', md: '6rem', lg: '6.5rem', xl: '7rem' },
                                height: { xs: '4.5rem', sm: '5.25rem', md: '6rem', lg: '6.5rem', xl: '7rem' },
                                fontSize: { xs: '2rem', sm: '2.25rem', md: '2.25rem', lg: '2.5rem', xl: '3.5rem' },
                                border: `2px solid ${theme.palette.baseColor.main}`,
                                '&:hover': { borderColor: theme.palette.primary.main },
                                '&:focus': { borderColor: theme.palette.primary.main },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                        <Box
                            component="input"
                            type="text"
                            placeholder={"T. AC"}
                            id='temp-ac-input'
                            value={parseInt(tempAC)}
                            onChange={(e) => { setTempAC(parseInt(e.target.value)) }}
                            onBlur={(e) => { draft.stats.armor_class_temp = parseInt(e.target.value); setDraft({ ...draft }) }}
                            className="absolute text-center bg-zinc-50 font-semibold rounded focus-visible:outline-none hover:shadow-md transition-all duration-200"
                            sx={{
                                // position and responsive size
                                right: { xs: '-0.75rem', sm: '-1rem', md: '-1.25rem', lg: '-1.25rem', xl: '-1.25rem' },
                                bottom: { xs: '-0.75rem', sm: '-1rem', md: '-1.25rem', lg: '-1.25rem', xl: '-1.25rem' },
                                width: { xs: '2.5rem', sm: '2.75rem', md: '3rem', lg: '3.25rem', xl: '3.5rem' },
                                height: { xs: '2.5rem', sm: '2.75rem', md: '3rem', lg: '3.25rem', xl: '3.5rem' },
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem', xl: '2rem' },
                                border: `2px solid ${theme.palette.baseColor.main}`,
                                '&:hover': { borderColor: theme.palette.primary.main },
                                '&:focus': { borderColor: theme.palette.primary.main },
                                transition: 'border-color 0.2s ease',
                            }}
                        />
                    </div>
                </div>

                <div className='flex bg-white flex-col items-center'>
                    <label htmlFor='ini-input' className="absolute text-lg sm:text-xl md:text-xl xl:text-2xl font-semibold">Initiative</label>
                    <Box
                        component="input"
                        type="text"
                        placeholder={"Ini."}
                        id='ini-input'
                        value={parseInt(iniBonus)}
                        onChange={(e) => { setIniBonus(parseInt(e.target.value)) }}
                        onBlur={(e) => { draft.stats.initiative_bonus = parseInt(e.target.value); setDraft({ ...draft }) }}
                        className="text-center font-semibold rounded focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        sx={{
                            width: { xs: '4.5rem', sm: '5.25rem', md: '6rem', lg: '6.8rem', xl: '7rem' },
                            height: { xs: '4.5rem', sm: '5.25rem', md: '6rem', lg: '6.5rem', xl: '7rem' },
                            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.25rem', lg: '2.5rem', xl: '3.25rem' },
                            border: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                            '&:focus': { borderColor: theme.palette.primary.main },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                </div>

                <div className='flex bg-white flex-col items-center'>
                    <label htmlFor='spd-input' className="absolute text-lg sm:text-xl md:text-xl xl:text-2xl font-semibold">Speed</label>
                    <Box
                        component="input"
                        type="text"
                        placeholder={"Spd."}
                        id='spd-input'
                        value={parseInt(speed)}
                        onChange={(e) => { setSpeed(parseInt(e.target.value)) }}
                        onBlur={(e) => { draft.stats.speed = parseInt(e.target.value); setDraft({ ...draft }) }}
                        className="text-center font-semibold rounded focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        sx={{
                            width: { xs: '4.5rem', sm: '5.25rem', md: '6rem', lg: '5.7rem', xl: '7rem' },
                            height: { xs: '4.5rem', sm: '5.25rem', md: '6rem', lg: '6.5rem', xl: '7rem' },
                            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.25rem', lg: '2.5rem', xl: '3.25rem' },
                            border: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                            '&:focus': { borderColor: theme.palette.primary.main },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                </div>
            </div>

            {/* HP row */}
            <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 md:gap-8 mb-6 min-w-0 max-w-full mt-18">
                <div className="relative inline-block">
                    <label htmlFor="hp-current" className="absolute left-16 sm:left-12 top-5 z-20 text-md sm:text-xl md:text-2xl lg:text-xl font-semibold">Current HP</label>
                    <Box
                        component="input"
                        id="hp-current"
                        value={currentHP}
                        onChange={(e) => setCurrentHP(e.target.value)}
                        onBlur={() => { draft.stats.current_hp = parseInt(currentHP); setDraft({ ...draft }) }}
                        type="text"
                        placeholder="HP"
                        className="text-center bg-white font-semibold rounded-2xl focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        sx={{
                            width: { xs: '11rem', sm: '12rem', md: '13rem', lg: '10rem', xl: '13rem' },
                            height: { xs: '7rem', sm: '8rem', md: '9rem', lg: '8.5rem', xl: '10rem' },
                            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.75rem', lg: '3rem', xl: '3.25rem' },
                            border: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                            '&:focus': { borderColor: theme.palette.primary.main },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                    <Box
                        component="label"
                        htmlFor="hp-max"
                        className="absolute z-20 font-semibold w-20"
                        sx={{
                            right: { xs: '2.5rem', sm: '7.5rem', md: '7.8rem', lg: '5.4rem', xl: '10.5rem' },
                            top: { xs: '-1.75rem', sm: '-1.9rem', md: '-2rem', lg: '-2rem', xl: '-1.8rem' },
                            fontSize: { xs: '1rem', sm: '.75rem', md: '.85rem', lg: '.9rem', xl: '1rem' },
                        }}
                    >
                        Max HP
                    </Box>
                    <Box
                        component="input"
                        id="hp-max"
                        type="text"

                        placeholder="Max HP"
                        value={GetMaxHP()}
                        onChange={(e) => setMaxHP(parseInt(e.target.value))}
                        onBlur={() => { draft.stats.max_hp = parseInt(maxHP); setDraft({ ...draft }) }}
                        className="absolute  text-center bg-zinc-50 font-semibold rounded z-10 focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        sx={{
                            right: { xs: '2.5rem', sm: '8rem', md: '8rem', lg: '6rem', xl: '10.5rem' },
                            top: { xs: '-1.75rem', sm: '-1.9rem', md: '-2rem', lg: '-2rem', xl: '-1.8rem' },
                            width: { xs: '5.5rem', sm: '6rem', md: '6.5rem', lg: '5.5rem', xl: '6.5rem' },
                            height: { xs: '2.75rem', sm: '3.2rem', md: '3.5rem', lg: '3.5rem', xl: '5.1rem' },
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem', lg: '1.6rem', xl: '2rem' },
                            border: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                            '&:focus': { borderColor: theme.palette.primary.main },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                </div>

                <div className="relative inline-block">
                    <Box
                        component="input"
                        id="temp-hp-current"
                        type="text"
                        value={parseInt(tempHP)}
                        onChange={(e) => setTempHP(parseInt(e.target.value))}
                        onBlur={() => { draft.stats.temporary_hp = parseInt(tempHP); setDraft({ ...draft }) }}
                        placeholder="Temp.HP"
                        className="text-center bg-white font-semibold rounded-2xl focus-visible:outline-none hover:shadow-md transition-all duration-200"
                        sx={{
                            width: { xs: '11rem', sm: '12rem', md: '13rem', lg: '10rem', xl: '10rem' },
                            height: { xs: '7rem', sm: '8rem', md: '9rem', lg: '8.5rem', xl: '10rem' },
                            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.75rem', lg: '3rem', xl: '3.25rem' },
                            border: `2px solid ${theme.palette.baseColor.main}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                            '&:focus': { borderColor: theme.palette.primary.main },
                            transition: 'border-color 0.2s ease',
                        }}
                    />
                    <Box
                        component="label"
                        htmlFor="temp-hp-current"
                        className="absolute   rounded z-10 text-pretty text-center pb-1 font-semibold"
                        sx={{
                            right: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '1.25rem', xl: '1.25rem' },
                            top: { xs: '-1.75rem', sm: '-1.9rem', md: '-2rem', lg: '-1.8rem', xl: '-1.8rem' },
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.15rem', xl: '1.5rem' },
                            width: { xs: '6.25rem', sm: '6.5rem', md: '7rem', lg: '7.5rem', xl: '7.5rem' },
                            border: `2px solid ${theme.palette.baseColor.main}`,
                            backgroundColor: '#fafafa',
                        }}
                    >
                        Temp. HP
                    </Box>
                </div>
            </div>
        </>
    )
}

export default PlayerStats;