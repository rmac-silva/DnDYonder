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

import GetArmorProficiencies from '../../Lists/ArmorProficiencies';
import GetWeaponProficiencies from '../../Lists/WeaponProficiencies';
import GetToolProficiencies from '../../Lists/ToolProficiencies';
import GetAttributeProficiencies from '../../Lists/AttributeProficiencies';
import GetSkillProficiencies from '../../Lists/SkillProficiencies';
import GetStartingEquipment from '../../Lists/StartingEquipment';
import GetClassFeats from '../../Lists/ClassFeature';

const ClassSelect = ({ sheet, setSheet, selectClass, disabled }) => {
  const [loading, setLoading] = useState(true);
  const [fetchedClasses, setFetchedClasses] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [creatingNewClass, setCreatingNewClass] = useState(false);

  const [hasSubclass, setHasSubclass] = useState(false);
  const [hasSpellcasting, setHasSpellcasting] = useState(false);

  const [localClassName, setLocalClassName] = useState('');

  const [newClass, setNewClass] = useState({
    class_name: '',

    hit_die: 'none',
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

  //Error setters
  const [errorField, setErrorField] = useState('');

  function WipeNewClassData() {
    setErrorField('');
    setLocalClassName('');
    setNewClass({
      class_name: '',

      hit_die: 'none',
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
  }

  useEffect(() => {
    let mounted = true;
    const getClasses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/info/classes`);
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

  function setHitDice(value) {
    newClass.hit_die = value;

    //Based on the hit dice, set the starting hitpoints and hitpoints per level to default values
    switch (value) {
      case 'none':
        newClass.starting_hitpoints = 0;
        newClass.hitpoints_per_level = 0;
        break;
      case 'd6':
        newClass.starting_hitpoints = 6;
        newClass.hitpoints_per_level = 4;
        break;
      case 'd8':
        newClass.starting_hitpoints = 8;
        newClass.hitpoints_per_level = 5;
        break;
      case 'd10':
        newClass.starting_hitpoints = 10;
        newClass.hitpoints_per_level = 6;
        break;
      case 'd12':
        newClass.starting_hitpoints = 12;
        newClass.hitpoints_per_level = 7;
        break;
      default:
        break;
    }

    setNewClass({ ...newClass });
  }

  const handleDialogClose = () => {
    setCreatingNewClass(false);



    // reset newClass state if desired
    WipeNewClassData(setNewClass);


  };

  function ValidateForm() {
    if (!newClass.class_name) {
      setErrorField('class_name');
      alert('Please provide a class name.');
      return false;
    }

    if (newClass.starting_hitpoints === 0 || newClass.hitpoints_per_level === 0) {
      setErrorField('hit_die');
      alert('Please select a valid hit die for the class.');
      return false;
    }

    if (newClass.attribute_proficiencies.length === 0) {
      setErrorField('attribute_proficiencies');
      alert('Please select at least one saving throw proficiency.');
      return false;
    }

    if (newClass.skill_proficiencies.length === 0) {
      setErrorField('skill_proficiencies');
      alert('Please select the skill proficiencies for the class.');
      return false;
    }

    if (newClass.num_skill_proficiencies === undefined || newClass.num_skill_proficiencies <= 0) {
      setErrorField('num_skill_proficiencies');
      alert('Please provide a valid number of skill proficiencies to choose from.');
      return false;
    }

    // Check if there's starting items. If not warn the user but accept it as valid if they confirm.
    if (newClass.starting_equipment.length === 0 && newClass.starting_equipment_choices.length === 0) {
      const confirmNoStartingItems = window.confirm('NO STARTING EQUIPMENT has been added for this class. Are you sure you want to proceed?');
      if (!confirmNoStartingItems) {
        return false;
      }
    }

    //Check the same for class features
    if (newClass.class_features.length === 0) {
      const confirmNoClassFeatures = window.confirm('NO CLASS FEATURES have been added for this class. Are you sure you want to proceed?');
      if (!confirmNoClassFeatures) {
        return false;
      }
    } else if(newClass.class_features.length > 0) {
      //Check that all class features have a required level
      for (let feat of newClass.class_features) {
        if (feat.level_requirement === undefined || feat.level_requirement < 1) {
          setErrorField('class_features');
          alert(`Please provide a valid level for the class feature: ${feat.name}`);
          return false;
        }
      }

    }

    setErrorField('');

    return true;
  }

  const handleCreateClass = async () => {
    if (!ValidateForm()) {
      return;
    }

    // POST to backend
    const payload = {
      'class': newClass,
      'token': localStorage.getItem('authToken'),
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/info/classes`, {
      method: 'POST', // or PUT depending on your API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      //Alert with error message
      const err = await res.json().catch(() => ({ detail: 'Unknown' }));
      alert(`Error creating class: HTTP ${res.status} - ${err.detail}`);
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

    handleChangingClass({ target: { value: newClass.class_name } });
    WipeNewClassData(setNewClass);

  };



  const ClassNameInput = memo(function ClassNameInput({ initial = '', onCommit,error }) {
    // local state lives inside this small component — typing won't re-render parent
    const [value, setValue] = useState(initial);

    // keep in sync if parent changes initial (e.g. when class selected programmatically)
    useEffect(() => setValue(initial), [initial]);

    return (
      <TextField
        fullWidth
        error={error}
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
            //Red outline when error in class name
            error={errorField === 'class_name'}
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
                error={errorField === 'hit_die'}
                labelId="hit-die-label"
                id="hit-die"
                value={newClass.hit_die}
                label="Hit Dice"
                onChange={(e) => {setHitDice(e.target.value);}}
              >
                <MenuItem value="none">—</MenuItem>
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
              //Make this field read-only, as it is calculated based on hit die
              InputProps={{
                readOnly: true,
              }}
              value={newClass.starting_hitpoints}
              size="small"
            />

            <TextField
              type='number'
              label="HP / Level"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              value={newClass.hitpoints_per_level}
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
            <GetAttributeProficiencies value={newClass.attribute_proficiencies} onChange={setAttributeProficiencies} error={errorField === 'attribute_proficiencies'} />
            <GetSkillProficiencies value={newClass.skill_proficiencies} onChange={setSkillProficiencies} error={errorField === 'skill_proficiencies'} />

            {/* A text field for number of skill proficiencies to choose from: */}
            <TextField
              className='w-30'
              type='number'
              error={errorField === 'num_skill_proficiencies'}
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
            <GetClassFeats onChange={setClassFeats} label={"Class"} objectFeatures={newClass.class_features} object={newClass} />
          </Box>
        </DialogContent>

        <DialogActions>


          <Box gap={2} display="flex">
            <Button onClick={handleDialogClose} variant="contained" color="error">Cancel</Button>
            <Button onClick={handleCreateClass} variant="contained" color="primary">Create</Button>
          </Box>

        </DialogActions>
      </Dialog >
    </>
  );
};

export default ClassSelect;


