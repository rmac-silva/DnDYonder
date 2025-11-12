import COLORS from '../constants/colors.js';

function SheetHeader({draft,setDraft, nameVar, setNameVar}) {

    
    const textClasses = 'focus-visible:outline-none';

    return (<div className="flex rounded-xl shadow-md font-semibold p-5 justify-between border-2 mb-4" style={{backgroundColor: COLORS.primary, borderColor: COLORS.accent}}>
        <div className="flex-1 mr-4">
            <label htmlFor="characterName" className="block text-xl" style={{color: COLORS.secondary}}>
                Character Name:
            </label>
            {/* Character Name */}
            <input
                type="text"
                onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }) }}
                onChange={(e) => setNameVar(e.target.value)}
                value={nameVar}
                placeholder="Grommisk"
                className={`mt-1 px-3 py-2 block w-full border-b-2 bg-transparent !text-4xl font-semibold leading-tight whitespace-nowrap overflow-y-hidden transition-colors duration-200 ${textClasses}`}
                style={{borderColor: COLORS.accent, color: COLORS.secondary}}
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.accent}
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
                className={`mt-1 px-3 py-2 block w-full border-b-2 bg-transparent !text-md leading-tight whitespace-nowrap overflow-y-hidden transition-colors duration-200 ${textClasses}`}
                style={{borderColor: COLORS.accent, color: COLORS.secondary}}
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            />

            {/* Background */}
            <input
                type="text"
                placeholder="Background"
                onBlur={(e) => { draft.background.background = e.target.value; setDraft({ ...draft }) }}
                defaultValue={draft.background.background}
                className={`mt-1 px-3 py-2 block w-full border-b-2 bg-transparent !text-md leading-tight whitespace-nowrap overflow-y-hidden transition-colors duration-200 ${textClasses}`}
                style={{borderColor: COLORS.accent, color: COLORS.secondary}}
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            />

            {/* Race */}
            <input
                type="text"
                disabled
                defaultValue={draft.race.subrace !== '' ? draft.race.subrace + " " + draft.race.race : draft.race.race}
                onBlur={(e) => { draft.race.race = e.target.value; setDraft({ ...draft }) }}
                placeholder="Race"
                className={`mt-1 px-3 py-2 block w-full border-b-2 bg-transparent !text-md leading-tight whitespace-nowrap overflow-y-hidden transition-colors duration-200 ${textClasses}`}
                style={{borderColor: COLORS.accent, color: COLORS.secondary}}
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            />

            {/* Alignment */}
            <input
                type="text"
                defaultValue={draft.race.alignment}
                onBlur={(e) => { draft.race.alignment = e.target.value; setDraft({ ...draft }) }}
                placeholder="Alignment"
                className={`mt-1 px-3 py-2 block w-full border-b-2 bg-transparent !text-md leading-tight whitespace-nowrap overflow-y-hidden transition-colors duration-200 ${textClasses}`}
                style={{borderColor: COLORS.accent, color: COLORS.secondary}}
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            />
        </div>
    </div>)
}

export default SheetHeader;