import { React, useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';

import Navbar from '../Navbar/Navbar.jsx';
import PlayerStats from './Stats/PlayerStats.jsx';

import HitDice from './Stats/HitDice.jsx';
import DeathSaves from './Stats/DeathSaves.jsx';

import SheetSidebar from './SheetSidebar.jsx';
import SheetHeader from './SheetHeader.jsx';
import SheetLeftColumn from './SheetColumnLeft.jsx';

import CreateNewCharacter from './CreateNewCharacter.jsx';

function GetSheet() {



    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState(null);     // editable plain JS object
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

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
            setCreatingNewSheet(true);
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



    if (loading) return <div>Loading sheet…</div>; //TODO - Make a generic loading screen that receives a message
    if (error) return <div>{String(error)}</div>;
    if (!draft) return null;

    return (
        <div>
            <Navbar />

            {creatingNewSheet && 
            <CreateNewCharacter isOpen={creatingNewSheet} onClose={() => setCreatingNewSheet(false)} draft={draft} setDraft={setDraft} />
            }
            {
                !creatingNewSheet &&
            <div className='flex'>
                <SheetSidebar saveSheet={saveSheet} saving={saving} draft={draft} />

                <div className='flex-col w-full'>

                    {/* Sheet Page 1 */}
                    <div className='flex w-full'>
                        <div className="mt-4 p-4 bg-zinc-200 mx-5 justify-self-center rounded w-full text-gray-700">
                            {/* Header */}
                            <SheetHeader draft={draft} setDraft={setDraft} />

                            {/* Three Columns */}
                            <div className="flex mt-6">

                                {/* First Column - Stats */}
                                <SheetLeftColumn draft={draft} setDraft={setDraft} />

                                {/* Second Column - Health, Attacks, etc. */}
                                <div className="w-2/5 bg-white mx-4 p-4 rounded shadow">
                                    <div className=' p-4 '>

                                        <PlayerStats draft={draft} setDraft={setDraft} />
                                        <div className='flex justify-center'>
                                            <HitDice draft={draft} />
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

                    {/* Sheet Page 2 */}
                    <div className='flex w-full'>
                        <div className="mt-4 p-4 bg-zinc-200 mx-5 justify-self-center rounded w-full text-gray-700">
                            {/* Inventory Character Traits etc... Spellcasting if applicable*/}
                        </div>
                    </div>


                </div>
            </div>
            }

        </div>
    );
}

export default GetSheet;