import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import ItemCache from '../Inventory/ItemCache';
import AddItem from '../AddingStuff/AddItem';

const GetWeaponProficiencies = ({ value = [], onChange }) => {
    const [cacheTick, setCacheTick] = useState(0); // keep if you want a tick
    const [equipmentOptions, setEquipmentOptions] = useState(() => {
        return ["Add new weapon...","Simple Weapons","Martial Weapons"].concat((ItemCache.getAllNames() || []).map(n => n.charAt(0).toUpperCase() + n.slice(1)));
    });

    const [newWeaponDialogOpen, setNewWeaponDialogOpen] = useState(false);

    const AddWeaponProficiency = (newValue) => {
        console.log("New weapon proficiency value:", newValue);
        if (newValue.includes("Add new weapon...")) {
            //Open dialog to add new weapon proficiency
            console.log("Opening new weapon dialog");
            setNewWeaponDialogOpen(true);
            return;
        }

        onChange(newValue);
    }

    const handleAddNewWeapon = async (newWeapon) => {
        //Whenever a new weapon is added, add it to the list.
        //Later it will be fetched from the backend

        setNewWeaponDialogOpen(false); //Close the dialog

        if (newWeapon === null || !newWeapon.name || newWeapon.name.trim() === '') {
            return; //Don't add empty names
        }

        // await refresh so the options are updated before any immediate UI work
        await ItemCache.ForceCacheRefresh();

        onChange([...value, newWeapon.name]); //optionally add it to the selected list

    }



    useEffect(() => {
        // update local options immediately and on notifications
        const updateOptions = () => {
            setEquipmentOptions(["Add new weapon...","Simple Weapons","Martial Weapons"].concat((ItemCache.GetItemNamesOfType("weapon") || []).map(n => n.charAt(0).toUpperCase() + n.slice(1))));
            setCacheTick(t => t + 1);
        };
        // subscribe
        const unsub = ItemCache.subscribeItemCache(updateOptions);
        // also call once to ensure up-to-date on mount
        updateOptions();
        return unsub;
    }, []);


    return (<>
        <FormControl sx={{ minWidth: 360 }}>

            <Autocomplete
                multiple
                options={equipmentOptions}
                value={value}
                onChange={(_, newValue) => { AddWeaponProficiency(newValue); }}
                disableClearable={false}

                renderInput={(params) => <TextField {...params} label="Weapon Proficiencies" placeholder="Search weapon..." />}
                filterSelectedOptions
            />
        </FormControl>

        <AddItem isOpen={newWeaponDialogOpen} onAddItem={handleAddNewWeapon} itemTypeDefault="Weapon" />
    </>)
}

export default GetWeaponProficiencies;