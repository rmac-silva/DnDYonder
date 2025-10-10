import { React, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const GetToolProficiencies = ({ value = [], onChange }) => {
  const [options, setOptions] = useState([]);

  const GetWeaponsList = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/info/tools');
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown' }));
        throw new Error(`HTTP ${res.status} - ${err.detail}`);
      }
      const data = await res.json();
      // expecting data.classes or an array
      setOptions((Array.isArray(data) ? data : data.tools ?? []));
    } catch (err) {
      console.error('Error fetching tools:', err);
    }
  }

  useEffect(() => {
    GetWeaponsList();
  }, []);

  return (<>
    <FormControl sx={{ minWidth: 360 }}>

      <Autocomplete
        multiple
        options={options}
        value={value}
        onChange={(_, newValue) => { console.log("New value", newValue); onChange(newValue) }}
        disableClearable={false}

        renderInput={(params) => <TextField {...params} label="Tool Proficiencies" placeholder="" />}
        filterSelectedOptions
      />
    </FormControl>
  </>)
}

export default GetToolProficiencies;