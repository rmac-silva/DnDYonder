// This dialog will appear when the player creates a new sheet. It will prompt the user to select a class,
// make choices about which proficiencies they want, starting equipment etc... just like DnD beyond does.

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import ClassSelect from './ClassSelect.jsx';
import RaceSelect from '../Race/RaceSelect.jsx';
import SkillProfSelection from './SkillProficiencySelection.jsx';
import StartingEquipmentSelection from './StartingEquipmentSelection.jsx';
import FeatureList from '../../Lists/FeatureList.jsx';

function CreateNewCharacter({ isOpen, onClose, onSubmit, draft, setDraft }) {

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // [ [ {name: "item1", selected: false}, {name: "item2", selected: true} ], [ {...} ] ]

    const [hasSelectedClass, setHasSelectedClass] = useState(false);
    const [hasSelectedRace, setHasSelectedRace] = useState(false);

    const [selectedSkillProfs, setSelectedSkillProfs] = useState(false);
    const [selectedStarterGear, setSelectedStarterGear] = useState(false);

    

    const handleClassSelection = () => {
        if (draft.class != null) {
            //Player selected a class, now we can show him the class information
            setHasSelectedClass(true);

        } else {
            setHasSelectedClass(false);
        }
    }
    const handleRaceSelection = () => {
        if (draft.race != null) {
            //Player selected a race, now we can show him the race information
            setHasSelectedRace(true);

        } else {
            setHasSelectedRace(false);
        }
    }

    const GetStartingEquipment = () => {
        var equipment = draft.class.starting_equipment;
        var equipmentText = "";
        equipment.forEach(item => {
            equipmentText += item.name + ", ";
        });

        return equipmentText.slice(0, -2); //Remove last comma and space
    }

    const GetSkillProficienciesText = () => {
        var classProfs = selectedSkills;
        return classProfs.join(", ");
    }

    const IsFormValid = () => {
        //Check if the form is valid to proceed to next step
        if (activeStep === 0) {
            //Class selection step
            return selectedSkillProfs && selectedStarterGear;

        }

        
        if (activeStep === 1) {
            // ! - If needed, add more validation to the race
            return hasSelectedRace;
        }
        
        if(activeStep === 2) {
            //Character name step
            return draft.name && draft.name.trim() !== "";
        }
        
        return true;
    }

    const steps = ['Select your class', 'Select your race', 'Character Name', 'Overview'];
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNextStep = async () => {

        if (activeStep === steps.length - 1) {
            //Finish button clicked
            // console.log("Finished creating character:", draft);
            
            draft.class.skill_proficiencies = selectedSkills;
            
            //Set the misc proficiencies
            var miscProfs = [];
            //1. Fetch the weapon profs that are not simple or martial weapons from class and race
            draft.class.weapon_proficiencies.forEach(prof => {
                if (prof.toLowerCase() !== "simple weapons" && prof.toLowerCase() !== "martial weapons") {
                    if (!draft.misc.proficiencies.includes(prof)) {
                        miscProfs.push(prof);
                    }
                }
            });
            draft.race.weapon_proficiencies.forEach(prof => {
                if (prof.toLowerCase() !== "simple weapons" && prof.toLowerCase() !== "martial weapons") {
                    if (!draft.misc.proficiencies.includes(prof)) {
                        miscProfs.push(prof);
                    }
                }
            });

            //2. Fetch the tool profs from class and race
            draft.class.tool_proficiencies.forEach(prof => {
                if (!draft.misc.proficiencies.includes(prof)) {
                    miscProfs.push(prof);
                }
            });
            draft.race.tool_proficiencies.forEach(prof => {
                if (!draft.misc.proficiencies.includes(prof)) {
                    miscProfs.push(prof);
                }
            });

            draft.misc.proficiencies = miscProfs;

            setDraft({ ...draft });

            await onSubmit();
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handlePrevStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <div className='p-4'>

                <DialogTitle className='!-ml-4 !font-normal !text-4xl'>{draft.name || "Create New Character"}</DialogTitle>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        const stepProps = {};
                        const labelProps = {};


                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {/* Page 1 - Class Selection */}
                {(activeStep === 0 || activeStep === 3) &&
                    <div className='pb-4 mx-4'>

                        <ClassSelect sheet={draft} setSheet={setDraft} selectClass={handleClassSelection} disabled={activeStep === 3} />

                        {hasSelectedClass &&
                            <div>

                                {/* Class Info */}
                                <div>
                                    <div className='font-semibold text-2xl mt-4'>
                                        {draft.class.class_name}
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
                                            <span className='mr-2'>Tool Proficiencies:</span>
                                            <span className='font-normal'>{draft.class.tool_proficiencies.join(", ") || "None"}</span>
                                        </div>
                                        <div className='flex'>
                                            <span className='mr-2'>Saving Throws:</span>
                                            <span className='font-normal'>{draft.class.attribute_proficiencies.join(", ")}</span>
                                        </div>
                                        {/* Overview Info */}

                                        {activeStep === 3 && <>
                                            <div className='flex'>
                                                <span className='mr-2'>Skill Proficiencies:</span>
                                                <span className='font-normal'>{GetSkillProficienciesText()}</span>
                                            </div>
                                            <div className='flex'>
                                                <span className='mr-2'>Starting Equipment:</span>
                                                <span className='font-normal'>{GetStartingEquipment()}</span>
                                            </div>
                                        </>
                                        }
                                        {/* End of Overview Info */}
                                    </div>
                                </div>

                                {/* Skill Proficiency Selection */}
                                {activeStep === 0 &&
                                    <SkillProfSelection sheet={draft} setSheet={setDraft} onValid={setSelectedSkillProfs} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
                                }
                                {activeStep === 0 &&
                                    // Starting equipment selection

                                    <StartingEquipmentSelection sheet={draft} setSheet={setDraft} onValid={setSelectedStarterGear} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                                }

                                {/* Features */}
                                {activeStep === 0 &&

                                    <FeatureList label={"Class"} features={draft.class.class_features} />
                                }
                                {/* End of features */}




                            </div>
                        }
                    </div>
                }
                {/* End of Page 1 */}


                {/* Page 2 - Race Selection */}
                {(activeStep === 1 || activeStep === 3) && <>
                    <div className='p-4'>
                        <RaceSelect sheet={draft} setSheet={setDraft} selectRace={handleRaceSelection} disabled={activeStep === 3} />
                    </div>
                    {hasSelectedRace && <>
                        <div className='font-semibold text-2xl mt-4'>
                            {draft.race.subrace + " " + draft.race.race}
                        </div>
                        <div className='font-medium text-xl mt-2 mb-4 pl-2'>

                            <div className='flex'>
                                <span className='mr-2'>Size:</span>
                                <span className='font-normal'>{draft.race.size}</span>
                            </div>
                            <div className='flex'>
                                <span className='mr-2'>Type:</span>
                                <span className='font-normal'>{draft.race.creature_type}</span>
                            </div>
                            <div className='flex'>
                                <span className='mr-2'>Speed:</span>
                                <span className='font-normal'>{draft.race.speed}ft</span>
                            </div>
                            <div className='flex'>
                                <span className='mr-2'>Languages:</span>
                                <span className='font-normal'>{draft.race.languages.join(", ") || "None"}</span>
                            </div>
                            <div className='flex'>
                                <span className='mr-2'>Weapon Proficiencies:</span>
                                <span className='font-normal'>{draft.race.weapon_proficiencies.join(", ") || "None"}</span>
                            </div>
                            <div className='flex'>
                                <span className='mr-2'>Armor Proficiencies:</span>
                                <span className='font-normal'>{draft.race.armor_proficiencies.join(", ") || "None"}</span>
                            </div>
                            <div className='flex'>
                                <span className='mr-2'>Tool Proficiencies:</span>
                                <span className='font-normal'>{draft.race.tool_proficiencies.join(", ") || "None"}</span>
                            </div>



                            {/* Features */}
                            {activeStep === 1 &&
                                <FeatureList label={"Race"} features={draft.race.race_features}  />
                            }
                            {/* End of features */}
                        </div>
                    </>
                    }
                </>}
                {/* End of Page 2 */}

                {/* Page 3 - Character name */}
                {activeStep === 2 &&
                    <div className='p-4'>
                        <Box component="form" noValidate autoComplete="off" className='flex flex-col space-y-4'>
                            <TextField
                                label="Character Name"
                                variant="outlined"
                                value={draft.name}
                                onChange={(e) => { draft.name = e.target.value; setDraft({ ...draft }); }}

                            />
                        </Box>
                    </div>
                }
                {/* End of Page 3 */}
                <div className='flex flex-row justify-end space-x-3'>

                    <Button onClick={handlePrevStep} disabled={activeStep === 0} variant="contained" className="mt-4" sx={"    margin-right: 10px;"}>
                        Back
                    </Button>
                    <Button onClick={handleNextStep} disabled={!IsFormValid()} variant="contained" className="mt-4">
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export default CreateNewCharacter;