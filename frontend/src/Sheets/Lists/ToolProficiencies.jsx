import { React, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import ItemCache from '../Inventory/ItemCache';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import AddItem from '../AddingStuff/AddItem';

const GetToolProficiencies = ({ value = [], onChange }) => {
  const [cacheTick, setCacheTick] = useState(0); // keep if you want a tick
  const [equipmentOptions, setEquipmentOptions] = useState(() => {
    return ["Add new tool..."].concat((ItemCache.getAllNames() || []).map(n => n.charAt(0).toUpperCase() + n.slice(1)));
  });
  const [newToolDialogOpen, setNewToolDialogOpen] = useState(false);

  useEffect(() => {
    // update local options immediately and on notifications
    const updateOptions = () => {
      setEquipmentOptions(["Add new tool..."].concat((ItemCache.GetItemNamesOfType("tool") || []).map(n => n.charAt(0).toUpperCase() + n.slice(1))));
      setCacheTick(t => t + 1);
    };
    // subscribe
    const unsub = ItemCache.subscribeItemCache(updateOptions);
    // also call once to ensure up-to-date on mount
    updateOptions();
    return unsub;
  }, []);


  const AddToolProficiency = (newValue) => {

    if (newValue.includes("Add new tool...")) {
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

    if (newTool === null || !newTool.name || newTool.name.trim() === '') {
      return; //Don't add empty names
    }

    ItemCache.ForceCacheRefresh();
    
    onChange([...value, newTool.name]); //optionally add it to the selected list

  }

  

  return (<>
    <FormControl sx={{ minWidth: 360 }}>

      <Autocomplete
        multiple
        options={equipmentOptions}
        value={value}
        onChange={(_, newValue) => { AddToolProficiency(newValue); }}
        disableClearable={false}

        renderInput={(params) => <TextField {...params} label="Tool Proficiencies" placeholder="" />}
        filterSelectedOptions
      />
    </FormControl>
    <AddItem isOpen={newToolDialogOpen} onAddItem={handleAddNewTool} itemTypeDefault="Tool" />
  </>)
}

export default GetToolProficiencies;