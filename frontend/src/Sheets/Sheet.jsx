import { React, useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';

// import { loadNewSheet } from './Sheet.js';
import Button from '@mui/material/Button';
import Navbar from '../Navbar/Navbar.jsx';
import PlayerStats from './Stats/PlayerStats.jsx';
import StatBlock from './Attributes/StatBlock.jsx';
import HitDice from './Stats/HitDice.jsx';
import DeathSaves from './Stats/DeathSaves.jsx';
import ClassSelect from './Class/ClassSelect.jsx';

function GetSheet() {

    const textClasses = 'focus-visible:outline-none';

    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState(null);     // editable plain JS object
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

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

            setDraft(data);
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
        } else {
            
            loadExistingSheet(mounted);
        }
        return () => { mounted = false; controller.abort(); };
    }, [email]); //Set the dependencies to [] so they never change, meaning the code will never be run again


    const saveSheet = async () => {

        if (!draft) return; // Nothing to save
        if (saving) return; // Prevent multiple simultaneous saves
        setSaving(true);

        if (sheetid === undefined || hashedemail === undefined) {
            
            saveNewSheet(); //Call the load function
        } else {
            
            saveExistingSheet();
        }
    };

    const saveNewSheet = async () => {
        try {
            // If you have a class with jsonify(), call draft = draft.jsonify() instead
            const payload = {
                'sheet': draft,
                'token': localStorage.getItem('authToken')
            } // plain JS object
            const res = await fetch('http://127.0.0.1:8000/sheets/new', {
                method: 'POST', // or PUT depending on your API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            const saved = await res.json();
            
            
            //Navigate to the new sheet's page, since it has an ID now
            //Saves on /sheets/sheet_id will override the pre-existing sheet
            navigate(`/sheets/${email}/${saved.id}`);


        } catch (err) {
            console.error('Save error', err);
            setError(err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const saveExistingSheet = async () => {
        draft.id = parseInt(sheetid); //Ensure the draft has the correct ID
        const payload = {
            'sheet': draft,
        }

        try {
            
            const res = await fetch(`http://127.0.0.1:8000/sheets/${hashedemail}/${sheetid}`, {
                method: 'POST', // or PUT depending on your API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            // const saved = await res.json(); - Do something with the success message
            
        } catch (error) {
            console.error('Save error', error);
            setError(error);
            throw error;
        } finally {
            setSaving(false);
        }


    }

    function GetProficiencyBonus(level) {
        let val = Math.ceil(level / 4) + 1;
        draft.stats.proficiency_bonus = val;
        return val;
    }

    if (loading) return <div>Loading sheet…</div>; //TODO - Make a generic loading screen that receives a message
    if (error) return <div>{String(error)}</div>;
    if (!draft) return null;

    return (
        <div>
            <Navbar />
            <div className='flex'>

                {/* Sidebar */}
                <div className='mt-4 p-4 h-auto bg-zinc-200 mx-5 justify-self-center rounded w-1/8 text-gray-700'>

                    {/* /* Save button */}
                    <div className="relative inline-block w-full">
                        <Button onClick={() => { saveSheet() }} loading={saving} variant="contained" className='h-15 w-full text-6xl' color="success">
                            <span className='text-2xl font-bold text-gray-100'>Save</span>
                        </Button>
                    </div>

                    </div>

                    <div className="mt-4 p-4 bg-zinc-200 mx-5 justify-self-center rounded w-5/6 text-gray-700">
                        {/* Header */}
                    <div className="flex bg-white rounded shadow font-semibold p-4 justify-between">
                        <div className="flex-1 mr-4">
                            <label htmlFor="characterName" className="block text-xl text-gray-700">
                                Character Name:
                            </label>
                            {/* Character Name */}
                            <input
                                type="text"
                                onBlur={(e) => { draft.name = e.target.value; setDraft({ ...draft }) }}
                                defaultValue={draft.name}
                                placeholder="Grommisk"
                                className={`mt-1 px-2 py-2 block w-full border-b-2 !text-gray-700 !text-3xl ${textClasses}`}
                            />
                        </div>

                        <div className="flex-2 grid grid-cols-2 gap-4">
                            {/* Class */}
                            <ClassSelect sheet={draft} setSheet={setDraft}/>

                            {/* Background */}
                            <input
                                type="text"
                                placeholder="Background"
                                onBlur={(e) => { draft.background.background = e.target.value; setDraft({ ...draft }) }}
                                defaultValue={draft.background.background}
                                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                            />

                            {/* Race */}
                            <input
                                type="text"
                                defaultValue={draft.race.race}
                                onBlur={(e) => { draft.race.race = e.target.value; setDraft({ ...draft }) }}

                                placeholder="Race"
                                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                            />

                            {/* Alignment */}
                            <input
                                type="text"
                                defaultValue={draft.race.alignment}
                                onBlur={(e) => { draft.race.alignment = e.target.value; setDraft({ ...draft }) }}

                                placeholder="Alignment"
                                className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                            />
                        </div>
                    </div>

                    {/* Three Columns */}
                    <div className="flex mt-6">

                        {/* First Column - Stats */}
                        <div className="w-1/4 bg-white p-4 rounded shadow">
                            {/*Proficiency Bonus + Passive Perception*/}
                            <div className="flex justify-between mb-4">
                                <div className="flex flex-col items-center bg-zinc-100 p-4 rounded shadow w-1/2 mr-2">
                                    <label className="text-2xl font-semibold text-gray-700 ">Level</label>
                                    <input className={`mt-2 px-2 py-1 text-center border-b-2 font-semibold text-gray-700 border-zinc-500  text-3xl w-1/2 ${textClasses}`}
                                        placeholder='1'
                                        defaultValue={draft.stats.level}
                                        onBlur={(e) => { draft.stats.level = e.target.value; setDraft({ ...draft }) }} />
                                </div>
                                <div className="flex flex-col items-center bg-zinc-100 p-4 rounded shadow w-1/2 mr-2">
                                    <label className="text-2xl font-semibold text-center text-gray-700">Proficiency Bonus</label>
                                    <div className={`mt-2 px-2 py-1 text-center border-b-2 border-zinc-500 text-2xl ${textClasses}`}>{GetProficiencyBonus(draft.stats.level)}</div>

                                </div>
                            </div>

                            {/* Stat Blocks */}
                            <StatBlock label="STR" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Strength} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="DEX" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Dexterity} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="CON" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Constitution} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="INT" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Intelligence} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="WIS" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Wisdom} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="CHA" proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Charisma} updateDraftFun={setDraft}>

                            </StatBlock>
                        </div>

                        {/* Second Column - Health, Attacks, etc. */}
                        <div className="w-2/5 bg-white mx-4 p-4 rounded shadow">
                            <div className=' p-4 '>

                                <PlayerStats />
                                <div className='flex justify-center'>
                                    <HitDice />
                                    <DeathSaves />
                                </div>
                            </div>
                        </div>

                        {/* Third Column - Traits and Features */}
                        <div className="flex-1 bg-white p-4 rounded shadow">
                            {/* placeholder for traits and features */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetSheet;