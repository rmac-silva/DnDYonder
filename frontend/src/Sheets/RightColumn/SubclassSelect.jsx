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
import CachedIcon from '@mui/icons-material/Cached';

import GetClassFeats from "../Lists/ClassFeature";


function SubclassSelect({ draft, setDraft }) {
  const [loadingWikidotData, setLoadingWikidotData] = useState(false);
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

  async function handleWikidotFetch() {
    setLoadingWikidotData(true);

    try {

      const res = await fetch(`${import.meta.env.VITE_API_URL}/wikidot/subclass/${newSubclass.class_name}/${encodeURIComponent(newSubclass.name)}`, {
        method: 'GET',
      });

      const data = await res.json();
      console.log("Wikidot fetch response data:", data);
      handleWikidotData(data);

    } catch (error) {
      setLoadingWikidotData(false);
      console.error("Error fetching subclass from Wikidot:", error);
      return;
    }


    setLoadingWikidotData(false);
    return;
  }

  function handleWikidotData(data) {
    // Process and set the fetched Wikidot data into newSubclass
    var new_subclass_features = [];
    for (const [key, value] of Object.entries(data)) {
      var content = value.content || "";
      if (value.tables && value.tables.length > 0) {
        //Append some text informing there's a table that will be shown later
        content += "\n\n[Table data available, it will be shown in the sheet.]";
      }

      var new_feature = {
        name: key,
        description: content,
        tables: value.tables || [],
        level_requirement: value.level_required || newSubclass.level,
        benefits: []
      };
      console.log("Adding new feature: ", new_feature);
      new_subclass_features.push(new_feature);
    }

    console.log("Parsed subclass features from Wikidot:", new_subclass_features);

    SetSubclassFeatures(new_subclass_features);
  }

  const SetSubclassFeatures = (value) => {
    newSubclass.features = value;
    setNewSubclass({ ...newSubclass });
  }

  useEffect(() => {
    let mounted = true;
    const getSubclasses = async () => {
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
    getSubclasses();
    if (forceRefresh) setForceRefresh(false);
    return () => {
      mounted = false;
    };
  }, [forceRefresh]);

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

    if (!validateSubclass()) {
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
        <Typography className='text-lg !font-semibold'>
          Tip: Normally subclass URLs don't have the same format as their name. For example, "Oath of the Ancients" is just "paladin:ancients" in the URL. So be sure to open the Wikidot subclass page,
          and give the subclass name exactly as it appears in the page URL after the colon if you want to fetch from wikidot successfully.
        </Typography>
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
          <GetClassFeats onChange={SetSubclassFeatures} objectFeatures={newSubclass.features} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleWikidotFetch}
          variant="outlined"
          color="secondary"
          disabled={loadingWikidotData}
          startIcon={<CachedIcon />}
          sx={{ mr: 1 }}
        >
          Fetch from Wikidot
        </Button>
        <Button variant="outlined" color="error" onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleCreateSubclass} disabled={!readyToCreate} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  </>);
}

export default SubclassSelect;