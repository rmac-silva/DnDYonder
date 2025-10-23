import { React, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import AddItem from '../AddingStuff/AddItem';

const GetToolProficiencies = ({ value = [], onChange }) => {
  const [options, setOptions] = useState(["Add new tool..."]);
  const [newToolDialogOpen, setNewToolDialogOpen] = useState(false);

  const GetWeaponsList = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/info/tools');
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown' }));
        throw new Error(`HTTP ${res.status} - ${err.detail}`);
      }
      const data = await res.json();
      // expecting data.classes or an array
      setOptions((prevOptions) => [
                    ...prevOptions,
                    ...data.tools,
                ]);
    } catch (err) {
      console.error('Error fetching tools:', err);
    }
  }

  const AddToolProficiency = (newValue) => {

    if (newValue[0] === "Add new tool...") {
      //Open dialog to add new tool proficiency
      setNewToolDialogOpen(true);
      return;
    }

    onChange(newValue);
  }

  const handleAddNewTool = (newTool) => {
        //Whenever a new tool is added, add it to the list.
        //Later it will be fetched from the backend

        setNewToolDialogOpen(false); //Close the dialog

        if(newTool === null || !newTool.name || newTool.name.trim() === '') {
            return; //Don't add empty names
        }

        setOptions((prevOptions) => [...prevOptions, newTool.name]);
        onChange([...value, newTool.name]); //optionally add it to the selected list
        
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
        onChange={(_, newValue) => {AddToolProficiency(newValue);}}
        disableClearable={false}

        renderInput={(params) => <TextField {...params} label="Tool Proficiencies" placeholder="" />}
        filterSelectedOptions
      />
    </FormControl>
    <AddItem isOpen={newToolDialogOpen} onAddItem={handleAddNewTool} itemTypeDefault="Tool" />
  </>)
}

export default GetToolProficiencies;