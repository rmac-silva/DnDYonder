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
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

function AddNewSpell({ draft, setDraft, onAdd }) {

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchedSpells, setFetchedSpells] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const [forceRefresh, setForceRefresh] = useState(true);
  const [creatingNewSpell, setCreatingNewSpell] = useState(false);

  const [loadingWikidotData, setLoadingWikidotData] = useState(false);

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

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

  const wipeSpellData = () => {
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
    })
  }

  useEffect(() => {
    const getSpells = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/info/spells`);
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
    if (forceRefresh) {
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


    if (newSpell.name.trim() === "") {
      alert("Please enter a spell name to fetch from Wikidot.");
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

  const handleCreateSpell = async () => {


    if (!CheckRequirements()) {
      alert("Please fill in all required fields. (Dropdowns must be selected)");
      return;
    }

    console.log('Creating spell:', newSpell);
    newSpell.name = newSpell.name.trim().toLowerCase();
    const payload = {
      'spell': newSpell,
      'token': localStorage.getItem('authToken'),
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/info/spells`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert(`Failed to save spell. Server responded with status ${res.status}.`);
      throw new Error(`Save failed: ${res.status}`);
    }

    setCreatingNewSpell(false);

    // ✅ Create new array reference
    const updatedSpells = [...(draft.class.spellcasting.spells_known || []), newSpell];
    setDraft({
      ...draft,
      class: {
        ...draft.class,
        spellcasting: {
          ...draft.class.spellcasting,
          spells_known: updatedSpells
        }
      }
    });

    // Update fetched spells list for the dropdown
    setFetchedSpells([...fetchedSpells, { s_name: newSpell.name, s_content: newSpell }]);

    wipeSpellData();
    setForceRefresh(true);
    onAdd(true);
  };

  function handleSelectingSpell(event) {
    const selectedSpellName = event.target.value.toLowerCase();
   
    if (selectedSpellName === "" || selectedSpellName === null || selectedSpellName === undefined) {
      console.log("Selected invalid spell or none.")
      return;
    }

    if (selectedSpellName === "< new spell >") {
      // Logic to add a new spell
      setCreatingNewSpell(true);
    } else {
      console.log("Selected existing spell:", selectedSpellName, " searching in: ", fetchedSpells);
      const selectedSpell = fetchedSpells.find(spell => spell.s_name === selectedSpellName);

      //Check if the selected spell is already in the draft
      const alreadyAdded = draft.class.spellcasting.spells_known.find(s => s.name === selectedSpell.s_name);

      if (!alreadyAdded) {
        console.log("Adding spell to draft:", selectedSpell);
        draft.class.spellcasting.spells_known.push(selectedSpell.s_content);
        setDraft({ ...draft });
      } else {
        alert("This spell is already on your spell list.");
      }
    }
    onAdd(true);
    setSelectValue('');
  }

  if (!mounted || loading) {
    return <div>Loading spells...</div>;
  }

  return (
    <>
      <FormControl
        fullWidth
        variant="standard"
        margin="normal"
        sx={{
          width: '100%',
          maxWidth: '100%',
          ml: { xs: 0, sm: 0, md: 5 } // keep desktop spacing only
        }}
        className=''
      >
        <Autocomplete
          fullWidth
          clearOnEscape
          disableClearable={false}
          options={["", "< New Spell >", ...fetchedSpells.map(s => titleCase(String(s.s_name)))]}
          value={selectValue}
          onChange={(_, newValue) => {
            handleSelectingSpell({ target: { value: newValue ?? "" } });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
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

          <Button onClick={handleDialogClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button onClick={handleCreateSpell} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddNewSpell;