import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const GetSkillProficiencies = ({value = [], onChange}) => {
    const options = [
        "Athletics",
        "Acrobatics",
        "Sleight of Hand",
        "Stealth",
        "Arcana",
        "History",
        "Investigation",
        "Nature",
        "Religion",
        "Animal Handling",
        "Insight",
        "Medicine",
        "Perception",
        "Survival",
        "Deception",
        "Intimidation",
        "Performance",
        "Persuasion"
    ];
    
    return (<>
        <FormControl sx={{ minWidth: 360 }}>
        
                    <Autocomplete
                      multiple
                      options={options}
                      value={value}
                      onChange={(_, newValue) => {console.log("New value",newValue); onChange(newValue)}}
                      disableClearable={false}
                     
                    renderInput={(params) => <TextField {...params} label="Skill Proficiencies" placeholder="Acrobatics, Arcana..." />}
                    filterSelectedOptions
                    />
                  </FormControl>
    </>)
}

export default GetSkillProficiencies;