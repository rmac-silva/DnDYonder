// This dialog will appear when the player creates a new sheet. It will prompt the user to select a class,
// make choices about which proficiencies they want, starting equipment etc... just like DnD beyond does.

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import ClassSelect from './Class/ClassSelect.jsx';
import SkillProfSelection from './CharacterCreation/SkillProficiencySelection.jsx';
import StartingEquipmentSelection from './CharacterCreation/StartingEquipmentSelection.jsx';
function CreateNewCharacter({ isOpen, onClose, draft, setDraft }) {


    const [hasSelectedClass, setHasSelectedClass] = useState(false);

    const handleClassSelection = () => {
        if (draft.class != null) {
            //Player selected a class, now we can show him the class information
            console.log("Class selected:", draft.class);
            setHasSelectedClass(true);

        } else {
            setHasSelectedClass(false);
        }
    }


    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <div className='p-4'>

                <DialogTitle className='!-ml-4 !font-normal !text-4xl'>Create New Character</DialogTitle>
                <div className='pb-4 mx-4'>

                    <ClassSelect sheet={draft} setSheet={setDraft} selectClass={handleClassSelection} />

                    {hasSelectedClass &&
                        <div>

                            {/* Class Info */}
                            <div>
                                <div className='font-semibold text-2xl mt-4'>
                                    Class info
                                </div>
                                <div className='font-medium text-xl mt-2 pl-2'>

                                    <div className='flex'>
                                        <span className='mr-2'>Hit dice:</span>
                                        <span className='font-normal'>1{draft.class.hit_die}</span>
                                    </div>
                                    <div className='flex'>
                                        <span className='mr-2'>Starting Hitpoints:</span>
                                        <span className='font-normal'>{draft.class.starting_hitpoints}</span>
                                    </div>
                                    <div className='flex'>
                                        <span className='mr-2'>Weapon Proficiencies:</span>
                                        <span className='font-normal'>{draft.class.weapon_proficiencies.join(", ")}</span>
                                    </div>
                                    <div className='flex'>
                                        <span className='mr-2'>Armor Proficiencies:</span>
                                        <span className='font-normal'>{draft.class.armor_proficiencies.join(", ")}</span>
                                    </div>
                                    <div className='flex'>
                                        <span className='mr-2'>Saving Throws:</span>
                                        <span className='font-normal'>{draft.class.attribute_proficiencies.join(", ")}</span>
                                    </div>
                                </div>
                            </div>
                        
                            {/* Skill Proficiency Selection */} 
                            <div>
                                <SkillProfSelection sheet={draft} setSheet={setDraft} />
                            </div>
                            {/* Starting Equipment Selection */}
                                <StartingEquipmentSelection sheet={draft} setSheet={setDraft} />
                            <div>

                            </div>
                        </div>
                    }
                </div>
            </div>
        </Dialog>
    );
}

export default CreateNewCharacter;