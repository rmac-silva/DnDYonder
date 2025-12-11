/*
TODO: Fetch possible classes from backend and populate a select component from material-ui
TODO: Upon selection of a class, set that class information in the sheet (recevied via props)
TODO: Allow the user to create a class if needed
*/

import React, { useState, useEffect, memo } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import GetArmorProficiencies from '../../Sheets/Lists/ArmorProficiencies';
import GetWeaponProficiencies from '../../Sheets/Lists/WeaponProficiencies';
import GetToolProficiencies from '../../Sheets/Lists/ToolProficiencies';
import GetAttributeProficiencies from '../../Sheets/Lists/AttributeProficiencies';
import GetSkillProficiencies from '../../Sheets/Lists/SkillProficiencies';
import GetStartingEquipment from '../../Sheets/Lists/StartingEquipment';
import GetClassFeats from '../../Sheets/Lists/ClassFeature';

import { getItem, ForceCacheRefresh } from '../../Sheets/MiddleColumn/Inventory/ItemCache';

// NEW: layout helpers
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

const ClassEdit = ({ sheet, setSheet, selectClass, disabled, open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [loadingWikidotData, setLoadingWikidotData] = useState(false);
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
  const [featuresOpen, setFeaturesOpen] = useState(false);

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

  // Preload when opening with an existing class
  useEffect(() => {
    const cls = sheet?.class;
    if (!cls) return;
    setNewClass({
      class_name: cls.class_name || '',
      hit_die: cls.hit_die || 'none',
      starting_hitpoints: cls.starting_hitpoints ?? 0,
      hitpoints_per_level: cls.hitpoints_per_level ?? 0,
      armor_proficiencies: cls.armor_proficiencies || [],
      weapon_proficiencies: cls.weapon_proficiencies || [],
      tool_proficiencies: cls.tool_proficiencies || [],
      attribute_proficiencies: cls.attribute_proficiencies || [],
      skill_proficiencies: cls.skill_proficiencies || [],
      num_skill_proficiencies: cls.num_skill_proficiencies ?? 0,
      starting_equipment: cls.starting_equipment || [],
      starting_equipment_choices: cls.starting_equipment_choices || [],
      class_features: cls.class_features || [],
      spellcasting: {
        level: cls.spellcasting?.level ?? -1,
        spell_slots: cls.spellcasting?.spell_slots ?? {},
        spells_known: cls.spellcasting?.spells_known ?? [],
        spellcasting_ability: cls.spellcasting?.spellcasting_ability ?? '',
      },
      subclass: {
        selected: !!cls.subclass?.selected,
        name: cls.subclass?.name ?? '',
        description: cls.subclass?.description ?? '',
        level: cls.subclass?.level ?? -1,
        features: cls.subclass?.features ?? []
      },
    });
    setLocalClassName(cls.class_name || '');
    setHasSpellcasting((cls.spellcasting?.level ?? -1) >= 0);
    setHasSubclass(!!cls.subclass && (cls.subclass.level ?? -1) >= 0);
  }, [sheet?.class]);

  const handleChangingClass = (e) => {

    //Wipe the selected starting equipment and skill proficiencies from the sheet first
    
    

    const val = e.target.value;
    if (val === 'new') {
      // open dialog for creating a class
      setCreatingNewClass(true);
      return;
    }
    console.log("Selected class, sheet is now:", sheet);
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
    onClose(false);
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
    } else if (newClass.class_features.length > 0) {
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

  const handleEditClass = async () => {
    if (!ValidateForm()) {
      return;
    }

    // POST to backend
    const payload = {
      'class': newClass,
      'token': localStorage.getItem('authToken'),
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/info/classes`, {
      method: 'PUT', // or PUT depending on your API
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
    onClose(true);

  };



  const ClassNameInput = memo(function ClassNameInput({ initial = '', onCommit, error }) {
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
        disabled
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onCommit(value)}
        margin="none"            // centered with the row
      />
    );
  });

  async function handleWikidotData(data) {
    console.log("Wikidot data received:", data);

    if (data === null || Object.keys(data).length === 0) {
      alert("No data found on Wikidot for this class" + ". If it is an Unearthed Arcana, try adding 'UA' to the name: {YOUR NAME} UA");
      return;
    }

    var ignored_keys = ['Class Features', 'Spellcasting', 'misc_class_info']

    var new_class_features = [];
    for (const [key, value] of Object.entries(data)) {

      if (key === "misc_class_info") {

        var misc_info = value.content;

        newClass.hit_die = misc_info.hit_die ? `d${misc_info.hit_die}` : newClass.hit_die;
        setHitDice(newClass.hit_die);
        newClass.num_skill_proficiencies = misc_info.num_skills_to_choose ? parseInt(misc_info.num_skills_to_choose) : newClass.num_skill_proficiencies;

        newClass.attribute_proficiencies = misc_info.saving_throws ? misc_info.saving_throws : newClass.attribute_proficiencies;

        newClass.skill_proficiencies = misc_info.skills_list ? misc_info.skills_list : newClass.skill_proficiencies;

        newClass.weapon_proficiencies = misc_info.weapon_proficiencies ? misc_info.weapon_proficiencies : newClass.weapon_proficiencies;

        newClass.armor_proficiencies = misc_info.armor_proficiencies ? misc_info.armor_proficiencies : newClass.armor_proficiencies;

        newClass.tool_proficiencies = misc_info.tool_proficiencies ? misc_info.tool_proficiencies : newClass.tool_proficiencies;
      }

      if (ignored_keys.includes(key)) {
        continue;
      }

      var content = value.content || "";
      if (value.table) {
        //Append some text informing there's a table that will be shown later
        content += "\n\n[Table data available, it will be shown in the sheet.]";
      }

      //Iterate through the weapon and tool proficiencies, and check for items that are not defined in the item cache.
      
      for (let prof of data.misc_class_info.content.weapon_proficiencies) {
          if (getItem(prof) === undefined) {
            var item = {
              name: prof,
              type: "Weapon",
              description: "Fetched from Wikidot. Please edit details.",
              weight: 0,
              cost: 0,
              features: [],
              range : "",
              attacks:  [],
            };
            await saveNewItem(item);
          }
        }

      for (let prof of data.misc_class_info.content.tool_proficiencies) {
          if (getItem(prof) === undefined) {
            item = {
              name: prof,
              type: "Tool",
              description: "Fetched from Wikidot. Please edit details.",
              weight: 0,
              cost: 0,
              features: [],
            };
            await saveNewItem(item);
          }
        }
      

      

      var new_feature = {
        name: key,
        description: content,
        tables: value.tables || [],
        level_requirement: value.level_required || newClass.level,
        benefits: []
      };
      new_class_features.push(new_feature);
    }
    // immutably set the new features array so React re-renders
    newClass.class_features = [...new_class_features];
    setNewClass({ ...newClass });
  }

  async function saveNewItem(item) {
    const payload = {
      'item': item,
      'type': item.type,
      'token': localStorage.getItem('authToken'),
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/info/save_item`, {
      method: 'POST', // or PUT depending on your API
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      
      throw new Error(`Save failed: ${res.status} - ${errorData.detail || 'Unknown error'}`);
    } else {
      ForceCacheRefresh();//Update the cache after adding a new item
    }
  }

  async function handleWikidotFetch() {
    try {

      setLoadingWikidotData(true);


      await fetchWikidotClassData(newClass.class_name);



    } catch (error) {
      console.error("Error during Wikidot fetch:", error);
      setLoadingWikidotData(false);
    }
  }


  async function fetchWikidotClassData(className) {

    if (className === '') {
      alert('Please provide a class name to fetch from Wikidot.');
      setLoadingWikidotData(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wikidot/class/${newClass.class_name}`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`Wikidot fetch failed: ${res.status}`);
      }

      const data = await res.json();
      await handleWikidotData(data);

      setLoadingWikidotData(false);
    } catch (error) {
      console.error("Error fetching from Wikidot:", error);
      setLoadingWikidotData(false);
    }

  }

  return (
    <>
      

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="xl">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Editing '{newClass.class_name}'</Typography>
            <IconButton aria-label="close" onClick={handleDialogClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* RESTRUCTURED: Standard sections with Paper + headers */}
          <Stack spacing={2}>
            {/* Warning before Basics */}
            <Typography  className='text-lg !font-semibold'>
              Tip: Fill in Spellcasting, Subclass details, and Starting Equipment before fetching from Wikidot as it slows down the website a lot.
            </Typography>

            {/* Basics */}
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Basics</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {/* Class Name */}
                  <ClassNameInput
                    initial={localClassName}
                    error={errorField === 'class_name'}
                    onCommit={(v) => {
                      setLocalClassName(v);
                      setNewClass(prev => ({ ...prev, class_name: v }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Hit dice + HP */}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems="center"
                  // removed mt to align vertically with Class Name
                  >
                    <FormControl sx={{ minWidth: 140 }}>
                      {/* ...existing Hit Dice Select (unchanged handlers/props)... */}
                      <InputLabel id="hit-die-label">Hit Dice</InputLabel>
                      <Select
                        error={errorField === 'hit_die'}
                        labelId="hit-die-label"
                        id="hit-die"
                        value={newClass.hit_die}
                        label="Hit Dice"
                        onChange={(e) => { setHitDice(e.target.value); }}
                      >
                        <MenuItem value="none">—</MenuItem>
                        <MenuItem value="d6">D6</MenuItem>
                        <MenuItem value="d8">D8</MenuItem>
                        <MenuItem value="d10">D10</MenuItem>
                        <MenuItem value="d12">D12</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      type='text'
                      label="Starting HP"
                      variant="outlined"


                      InputProps={{ readOnly: true }}
                      value={newClass.starting_hitpoints}
                      size="small"
                    />
                    <TextField
                      type='text'
                      label="HP / Level"
                      variant="outlined"

                      InputProps={{ readOnly: true }}
                      value={newClass.hitpoints_per_level}
                      size="small"
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  {/* Toggles */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Proficiencies */}
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Proficiencies</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <GetWeaponProficiencies value={newClass.weapon_proficiencies} onChange={setWeaponProficiencies} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <GetArmorProficiencies value={newClass.armor_proficiencies} onChange={setArmorProficiencies} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <GetToolProficiencies value={newClass.tool_proficiencies} onChange={setToolProficiencies} />
                </Grid>
              </Grid>
            </Paper>

            {/* Saving Throws & Skills */}
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Saving Throws & Skills</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <GetAttributeProficiencies value={newClass.attribute_proficiencies} onChange={setAttributeProficiencies} error={errorField === 'attribute_proficiencies'} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <GetSkillProficiencies value={newClass.skill_proficiencies} onChange={setSkillProficiencies} error={errorField === 'skill_proficiencies'} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    className='w-30'
                    type="number"
                    error={errorField === 'num_skill_proficiencies'}
                    label="Nr. Choices"
                    variant="outlined"
                    value={Number.isFinite(Number(newClass.num_skill_proficiencies)) ? Number(newClass.num_skill_proficiencies) : ''}

                    onChange={(e) => {
                      const v = e.target.value;
                      setNumSkillProficiencies(v === '' ? '' : Number(v));
                    }}
                    size="medium"
                    fullWidth
                    InputLabelProps={{ shrink: true }}    // ensures floating label
                    inputProps={{ min: 0 }}
                    placeholder="0"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Spellcasting Details */}
            {hasSpellcasting && (
              <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Spellcasting Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
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
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Subclass Details */}
            {hasSubclass && (
              <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, width: '100%' }} >
                <Typography variant="h6" sx={{ mb: 1 }}>Subclass Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ width: '100%', flexGrow: 1 }} >
                  <Grid item xs={12} md={12}>
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
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                      fullWidth
                    />
                  </Grid>
                  <Box display="flex" flexDirection="col" flexWrap="wrap" gap={2} width="100%" sx={{ mt: 2 }}>
                    <Grid item xs={24} sx={{ width: '80%' }}>
                      <TextField
                        className='!w-3/3'
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
                        fullWidth
                        multiline
                        minRows={3}
                      />
                    </Grid>
                  </Box>
                </Grid>
              </Paper>
            )}

            {/* Starting Equipment */}
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, md: 3 },
                // make all inner buttons appear outlined
                '& .MuiButton-root': {
                  border: '1px solid',
                  borderColor: (t) => t.palette.divider,
                  backgroundColor: 'transparent',
                  textTransform: 'none'
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>Starting Equipment</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <GetStartingEquipment
                  newClass={newClass}
                  setNewClass={setNewClass}
                  allowDuplicates
                  buttonVariant="outlined"
                />
              </Box>
            </Paper>

            {/* Class Features (Accordion, renders only when expanded) */}
            <Accordion
              expanded={featuresOpen}
              onChange={(_, v) => setFeaturesOpen(v)}
              TransitionProps={{ unmountOnExit: true }} // do not keep mounted when collapsed
              sx={{
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: 1,
                boxShadow: 'none',
                '&:before': { display: 'none' },
                mt: 2
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Class Features</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  // Align icon buttons without absolute positioning
                  '& .MuiCardHeader-root': { display: 'flex', alignItems: 'flex-start', pr: 1 },
                  '& .MuiCardHeader-action': { ml: 'auto', alignSelf: 'flex-start' },
                  '& .MuiIconButton-root': { position: 'static' }
                }}
              >
                <Divider sx={{ mb: 2 }} />
                {featuresOpen && (
                  <GetClassFeats
                    onChange={setClassFeats}
                    objectFeatures={newClass.class_features}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          </Stack>
        </DialogContent>

        <DialogActions>


          <Box gap={2} display="flex">
            
            <Button onClick={handleWikidotFetch} variant="contained" color="secondary" startIcon={<CachedIcon />} loading={loadingWikidotData}>Fetch from Wikidot</Button>
            <Button onClick={handleDialogClose} variant="contained" color="error">Cancel</Button>
            <Button onClick={handleEditClass} variant="contained" color="primary">Save</Button>
          </Box>

        </DialogActions>
      </Dialog >
    </>
  );
};

export default ClassEdit;


