/*
TODO: Fetch possible classes from backend and populate a select component from material-ui
TODO: Upon selection of a class, set that class information in the sheet (recevied via props)
TODO: Allow the user to create a class if needed
*/

import React, { useState, useEffect } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import GetArmorProficiencies from '../Lists/ArmorProficiencies';
import GetWeaponProficiencies from '../Lists/WeaponProficiencies';
import GetToolProficiencies from '../Lists/ToolProficiencies';
import GetAttributeProficiencies from '../Lists/AttributeProficiencies';
import GetSkillProficiencies from '../Lists/SkillProficiencies';
import GetStartingEquipment from '../Lists/StartingEquipment';
import GetClassFeats from '../Lists/ClassFeature';

const ClassSelect = ({ sheet, setSheet }) => {
    const [loading, setLoading] = useState(true);
    const [fetchedClasses, setFetchedClasses] = useState([]);
    const [creatingNewClass, setCreatingNewClass] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [newClass, setNewClass] = useState({
        class_name: '',

        hit_die: 'd6',
        starting_hitpoints: '',
        hitpoints_per_level: '',

        armor_proficiencies: [],
        weapon_proficiencies: [],
        tool_proficiencies: [],

        attribute_proficiencies: [],
        skill_proficiencies: [],

        starting_equipment: [],

        class_features: [],
    });

    useEffect(() => {
        let mounted = true;
        const getClasses = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/info/classes');
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ detail: 'Unknown' }));
                    throw new Error(`HTTP ${res.status} - ${err.detail}`);
                }
                const data = await res.json();
                if (!mounted) return;
                // expecting data.classes or an array
                setFetchedClasses(Array.isArray(data) ? data : data.classes ?? []);
            } catch (err) {
                console.error('Error fetching classes:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        getClasses();
        return () => {
            mounted = false;
        };
    }, []);

    const handleSelectChange = (e) => {
        const val = e.target.value;
        setSelectedClassId(val);
        if (val === 'new') {
            // open dialog for creating a class
            setCreatingNewClass(true);
            return;
        }
        // find class and pass to parent if provided
        fetchedClasses.forEach(element => {
            if (element.class_name === val) {
                sheet.class = element;
                setSheet({ ...sheet });
                return;
            }
        });
    };

    const setArmorProficiencies = (value) => {
        newClass.armor_proficiencies = value;
        console.log("New armor proficiencies", newClass.armor_proficiencies);
        setNewClass({ ...newClass });
    }
    const setWeaponProficiencies = (value) => {
        newClass.weapon_proficiencies = value;
        console.log("New weapon proficiencies", newClass.weapon_proficiencies);
        setNewClass({ ...newClass });
    }
    const setAttributeProficiencies = (value) => {
        newClass.attribute_proficiencies = value;
        console.log("New attribute proficiencies", newClass.attribute_proficiencies);
        setNewClass({ ...newClass });
    }
    const setSkillProficiencies = (value) => {
        newClass.skill_proficiencies = value;
        console.log("New skill proficiencies", newClass.skill_proficiencies);
        setNewClass({ ...newClass });
    }
    const setToolProficiencies = (value) => {
        newClass.tool_proficiencies = value;
        console.log("New tool proficiencies", newClass.tool_proficiencies);
        setNewClass({ ...newClass });
    }
    const setEquipment = (value) => {
        newClass.tool_proficiencies = value;
        console.log("New starting equipment", newClass.tool_proficiencies);
        setNewClass({ ...newClass });
    }
    const setClassFeats = (value) => {
        newClass.class_features = value;
        console.log("New class features", newClass.class_features);
        setNewClass({ ...newClass });
    }

    const handleDialogClose = () => {
        setCreatingNewClass(false);
        // reset newClass state if desired
        setNewClass({
            class_name: '',

            hit_die: 'd6',
            starting_hitpoints: '',
            hitpoints_per_level: '',

            armor_proficiencies: [],
            weapon_proficiencies: [],
            tool_proficiencies: [],

            attribute_proficiencies: [],
            skill_proficiencies: [],

            starting_equipment: [],

            class_features: [],
        });
    };

    const handleCreateClass = async () => {
        // For now just log; you can POST to backend here and refresh classes afterwards
        console.log('Creating class:', newClass);

        // Example: POST to backend and then refresh classes
        // await fetch('http://127.0.0.1:8000/info/classes', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newClass) });

        // close dialog
        // setCreatingNewClass(false);

        // Optional: refresh classes list or inform parent
        // For now we call onClassChange with the newClass object (no id)
        // onClassChange?.(newClass);
    };

    return (
        <>
      <FormControl fullWidth variant="standard" margin="normal">
        <InputLabel id="class-select-label">Class</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={selectedClassId}
          onChange={handleSelectChange}
          disabled={loading}
        >
          <MenuItem value="">— Select —</MenuItem>
          <MenuItem value="new">Add New Class…</MenuItem>
          {fetchedClasses.map((cls) => (
            <MenuItem key={`class-${cls.id}`} value={String(cls.id)}>
              {cls.class_name ?? cls.name ?? `Class ${cls.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Dialog open={creatingNewClass} onClose={handleDialogClose} fullWidth maxWidth="xl">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Create New Class</Typography>
            <IconButton aria-label="close" onClick={handleDialogClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* Large input for the class name */}
          <TextField
            fullWidth
            label="Class Name"
            variant="outlined"
            value={newClass.class_name}
            onChange={(e) => setNewClass((s) => ({ ...s, class_name: e.target.value }))}
            margin="normal"
          />

          {/* Row: Hit Dice select + two small text fields */}
          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="hit-die-label">Hit Dice</InputLabel>
              <Select
                labelId="hit-die-label"
                id="hit-die"
                value={newClass.hit_die}
                label="Hit Dice"
                onChange={(e) => setNewClass((s) => ({ ...s, hit_die: e.target.value }))}
              >
                <MenuItem value="d6">D6</MenuItem>
                <MenuItem value="d8">D8</MenuItem>
                <MenuItem value="d10">D10</MenuItem>
                <MenuItem value="d12">D12</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Starting HP"
              variant="outlined"
              value={newClass.starting_hitpoints}
              onChange={(e) => setNewClass((s) => ({ ...s, starting_hitpoints: e.target.value }))}
              size="small"
            />

            <TextField
              label="HP / Level"
              variant="outlined"
              value={newClass.hitpoints_per_level}
              onChange={(e) => setNewClass((s) => ({ ...s, hitpoints_per_level: e.target.value }))}
              size="small"
            />
          </Box>

          {/* Multi-select Autocompletes (searchable) */}

          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
            
            <GetWeaponProficiencies value={newClass.weapon_proficiencies} onChange={setWeaponProficiencies}/>

            <GetArmorProficiencies value={newClass.armor_proficiencies} onChange={setArmorProficiencies} />

            <GetToolProficiencies value={newClass.tool_proficiencies} onChange={setToolProficiencies}/>
          </Box>

          
          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
          <GetAttributeProficiencies value={newClass.attribute_proficiencies} onChange={setAttributeProficiencies}/>
          <GetSkillProficiencies value={newClass.skill_proficiencies} onChange={setSkillProficiencies}/>
           <GetStartingEquipment value={newClass.starting_equipment} onChange={setEquipment} /> 
            </Box>  

          



          <Box mt={2}>
            <GetClassFeats value={newClass.class_features} onChange={setClassFeats} playerClass={newClass.class_name}/>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
    );
};

export default ClassSelect;