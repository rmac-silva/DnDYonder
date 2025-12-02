import { Box, useTheme } from '@mui/material';

function SheetHeader({draft,setDraft, nameVar, setNameVar}) {
    const theme = useTheme();
    const textClasses = 'focus-visible:outline-none';

    return (
        <div className="flex bg-white rounded shadow font-semibold p-4 justify-between">
            <div className="flex-1 mr-4">
                <label htmlFor="characterName" className="block text-xl text-gray-800"
                    style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>
                    Character Name:
                </label>
                <Box
                    component="input"
                    type="text"
                    onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }) }}
                    onChange={(e) => setNameVar(e.target.value)}
                    value={nameVar}
                    placeholder="Grommisk"
                    className={`mt-1 px-2 py-2 block w-full !text-gray-700 font-semibold leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
                    sx={{
                        fontSize: { xs: '1rem', sm: '2.5rem', md: '3rem' },
                        borderBottom: `3px solid ${theme.palette.baseColor.main}`,
                        '&:hover': {
                            borderBottomColor: theme.palette.primary.main,
                        },
                        transition: 'border-color 0.2s ease',
                    }}
                />
            </div>

            <div className="flex-2 grid grid-cols-2 gap-4 ">
                {/* Class */}
                <Box
                    component="input"
                    type="text"
                    readOnly
                    defaultValue={draft.class.class_name}
                    onClick={() => { window.open(`https://dnd5e.wikidot.com/${draft.class.class_name.toLowerCase()}`, '_blank'); }}
                    placeholder="Class"
                    className={`mt-1 px-2 py-2 block w-full leading-tight whitespace-nowrap overflow-y-hidden cursor-pointer ${textClasses}`}
                    sx={{
                        fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.25rem' },
                        borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                        transition: 'border-color 0.2s ease',
                        '&:hover': {
                            color: theme.palette.primary.main,
                        },
                    }}
                />

                {/* Background */}
                <Box
                    component="input"
                    type="text"
                    placeholder="Background"
                    onBlur={(e) => { draft.background.background = e.target.value; setDraft({ ...draft }) }}
                    defaultValue={draft.background.background}
                    className={`mt-1 px-2 py-2 block w-full leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
                    sx={{
                        fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.25rem' },
                        borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                        '&:hover': {
                            borderBottomColor: theme.palette.primary.main,
                        },
                        transition: 'border-color 0.2s ease',
                    }}
                />

                {/* Race */}
                <Box
                    component="input"
                    type="text"
                    readOnly
                    defaultValue={draft.race.subrace !== '' ? draft.race.subrace + " " + draft.race.race : draft.race.race}
                    onClick={() => { window.open(`https://dnd5e.wikidot.com/lineage:${draft.race.race.toLowerCase()}`, '_blank'); }}
                    placeholder="Race"
                    className={`mt-1 px-2 py-2 block w-full leading-tight whitespace-nowrap overflow-y-hidden cursor-pointer ${textClasses}`}
                    sx={{
                        fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.25rem' },
                        borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                        transition: 'border-color 0.2s ease',
                        '&:hover': {
                            color: theme.palette.primary.main,
                        },
                    }}
                />

                {/* Alignment */}
                <Box
                    component="input"
                    type="text"
                    defaultValue={draft.race.alignment}
                    onBlur={(e) => { draft.race.alignment = e.target.value; setDraft({ ...draft }) }}
                    placeholder="Alignment"
                    className={`mt-1 px-2 py-2 block w-full leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
                    sx={{
                        fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.25rem' },
                        borderBottom: `2px solid ${theme.palette.baseColor.main}`,
                        '&:hover': {
                            borderBottomColor: theme.palette.primary.main,
                        },
                        transition: 'border-color 0.2s ease',
                    }}
                />
            </div>
        </div>
    );
}

export default SheetHeader;