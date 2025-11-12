import React from 'react';
import MainProfs from './Proficiencies/MainProfs.jsx';
import MiscProfs from './Proficiencies/MiscProfs.jsx';
import StatBlock from './Attributes/StatBlock.jsx';
function SheetLeftColumn({draft,setDraft}) {
    const textClasses = 'focus-visible:outline-none';

    //Proficiency bonus calculation
    function GetProficiencyBonus(level) {
        let val = Math.ceil(level / 4) + 1;
        draft.stats.proficiency_bonus = val;
        return val;
    }

    return (<div className="w-2/7 p-5 rounded-xl shadow-md border-2 transition-shadow duration-200" style={{backgroundColor: '#edeae8', borderColor: '#db7f3d'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c46d2f'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#db7f3d'}>
                            {/*Proficiency Bonus + Passive Perception*/}
                            <div className="flex justify-between mb-4">
                                <div className="flex flex-col items-center p-4 rounded-lg shadow-sm w-1/2 mr-2 border-2 transition-colors duration-200" style={{backgroundColor: '#edeae8', borderColor: '#db7f3d'}} onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#c46d2f'}} onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#db7f3d'}}>
                                    <label className="text-2xl font-semibold mb-2" style={{color: '#1a1a1a'}}>Level</label>
                                    <input className={`mt-2 px-2 py-1 text-center border-2 font-semibold bg-transparent text-3xl w-1/2 rounded-lg transition-colors duration-200 ${textClasses}`}
                                        style={{borderColor: '#db7f3d', backgroundColor: '#edeae8', color: '#1a1a1a'}}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c46d2f'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#db7f3d'}
                                        placeholder='1'
                                        min={1}
                                        max={20}
                                        type='number'
                                        defaultValue={draft.stats.level}
                                        onBlur={(e) => { draft.stats.level = e.target.value; setDraft({ ...draft }) }} />
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg shadow-sm w-1/2 mr-2 border-2 transition-colors duration-200" style={{backgroundColor: '#edeae8', borderColor: '#db7f3d'}} onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#c46d2f'}} onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#db7f3d'}}>
                                    <label className="text-2xl font-semibold text-center mb-2" style={{color: '#1a1a1a'}}>Proficiency Bonus</label>
                                    <div className={`mt-2 px-2 py-1 text-center border-2 rounded-lg text-2xl font-bold ${textClasses}`} style={{borderColor: '#db7f3d', backgroundColor: '#edeae8', color: '#1a1a1a'}}>{GetProficiencyBonus(draft.stats.level)}</div>

                                </div>
                            </div>

                            {/* Stat Blocks */}
                            <StatBlock label="STR"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Strength} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="DEX"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Dexterity} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="CON"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Constitution} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="INT"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Intelligence} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="WIS"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Wisdom} updateDraftFun={setDraft}>

                            </StatBlock>

                            <StatBlock label="CHA"  proficiencyBonus={draft.stats.proficiency_bonus} attribute={draft.attributes.Charisma} updateDraftFun={setDraft}>

                            </StatBlock>

                            <MainProfs draft={draft} setDraft={setDraft} />
                            <MiscProfs draft={draft} setDraft={setDraft} />
                        </div>)
}

export default SheetLeftColumn;