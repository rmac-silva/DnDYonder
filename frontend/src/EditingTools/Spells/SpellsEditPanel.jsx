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
    Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import { useNotification } from '../../Utils/NotificationContext';


export default function SpellsEditPanel({isOpen, handleClose, spellData}) {
    const { showNotification } = useNotification();
    const [newSpell, setNewSpell] = useState(null);
    const [editingExistingSpell, setEditingExistingSpell] = useState(false);
    const [loadingWikidotData, setLoadingWikidotData] = useState(false);

    useEffect(() => {

        const baseNewSpell = {
            name: "",
            description: "",

            level: -1,
            casting_time: "",
            range: "",
            components: "",
            duration: "",

            school: "None",
            is_ritual: false
        }
        if (spellData === undefined || spellData === null) {
            //new spell
            setEditingExistingSpell(false);
            setNewSpell(baseNewSpell);
        } else {
            //editing existing spell
            setEditingExistingSpell(true);
            setNewSpell(
                {
                    name: spellData.name || "",
                    description: spellData.description || "",

                    level: spellData.level,
                    casting_time: spellData.casting_time || "",
                    range: spellData.range || "",
                    components: spellData.components || "",
                    duration: spellData.duration || "",

                    school: spellData.school || "None",
                    is_ritual: spellData.is_ritual || false
                }
            );
        }
    }, [spellData])

    function CheckRequirements() {
        // Check that all required fields are filled
        if (
            newSpell.name.trim() === "" ||
            newSpell.description.trim() === "" ||
            newSpell.level <= -1 ||
            newSpell.casting_time.trim() === "" ||
            newSpell.range.trim() === "" ||
            newSpell.components.trim() === "" ||
            newSpell.duration.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    async function handleWikidotFetch() {
        setLoadingWikidotData(true);


        if (newSpell.name.trim() === "") {
            showNotification("Please enter a spell name to fetch from Wikidot.", 'error');
            setLoadingWikidotData(false);
            return;
        }

        try {
            // Sanitize the string for URL (replace spaces with underscores)
            var spell_name = newSpell.name.trim().replace(/\s+/g, '_');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/wikidot/spell/${spell_name}`, {
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

    async function handleWikidotData(data) {
        console.log("Wikidot data received:", data);

        newSpell.description = data.description || newSpell.description;
        newSpell.casting_time = data.casting_time || newSpell.casting_time;
        newSpell.range = data.range || newSpell.range;
        newSpell.components = data.components || newSpell.components;
        newSpell.duration = data.duration || newSpell.duration;
        newSpell.level = data.level !== undefined ? data.level : newSpell.level;
        newSpell.school = data.school ? data.school.charAt(0).toUpperCase() + data.school.slice(1) : newSpell.school;
        newSpell.is_ritual = data.is_ritual !== undefined ? data.is_ritual : newSpell.is_ritual;

    }

    function handleSubmit() {
        if(CheckRequirements() === false) {
            showNotification("Please fill in all required fields before submitting the spell.", 'error');
            return;
        }
        handleClose(true, newSpell)
    }


    if(newSpell === null) {
        return <></>;
    }

    return (<>
        <Dialog open={isOpen} onClose={() => handleClose(false)} fullWidth maxWidth="xl">
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">{editingExistingSpell ? "Edit Spell" : "Create New Spell"}</Typography>
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
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                            <TextField
                                required
                                sx={{ minWidth: 280, flex: 1 }}
                                label="Spell Name"
                                variant="outlined"
                                disabled={editingExistingSpell}
                                value={newSpell.name}
                                onChange={(e) => setNewSpell((s) => ({ ...s, name: e.target.value }))}
                            />
                            <TextField
                                required
                                sx={{ minWidth: 180 }}
                                label="Casting Time"
                                variant="outlined"
                                value={newSpell.casting_time}
                                onChange={(e) => setNewSpell((s) => ({ ...s, casting_time: e.target.value }))}
                            />
                            <FormControl sx={{ minWidth: 180 }}>
                                <Select
                                    labelId="spell-level-label"
                                    id="spell-level"
                                    required
                                    value={newSpell.level}
                                    onChange={(e) => setNewSpell((s) => ({ ...s, level: e.target.value }))}
                                >
                                    <MenuItem value={-1}>— Spell Level —</MenuItem>
                                    <MenuItem value={0}>Cantrip (0)</MenuItem>
                                    <MenuItem value={1}>1st Level</MenuItem>
                                    <MenuItem value={2}>2nd Level</MenuItem>
                                    <MenuItem value={3}>3rd Level</MenuItem>
                                    <MenuItem value={4}>4th Level</MenuItem>
                                    <MenuItem value={5}>5th Level</MenuItem>
                                    <MenuItem value={6}>6th Level</MenuItem>
                                    <MenuItem value={7}>7th Level</MenuItem>
                                    <MenuItem value={8}>8th Level</MenuItem>
                                    <MenuItem value={9}>9th Level</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 200 }}>
                                <Select
                                    labelId="spell-school-label"
                                    id="spell-school"
                                    required
                                    value={newSpell.school || 'None'}
                                    onChange={(e) => setNewSpell((s) => ({ ...s, school: e.target.value }))}
                                >
                                    <MenuItem value={"None"}>— Magic School —</MenuItem>
                                    <MenuItem value={"Abjuration"}>Abjuration</MenuItem>
                                    <MenuItem value={"Conjuration"}>Conjuration</MenuItem>
                                    <MenuItem value={"Divination"}>Divination</MenuItem>
                                    <MenuItem value={"Enchantment"}>Enchantment</MenuItem>
                                    <MenuItem value={"Evocation"}>Evocation</MenuItem>
                                    <MenuItem value={"Illusion"}>Illusion</MenuItem>
                                    <MenuItem value={"Necromancy"}>Necromancy</MenuItem>
                                    <MenuItem value={"Transmutation"}>Transmutation</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>

                    {/* Details */}
                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Details</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                            <TextField
                                required
                                sx={{ minWidth: 260, flex: 1 }}
                                label="Components"
                                variant="outlined"
                                value={newSpell.components}
                                onChange={(e) => setNewSpell((s) => ({ ...s, components: e.target.value }))}
                            />
                            <TextField
                                required
                                sx={{ minWidth: 140 }}
                                label="Range"
                                variant="outlined"
                                value={newSpell.range}
                                onChange={(e) => setNewSpell((s) => ({ ...s, range: e.target.value }))}
                            />
                            <TextField
                                required
                                sx={{ minWidth: 200 }}
                                label="Duration"
                                variant="outlined"
                                value={newSpell.duration}
                                onChange={(e) => setNewSpell((s) => ({ ...s, duration: e.target.value }))}
                            />
                            <FormControl sx={{ minWidth: 140 }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="body2">Ritual</Typography>
                                    <Checkbox
                                        checked={newSpell.is_ritual}
                                        onChange={(e) => setNewSpell((s) => ({ ...s, is_ritual: e.target.checked }))}
                                    />
                                </Box>
                            </FormControl>
                        </Box>
                    </Paper>

                    {/* Description */}
                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            required
                            label="Spell Description"
                            variant="outlined"
                            value={newSpell.description}
                            onChange={(e) => setNewSpell((s) => ({ ...s, description: e.target.value }))}
                            multiline
                            rows={Math.min(10, Math.max(3, Math.floor(newSpell.description.length / 100)))}
                        />
                    </Paper>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Tooltip title="Fetches spell information from Wikidot" arrow>
                    <span>
                        <Button
                            onClick={handleWikidotFetch}
                            variant="outlined"
                            color="secondary"
                            startIcon={<CachedIcon />}
                            disabled={loadingWikidotData || !newSpell.name.trim()}
                        >
                            Fetch from Wikidot
                        </Button>
                    </span>
                </Tooltip>

                <Button onClick={() => handleClose(false)} variant="contained" color="error">
                    Cancel
                </Button>
                <Button onClick={() => handleSubmit()} variant="contained" color="primary">
                    {editingExistingSpell ? "Save Changes" : "Create Spell"}
                </Button>
            </DialogActions>
        </Dialog>

    </>);
}