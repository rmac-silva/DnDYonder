import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import GetClassFeats from '../../Sheets/Lists/ClassFeature';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SubclassEditPanel({ dialogOpen, editedSubclass, onSubmit }) {
    const [readyToCreate, setReadyToCreate] = useState(false);
    const [error, setError] = useState(null);
    const [loadingWikidotData, setLoadingWikidotData] = useState(false);
    const [newSubclass, setNewSubclass] = useState({ });
    const [editingExistingSubclass, setEditingExistingSubclass] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    // Initialize form state when dialog opens or when editedSubclass changes
    useEffect(() => {

        const baseSubclass = {
            name: "",
            class_name: '',
            description: "",
            selected: true,
            level: 0,
            features: [],
        };

        if (!editedSubclass) {
            setEditingExistingSubclass(false);
            setNewSubclass(baseSubclass);
            setReadyToCreate(false);
        } else {
            console.log("Editing existing subclass:", editedSubclass);
            setEditingExistingSubclass(true);
            setNewSubclass({
                name: editedSubclass.name || "",
                old_subclass_name: editedSubclass.name || "",
                class_name: editedSubclass.class_name || '',
                description: editedSubclass.description || "",
                selected: editedSubclass.selected ?? true,
                level: editedSubclass.level ?? 0,
                features: editedSubclass.features || [],
            });
            setReadyToCreate(true);
        }
    }, [editedSubclass, dialogOpen]);

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

    function saveChanges() {
        if (!validateSubclass()) {
            return;
        }

        onSubmit(true, newSubclass);
    }

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
        setNewSubclass((s) => ({ ...s, features: value }));
    }



    return (
        <>
            <Dialog open={dialogOpen} onClose={() => onSubmit(false)} fullWidth maxWidth="xl">
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{editedSubclass ? "Editing Subclass" : "Creating New Subclass"}</Typography>
                        <IconButton aria-label="close" onClick={() => onSubmit(false)} size="large">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    {/* Large input for the class name */}
                    <div className="flex flex-col ">

                        <TextField
                            sx={{ minWidth: 300, maxWidth: 300 }}
                            error={error === "class_name"}
                            className="!-mb-2"
                            label="Class Name"
                            variant="outlined"
                            required
                            disabled={editingExistingSubclass}
                            value={newSubclass.class_name}
                            onChange={(e) => (setNewSubclass((s) => ({ ...s, class_name: e.target.value })), setReadyToCreate(e.target.value.trim() !== ""))}
                            margin="normal"
                        />
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
                <Typography variant="h6">Subclass Features</Typography>
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
                    onChange={SetSubclassFeatures}
                    objectFeatures={newSubclass.features}
                  />
                )}
              </AccordionDetails>
            </Accordion>
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
                    <Button variant="outlined" color="error" onClick={() => onSubmit(false)}>Cancel</Button>
                    <Button onClick={() => saveChanges()} disabled={!readyToCreate} variant="contained" color="primary">
                        {editedSubclass ? "Save Changes" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}