import React from 'react';
import AttributeRow from './Attributes.jsx';
import COLORS from '../../constants/colors.js';


function StatBlock({ label, attribute, proficiencyBonus, updateDraftFun }) {
    
    function GetModOfStat() {
        let val = parseInt(Math.floor((parseInt(attribute.value) - 10) / 2));
        return val;
    }

    function GetSkillsOfStat() {
        return attribute.skills;
    }
 
    const modifier = GetModOfStat();
    const formattedModifier = modifier >= 0 ? `+${modifier}` : modifier;

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="flex flex-col md:mr-8 items-center  flex-shrink-0">
                <label className="mb-2 text-3xl font-semibold z-10" style={{color: COLORS.secondary}}>{label}</label>
                <input
                    type="text"
                    placeholder={label}
                    defaultValue={attribute.value} 
                    onBlur={(e) => {attribute.value = parseInt(e.target.value); updateDraftFun(prev => ({...prev}));}}
                    className=" w-28 h-28 md:w-36 md:h-36 text-center border-2 text-4xl md:text-6xl font-semibold rounded-lg focus-visible:outline-none transition-colors duration-200"
                    style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accentHover}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                />
                
                <div className="w-12 md:w-16 h-8 text-center border-2 font-semibold text-lg md:text-xl rounded-lg mt-1" style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}>
                    {formattedModifier}
                </div>
            </div>

            {/* Attributes column (children) — allow shrinking and wrapping */}
            <div className="flex flex-col w-full flex-1 min-w-0">
                {GetSkillsOfStat().map(skill => {
                    return <AttributeRow key={skill.name} skill={skill} attributeModifier={modifier} proficiencyBonus={proficiencyBonus} updateDraftFun={updateDraftFun} locked={skill.locked} />;
                })}
            </div>
        </div>
    );
}

export default StatBlock;