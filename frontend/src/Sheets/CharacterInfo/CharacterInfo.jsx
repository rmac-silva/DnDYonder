// This section will have misc. info, age, hair, height, weight etc...
import {useState} from "react";

function CharacterInfo({ draft, setDraft, nameVar, setNameVar }) {

    return (
        <div className="flex w-full rounded-xl mb-4 px-5 py-4 items-center border-2 shadow-md transition-shadow duration-200" style={{backgroundColor: '#edeae8', borderColor: '#db7f3d'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c46d2f'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#db7f3d'}>

            {/* Character name */}
            <div className="flex-1 mr-4 w-1/2">
                <label htmlFor="characterName" className="block text-xl" style={{color: '#1a1a1a'}}>
                    Character Name:
                </label>
                {/* Character Name */}
                <input
                    type="text"
                    onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }) }}
                    value={nameVar}
                    onChange={(e) => { setNameVar(e.target.value) }}
                    placeholder="Grommisk"
                    className={`mt-1 px-3 py-2 block w-full border-b-2 bg-transparent !text-4xl font-semibold leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                    style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                />
            </div>
            {/* Character Name End */}

            {/* 2x4 Grid, Age Height Weight Distinguishing Marks, Eyes, Skin, Hair, Scars */}
            <div className="grid grid-cols-4 grid-rows-2 w-300 gap-y-4 mb-3 ">

                {/* Age */}
                <div className="flex-col flex  ">
                    <label htmlFor="characterName" className="block text-xl" style={{color: '#1a1a1a'}}>
                        Age:
                    </label>
                    {/* Character Name */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.age = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.age}
                        placeholder="0"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Height */}
                <div className="flex-1 ">
                    <label htmlFor="characterHeight" className="block text-xl text-gray-700">
                        Height:
                    </label>
                    {/* Character Height */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.height = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.height}
                        placeholder="6ft"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Weight */}
                <div className="flex-1 ">
                    <label htmlFor="characterWeight" className="block text-xl text-gray-700">
                        Weight:
                    </label>
                    {/* Character Weight */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.weight = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.weight}
                        placeholder="60 lbs"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Distinguishing Marks */}
                <div className="flex-1">
                    <label htmlFor="characterDistinguishingMarks" className="block text-xl text-gray-700">
                        Distinguishing Marks:
                    </label>
                    {/* Character Distinguishing Marks */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.distinguishing_marks = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.weight}
                        placeholder="Mind Library"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Eye Color */}
                <div className="flex-1">
                    <label htmlFor="characterEyeColor" className="block text-xl text-gray-700">
                        Eye Color:
                    </label>
                    {/* Character Eye Color */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.eye_color = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.eye_color}
                        placeholder="Nebula Eyes"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Skin Color */}
                <div className="flex-1">
                    <label htmlFor="characterSkinColor" className="block text-xl text-gray-700">
                        Skin Color:
                    </label>
                    {/* Character Skin Color */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.skin_color = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.skin_color}
                        placeholder="Pale"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Hair Color */}
                <div className="flex-1">
                    <label htmlFor="characterHairColor" className="block text-xl text-gray-700">
                        Hair Color:
                    </label>
                    {/* Character Hair Color */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.hair_color = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.hair_color}
                        placeholder="White with purple highlights"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

                {/* Scars */}
                <div className="flex-1">
                    <label htmlFor="characterScars" className="block text-xl text-gray-700">
                        Scars:
                    </label>
                    {/* Character Scars */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.scars = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.scars}
                        placeholder="Harry potter scar"
                        className={` px-3 py-2 block w-64 border-b-2 bg-transparent !text-lg leading-tight whitespace-nowrap overflow-y-hidden focus-visible:outline-none transition-colors duration-200`}
                        style={{borderColor: '#db7f3d', color: '#1a1a1a'}}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                    />
                </div>

            </div>
        </div>
    )
}

export default CharacterInfo;