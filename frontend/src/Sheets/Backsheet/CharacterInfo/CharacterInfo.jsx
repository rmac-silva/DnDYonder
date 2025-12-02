// This section will have misc. info, age, hair, height, weight etc...
import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function CharacterInfo({ draft, setDraft, nameVar, setNameVar }) {
  const theme = useTheme();

  const bottomBorder = (thickness = 2) => ({
    borderBottom: `${thickness}px solid ${theme.palette.baseColor.main}`,
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderBottomColor: theme.palette.primary.main,
    },
    '&:focus': {
      borderBottomColor: theme.palette.primary.main,
      outline: 'none',
    },
  });

  // Add a shared max-width style for all grid inputs so they stay narrow on mobile
  const gridItemWidth = { xs: 160, sm: 200, md: 256, lg: 256, xl: 280 };
  const commonInputSx = {
    ...bottomBorder(2),
    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
    width: '100%',
    maxWidth: gridItemWidth,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div className="flex bg-white w-full md:flex-row flex-col rounded mb-4 px-4 py-2 items-center">
      {/* Character name */}
      <div className="flex-1 mr-4 w-full mb-4 md:mb-0">
        <label
          htmlFor="characterName"
          className="block text-gray-700"
          style={{ fontSize: 'clamp(1rem, 3.5vw, 1.5rem)' }}
        >
          Character Name:
        </label>
        <Box
          component="input"
          id="characterName"
          type="text"
          value={nameVar}
          onChange={(e) => setNameVar(e.target.value)}
          onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }); }}
          placeholder="Grommisk"
          className="px-2 py-2 block w-full !text-gray-700 font-semibold text-lg md:text-4xl mt-1 leading-tight whitespace-nowrap overflow-y-hidden  focus-visible:outline-none"
          sx={{
            ...bottomBorder(2),
            // keep existing font sizes; only width behavior changed via container above
          }}
        />
      </div>

      {/* Responsive Grid: 2 cols on xs/sm, 4 cols on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 w-[80%] mb-3">
        {/* Age */}
        <div className="flex-col flex">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Age:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.age}
            onBlur={(e) => { draft.char_info.age = e.target.value; setDraft({ ...draft }); }}
            placeholder="0"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Height */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Height:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.height}
            onBlur={(e) => { draft.char_info.height = e.target.value; setDraft({ ...draft }); }}
            placeholder="6ft"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Weight */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Weight:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.weight}
            onBlur={(e) => { draft.char_info.weight = e.target.value; setDraft({ ...draft }); }}
            placeholder="60 lbs"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Distinguishing Marks */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Distinguishing Marks:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.weight} // kept as-is (original logic)
            onBlur={(e) => { draft.char_info.distinguishing_marks = e.target.value; setDraft({ ...draft }); }}
            placeholder="Mind Library"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Eye Color */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Eye Color:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.eye_color}
            onBlur={(e) => { draft.char_info.eye_color = e.target.value; setDraft({ ...draft }); }}
            placeholder="Nebula Eyes"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Skin Color */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Skin Color:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.skin_color}
            onBlur={(e) => { draft.char_info.skin_color = e.target.value; setDraft({ ...draft }); }}
            placeholder="Pale"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Hair Color */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Hair Color:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.hair_color}
            onBlur={(e) => { draft.char_info.hair_color = e.target.value; setDraft({ ...draft }); }}
            placeholder="White with purple highlights"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>

        {/* Scars */}
        <div className="flex-1">
          <label className="block text-gray-700 text-base sm:text-lg md:text-xl">Scars:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.scars}
            onBlur={(e) => { draft.char_info.scars = e.target.value; setDraft({ ...draft }); }}
            placeholder="Harry potter scar"
            className="px-2 py-2 block !text-gray-700 leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={commonInputSx}
          />
        </div>
      </div>
    </div>
  );
}

export default CharacterInfo;