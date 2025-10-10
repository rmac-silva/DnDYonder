import React from 'react';
import AttributeRow from './Attributes.jsx';

function StatBlock({ label, attribute, proficiencyBonus, updateDraftFun }) {
    
    function GetModOfStat() {
        let val = parseInt(Math.floor((parseInt(attribute.value) - 10) / 2));
        return val;
    }

    function GetSkillsOfStat() {
        return attribute.skills;
    }
 

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="flex flex-col md:mr-8 items-center flex-shrink-0">
                <label  className="-mb-10 text-3xl font-semibold">{label}</label>
                <input
                    type="text"
                    placeholder={label}
                    defaultValue={attribute.value} 
                    onBlur={(e) => {attribute.value = parseInt(e.target.value); updateDraftFun(prev => ({...prev}));}} //Here we are passing a function to the setState hook. This function will be run with whatever the state was previously. In this case we're simply copying the state, faking a change to force React to update
                    className="w-28 h-28 md:w-36 md:h-36 text-center border-2 border-gray-400 text-4xl md:text-6xl font-semibold rounded focus-visible:outline-none"
                />
                
                <div className="w-12 md:w-16 h-8 text-center border-2 border-gray-400 font-semibold text-lg md:text-xl rounded mt-1">
                    {GetModOfStat()}
                </div>
            </div>

            {/* Attributes column (children) — allow shrinking and wrapping */}
            <div className="flex flex-col w-full flex-1 min-w-0">
                {GetSkillsOfStat().map(skill => {
                    return <AttributeRow key={skill.name} skill={skill} attributeModifier={GetModOfStat()} proficiencyBonus={proficiencyBonus} updateDraftFun={updateDraftFun} />;
                })}
            </div>
        </div>
    );
}

export default StatBlock;