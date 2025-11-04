import { React, useState,useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import AddItem from '../AddingStuff/AddItem';
import ItemCache from '../Inventory/ItemCache';

const GetStartingEquipment = ({ newClass = {}, setNewClass }) => {
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [showFixedPicker, setShowFixedPicker] = useState(false);
  const [fixedSelectedNames, setFixedSelectedNames] = useState([]);
  const [cacheTick, setCacheTick] = useState(0); // keep if you want a tick
  const [equipmentOptions, setEquipmentOptions] = useState(() => {
    return ["Add a new item...","Any Simple Weapon","Any Martial Weapon"].concat((ItemCache.getAllNames() || []).map(n => n.charAt(0).toUpperCase() + n.slice(1)));
  });

  useEffect(() => {
    // update local options immediately and on notifications
    const updateOptions = () => {
      setEquipmentOptions(["Add a new item...","Any Simple Weapon","Any Martial Weapon"].concat((ItemCache.getAllNames() || []).map(n => n.charAt(0).toUpperCase() + n.slice(1))));
      setCacheTick(t => t + 1);
    };
    // subscribe
    const unsub = ItemCache.subscribeItemCache(updateOptions);
    // also call once to ensure up-to-date on mount
    updateOptions();
    return unsub;
  }, []);

  const handleNewItem = async (newItem) => {
    setNewItemDialogOpen(false);
    if (!newItem?.name || newItem.name.trim() === '') return;

    // await refresh so the options are updated before any immediate UI work
    await ItemCache.ForceCacheRefresh();

    // optional: immediately add to fixed selection
    setFixedSelectedNames((prev) => [...prev, newItem.name]);
  };

  const AddStartingItem = (newValue) => {
        // handle "Add a new item..." placeholder
        console.log("New value:", newValue);
        if(newValue.includes("Add a new item...")) {
            setNewItemDialogOpen(true);
            // remove placeholder from selection
            newValue = newValue.filter(v => v !== "Add a new item...");
        }
        setFixedSelectedNames(newValue);
    }

  const GetEquipmentList = () => {
    // keep for backward compatibility, or use equipmentOptions directly
    return equipmentOptions;
  }

  

  // Fixed equipment handlers
  const openFixedPicker = () => setShowFixedPicker(true);
  const cancelFixedPicker = () => { setShowFixedPicker(false); setFixedSelectedNames([]); };

  const confirmAddFixed = () => {
    const selectedNames = fixedSelectedNames.filter(n => n !== "Add a new item...");
    const selectedItems = selectedNames.map(name => ({ name }));
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment = Array.isArray(next.starting_equipment) ? [...next.starting_equipment, ...selectedItems] : [...selectedItems];
      return next;
    });
    setFixedSelectedNames([]);
    setShowFixedPicker(false);
  };

  const removeFixedAt = (index) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment = (next.starting_equipment || []).slice();
      next.starting_equipment.splice(index, 1);
      return next;
    });
  };

  // Choice groups handlers
  // Now each option is an array of items (allow multiple, duplicates allowed)
  const addChoiceGroup = () => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? [...next.starting_equipment_choices] : [];
      // default group: two empty options (each option is an array)
      next.starting_equipment_choices.push([[], []]);
      return next;
    });
  };

  // local input state for per-option selection before "Add"
  const [optionInputs, setOptionInputs] = useState({}); // key: `${gi}-${oi}` => string

  const setOptionInput = (gi, oi, value) => {
    setOptionInputs(prev => ({ ...prev, [`${gi}-${oi}`]: value }));
  };

  const getOptionInput = (gi, oi) => {
    return optionInputs[`${gi}-${oi}`] || null;
  };

  const addItemToOption = (groupIndex, optionIndex, itemName) => {
    if (!itemName || itemName === "Add a new item...") {
      if (itemName === "Add a new item...") setNewItemDialogOpen(true);
      return;
    }
    const newEntry = { name: itemName, uid: `${Date.now()}-${Math.random().toString(36).slice(2,8)}` };
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? g.map(o => Array.isArray(o) ? [...o] : []) : []) : [];
      // ensure group exists
      if (!next.starting_equipment_choices[groupIndex]) next.starting_equipment_choices[groupIndex] = [];
      // ensure option exists
      if (!Array.isArray(next.starting_equipment_choices[groupIndex][optionIndex])) next.starting_equipment_choices[groupIndex][optionIndex] = [];
      next.starting_equipment_choices[groupIndex][optionIndex].push(newEntry);
      return next;
    });
    setOptionInput(groupIndex, optionIndex, null);
  };

  const removeItemFromOption = (groupIndex, optionIndex, itemIndex) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? g.map(o => Array.isArray(o) ? [...o] : []) : []) : [];
      if (!next.starting_equipment_choices[groupIndex]) return next;
      if (!Array.isArray(next.starting_equipment_choices[groupIndex][optionIndex])) return next;
      next.starting_equipment_choices[groupIndex][optionIndex].splice(itemIndex, 1);
      return next;
    });
  };

  const addOptionToGroup = (groupIndex) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? [...g] : []) : [];
      if (!next.starting_equipment_choices[groupIndex]) next.starting_equipment_choices[groupIndex] = [];
      next.starting_equipment_choices[groupIndex].push([]); // new empty option (array)
      return next;
    });
  };

  const removeOptionFromGroup = (groupIndex, optionIndex) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? [...g] : []) : [];
      if (!next.starting_equipment_choices[groupIndex]) return next;
      next.starting_equipment_choices[groupIndex].splice(optionIndex, 1);
      return next;
    });
  };

  const removeChoiceGroup = (groupIndex) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = (next.starting_equipment_choices || []).slice();
      next.starting_equipment_choices.splice(groupIndex, 1);
      return next;
    });
  };


  return (<div className='w-full mt-4'>
    <div className='font-semibold text-2xl'>Starting Equipment</div>
    <div style={{ marginBottom: 12 }} className='flex flex-row w-full justify-center'>
      <Button variant="contained" size="medium" onClick={openFixedPicker} sx={{ mr: 1 }}>Add Fixed Starting Equipment</Button>
      <Button variant="contained" size="medium" onClick={addChoiceGroup}>Add Starting Equipment Choice</Button>
    </div>

    {/* Fixed picker */}
    {showFixedPicker && (
      <FormControl sx={{ minWidth: 360, mb: 2 }}>
        <Autocomplete
          multiple
          options={equipmentOptions}      // use reactive state
          value={fixedSelectedNames}
          onChange={(_, newValue) => { AddStartingItem(newValue); }}
          disableClearable={false}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Select fixed starting equipment" placeholder="" />}
        />
        <div style={{ marginTop: 8 }}>
          <Button variant="contained" size="small" onClick={confirmAddFixed} sx={{ mr: 1 }}>Add Selected</Button>
          <Button variant="outlined" size="small" onClick={cancelFixedPicker}>Cancel</Button>
        </div>
      </FormControl>
    )}

    {/* display current fixed items */}
    <div style={{ marginBottom: 12 }} className='flex flex-col space-y-1'>
      <strong>Fixed starting equipment </strong>
      <ul>
        {(newClass.starting_equipment || []).map((it, idx) => (
          <li key={idx}>
            {it?.name || JSON.stringify(it)}
            <IconButton size="small" onClick={() => removeFixedAt(idx)}><ClearIcon fontSize="small" /></IconButton>
          </li>
        ))}
      </ul>
    </div>

    {/* choice groups */}
    <div>
      <strong>Starting equipment choices :</strong>
      {(newClass.starting_equipment_choices || []).map((group, gi) => (
        <div key={gi} style={{ border: "1px dashed #ccc", padding: 8, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>Choice group #{gi + 1}</div>
            <div>
              <Button size="small" color="success" onClick={() => addOptionToGroup(gi)} sx={{ mr: 1 }}>+ Choice</Button>
              <Button size="small" color="error" onClick={() => removeChoiceGroup(gi)}>Remove Group</Button>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            {(group || []).map((optionItem, oi) => {
              // coerce legacy single item / null into array-of-items for display
              const itemsArray = Array.isArray(optionItem) ? optionItem : (optionItem ? [optionItem] : []);
              return (
                <div key={oi} style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
                  <div style={{ width: 28 }}>{String.fromCharCode(65 + oi)}.</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FormControl sx={{ minWidth: 300 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Autocomplete
                          sx={{minWidth:200}}
                          options={GetEquipmentList()}
                          value={getOptionInput(gi, oi)}
                          onChange={(_, newValue) => {
                            // instant add: when an option is selected, add it immediately and clear the input
                            if (!newValue) {
                              setOptionInput(gi, oi, null);
                              return;
                            }
                            if (newValue === "Add a new item...") {
                              setNewItemDialogOpen(true);
                              setOptionInput(gi, oi, null);
                              return;
                            }
                            // add immediately (preserves duplicates via uid)
                            addItemToOption(gi, oi, newValue);
                          }}
                          renderInput={(params) => <TextField {...params} label="Select item to add" />}
                          clearOnEscape
                          getOptionLabel={(opt) => opt}
                          isOptionEqualToValue={(option, value) => option === value}
                        />
                        {/* removed the separate 'Add' button: selection now adds instantly */}
                      </div>
                    </FormControl>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {itemsArray.map((it, idx) => (
                        <Chip
                          key={it?.uid || `${it?.name}-${idx}`}
                          label={it?.name || JSON.stringify(it)}
                          onDelete={() => removeItemFromOption(gi, oi, idx)}
                          variant="outlined"
                        />
                      ))}
                    </div>

                    <Button size="small" color="error" onClick={() => removeOptionFromGroup(gi, oi)} sx={{ ml: 1 }}>Remove Option</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <AddItem isOpen={newItemDialogOpen} onAddItem={handleNewItem} itemTypeDefault="Weapon" />
  </div>)
}

export default GetStartingEquipment;