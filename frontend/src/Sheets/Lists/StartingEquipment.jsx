import { React, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import AddItem from '../AddingStuff/AddItem';

const GetStartingEquipment = ({ newClass = {}, setNewClass }) => {
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);

  const [options, setOptions] = useState([
    "Add a new item..."
  ]);

  const [showFixedPicker, setShowFixedPicker] = useState(false);
  const [fixedSelectedNames, setFixedSelectedNames] = useState([]);

  const handleNewItem = (newItem) => {
        setNewItemDialogOpen(false);

        if(newItem === null || !newItem.name || newItem.name.trim() === '') {
            return;
        }

        setOptions((prevOptions) => [...prevOptions, newItem.name]);
        // optional: immediately add to fixed selection
        setFixedSelectedNames((prev) => [...prev, newItem.name]);
    }

  const AddStartingItem = (newValue) => {
        // handle "Add a new item..." placeholder
        if(newValue.includes("Add a new item...")) {
            setNewItemDialogOpen(true);
            // remove placeholder from selection
            newValue = newValue.filter(v => v !== "Add a new item...");
        }
        setFixedSelectedNames(newValue);
    }

  const GetEquipmentList = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/info/equipment');
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown' }));
        throw new Error(`HTTP ${res.status} - ${err.detail}`);
      }
      const data = await res.json();
      setOptions((prevOptions) => [
        ...prevOptions,
        ...(Array.isArray(data.equipment) ? data.equipment : [])
      ]);

    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  }

  useEffect(() => {
    GetEquipmentList();
  }, []);

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
  const addChoiceGroup = () => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? [...next.starting_equipment_choices] : [];
      next.starting_equipment_choices.push([null, null]); // two empty options by default
      return next;
    });
  };

  const updateChoice = (groupIndex, optionIndex, itemName) => {
    const selected = itemName ? { name: itemName } : null;
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? [...g] : []) : [];
      next.starting_equipment_choices[groupIndex][optionIndex] = selected;
      return next;
    });
  };

  const addOptionToGroup = (groupIndex) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? [...g] : []) : [];
      next.starting_equipment_choices[groupIndex].push(null);
      return next;
    });
  };

  const removeOptionFromGroup = (groupIndex, optionIndex) => {
    setNewClass(prev => {
      const next = { ...(prev || {}) };
      next.starting_equipment_choices = Array.isArray(next.starting_equipment_choices) ? next.starting_equipment_choices.map(g => Array.isArray(g) ? [...g] : []) : [];
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

  const selectableOptions = options.filter(o => o !== "Add a new item...");

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
          options={options}
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
            {(group || []).map((optionItem, oi) => (
              <div key={oi} style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
                <div style={{ width: 28 }}>{String.fromCharCode(65 + oi)}.</div>
                <FormControl sx={{ minWidth: 300 }}>
                  <Autocomplete
                    options={selectableOptions}
                    value={optionItem?.name || null}
                    onChange={(_, newValue) => {
                      if (newValue === "Add a new item...") {
                        setNewItemDialogOpen(true);
                        return;
                      }
                      updateChoice(gi, oi, newValue || null);
                    }}
                    renderInput={(params) => <TextField {...params} label="Select item" />}
                    disableClearable
                    clearOnEscape
                    getOptionLabel={(opt) => opt}
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                </FormControl>
                <Button size="small" color="error" onClick={() => removeOptionFromGroup(gi, oi)} sx={{ ml: 1 }}>Remove Option</Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <AddItem isOpen={newItemDialogOpen} onAddItem={handleNewItem} itemTypeDefault="Weapon" />
  </div>)
}

export default GetStartingEquipment;