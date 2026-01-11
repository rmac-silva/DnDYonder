import React from 'react';
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Button,
    Stack,
    Paper,
    Divider,
    Tooltip,
    Checkbox,
    Grid,
    Autocomplete,
    InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import GetWeaponProficiencies from '../../Sheets/Lists/WeaponProficiencies';
import GetArmorProficiencies from '../../Sheets/Lists/ArmorProficiencies';
import GetToolProficiencies from '../../Sheets/Lists/ToolProficiencies';
import GetClassFeats from '../../Sheets/Lists/ClassFeature';
import { useNotification } from '../../Utils/NotificationContext.jsx';

export default function RaceEditPanel({ isOpen, handleClose, raceData }) {

    const [newRace, setNewRace] = useState(null);
    const [editingExistingRace, setEditingExistingRace] = useState(false);
    const [errorField, setErrorField] = useState('');
    const { showNotification } = useNotification();

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

    const joinName = (race, subrace) => {
        if (subrace && subrace.trim() !== '') {
            return `${subrace.trim()} ${race.trim()}`;
        }
        return race.trim(); 
    }

    useEffect(() => {

        const baseNewRace = {
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
        }

       

        if (raceData === undefined || raceData === null) {
            //new race
            setEditingExistingRace(false);
            setNewRace(baseNewRace);
        } else {
            //editing existing race
            setEditingExistingRace(true);
            setNewRace(
                {
                    old_name: joinName(raceData.race, raceData.subrace), //Useful for knowing what the old entry was called
                    race: raceData.race || '',
                    subrace: raceData.subrace || '',
                    creature_type: raceData.creature_type || '',
                    size: raceData.size || '',
                    speed: raceData.speed || 30,
                    armor_proficiencies: raceData.armor_proficiencies || [], //Some races have innate proficiencies
                    weapon_proficiencies: raceData.weapon_proficiencies || [], //Some races have innate proficiencies
                    tool_proficiencies: raceData.tool_proficiencies || [], //Some races have innate proficiencies

                    languages: raceData.languages || ["Common"],
                    race_features: raceData.race_features || [],
                }
            );
        }
    }, [raceData])

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

    function validateNewRace() {
        if (newRace.race.trim() === '') {
            showNotification("Race name is required.", 'error');
            setErrorField('race');
            return false;
        }
        if (newRace.creature_type.trim() === '') {
            showNotification("Creature type is required.", 'error');
            setErrorField('creature_type');
            return false;
        }
        if (newRace.size.trim() === '') {
            showNotification("Size is required.", 'error');
            setErrorField('size');
            return false;
        }
        if (isNaN(parseInt(newRace.speed)) || parseInt(newRace.speed) <= 0) {
            showNotification("Speed must be a positive number.", 'error');
            setErrorField('speed');
            return false;
        }

        //Check if the race has no features, warn the user but allow it
        if (newRace.race_features.length === 0) {
            if (!window.confirm("The race has no features. Are you sure you want to create it?")) {
                return false;
            }
        }

        setErrorField('');
        return true;
    }



    function handleSubmit() {
        if (validateNewRace() === false) {
            showNotification("Please fill in all required fields before submitting the race.", 'error');
            return;
        }
        handleClose(true, newRace)
    }


    if (newRace === null) {
        return <></>;
    }

    return (<>


        <Dialog open={isOpen} onClose={() => handleClose(false)} fullWidth maxWidth="xl">
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Create New Race</Typography>
                    <IconButton aria-label="close" onClick={() => handleClose(false)} size="large">
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
                        <GetClassFeats onChange={setRaceFeats} objectFeatures={newRace.race_features} />
                    </Paper>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
                <Button onClick={() => handleSubmit()} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </>);
}