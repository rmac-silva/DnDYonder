/*
TODO: Fetch possible classes from backend and populate a select component from material-ui
TODO: Upon selection of a class, set that class information in the sheet (recevied via props)
TODO: Allow the user to create a class if needed
*/

import React, { useState, useEffect, memo } from 'react';

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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import GetArmorProficiencies from '../Lists/ArmorProficiencies';
import GetWeaponProficiencies from '../Lists/WeaponProficiencies';
import GetToolProficiencies from '../Lists/ToolProficiencies';
import GetAttributeProficiencies from '../Lists/AttributeProficiencies';
import GetSkillProficiencies from '../Lists/SkillProficiencies';
import GetStartingEquipment from '../Lists/StartingEquipment';
import GetClassFeats from '../Lists/ClassFeature';

const ClassSelect = ({ sheet, setSheet, selectClass, disabled }) => {
  const [loading, setLoading] = useState(true);
  const [fetchedClasses, setFetchedClasses] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [creatingNewClass, setCreatingNewClass] = useState(false);

  const [hasSubclass, setHasSubclass] = useState(false);
  const [hasSpellcasting, setHasSpellcasting] = useState(false);

  const [loadingWikidotData, setLoadingWikidotData] = useState(false);

  const [localClassName, setLocalClassName] = useState('');

  const [newClass, setNewClass] = useState({
    class_name: '',

    hit_die: 'd6',
    starting_hitpoints: 0,
    hitpoints_per_level: 0,

    armor_proficiencies: [],
    weapon_proficiencies: [],
    tool_proficiencies: [],

    attribute_proficiencies: [],
    skill_proficiencies: [],

    starting_equipment: [],
    starting_equipment_choices: [],

    class_features: [],
    spellcasting: {
      level: -1,
      spell_slots: {},
      spells_known: [],
      spellcasting_ability: '',
    },
    subclass: {
      selected: false,
      name: '',
      description: '',
      level: -1,
      features: []
    },
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
        // console.log('Fetched classes:', data.classes);
        setFetchedClasses(data.classes);
      } catch (err) {
        console.error('Error fetching classes:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getClasses();
    if (forceRefresh) setForceRefresh(false);
    return () => {
      mounted = false;
    };
  }, [forceRefresh]);

  const handleChangingClass = (e) => {
    const val = e.target.value;
    if (val === 'new') {
      // open dialog for creating a class
      setCreatingNewClass(true);
      return;
    }
    // find class and pass to parent if provided

    const cls = fetchedClasses.find((c) => String(c.c_name) === String(val));

    if (!cls) {
      sheet.class = null;
    } else {
      sheet.class = cls.c_content;
    }
    setSheet({ ...sheet });
    selectClass();


  };

  const setArmorProficiencies = (value) => {
    newClass.armor_proficiencies = value;

    setNewClass({ ...newClass });
  }
  const setWeaponProficiencies = (value) => {
    newClass.weapon_proficiencies = value;

    setNewClass({ ...newClass });

    //Refresh starting equipment options
    setForceRefresh(true);
  }
  const setAttributeProficiencies = (value) => {
    newClass.attribute_proficiencies = value;
    // console.log("New attribute proficiencies", newClass.attribute_proficiencies);
    setNewClass({ ...newClass });
  }
  const setSkillProficiencies = (value) => {
    newClass.skill_proficiencies = value;

    setNewClass({ ...newClass });
  }
  const setNumSkillProficiencies = (value) => {
    newClass.num_skill_proficiencies = value;

    setNewClass({ ...newClass });
  }
  const setToolProficiencies = (value) => {
    newClass.tool_proficiencies = value;
    // console.log("New tool proficiencies", newClass.tool_proficiencies);
    setNewClass({ ...newClass });
  }

  const setClassFeats = (value) => {
    newClass.class_features = value;
    setNewClass({ ...newClass });
  }

  const handleDialogClose = () => {
    setCreatingNewClass(false);
    // reset newClass state if desired
    setNewClass({
      class_name: '',

      hit_die: 'd6',
      used_hit_dice: 0,
      starting_hitpoints: 0,
      hitpoints_per_level: 0,

      armor_proficiencies: [],
      weapon_proficiencies: [],
      tool_proficiencies: [],

      attribute_proficiencies: [],
      skill_proficiencies: [],
      num_skill_proficiencies: 0,
      starting_equipment: [],
      starting_equipment_choices: [],


      class_features: [],
      spellcasting: {
        level: -1,
        spell_slots: {},
        max_level_spellslots: 9,
        spells_known: [],
        spellcasting_ability: '',
      },
      subclass: {
        name: '',
        description: '',
        level: -1,
        features: [],
        selected: false
      },
    });
  };

  function ValidateForm() {
    if (!newClass.class_name) {
      alert('Please provide a class name.');
      return false;
    }

    if (!newClass.starting_hitpoints === 0 || !newClass.hitpoints_per_level === 0) {
      alert('Please provide valid hitpoint values.');
      return false;
    }

    if (newClass.attribute_proficiencies.length === 0) {
      alert('Please select at least one saving throw proficiency.');
      return false;
    }

    if (newClass.skill_proficiencies.length === 0) {
      alert('Please select the skill proficiencies for the class.');
      return false;
    }

    if (newClass.num_skill_proficiencies === undefined || newClass.num_skill_proficiencies <= 0) {
      alert('Please provide a valid number of skill proficiencies to choose from.');
      return false;
    }
  }

  const handleCreateClass = async () => {
    if(!ValidateForm()) {
      return;
    }

    // POST to backend
    const payload = {
      'class': newClass,
      'token': localStorage.getItem('authToken'),
    }
    const res = await fetch('http://127.0.0.1:8000/info/classes', {
      method: 'POST', // or PUT depending on your API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Save failed: ${res.status}`);
    }

    // close dialog
    setCreatingNewClass(false);

    // Optional: refresh classes list or inform parent
    // For now we call onClassChange with the newClass object (no id)
    setFetchedClasses([...fetchedClasses, [{ c_name: newClass.class_name, c_content: JSON.stringify(newClass) }]]);
    setForceRefresh(true);
    sheet.class = newClass;
    setSheet({ ...sheet });

  };

  function handleWikidotData(data) {
    const ignored_keys = ["Hit Points","Proficiencies","Class Features","Equipment"];

    const features = [];
    for (const [key, value] of Object.entries(data)) {
      if (!ignored_keys.includes(key)) {
        var combined_feature = ""

        for(const content_part of value) {
          var isTable = content_part.table;

          if(isTable) {
            //Handle table separately
          } else {
            combined_feature += content_part.content + "\n";
          }
        }

        features.push({ name: key, description: combined_feature, level_requirement: 0 });
      }
    }

    // immutably set the new features array so React re-renders
    setNewClass(prev => ({ ...prev, class_features: features }));
  }

  async function handleWikidotFetch() {
    setLoadingWikidotData(true);
    if(newClass.class_name === '') {
      alert('Please provide a class name to fetch from Wikidot.');
      setLoadingWikidotData(false);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/wikidot/class/${newClass.class_name}`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`Wikidot fetch failed: ${res.status}`);
      }

      const data = await res.json();
      handleWikidotData(data);

      setLoadingWikidotData(false);
    } catch (error) {
      console.error("Error fetching from Wikidot:", error);
      setLoadingWikidotData(false);
    }
    
  }

  const ClassNameInput = memo(function ClassNameInput({ initial = '', onCommit }) {
    // local state lives inside this small component — typing won't re-render parent
    const [value, setValue] = useState(initial);

    // keep in sync if parent changes initial (e.g. when class selected programmatically)
    useEffect(() => setValue(initial), [initial]);

    return (
      <TextField
        fullWidth
        label="Class Name"
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onCommit(value)}      // only commit to parent on blur
        margin="normal"
      />
    );
  });

  return (
    <>
      <FormControl fullWidth variant="standard" margin="normal">
        <InputLabel id="class-select-label">Class</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={sheet.class?.class_name || ''}
          onChange={handleChangingClass}
          disabled={loading || disabled}
        >
          <MenuItem value="">— Select —</MenuItem>
          <MenuItem value="new">Add New Class…</MenuItem>
          {fetchedClasses.map((cls) => (
            <MenuItem key={`class-${cls.c_name}`} value={String(cls.c_name)}>
              {cls.c_name}
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
          <ClassNameInput
            initial={localClassName}
            onCommit={(v) => {
              // update both localClassName and newClass exactly once (on blur)
              setLocalClassName(v);
              setNewClass(prev => ({ ...prev, class_name: v }));
            }}
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
              type='number'
              label="Starting HP"
              variant="outlined"
              value={newClass.starting_hitpoints}
              onChange={(e) => setNewClass((s) => ({ ...s, starting_hitpoints: e.target.value }))}
              size="small"
            />

            <TextField
              type='number'
              label="HP / Level"
              variant="outlined"
              value={newClass.hitpoints_per_level}
              onChange={(e) => setNewClass((s) => ({ ...s, hitpoints_per_level: e.target.value }))}
              size="small"
            />
          </Box>

          {/* Multi-select Autocompletes (searchable) */}

          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>

            <GetWeaponProficiencies value={newClass.weapon_proficiencies} onChange={setWeaponProficiencies} />

            <GetArmorProficiencies value={newClass.armor_proficiencies} onChange={setArmorProficiencies} />

            <GetToolProficiencies value={newClass.tool_proficiencies} onChange={setToolProficiencies} />
          </Box>


          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
            <GetAttributeProficiencies value={newClass.attribute_proficiencies} onChange={setAttributeProficiencies} />
            <GetSkillProficiencies value={newClass.skill_proficiencies} onChange={setSkillProficiencies} />

            {/* A text field for number of skill proficiencies to choose from: */}
            <TextField
              className='w-30'
              type='number'

              label="Nr. Choices"
              variant="outlined"
              value={newClass.num_skill_proficiencies}
              onChange={(e) => setNumSkillProficiencies(e.target.value)}
              size="medium"
            />

            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasSpellcasting}
                    onChange={(e) => setHasSpellcasting(e.target.checked)}
                  />
                }
                label="Has Spellcasting?"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasSubclass}
                    onChange={(e) => setHasSubclass(e.target.checked)}
                  />
                }
                label="Has Subclass?"
              />
            </Box>


          </Box>

          {hasSpellcasting &&
            <>
              <div className='font-semibold text-xl'>Spellcasting Details:</div>
              <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
                <TextField
                  label="Spellcasting Level"
                  variant="outlined"
                  type='number'
                  sx={{ maxWidth: 130 }}
                  value={newClass.spellcasting.level}
                  onChange={(e) => setNewClass((s) => ({
                    ...s,
                    spellcasting: {
                      ...s.spellcasting,
                      level: e.target.value
                    }
                  }))}
                  size="medium"
                />
              </Box>
            </>
          }

          {hasSubclass &&
            <>
              <div className='font-semibold text-xl'>Subclass Details:</div>
              <Box display="flex" flexDirection="row" gap={2} mt={2} mb={2}>

                <TextField

                  label="Subclass Name"
                  variant="outlined"
                  value={newClass.subclass.name}
                  onChange={(e) => setNewClass((s) => ({
                    ...s,
                    subclass: {
                      ...s.subclass,
                      name: e.target.value
                    }
                  }))}

                />
                <TextField

                  label="Subclass Level"
                  variant="outlined"
                  type='number'
                  sx={{ maxWidth: 140 }}
                  value={newClass.subclass.level}
                  onChange={(e) => setNewClass((s) => ({
                    ...s,
                    subclass: {
                      ...s.subclass,
                      level: e.target.value
                    }
                  }))}

                />


              </Box>
              <TextField
                className='!w-2/3'
                label="Subclass Description"
                variant="outlined"
                value={newClass.subclass.description}
                onChange={(e) => setNewClass((s) => ({
                  ...s,
                  subclass: {
                    ...s.subclass,
                    description: e.target.value
                  }
                }))}

              />
            </>
          }

          <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
            <GetStartingEquipment newClass={newClass} setNewClass={setNewClass} />
          </Box>






          <Box mt={2}>
            <GetClassFeats onChange={setClassFeats} label={"Class"} classFeatures={newClass.class_features} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button onClick={handleWikidotFetch} loading={loadingWikidotData} variant="contained" color="success">Fetch from Wikidot</Button>
            <Box gap={2} display="flex">
              <Button onClick={handleDialogClose} variant="contained" color="error">Cancel</Button>
              <Button onClick={handleCreateClass} variant="contained" color="primary">Create</Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog >
    </>
  );
};

export default ClassSelect;