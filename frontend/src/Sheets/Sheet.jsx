import { React, useState, useEffect } from 'react';
import { getDraftGlobal, saveNewSheet } from './SheetManager.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';
import { initSheetManager, setDraftGlobal, isSheetSaved, saveSheet } from './SheetManager.js';

import Navbar from '../Navbar/Navbar.jsx';
import Box from '@mui/material/Box';

//Left column
import PlayerStats from './MiddleColumn/Stats/PlayerStats.jsx';

//Middle column
import HitDice from './MiddleColumn/Stats/HitDice.jsx';
import DeathSaves from './MiddleColumn/Stats/DeathSaves.jsx';
import PlayerAttacks from './MiddleColumn/Stats/PlayerAttacks.jsx';
import Inventory from './MiddleColumn/Inventory/Inventory.jsx';
import Trackers from './MiddleColumn/Trackers.jsx';

import SheetHeader from './SheetHeader.jsx';
import SheetLeftColumn from './LeftColumn/SheetColumnLeft.jsx';

import SubclassInfo from './RightColumn/SubclassInfo.jsx';
import SheetFeatures from './RightColumn/SheetFeatures.jsx';

import CreateNewCharacter from './AddingStuff/CharacterCreation/CreateNewCharacter.jsx';

//Sheet 2
import Spellcasting from './Backsheet/Spellcasting/Spellcasting.jsx';
import SpellList from './Backsheet/Spellcasting/SpellList.jsx';

import CharacterInfo from './Backsheet/CharacterInfo/CharacterInfo.jsx';
import Backstory from './Backsheet/CharacterInfo/Backstory.jsx';
import PersonalityTraits from './Backsheet/CharacterInfo/PersonalityTraits.jsx';

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
    const { sheetid } = useParams();
    const { authUsername, checkAuth } = useAuth();

    const [nameVar, setNameVar] = useState("");

    async function loadNewSheet(mounted) {

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/sheets/new`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (!mounted) return;
            console.log("New sheet data:", data);
            setDraft(data);
            initSheetManager(data, undefined, authUsername);
            // ensure the local name input is updated for a freshly created sheet
            setNameVar(data?.name ?? "");
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
        if (authUsername === null) {
            await checkAuth();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // console.log(`Fetching sheet for ${hashedemail} with ID ${sheetid}`);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/sheets/${authUsername}/${sheetid}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(`HTTP ${res.status} - ${data.detail}`);
            }
            const data = await res.json();
            if (!mounted) return;

            setDraft(data);
            initSheetManager(data, sheetid, authUsername);
            setNameVar(data.name);
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
        setLoading(true);
        if (sheetid === undefined || authUsername === undefined) {
            loadNewSheet(mounted); //Call the load function
            setCreatingNewSheet(true);
            initSheetManager(draft, undefined, authUsername);

        } else {
            loadExistingSheet(mounted);

        }

        setLoading(false);
        return () => { saveSheet(); mounted = false; controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUsername]); //Set the dependencies to [] so they never change, meaning the code will never be run again


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

        // Build a single canonical object to avoid race/immutability issues
        const finalDraft = { ...draft };

        // Ensure nameVar (UI input) is applied if present
        if (nameVar && nameVar !== finalDraft.name) {
            finalDraft.name = nameVar;
        }

        // commit the finalized draft into React state and SheetManager synchronously
        setDraft(finalDraft);
        setDraftGlobal(finalDraft);

        setCreatingNewSheet(false);
        // initialize with the finalized draft object
        initSheetManager(finalDraft, undefined, authUsername);

        // Save using the (now-synced) global draft — setDraftGlobal already updated it.
        const newSheetUrl = await saveNewSheet();
        navigate(newSheetUrl);
        setNameVar(finalDraft.name);
    }

    function cancelCharacterCreation() {
        navigate(`/sheets/${authUsername}/`);
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
            <Navbar />
            {creatingNewSheet &&
                <CreateNewCharacter isOpen={creatingNewSheet} onClose={cancelCharacterCreation} onSubmit={saveNewCharacter} draft={draft} setDraft={updateDraft} />
            }
            {!creatingNewSheet &&
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        margin: '0 auto',
                        minHeight: '100vh',
                        boxSizing: 'border-box',
                    }}
                >
                    <div className='flex-col w-full'>
                        {/* Sheet Page 1 */}
                        <div className='flex w-full'>
                            <div className="mx-1 p-4 bg-zinc-200 justify-self-center rounded w-full text-gray-700">
                                {/* Header */}
                                <SheetHeader draft={draft} setDraft={updateDraft} nameVar={nameVar} setNameVar={setNameVar} />

                                {/* Three Columns */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {/* First Column - Stats */}
                                    <div className="w-full min-w-0">
                                        <SheetLeftColumn draft={draft} setDraft={updateDraft} />
                                    </div>

                                    {/* Second Column - Health, Attacks, etc. */}
                                    <div className="w-full min-w-0 bg-white p-4 rounded shadow">
                                        <div className="p-4 flex flex-col gap-4 min-w-0 max-w-full overflow-hidden">
                                            <div className="w-full min-w-0">
                                                <PlayerStats draft={draft} setDraft={updateDraft} />
                                            </div>
                                            <Box
                                                sx={{
                                                    display: 'flex', //Col on medium and below, row on large and up
                                                    flexDirection: { xs: 'column', lg: 'row' },
                                                    justifyContent: { xs: 'flex-start', sm: 'center' },
                                                    alignItems: {xs: 'center', sm: 'flex-start' },
                                                    flexWrap:{xl: 'nowrap', lg: 'wrap'} , // keep side-by-side
                                                    gap: { xs: 1.5, sm: 2 },
                                                    width: '100%',
                                                    minWidth: 0,
                                                     
                                                }}
                                            >
                                                <HitDice draft={draft} setDraft={updateDraft} />
                                                <DeathSaves draft={draft} setDraft={updateDraft} />
                                            </Box>
                                            <div className="w-full min-w-0">
                                                <PlayerAttacks draft={draft} setDraft={updateDraft} />
                                            </div>
                                            <div className="w-full min-w-0">
                                                <Inventory draft={draft} setDraft={updateDraft} />
                                            </div>
                                            <div className="w-full min-w-0">
                                                <Trackers draft={draft} setDraft={updateDraft} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Third Column - Traits and Features */}
                                    <div className="w-full min-w-0 bg-white flex flex-col p-4 rounded shadow">
                                        <SubclassInfo draft={draft} setDraft={updateDraft} />
                                        <SheetFeatures draft={draft} setDraft={updateDraft} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sheet Page 2 */}
                        <div className='flex w-full'>
                            <div className="mt-4 p-4 bg-zinc-200 mx-1 sm:mx-5 justify-self-center flex flex-col rounded w-full text-gray-700">
                                <div className='flex items-center justify-center gap-4 '>
                                    <CharacterInfo draft={draft} setDraft={updateDraft} nameVar={nameVar} setNameVar={setNameVar}/>
                                </div>

                                {/* Responsive grid for backsheet components:
                                    - 1 column on xs
                                    - 2 columns on md
                                    - 3 columns on lg and up
                                */}
                                <div className='w-full grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-[.5fr_1fr_.5fr] '>
                                    {/* Backstory cell */}
                                    <div className='w-full min-w-0 flex flex-col items-center space-y-2'>
                                        <Backstory draft={draft} setDraft={updateDraft} />
                                    </div>

                                    {/* Spellcasting + SpellList: only render if available; ensure it can't force viewport wider */}
                                    {draft.stats.level >= (draft.class.spellcasting?.level ?? Infinity) &&
                                        <div className='w-full min-w-0'>
                                            <div className='bg-white rounded shadow p-2 flex flex-col items-center space-y-2 w-full min-w-0 max-w-full overflow-hidden'>
                                                <Spellcasting draft={draft} setDraft={updateDraft} />
                                                <SpellList draft={draft} setDraft={updateDraft} />
                                            </div>
                                        </div>
                                    }

                                    {/* Personality / Traits cell */}
                                    <div className='w-full min-w-0 flex flex-col items-center space-y-2'>
                                        <PersonalityTraits draft={draft} setDraft={updateDraft} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            }
        </div>
    );
}

export default GetSheet;