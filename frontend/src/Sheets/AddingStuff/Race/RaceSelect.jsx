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
import { Paper, Divider, Grid, Stack } from '@mui/material';


import GetArmorProficiencies from '../../Lists/ArmorProficiencies';
import GetWeaponProficiencies from '../../Lists/WeaponProficiencies';
import GetToolProficiencies from '../../Lists/ToolProficiencies';
import GetClassFeats from '../../Lists/ClassFeature';

const RaceSelect = ({ sheet, setSheet, selectRace,disabled }) => {
    const [loading, setLoading] = useState(true);
    const [fetchedRaces, setFetchedRaces] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [creatingNewRace, setCreatingNewRace] = useState(false);
    const [newRace, setNewRace] = useState({
        race: '',
        subrace: '',
        creature_type: '',
        size: '',
        speed: 30,
        alignment: '',

        armor_proficiencies: [], //Some races have innate proficiencies
        weapon_proficiencies: [], //Some races have innate proficiencies
        tool_proficiencies: [], //Some races have innate proficiencies

        languages: ["Common"],
        race_features: [],
    });

    const [errorField, setErrorField] = useState('');

    const languages = [
        "Common",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Orc",
        "Abyssal",
        "Celestial",
        "Draconic",
        "Deep Speech",
        "Infernal",
        "Primordial",
        "Sylvan",
        "Undercommon"
    ];

    useEffect(() => {
        let mounted = true;
        const getClasses = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/info/races`);
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ detail: 'Unknown' }));
                    throw new Error(`HTTP ${res.status} - ${err.detail}`);
                }
                const data = await res.json();
                if (!mounted) return;
                // expecting data.races or an array
                // console.log('Fetched races:', data.races);
                setFetchedRaces(data.races);
            } catch (err) {
                console.error('Error fetching races:', err);
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

    const handleChangingRace = (e) => {
        const val = e.target.value;
        if (val === 'new') {
            // open dialog for creating a class
            setCreatingNewRace(true);
            return;
        }
        // find race and pass to parent if provided
        // console.log("Trying to find race:", val, "in", fetchedRaces);
        const race = fetchedRaces.find((c) => String(c.r_name) === String(val));

        if (!race) {
            sheet.race = null;
        } else {
            sheet.race = race.r_content;
            // console.log("Found race, applied to sheet:", sheet)
        }
        setSheet({ ...sheet });
        selectRace();


    };



    const setRaceFeats = (value) => {
        newRace.race_features = value;
        setNewRace({ ...newRace });
    }

    const setLanguages = (value) => {
        newRace.languages = value;
        console.log("New languages", newRace.languages);
        setNewRace({ ...newRace });
    }

    const setArmorProficiencies = (value) => {
        newRace.armor_proficiencies = value;
        console.log("New armor proficiencies", newRace.armor_proficiencies);
        setNewRace({ ...newRace });
    }
    const setWeaponProficiencies = (value) => {
        newRace.weapon_proficiencies = value;
        console.log("New weapon proficiencies", newRace.weapon_proficiencies);
        setNewRace({ ...newRace });
    }

    const setToolProficiencies = (value) => {
        newRace.tool_proficiencies = value;
        console.log("New tool proficiencies", newRace.tool_proficiencies);
        setNewRace({ ...newRace });
    }

    function WipeRaceData() {
        setErrorField('');
        setNewRace({
            race: '',
            subrace: '',
            creature_type: '',
            size: '',
            speed: 30,

            armor_proficiencies: [], //Some races have innate proficiencies
            weapon_proficiencies: [], //Some races have innate proficiencies
            tool_proficiencies: [], //Some races have innate proficiencies

            languages: ["Common"],
            race_features: [],
        });
    }

    const handleDialogClose = () => {
        setCreatingNewRace(false);
        // reset newClass state if desired
        WipeRaceData();
    };

    function validateNewRace() {
        if(newRace.race.trim() === '') {
            alert("Race name is required.");
            setErrorField('race');
            return false;
        }
        if(newRace.creature_type.trim() === '') {
            alert("Creature type is required.");
            setErrorField('creature_type');
            return false;
        }
        if(newRace.size.trim() === '') {
            alert("Size is required.");
            setErrorField('size');
            return false;
        }
        if(isNaN(parseInt(newRace.speed)) || parseInt(newRace.speed) <= 0) {
            alert("Speed must be a positive number.");
            setErrorField('speed');
            return false;
        }

        //Check if the race has no features, warn the user but allow it
        if(newRace.race_features.length === 0) {
            if(!window.confirm("The race has no features. Are you sure you want to create it?")) {
                return false;
            }
        }

        setErrorField('');
        return true;
    }

    const handleCreateClass = async () => {

        if(!validateNewRace()) {
            return;
        }

        // For now just log; you can POST to backend here and refresh classes afterwards
        console.log('Creating race:', newRace);

        // POST to backend
        const payload = {
            'race': newRace,
            'token': localStorage.getItem('authToken'),
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/info/races`, {
            method: 'POST', // or PUT depending on your API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Save failed: ${res.status}`);
        }

        // close dialog
        setCreatingNewRace(false);

        

        // Optional: refresh races list or inform parent
        // For now we call onRaceChange with the newRace object (no id)
        setFetchedRaces([...fetchedRaces, [{ r_name: newRace.race, r_content: JSON.stringify(newRace) }]]);
        setForceRefresh(true);
        

        handleChangingRace({ target: { value: newRace.race } });
        
        // reset newClass state
        WipeRaceData();

    };

    return (
        <>
            <FormControl fullWidth variant="standard" margin="normal">
                <InputLabel id="race-select-label">Race</InputLabel>
                <Select
                    labelId="race-select-label"
                    id="race-select"
                    value={(sheet.race.subrace !== null && sheet.race.subrace !== '') ? (sheet.race.subrace + " " + sheet.race.race) : sheet.race.race || ''}
                    
                    onChange={handleChangingRace}
                    disabled={loading || disabled}
                >
                    <MenuItem value="">— Select —</MenuItem>
                    <MenuItem value="new">Add New Race...</MenuItem>
                    {fetchedRaces?.map((race) => (
                        <MenuItem key={`race-${race.r_name}`} value={String(race.r_name)}>
                            {race.r_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Dialog open={creatingNewRace} onClose={handleDialogClose} fullWidth maxWidth="xl">
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Create New Race</Typography>
                        <IconButton aria-label="close" onClick={handleDialogClose} size="large">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={2}>
                      {/* Basics */}
                      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Basics</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              required
                              fullWidth
                              label="Race Name"
                              variant="outlined"
                              placeholder="Dwarf"
                              error={errorField === 'race'}
                              value={newRace.race}
                              onChange={(e) => setNewRace((s) => ({ ...s, race: e.target.value }))}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Subrace Name"
                              variant="outlined"
                              placeholder="Mountain"
                              value={newRace.subrace}
                              onChange={(e) => setNewRace((s) => ({ ...s, subrace: e.target.value }))}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth sx={{ minWidth: 180 }}>
                              <InputLabel id="creature_type-label">Creature Type</InputLabel>
                              <Select
                                required
                                error={errorField === 'creature_type'}
                                labelId="creature_type-label"
                                id="creature_type"
                                value={newRace.creature_type}
                                label="Creature Type"
                                onChange={(e) => setNewRace((s) => ({ ...s, creature_type: e.target.value }))}
                              >
                                <MenuItem value="Humanoid">Humanoid</MenuItem>
                                <MenuItem value="Aberration">Aberration</MenuItem>
                                <MenuItem value="Beast">Beast</MenuItem>
                                <MenuItem value="Celestial">Celestial</MenuItem>
                                <MenuItem value="Construct">Construct</MenuItem>
                                <MenuItem value="Dragon">Dragon</MenuItem>
                                <MenuItem value="Elemental">Elemental</MenuItem>
                                <MenuItem value="Fey">Fey</MenuItem>
                                <MenuItem value="Fiend">Fiend</MenuItem>
                                <MenuItem value="Giant">Giant</MenuItem>
                                <MenuItem value="Monstrosity">Monstrosity</MenuItem>
                                <MenuItem value="Ooze">Ooze</MenuItem>
                                <MenuItem value="Plant">Plant</MenuItem>
                                <MenuItem value="Undead">Undead</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth sx={{ minWidth: 180 }}>
                              <InputLabel id="size-label">Size</InputLabel>
                              <Select
                                required
                                labelId="size-label"
                                id="size"
                                error={errorField === 'size'}
                                value={newRace.size}
                                label="Size"
                                onChange={(e) => setNewRace((s) => ({ ...s, size: e.target.value }))}
                              >
                                <MenuItem value="Tiny">Tiny</MenuItem>
                                <MenuItem value="Small">Small</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Large">Large</MenuItem>
                                <MenuItem value="Huge">Huge</MenuItem>
                                <MenuItem value="Gargantuan">Gargantuan</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Speed (ft)"
                              variant="outlined"
                              value={newRace.speed}
                              onChange={(e) => setNewRace((s) => ({ ...s, speed: e.target.value }))}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Proficiencies */}
                      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Proficiencies</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <GetWeaponProficiencies value={newRace.weapon_proficiencies} onChange={setWeaponProficiencies} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <GetArmorProficiencies value={newRace.armor_proficiencies} onChange={setArmorProficiencies} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <GetToolProficiencies value={newRace.tool_proficiencies} onChange={setToolProficiencies} />
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Languages */}
                      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Languages</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Autocomplete
                          multiple
                          options={languages}
                          value={newRace.languages}
                          onChange={(_, newValue) => { setLanguages(newValue); }}
                          renderInput={(params) => <TextField {...params} label="Languages" placeholder="Search languages..." />}
                          filterSelectedOptions
                        />
                      </Paper>

                      {/* Race Features */}
                      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Race Features</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <GetClassFeats onChange={setRaceFeats} label={"Race"} />
                      </Paper>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ mt: 2 }}>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleCreateClass} variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RaceSelect;