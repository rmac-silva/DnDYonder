import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const GetAttributeProficiencies = ({value = [], onChange}) => {
    const options = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma"
    ];
    
    return (<>
        <FormControl sx={{ minWidth: 360 }}>
        
                    <Autocomplete
                      multiple
                      options={options}
                      value={value}
                      onChange={(_, newValue) => {console.log("New value",newValue); onChange(newValue)}}
                      disableClearable={false}
                     
                    renderInput={(params) => <TextField {...params} label="Saving Throws" placeholder="Str, Dex..." />}
                    filterSelectedOptions
                    />
                  </FormControl>
    </>)
}

export default GetAttributeProficiencies;