import { useState, useEffect } from 'react';
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";

function Spellcasting({ draft, setDraft }) {
    const grey400 = grey[400];
    const [maxSpellLevel, setMaxSpellLevel] = useState(draft.class.spellcasting.max_level_spellslots);
    const [spellcastingAbility, setSpellcastingAbility] = useState(draft.class.spellcasting.spellcasting_ability);
    const [loading, setLoading] = useState(true);
    const maxSlotsPerLevel = {
        1: 4,
        2: 3,
        3: 3,
        4: 3,
        5: 3,
        6: 2,
        7: 2,
        8: 1,
        9: 1
    }

    useEffect(() => {
        if (Object.keys(draft.class.spellcasting.spell_slots).length === 0) {
            draft.class.spellcasting.spell_slots[1] = [false, false, false, false];
            draft.class.spellcasting.spell_slots[2] = [false, false, false];
            draft.class.spellcasting.spell_slots[3] = [false, false, false];
            draft.class.spellcasting.spell_slots[4] = [false, false, false];
            draft.class.spellcasting.spell_slots[5] = [false, false, false];
            draft.class.spellcasting.spell_slots[6] = [false, false];
            draft.class.spellcasting.spell_slots[7] = [false, false];
            draft.class.spellcasting.spell_slots[8] = [false];
            draft.class.spellcasting.spell_slots[9] = [false];
            setDraft({ ...draft });
        }

        setLoading(false);
    })


    function GetSpellcastingModifier() {
        var proficiencyBonus = draft.stats.proficiency_bonus;

        if (spellcastingAbility === undefined || spellcastingAbility === null) {
            return proficiencyBonus;
        }

        //Get the modifier bonus for the spellcasting ability
        switch (spellcastingAbility.toLowerCase().trim().replaceAll('.', '')) {
            case 'strength':
                return proficiencyBonus + Math.floor((draft.attributes.Strength.value - 10) / 2);
            case 'str':
                return proficiencyBonus + Math.floor((draft.attributes.Strength.value - 10) / 2);

            case 'dexterity':
                return proficiencyBonus + Math.floor((draft.attributes.Dexterity.value - 10) / 2);
            case 'dex':
                return proficiencyBonus + Math.floor((draft.attributes.Dexterity.value - 10) / 2);

            case 'constitution':
                return proficiencyBonus + Math.floor((draft.attributes.Constitution.value - 10) / 2);
            case 'con':
                return proficiencyBonus + Math.floor((draft.attributes.Constitution.value - 10) / 2);

            case 'intelligence':
                return proficiencyBonus + Math.floor((draft.attributes.Intelligence.value - 10) / 2);
            case 'int':
                return proficiencyBonus + Math.floor((draft.attributes.Intelligence.value - 10) / 2);

            case 'wisdom':
                return proficiencyBonus + Math.floor((draft.attributes.Wisdom.value - 10) / 2);
            case 'wis':
                return proficiencyBonus + Math.floor((draft.attributes.Wisdom.value - 10) / 2);

            case 'charisma':
                return proficiencyBonus + Math.floor((draft.attributes.Charisma.value - 10) / 2);
            case 'cha':
                return proficiencyBonus + Math.floor((draft.attributes.Charisma.value - 10) / 2);

            default:
                return proficiencyBonus;
        }
    }

    function GetSpellcastingDC() {
        return 8 + GetSpellcastingModifier();
    }

    function ToggleSpellcastingSlot(spellSlotLevel, spellSlotIndex) {
        console.log(`Toggling spell slot level ${spellSlotLevel} index ${spellSlotIndex}`);
        draft.class.spellcasting.spell_slots[spellSlotLevel][spellSlotIndex] = !draft.class.spellcasting.spell_slots[spellSlotLevel][spellSlotIndex];
        setDraft({ ...draft });
    }

    function DrawSpellslotMarkers(index) {
        // wrapper ensures consistent horizontal spacing and vertical alignment



        const markers = [];
        for (let i = 0; i < maxSlotsPerLevel[index + 1]; i++) {
            markers.push(<Checkbox
                key={i}
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                disabled={index + 1 > maxSpellLevel}
                size="small"                      // use valid MUI size value
                checked={draft.class.spellcasting.spell_slots[index + 1][i]}      // coerce to boolean to avoid uncontrolled->controlled
                onChange={() => ToggleSpellcastingSlot(index + 1, i)}
                sx={{
                    padding: 0,
                    marginBottom: 0.2,
                    marginRight: -1,
                    color: grey400,

                    "&.Mui-checked": {
                        color: "#1f1f1f",
                    },
                }}
            />);
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {markers}
            </div>
        );
    }

    if(loading){
        return <div>Loading Spellsheet...</div>;
    }

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='text-4xl font-semibold mb-4'>Spellcasting</div>

            <div className='flex justify-start w-full'>


                {/* Modifier, Spellcasting Ability, and Max Spell Slot Level */}
                <div className="relative flex flex-col w-auto items-center justify-center ">

                    {/* Input that specifies the max level of the spell slot */}
                    <div className="flex space-x-2 mt-2 justify-center items-center w-full ml-6 mr-2">

                        <div className='items-center flex flex-col'>

                            <label className="absolute   text-lg font-semibold">Spellcasting Lvl.</label>
                            <input
                                type="number"
                                max={9}
                                min={1}
                                value={maxSpellLevel}
                                onChange={(e) => setMaxSpellLevel(e.target.value)}
                                onBlur={(e) => { draft.class.spellcasting.max_level_spellslots = e.target.value; setDraft({ ...draft }) }}
                                className="border border-gray-300 rounded p-1 w-36 h-24 text-center text-4xl"
                            />
                        </div>

                        <div className='items-center flex flex-col'>
                            <label className="absolute   text-lg font-semibold">Spellcasting Ability</label>
                            <input
                                type="text"
                                value={spellcastingAbility}
                                placeholder='Wisdom'
                                onChange={(e) => setSpellcastingAbility(e.target.value)}
                                onBlur={(e) => { draft.class.spellcasting.spellcasting_ability = e.target.value; setDraft({ ...draft }) }}
                                className="border border-gray-300 rounded p-1 w-48 h-24 text-center text-4xl"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-2 mt-2 justify-center items-start w-full ml-6 mr-2">


                        {/* Mod */}
                        <div className='items-center flex flex-col'>
                            <label className="absolute   text-lg font-semibold">Modifier</label>
                            <input
                                type="text"
                                value={GetSpellcastingModifier()}
                                readOnly
                                className="border border-gray-300 rounded p-1 w-24 h-24 text-center text-4xl"
                            />
                        </div>

                        {/* DC */}
                        <div className='items-center flex flex-col '>
                            <label className="absolute   text-lg font-semibold">DC</label>
                            <input
                                type="text"
                                value={GetSpellcastingDC()}
                                readOnly
                                className="border border-gray-300 rounded p-1 w-24 h-24 text-center text-4xl"
                            />
                        </div>
                    </div>
                </div>

                {/* The spell slots, with levels 1 to 9 will go here. With dots to represent the maximum spell slots known */}
            <div className='flex flex-col w-full items-center space-y-2'>
                <div className='text-2xl'> Spell Slots</div>
                <div className='grid w-full grid-cols-3 place-items-center mt-2'>
                    {Array.from({ length: 9 }, (_, index) => (
                        <div className=' flex border-1 border-zinc-400 w-42 px-4 py-2 rounded items-center space-x-4 mb-2 ml-1' key={index}>
                            {/* fixed minWidth makes all markers start at same place */}
                            <div
                                className={index + 1 > maxSpellLevel ? 'disabled font-light' : 'font-medium'}
                                style={{ minWidth: 38, textAlign: 'left' }}
                            >
                                Lvl. {index + 1}
                            </div>

                            {DrawSpellslotMarkers(index)}

                        </div>
                    ))}
                </div>
            </div>
            </div>

        </div>
    );
}

export default Spellcasting;