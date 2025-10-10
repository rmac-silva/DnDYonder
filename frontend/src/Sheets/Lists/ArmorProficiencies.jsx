import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const GetArmorProficiencies = ({value = [], onChange}) => {
    const options = [
        "Light Armor",
        "Medium Armor",
        "Heavy Armor",
        "Shields"
    ];
    
    return (<>
        <FormControl sx={{ minWidth: 360 }}>
        
                    <Autocomplete
                      multiple
                      options={options}
                      value={value}
                      onChange={(_, newValue) => {console.log("New value",newValue); onChange(newValue)}}
                      disableClearable={false}
                     
                    renderInput={(params) => <TextField {...params} label="Armor Proficiencies" placeholder="Search armor..." />}
                    filterSelectedOptions
                    />
                  </FormControl>
    </>)
}

export default GetArmorProficiencies;