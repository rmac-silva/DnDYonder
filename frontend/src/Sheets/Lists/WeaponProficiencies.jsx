import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import AddItem from '../AddingStuff/AddItem';

const GetWeaponProficiencies = ({value = [], onChange}) => {
    const [options, setOptions] = useState([
        "Add new weapon...",
        "Simple Weapons",
        "Martial Weapons",
    ]);

    const [newWeaponDialogOpen, setNewWeaponDialogOpen] = useState(false);

    const AddWeaponProficiency = (newValue) => {

        if(newValue[0] === "Add new weapon...") {
            //Open dialog to add new weapon proficiency
            setNewWeaponDialogOpen(true);
            return;
        }

        onChange(newValue);
    }

    const handleAddNewWeapon = (newWeapon) => {
        //Whenever a new weapon is added, add it to the list.
        //Later it will be fetched from the backend

        setNewWeaponDialogOpen(false); //Close the dialog

        if(newWeapon === null || !newWeapon.name || newWeapon.name.trim() === '') {
            return; //Don't add empty names
        }

        setOptions((prevOptions) => [...prevOptions, newWeapon.name]);
        onChange([...value, newWeapon.name]); //optionally add it to the selected list
        
    }

    const GetWeaponsList = async () => {
        try {
                const res = await fetch('http://127.0.0.1:8000/info/weapons');
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ detail: 'Unknown' }));
                    throw new Error(`HTTP ${res.status} - ${err.detail}`);
                }
                const data = await res.json();
                // expecting data.classes or an array
                setOptions((prevOptions) => [
                    ...prevOptions,
                    ...data.weapons,
                ]);
            } catch (err) {
                console.error('Error fetching weapons:', err);
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
                      onChange={(_, newValue) => {AddWeaponProficiency(newValue);}}
                      disableClearable={false}
                     
                    renderInput={(params) => <TextField {...params} label="Weapon Proficiencies" placeholder="Search weapon..." />}
                    filterSelectedOptions
                    />
                  </FormControl>

        <AddItem isOpen={newWeaponDialogOpen} onAddItem={handleAddNewWeapon} itemTypeDefault="Weapon" />
    </>)
}

export default GetWeaponProficiencies;