import { React, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const GetClassFeats = ({ value = [], onChange, playerClass }) => {
  const [options, setOptions] = useState([]);

  const GetWeaponsList = async () => {
    try {

      let payload = { "playerClass": playerClass };
      const query = new URLSearchParams(payload).toString();

      const res = await fetch(`http://127.0.0.1:8000/info/feats?${query}`, {
        method: 'GET',

      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown' }));
        throw new Error(`HTTP ${res.status} - ${err.detail}`);
      }
      const data = await res.json();

      
      // expecting an array
      setOptions((Array.isArray(data) ? data : data.feats ?? []));
    } catch (err) {
      console.error('Error fetching feats:', err);
    }
  }

  useEffect(() => {
    GetWeaponsList();
  }, []);

  return (<>
    <FormControl sx={{ minWidth: 1112 }}>

      <Autocomplete
        multiple
        options={options}
        value={value}
        onChange={(_, newValue) => { console.log("New value", newValue); onChange(newValue) }}
        disableClearable={false}

        renderInput={(params) => <TextField {...params} label="Starting Equipment" placeholder="" />}
        filterSelectedOptions
      />
    </FormControl>
  </>)
}

export default GetClassFeats;