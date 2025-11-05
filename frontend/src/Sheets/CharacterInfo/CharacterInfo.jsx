// This section will have misc. info, age, hair, height, weight etc...


function CharacterInfo({ draft, setDraft }) {

    return (
        <div className="flex bg-white w-full rounded mb-4 p-2 items-center">

            {/* Character name */}
            <div className="flex-1 mr-4 w-1/2">
                <label htmlFor="characterName" className="block text-xl text-gray-700">
                    Character Name:
                </label>
                {/* Character Name */}
                <input
                    type="text"
                    onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }) }}
                    defaultValue={draft.name}
                    placeholder="Grommisk"
                    className={`mt-1 px-2 py-2 block w-full border-b-2 !text-gray-700 !text-4xl font-semibold focus-visible:outline-none`}
                />
            </div>
            {/* Character Name End */}

            {/* 2x4 Grid, Age Height Weight Distinguishing Marks, Eyes, Skin, Hair, Scars */}
            <div className="grid grid-cols-4 grid-rows-2 w-300 gap-y-4 ">

                {/* Age */}
                <div className="flex-col flex  ">
                    <label htmlFor="characterName" className="block text-xl text-gray-700">
                        Age:
                    </label>
                    {/* Character Name */}
                    <input
                        type="text"
                        onBlur={(e) => { draft.char_info.age = e.target.value; setDraft({ ...draft }) }}
                        defaultValue={draft.char_info.age}
                        placeholder="0"
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
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
                        className={` px-2 py-2 block w-64 border-b-2 !text-gray-700 !text-2xl focus-visible:outline-none`}
                    />
                </div>

            </div>
        </div>
    )
}

export default CharacterInfo;