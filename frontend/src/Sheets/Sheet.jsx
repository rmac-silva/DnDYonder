import { React, useState, useEffect } from 'react';
import { getDraftGlobal, saveNewSheet } from './SheetManager.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';
import { initSheetManager, setDraftGlobal, isSheetSaved, saveSheet } from './SheetManager.js';

import Navbar from '../Navbar/Navbar.jsx';

//Left column
import PlayerStats from './Stats/PlayerStats.jsx';

//Middle column
import HitDice from './Stats/HitDice.jsx';
import DeathSaves from './Stats/DeathSaves.jsx';
import PlayerAttacks from './Stats/PlayerAttacks.jsx';
import Inventory from './Inventory/Inventory.jsx';
import Trackers from './Lists/Trackers.jsx';

import SheetHeader from './SheetHeader.jsx';
import SheetLeftColumn from './SheetColumnLeft.jsx';

import SubclassInfo from './SubclassInfo.jsx';
import SheetFeatures from './SheetFeatures.jsx';

import CreateNewCharacter from './CreateNewCharacter.jsx';

//Sheet 2
import Spellcasting from './Spellcasting/Spellcasting.jsx';
import SpellList from './Spellcasting/SpellList.jsx';

import CharacterInfo from './CharacterInfo/CharacterInfo.jsx';

function GetSheet() {




    const ABILITY_SKILL_MAP = {
        "Athletics": "Strength",
        "Acrobatics": "Dexterity",
        "Sleight of Hand": "Dexterity",
        "Stealth": "Dexterity",
        "Arcana": "Intelligence",
        "History": "Intelligence",
        "Investigation": "Intelligence",
        "Nature": "Intelligence",
        "Religion": "Intelligence",
        "Animal Handling": "Wisdom",
        "Insight": "Wisdom",
        "Medicine": "Wisdom",
        "Perception": "Wisdom",
        "Survival": "Wisdom",
        "Deception": "Charisma",
        "Intimidation": "Charisma",
        "Performance": "Charisma",
        "Persuasion": "Charisma"
    };

    const [loading, setLoading] = useState(true);
    const [draft, setDraft] = useState(null);     // editable plain JS object
    const [error, setError] = useState(null);

    const [creatingNewSheet, setCreatingNewSheet] = useState(false);

    const navigate = useNavigate();
    const { sheetid, hashedemail } = useParams();
    const { email, checkAuth } = useAuth();

    async function loadNewSheet(mounted) {

        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:8000/sheets/new');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (!mounted) return;
            console.log("New sheet data:", data);
            setDraft(data);
            initSheetManager(data, undefined, email);
            // console.log("Loaded new sheet:", data); //Enable this to see the json layout
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            setError(err);
        } finally {
            if (mounted) setLoading(false);
        }
    }

    async function loadExistingSheet(mounted) {

        //Check if we have the hashed email
        if (email === null) {
            await checkAuth();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // console.log(`Fetching sheet for ${hashedemail} with ID ${sheetid}`);
            const res = await fetch(`http://127.0.0.1:8000/sheets/${hashedemail}/${sheetid}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(`HTTP ${res.status} - ${data.detail}`);
            }
            const data = await res.json();
            if (!mounted) return;

            setDraft(data);
            initSheetManager(data, sheetid, hashedemail);

        } catch (err) {

            if (err.name === 'AbortError') return;
            console.error(err);
            setError(err);
        } finally {
            if (mounted) setLoading(false);
        }
    }

    useEffect(() => {
        //This is a setup function, gets called when the depencies change
        const controller = new AbortController();
        let mounted = true;

        if (sheetid === undefined || hashedemail === undefined) {
            loadNewSheet(mounted); //Call the load function
            setCreatingNewSheet(true);
            initSheetManager(draft, undefined, hashedemail);

        } else {
            loadExistingSheet(mounted);

        }
        return () => { saveSheet(); mounted = false; controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]); //Set the dependencies to [] so they never change, meaning the code will never be run again


    function updateDraft(newDraft) {
        // console.log("Updating draft:", newDraft);
        setDraftGlobal(newDraft);
        setDraft(newDraft);
    }

    const saveNewCharacter = async () => {
        //This function gets called when the user finishes creating a new character.
        //Let's first grab the proficiencies from the class, and set them in the attributes so we don't have to worry about it later.
        var attributeProfs = draft.class.attribute_proficiencies;
        var skillProfs = draft.class.skill_proficiencies;

        //Now go into the respective attributes and set the proficiencies
        for (let attr of attributeProfs) {
            draft.attributes[attr].skills[0].proficient = true; //[0] is always the saving throw
            draft.attributes[attr].skills[0].locked = true;
        }

        for (let skill of skillProfs) {
            var attributeSkills = draft.attributes[ABILITY_SKILL_MAP[skill]].skills; //Fetch the skills associated with the skill
            var skillObj = attributeSkills.find(s => s.name === skill); //Find the skill object with the same name
            skillObj.proficient = true; //Mark it as proficient
            skillObj.locked = true; // Lock it so the user can't unselect it (This isn't activated but still good to be set)
        }

        setCreatingNewSheet(false);
        initSheetManager(getDraftGlobal(), undefined, email);


        //Now save the sheet to the backend
        console.log("Saving new character... ", getDraftGlobal());
        var newSheetUrl = await saveNewSheet();
        console.log("Navigating to new sheet URL:", newSheetUrl);
        navigate(newSheetUrl);
    }

    function cancelCharacterCreation() {
        navigate(`/sheets/${email}/`);
    }

    // warn on page unload/refresh when sheet has unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            try {
                if (!isSheetSaved()) {
                    // Use the browser native dialog. Setting returnValue is required.
                    e.preventDefault();
                    e.returnValue = '';
                    // Do not call window.confirm here — browsers ignore custom prompts in beforeunload.
                }
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                // If isSheetSaved isn't ready, do nothing.
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [/* no deps so always uses latest isSheetSaved implementation */]);

    if (loading) return <div>Loading sheet…</div>; //TODO - Make a generic loading screen that receives a message
    if (error) return <div>{String(error)}</div>;
    if (!draft) return null;
    if (draft === null || draft === undefined || draft.class === undefined || draft.race === undefined) {
        return <div>Error loading sheet…</div>;
    }

    return (
        <div>
            {/* Using beforeunload handler above instead of Prompt (Prompt removed in react-router-dom v6) */}
            <Navbar />

            {creatingNewSheet &&
                <CreateNewCharacter isOpen={creatingNewSheet} onClose={cancelCharacterCreation} onSubmit={saveNewCharacter} draft={draft} setDraft={updateDraft} />
            }
            {
                !creatingNewSheet &&
                <div className='flex'>


                    <div className='flex-col w-full'>

                        {/* Sheet Page 1 */}
                        <div className='flex w-full'>
                            <div className="mt-4 p-4 bg-zinc-200 mx-5 justify-self-center rounded w-full text-gray-700">
                                {/* Header */}
                                <SheetHeader draft={draft} setDraft={updateDraft} />

                                {/* Three Columns */}
                                <div className="flex mt-6">

                                    {/* First Column - Stats */}
                                    <SheetLeftColumn draft={draft} setDraft={updateDraft} />

                                    {/* Second Column - Health, Attacks, etc. */}
                                    <div className="w-1/3 bg-white mx-4 p-4 rounded shadow">
                                        <div className=' p-4 flex flex-col'>

                                            <PlayerStats draft={draft} setDraft={updateDraft} />
                                            <div className='flex justify-center'>
                                                <HitDice draft={draft} setDraft={updateDraft} />
                                                <DeathSaves draft={draft} setDraft={updateDraft} />
                                            </div>
                                            <PlayerAttacks draft={draft} setDraft={updateDraft} />
                                            <Inventory draft={draft} setDraft={updateDraft} />
                                            <Trackers draft={draft} setDraft={updateDraft} />
                                        </div>
                                    </div>

                                    {/* Third Column - Traits and Features */}
                                    <div className=" bg-white flex flex-col p-4 w-1/3 rounded shadow">
                                        {/* placeholder for traits and features */}
                                        <SubclassInfo draft={draft} setDraft={updateDraft} />
                                        <SheetFeatures draft={draft} setDraft={updateDraft} />

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sheet Page 2 */}
                        <div className='flex w-full'>
                            <div className="mt-4 p-4 bg-zinc-200 mx-5 justify-self-center flex flex-col rounded w-full  text-gray-700">

                                {/* Header */}
                                <div className='flex items-center justify-center gap-4'>
                                    <CharacterInfo draft={draft} setDraft={updateDraft}/>
                                </div>

                                {/* Character Traits etc... Spellcasting if applicable*/}
                                <div className=' w-full flex space-x-2 flex-wrap' >
                                    <div className= {`bg-white rounded shadow p-2 flex flex-col items-center space-y-2 ${draft.stats.level >= draft.class.spellcasting.level ? 'w-23/100' : 'w-49/100'}`}>
                                        <div className='text-4xl font-semibold'>Backstory</div>
                                        <div >TODO</div>
                                    </div>
                                    {draft.stats.level >= draft.class.spellcasting.level &&
                                        <div className=' bg-white rounded shadow p-2 flex flex-col items-center space-y-2 min-w-230 max-w-230'>
                                            <Spellcasting draft={draft} setDraft={updateDraft} />
                                            <SpellList draft={draft} setDraft={updateDraft} />
                                        </div>
                                    }
                                    <div className= {`bg-white rounded shadow p-2 flex flex-col items-center space-y-2 ${draft.stats.level >= draft.class.spellcasting.level ? 'w-23/100' : 'w-49/100'}`}>

                                        <div className='text-4xl font-semibold'>Backstory</div>
                                        <div >TODO</div>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            }

        </div>
    );
}

export default GetSheet;