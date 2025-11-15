import { useEffect, useState } from "react";

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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import GetClassFeats from "./Lists/ClassFeature";


function SubclassSelect({ draft, setDraft }) {
  const [loading, setLoading] = useState(true);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [readyToCreate, setReadyToCreate] = useState(false);

  const [fetchedSubclasses, setFetchedSubclasses] = useState([]);
  const [creatingNewSubclass, setCreatingNewSubclass] = useState(false);
  const [error, setError] = useState(null);
  const [newSubclass, setNewSubclass] = useState({
    name: "",
    class_name: draft.class.class_name,
    description: "",
    selected: true,
    level: draft.class.subclass.level,
    features: [],
  });

  const SetSubclassFeatures = (value) => {
    newSubclass.features = value;
    setNewSubclass({ ...newSubclass });
  }

  useEffect(() => {
    let mounted = true;
    const getClasses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/info/subclasses/${draft.class.class_name}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: 'Unknown' }));
          throw new Error(`HTTP ${res.status} - ${err.detail}`);
        }
        const data = await res.json();
        if (!mounted) return;
        // expecting data.classes or an array
        
        newSubclass.class_name = draft.class.class_name;
        setFetchedSubclasses(data.subclasses);
      } catch (err) {
        console.error('Error fetching subclasses:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getClasses();
    if (forceRefresh) setForceRefresh(false);
    return () => {
      mounted = false;
    };
  }, [ forceRefresh, newSubclass]);



  const handleChangingSubclass = (e) => {
    const val = e.target.value;
    if (val === 'new') {
      // open dialog for creating a class
      setCreatingNewSubclass(true);
      return;
    }

    // Set the subclass features onto the draft. 
    const selectedSubclass = fetchedSubclasses.find((sc) => sc.c_name === val);
    draft.class.subclass = selectedSubclass.c_content;
    setDraft({ ...draft });

    // Set the draft.class.subclass.selected = true so it shows the new information
  };

  function validateSubclass() {

    // Ensure the subclass has a name
    if (newSubclass.name.trim() === "") {
      alert("Subclass must have a name.");
      setError("name");
      return false;
    }
    
    //Check if it has features
    if (newSubclass.features.length === 0) {
      alert("Subclass must have at least one feature.");
      setError("features");
      return false;
    }

    //Check if all features have required_level
    for (const feat of newSubclass.features) {
      if (feat.level_requirement === undefined || feat.level_requirement === null || feat.level_requirement < 0) {
        alert(`Feature "${feat.name}" must have a required level.`);
        setError("features");
        return false;
      }
    }

    setError(null);
    return true;
  }

  const handleCreateSubclass = async () => {
    // Add the new subclass to the database
    
      if(!validateSubclass()) {
        return;
      }

      // POST to backend
      const payload = {
        'subclass': newSubclass,
        'token': localStorage.getItem('authToken'),
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/info/subclasses`, {
        method: 'POST', // or PUT depending on your API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Save failed: ${res.status}`);
      }

      // On success, set the draft to use the new subclass
      draft.class.subclass = newSubclass;
      setDraft({ ...draft });
      setCreatingNewSubclass(false);
    };

    const handleDialogClose = () => {
      setCreatingNewSubclass(false);
      // reset newSubclass state if desired
      setNewSubclass({
        name: "",
        class_name: draft.class.class_name,
        description: "",
        selected: true,
        level: draft.class.subclass.level,
        features: [],
      });
    };

    return (<>



      {/* //Button for selecting a subclass if none selected */}
      {draft.class.subclass.selected === false &&
        <FormControl fullWidth variant="standard" margin="normal">
          <InputLabel id="class-select-label">Subclass</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={''}
            onChange={handleChangingSubclass}
            disabled={loading}
          >
            <MenuItem value="">— Select —</MenuItem>
            <MenuItem value="new">Add New Subclass…</MenuItem>
            {fetchedSubclasses.map((cls) => (
              <MenuItem key={`class-${cls.c_name}`} value={String(cls.c_name)}>
                {cls.c_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }

      <Dialog open={creatingNewSubclass} onClose={handleDialogClose} fullWidth maxWidth="xl">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Create New Subclass</Typography>
            <IconButton aria-label="close" onClick={handleDialogClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* Large input for the class name */}
          <div className="flex flex-col ">

            <TextField
              sx={{ minWidth: 300, maxWidth: 300 }}
              error={error === "name"}
              className="!-mb-2"
              label="Subclass Name"
              variant="outlined"
              required
              value={newSubclass.name}
              onChange={(e) => (setNewSubclass((s) => ({ ...s, name: e.target.value })), setReadyToCreate(e.target.value.trim() !== ""))}
              margin="normal"
            />
            <TextField
              sx={{ minWidth: 900 }}

              label="Description"
              variant="outlined"
              value={newSubclass.description}
              onChange={(e) => setNewSubclass((s) => ({ ...s, description: e.target.value }))}
              margin="normal"
            />
          </div>
          <Box mt={2}>
            <GetClassFeats label={"Subclass"} onChange={SetSubclassFeatures} object={newSubclass} objectFeatures={newSubclass.features}/>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateSubclass} disabled={!readyToCreate} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>);
  }

  export default SubclassSelect;