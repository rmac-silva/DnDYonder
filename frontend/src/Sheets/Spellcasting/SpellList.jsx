import { useEffect, useState } from "react";

import AddNewSpell from "./AddNewSpell";
import SwipeableSpellAccordion from "../Lists/SwipeableSpellAccordion";

function SpellList({ draft, setDraft }) {

    const [sortedSpells, setSortedSpells] = useState([]);
    const [newSpells, setNewSpells] = useState(false);

    useEffect(() => {
        console.log("Spellcasting spells known changed:", draft.class.spellcasting.spells_known);
        // Sort spells by level and then by name
        const spellsCopy = [...draft.class.spellcasting.spells_known];
        spellsCopy.sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        });
        setSortedSpells(spellsCopy);
        setNewSpells(false);
    }, [draft.class.spellcasting, newSpells]);

    function handleDelete(spell) {
        draft.class.spellcasting.spells_known = draft.class.spellcasting.spells_known.filter(s => s !== spell);
        setDraft({ ...draft });
        setNewSpells(true);
    }

    function DrawSpell(spell, key) {
        if (spell === undefined) {
            return <div key={key}>Failed to load a spell: Undefined</div>;
        }
        return (




            <SwipeableSpellAccordion
                key={`${spell.name}-${spell.level}-${key}`}
                spell={spell}
                onDelete={handleDelete}
            />

        );
    }

    return (
        <div className="w-full  mt-6 rounded shadow p-2 flex flex-col items-center space-y-2">
            <div className="text-3xl font-semibold">Spell List</div>
            {/* Spell list content goes here */}
            <div className="grid grid-cols-3 gap-4 mt-2 bg-white  p-2 rounded ">
                {/* Example spell entry */}
                {sortedSpells.map((spell, index) => (
                    DrawSpell(spell, index)
                ))}
            </div>
            {/* A button to add a new spell */}
            <AddNewSpell draft={draft} setDraft={setDraft} onAdd={setNewSpells} />
        </div>
    );
}

export default SpellList;