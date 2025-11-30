import {React, useState} from 'react';
import Button from '@mui/material/Button';


function SkillProfSelection({sheet,setSheet, onValid, selectedSkills, setSelectedSkills}) {

    
    const [canSelectMore, setCanSelectMore] = useState(true);

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

    

    const handleSkillToggle = (skill) => {
        var change = 0;

        if (selectedSkills.includes(skill)) {
            // If the skill is already selected, remove it
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
            const attributeSkills = sheet.attributes[ABILITY_SKILL_MAP[skill]].skills
            
            attributeSkills.find(s => s.name === skill).proficient = false;
            attributeSkills.find(s => s.name === skill).locked = false;
            change = -1;
            setSheet({...sheet});
        } else if(canSelectMore) {
            // If the skill is not selected, add it
            setSelectedSkills([...selectedSkills, skill]);
            const attributeSkills = sheet.attributes[ABILITY_SKILL_MAP[skill]].skills
            
            attributeSkills.find(s => s.name === skill).proficient = true;
            attributeSkills.find(s => s.name === skill).locked = true;
            change = 1;
            setSheet({...sheet});
        } else {
            //Cannot select more skills
            //Show a popup
            alert(`You can only select ${sheet.class.num_skill_proficiencies} skill proficiencies.`);
        }

        // This only gets updated on next frame. So we need to use a local array to check
        if (selectedSkills.length + change >= parseInt(sheet.class.num_skill_proficiencies)) {
            setCanSelectMore(false);
            onValid(true);
        } else {
            setCanSelectMore(true);
            onValid(false);
        }
    }

    return (
        <div className='flex-col mt-4'>
            <div className='mt-2 mb-2 font-semibold text-2xl'>
                Select {sheet.class.num_skill_proficiencies} skill proficiencies:
            </div>
            <div className='flex flex-row !space-x-2'>

            {sheet.class?.skill_proficiencies.map(prof => (
                
                <Button key={prof}  variant={selectedSkills.includes(prof) ? 'contained' : 'outlined'} onClick={() => handleSkillToggle(prof)}>{prof}</Button>
            ))}
            </div>
        </div>
    );
}

export default SkillProfSelection;