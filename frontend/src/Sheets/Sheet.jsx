import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';

import StatBlock from './Attributes/StatBlock.jsx';

function GetSheet() {

    function GetProficiencyBonus() {
        if(playerLevel <= 4) return 2;
        if(playerLevel <= 8) return 3;
        if(playerLevel <= 12) return 4;
        if(playerLevel <= 16) return 5;
        return 6;
    }


    const textClasses = 'focus-visible:outline-none';

    const [playerLevel, setPlayerLevel] = useState(1);
    const [STR, setStr] = useState(10);
    const [DEX, setDex] = useState(10);
    const [CON, setCon] = useState(10);
    const [INT, setInt] = useState(10);
    const [WIS, setWis] = useState(10);
    const [CHA, setCha] = useState(10);

    function setStat(attribute, value) {
        if (attribute === 'STR') setStr(value);
        if (attribute === 'DEX') setDex(value);
        if (attribute === 'CON') setCon(value);
        if (attribute === 'INT') setInt(value);
        if (attribute === 'WIS') setWis(value);
        if (attribute === 'CHA') setCha(value);
    }



    return (
        <div>
            <Navbar />

            <div className="mt-4 p-4 bg-zinc-200 mx-5 rounded  text-gray-700">
                {/* Header */}
                <div className="flex bg-white rounded shadow font-semibold p-4 justify-between">
                    <div className="flex-1 mr-4">
                        <label htmlFor="characterName" className="block text-xl text-gray-700">
                            Character Name:
                        </label>
                        <input
                            type="text"
                            id="characterName"
                            name="characterName"
                            placeholder="Grommisk"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 !text-gray-700 !text-3xl ${textClasses}`}
                        />
                    </div>

                    <div className="flex-2 grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Class"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                        <input
                            type="text"
                            placeholder="Background"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                        <input
                            type="text"
                            placeholder="Race"
                            className={`mt-1 px-2 py-2 block w-full border-b-2 border-zinc-500 !text-md ${textClasses}`}
                        />
                        <input
                            type="text"
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
                                <input onChange={(e) => setPlayerLevel(e.target.value)} className={`mt-2 px-2 py-1 text-center border-b-2 font-semibold text-gray-700 border-zinc-500  text-3xl w-1/2 ${textClasses}`} />
                            </div>
                            <div className="flex flex-col items-center bg-zinc-100 p-4 rounded shadow w-1/2 mr-2">
                                <label className="text-2xl font-semibold text-gray-700">Proficiency Bonus</label>
                                <div className={`mt-2 px-2 py-1 text-center border-b-2 border-zinc-500 text-2xl ${textClasses}`}>+{GetProficiencyBonus()}</div>
                                
                            </div>
                        </div>

                        {/* Stat Blocks */}
                        <StatBlock label="STR" proficiencyBonus={GetProficiencyBonus()} value={STR} onChange={(val) => setStat('STR', val)}>

                        </StatBlock>

                        <StatBlock label="DEX" proficiencyBonus={GetProficiencyBonus()} value={DEX} onChange={(val) => setStat('DEX', val)}>

                        </StatBlock>

                        <StatBlock label="CON" proficiencyBonus={GetProficiencyBonus()} value={CON} onChange={(val) => setStat('CON', val)}>

                        </StatBlock>

                        <StatBlock label="INT" proficiencyBonus={GetProficiencyBonus()} value={INT} onChange={(val) => setStat('INT', val)}>

                        </StatBlock>

                        <StatBlock label="WIS" proficiencyBonus={GetProficiencyBonus()} value={WIS} onChange={(val) => setStat('WIS', val)}>

                        </StatBlock>

                        <StatBlock label="CHA" proficiencyBonus={GetProficiencyBonus()} value={CHA} onChange={(val) => setStat('CHA', val)}>

                        </StatBlock>
                    </div>

                    {/* Second Column - Health, Attacks, etc. */}
                    <div className="w-2/5 bg-white mx-4 p-4 rounded shadow">
                        {/* placeholder for health/attacks */}
                    </div>

                    {/* Third Column - Traits and Features */}
                    <div className="flex-1 bg-white p-4 rounded shadow">
                        {/* placeholder for traits and features */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetSheet;