function SheetHeader({draft,setDraft, nameVar, setNameVar}) {

    
    const textClasses = 'focus-visible:outline-none';

    return (<div className="flex bg-white rounded shadow font-semibold p-4 justify-between">
        <div className="flex-1 mr-4">
            <label htmlFor="characterName" className="block text-xl text-gray-700">
                Character Name:
            </label>
            {/* Character Name */}
            <input
                type="text"
                onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }) }}
                onChange={(e) => setNameVar(e.target.value)}
                value={nameVar}
                placeholder="Grommisk"
                className={`mt-1 px-2 py-2 block w-full border-b-2 !text-gray-700 !text-4xl font-semibold leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
            />
        </div>

        <div className="flex-2 grid grid-cols-2 gap-4">
            {/* Class */}
            <input
                type="text"
                disabled
                defaultValue={draft.class.class_name}
                onBlur={(e) => { draft.class.class_name = e.target.value; setDraft({ ...draft }) }}
                placeholder="Race"
                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
            />

            {/* Background */}
            <input
                type="text"
                placeholder="Background"
                onBlur={(e) => { draft.background.background = e.target.value; setDraft({ ...draft }) }}
                defaultValue={draft.background.background}
                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
            />

            {/* Race */}
            <input
                type="text"
                disabled
                defaultValue={draft.race.race}
                onBlur={(e) => { draft.race.race = e.target.value; setDraft({ ...draft }) }}
                placeholder="Race"
                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
            />

            {/* Alignment */}
            <input
                type="text"
                defaultValue={draft.race.alignment}
                onBlur={(e) => { draft.race.alignment = e.target.value; setDraft({ ...draft }) }}
                placeholder="Alignment"
                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md leading-tight whitespace-nowrap overflow-y-hidden ${textClasses}`}
            />
        </div>
    </div>)
}

export default SheetHeader;