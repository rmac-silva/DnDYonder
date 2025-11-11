import { useState, useEffect } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import CachedIcon from '@mui/icons-material/Cached';

function AddNewSpell({ draft, setDraft, onAdd }) {

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchedSpells, setFetchedSpells] = useState([]);
    const [selectValue, setSelectValue] = useState('');
    const [forceRefresh, setForceRefresh] = useState(true);
    const [creatingNewSpell, setCreatingNewSpell] = useState(false);

    const [loadingWikidotData, setLoadingWikidotData] = useState(false);

    function handleDialogClose() {
        setCreatingNewSpell(false);
        setNewSpell({
            name: "",
            description: "",

            level: -1,
            casting_time: "",
            range: "",
            components: "",
            duration: "",

            school: "None",
            is_ritual: false
        });
    }


    const [newSpell, setNewSpell] = useState({
        name: "",
        description: "",

        level: -1,
        casting_time: "",
        range: "",
        components: "",
        duration: "",

        school: "None",
        is_ritual: false
    });

    useEffect(() => {
        const getSpells = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/info/spells');
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ detail: 'Unknown' }));
                    throw new Error(`HTTP ${res.status} - ${err.detail}`);
                }
                const data = await res.json();
                if (!mounted) return;
                // expecting data.spells or an array
                // console.log('Fetched spells:', data.spells);
                setFetchedSpells(data.spells);
            } catch (err) {
                console.error('Error fetching spells:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        getSpells();
        if(forceRefresh) {
            setForceRefresh(false);
        }
        setMounted(true);
        setLoading(false);
        return () => setMounted(false);
    }, [forceRefresh])

    function CheckRequirements() {
        // Check that all required fields are filled
        if (
            newSpell.name.trim() === "" ||
            newSpell.description.trim() === "" ||
            newSpell.level === -1 ||
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
        

        if(newSpell.name.trim() === "") {
            alert("Please enter a spell name to fetch from Wikidot.");
            setLoadingWikidotData(false);
            return;
        }

        try {
            // Sanitize the string for URL (replace spaces with underscores)
            var spell_name = newSpell.name.trim().replace(/\s+/g, '_');
            const res = await fetch(`http://127.0.0.1:8000/wikidot/spell/${spell_name}`, {
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

    const handleCreateSpell = async () => {


        if (!CheckRequirements()) {
            alert("Please fill in all required fields. (Dropdowns must be selected)");
            return;
        }

        // For now just log; you can POST to backend here and refresh spells afterwards
        console.log('Creating spell:', newSpell);

        // POST to backend
        const payload = {
            'spell': newSpell,
            'token': localStorage.getItem('authToken'),
        }
        const res = await fetch('http://127.0.0.1:8000/info/spells', {
            method: 'POST', // or PUT depending on your API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            alert(`Failed to save spell. Server responded with status ${res.status}.`);
            throw new Error(`Save failed: ${res.status}`);
            
        }

        // close dialog
        setCreatingNewSpell(false);

        // Refresh spells list
        setFetchedSpells([...fetchedSpells, [{ s_name: newSpell.name, s_content: JSON.stringify(newSpell) }]]);
        setForceRefresh(true);
        draft.class.spellcasting.spells_known.push(newSpell);
        setDraft({ ...draft });

    };

    function handleSelectingSpell(event) {
        const selectedSpellName = event.target.value;
        // console.log('Selected spell:', selectedSpellName);

        if (selectedSpellName === "new") {
            // Logic to add a new spell
            setCreatingNewSpell(true);
        } else {
            const selectedSpell = fetchedSpells.find(spell => spell.s_name === selectedSpellName);
            draft.class.spellcasting.spells_known.push(selectedSpell.s_content);
            setDraft({ ...draft });
        }
        onAdd(true);
        setSelectValue('');
    }

    if(!mounted || loading) {
        return <div>Loading spells...</div>;
    }

    return (
        <>
            <FormControl fullWidth variant="standard" margin="normal" sx={{ maxWidth: 350 }} className=''>
                {/* Autocomplete replaces Select but keeps existing logic/values */}
                <Autocomplete
                    freeSolo={false}
                    clearOnEscape
                    disableClearable={false}
                    options={["", "new", ...fetchedSpells.map(s => String(s.s_name))]}
                    value={selectValue}
                    onChange={(_, newValue) => {
                        // keep existing handler signature by synthesizing an event-like object
                        handleSelectingSpell({ target: { value: newValue ?? "" } });
                    }}
                    getOptionLabel={(opt) => {
                        if (opt === "") return "— Select —";
                        if (opt === "new") return "Create New Spell…";
                        return String(opt);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Add a spell..."
                            placeholder=""
                        />
                    )}
                />
            </FormControl>

            <Dialog open={creatingNewSpell} onClose={handleDialogClose} fullWidth maxWidth="xl">

                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Create New Spell</Typography>
                        <IconButton aria-label="close" onClick={handleDialogClose} size="large">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" alignItems="left" gap={0} >

                        <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={2}>

                            <TextField
                                fullWidth
                                required
                                sx={{ ml: 2, maxWidth: 400 }}
                                label="Spell Name"
                                variant="outlined"
                                value={newSpell.name}
                                onChange={(e) => setNewSpell((s) => ({ ...s, name: e.target.value }))}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                required
                                sx={{ maxWidth: 200 }}
                                label="Casting Time"
                                variant="outlined"
                                value={newSpell.casting_time}
                                onChange={(e) => setNewSpell((s) => ({ ...s, casting_time: e.target.value }))}
                                margin="normal"
                            />



                            <Select
                                labelId="spell-level-label"
                                id="spell-level"
                                required

                                sx={{ minWidth: 200, maxHeight: 50 }}
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
                            <Select
                                labelId="spell-level-label"
                                id="spell-level"
                                required

                                sx={{ minWidth: 200, maxHeight: 50 }}
                                value={newSpell.school || ""}
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

                            <Tooltip title="Fetches item information from Wikidot" arrow>
                                                                        <CachedIcon 
                                                                            onClick={handleWikidotFetch} 
                                                                            className={`cursor-pointer ${loadingWikidotData ? 'animate-spin text-gray-400' : 'text-black hover:text-gray-600'}`} 
                                                                            
                                                                        />
                                                                    </Tooltip>

                        </Box>

                        <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={2}>
                            <TextField
                                fullWidth
                                required
                                sx={{ ml: 2, maxWidth: 350 }}
                                label="Components"
                                variant="outlined"
                                value={newSpell.components}
                                onChange={(e) => setNewSpell((s) => ({ ...s, components: e.target.value }))}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                required
                                sx={{ maxWidth: 150 }}
                                label="Range"
                                variant="outlined"
                                value={newSpell.range}
                                onChange={(e) => setNewSpell((s) => ({ ...s, range: e.target.value }))}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                required
                                sx={{ maxWidth: 250 }}
                                label="Duration"
                                variant="outlined"
                                value={newSpell.duration}
                                onChange={(e) => setNewSpell((s) => ({ ...s, duration: e.target.value }))}
                                margin="normal"
                            />
                            {/* A label saying Is Ritual */}
                            <Typography required variant="body1">Is Ritual:</Typography>
                            <Checkbox required checked={newSpell.is_ritual} onChange={(e) => setNewSpell((s) => ({ ...s, is_ritual: e.target.checked }))} sx={{ ml: -2 }} />
                        </Box>

                        <TextField
                            fullWidth
                            required
                            sx={{ ml: 2, maxWidth: 1000 }}
                            label="Spell Description"
                            variant="outlined"
                            value={newSpell.description}
                            onChange={(e) => setNewSpell((s) => ({ ...s, description: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={Math.min(10, Math.max(3, Math.floor(newSpell.description.length / 100)))} //Number of rows depending on description length
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                          <Button onClick={handleDialogClose}>Cancel</Button>
                          <Button onClick={handleCreateSpell} variant="contained" color="primary">
                            Create
                          </Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default AddNewSpell;