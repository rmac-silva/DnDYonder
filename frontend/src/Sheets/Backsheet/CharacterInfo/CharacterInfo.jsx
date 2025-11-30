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

  return (
    <div className="flex bg-white w-full rounded mb-4 px-4 py-2 items-center">
      {/* Character name */}
      <div className="flex-1 mr-4 w-1/2">
        <label htmlFor="characterName" className="block text-xl text-gray-700">
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
          className=" !text-gray-700 !text-4xl font-semibold mt-1 px-2 py-2 block w-full  leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
          sx={bottomBorder(2)}
        />
      </div>

      {/* 2x4 Grid */}
      <div className="grid grid-cols-4 grid-rows-2 w-300 gap-y-4 mb-3">
        {/* Age */}
        <div className="flex-col flex">
          <label className="block text-xl text-gray-700">Age:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.age}
            onBlur={(e) => { draft.char_info.age = e.target.value; setDraft({ ...draft }); }}
            placeholder="0"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>

        {/* Height */}
        <div className="flex-1">
          <label className="block text-xl text-gray-700">Height:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.height}
            onBlur={(e) => { draft.char_info.height = e.target.value; setDraft({ ...draft }); }}
            placeholder="6ft"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>

        {/* Weight */}
        <div className="flex-1">
          <label className="block text-xl text-gray-700">Weight:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.weight}
            onBlur={(e) => { draft.char_info.weight = e.target.value; setDraft({ ...draft }); }}
            placeholder="60 lbs"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>

        {/* Distinguishing Marks */}
        <div className="flex-1">
          <label className="block text-xl text-gray-700">Distinguishing Marks:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.weight} // kept as-is (original logic)
            onBlur={(e) => { draft.char_info.distinguishing_marks = e.target.value; setDraft({ ...draft }); }}
            placeholder="Mind Library"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>

        {/* Eye Color */}
        <div className="flex-1">
            <label className="block text-xl text-gray-700">Eye Color:</label>
            <Box
              component="input"
              type="text"
              defaultValue={draft.char_info.eye_color}
              onBlur={(e) => { draft.char_info.eye_color = e.target.value; setDraft({ ...draft }); }}
              placeholder="Nebula Eyes"
              className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
              sx={bottomBorder(2)}
            />
        </div>

        {/* Skin Color */}
        <div className="flex-1">
          <label className="block text-xl text-gray-700">Skin Color:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.skin_color}
            onBlur={(e) => { draft.char_info.skin_color = e.target.value; setDraft({ ...draft }); }}
            placeholder="Pale"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>

        {/* Hair Color */}
        <div className="flex-1">
          <label className="block text-xl text-gray-700">Hair Color:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.hair_color}
            onBlur={(e) => { draft.char_info.hair_color = e.target.value; setDraft({ ...draft }); }}
            placeholder="White with purple highlights"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>

        {/* Scars */}
        <div className="flex-1">
          <label className="block text-xl text-gray-700">Scars:</label>
          <Box
            component="input"
            type="text"
            defaultValue={draft.char_info.scars}
            onBlur={(e) => { draft.char_info.scars = e.target.value; setDraft({ ...draft }); }}
            placeholder="Harry potter scar"
            className="px-2 py-2 block w-64 !text-gray-700 !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none"
            sx={bottomBorder(2)}
          />
        </div>
      </div>
    </div>
  );
}

export default CharacterInfo;