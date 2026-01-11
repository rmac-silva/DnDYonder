/** This class will be responsible for creating an item: Armor, Tool or Weapon. It will serve as an abstraction
 * Since the weapons might have different properties than armor or tools, we will need to create subclasses for each type of item.
 */

import { React, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useNotification } from '../../Utils/NotificationContext.jsx';
import CachedIcon from '@mui/icons-material/Cached';
import Tooltip from '@mui/material/Tooltip';
import { Paper, Divider, Stack } from '@mui/material';

const EditItem = ({ onClose, isOpen, itemType, item }) => {
  const [loadingWikidotData, setLoadingWikidotData] = useState(false);

  const [newTool, setNewTool] = useState({
    name: '', description: '', weight: '', cost: '', features: [],
  });
  const [newWeapon, setNewWeapon] = useState({
    name: '', description: '', weight: '', cost: '',
    features: [], attacks: [], range: '', properties: [],
  });
  const [newArmor, setNewArmor] = useState({
    name: '', description: '', weight: '', cost: '',
    features: [], armor_class: '', armor_type: '', stealth_disadvantage: false, strength_requirement: 0,
  });

  const { showNotification } = useNotification();

  const weaponProperties = [
        "Ammunition", "Finesse", "Heavy", "Light", "Loading", "Range", "Reach", "Special", "Thrown", "Two-Handed", "Versatile"
    ];

    const damageTypes = [
        "Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"
    ];

  // Populate when dialog opens or when itemType/item changes
  useEffect(() => {
    if (!isOpen) return;
    if (!item) {
      // reset for create mode
      setNewWeapon({ name: '', description: '', weight: '', cost: '', features: [], attacks: [], range: '', properties: [] });
      setNewArmor({ name: '', description: '', weight: '', cost: '', features: [], armor_class: '', armor_type: '', stealth_disadvantage: false, strength_requirement: 0 });
      setNewTool({ name: '', description: '', weight: '', cost: '', features: [] });
      return;
    }
    if (itemType === 'Weapon') {
      setNewWeapon({ name: item?.name || '', description: item?.description || '', weight: item?.weight || '', cost: item?.cost || '', features: item?.features || [], attacks: item?.attacks || [], range: item?.range || '', properties: item?.properties || [] });
    } else if (itemType === 'Armor') {
      setNewArmor({ name: item?.name || '', description: item?.description || '', weight: item?.weight || '', cost: item?.cost || '', features: item?.features || [], armor_class: item?.armor_class || '', armor_type: item?.armor_type || '', stealth_disadvantage: !!item?.stealth_disadvantage, strength_requirement: item?.strength_requirement ?? 0 });
    } else {
      setNewTool({ name: item?.name || '', description: item?.description || '', weight: item?.weight || '', cost: item?.cost || '', features: item?.features || [] });
    }
  }, [isOpen, itemType, item]);

  const validateItem = (item) => {
    // Check if the item has a name and description
    if (!item.name || !item.description) {
      showNotification("Item must have a name and description.", 'error');
      return false;
    }

    if (itemType === 'Weapon') {
      // Additional weapon-specific validation
      if (!item.attacks || item.attacks.length === 0) {
        showNotification("Weapon must have at least one attack.", 'error');
        return false;
      }
    }

    // Additional validation logic can go here

    return true;
  }

  const saveEditedItemToBackend = async (payloadItem) => {
    const payload = { item: payloadItem, type: itemType, token: localStorage.getItem('authToken') };
    const url = item ? '/info/edit_item' : '/info/save_item'; // create vs edit
    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      showNotification(`Error saving item: HTTP ${res.status} - ${errorData.detail || 'Unknown error'}`, 'error');
      throw new Error(`Save failed: ${res.status}`);
    } else {
      onClose(true);
    }
  }

  const SaveItem = async () => {
    console.log("Saving item... ", itemType);
    if (itemType === 'Weapon' && validateItem(newWeapon)) {
      await saveEditedItemToBackend(newWeapon);
      if (!item) setNewWeapon({ name: '', description: '', weight: '', cost: '', features: [], attacks: [], range: '', properties: [] });
    } else if (itemType === 'Armor' && validateItem(newArmor)) {
      await saveEditedItemToBackend(newArmor);
      if (!item) setNewArmor({ name: '', description: '', weight: '', cost: '', features: [], armor_class: '', armor_type: '', stealth_disadvantage: false, strength_requirement: 0 });
    } else if ((itemType === 'Tool' || itemType === 'Misc.') && validateItem(newTool)) {
      await saveEditedItemToBackend(newTool);
      if (!item) setNewTool({ name: '', description: '', weight: '', cost: '', features: [] });
    }
  };

  const updateActiveItem = (value) => {
    if (itemType === 'Weapon') setNewWeapon((s) => ({ ...s, ...value }));
    else if (itemType === 'Armor') setNewArmor((s) => ({ ...s, ...value }));
    else setNewTool((s) => ({ ...s, ...value }));
  };

  // Helpers specifically for attacks array (keeps component code cleaner)
  const addAttack = () => setNewWeapon((s) => ({ ...s, attacks: [...(s.attacks || []), { damage: '', damage_type: [] }] }));
  const updateAttackAt = (index, partial) =>
    setNewWeapon((s) => ({ ...s, attacks: s.attacks.map((a, i) => (i === index ? { ...a, ...partial } : a)) }));
  const removeAttackAt = (index) =>
    setNewWeapon((s) => ({ ...s, attacks: s.attacks.filter((_, i) => i !== index) }));

  async function handleWikidotFetch() {
    setLoadingWikidotData(true);
    var item_name = ""

    if (itemType === 'Weapon') {
      item_name = newWeapon.name;
    }
    else if (itemType === 'Armor') {
      item_name = newArmor.name;
    }
    else if (itemType === 'Tool' || itemType === "Misc.") {
      item_name = newTool.name;
    } else {
      setLoadingWikidotData(false);
      return;
    }

    try {
      // Sanitize the string for URL (replace spaces with underscores)
      item_name = item_name.trim().replace(/\s+/g, '_');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/wikidot/item/${item_name}`, {
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
    if (!data || Object.keys(data).length === 0) {
      showNotification("No data found on Wikidot for this item.", 'error');
      return;
    }

    if (itemType === 'Weapon') {
      setNewWeapon((s) => ({
        ...s,
        range: data.range || s.range || '',
        description: data.description || s.description || '',
        weight: data.weight ?? s.weight ?? '',
        cost: data.cost ?? s.cost ?? '',
        properties: Array.isArray(data.properties) ? data.properties : s.properties,
        attacks: Array.isArray(data.attacks) ? data.attacks : s.attacks,
      }));
    } else if (itemType === 'Armor') {
      setNewArmor((s) => ({
        ...s,
        armor_class: data.armor_class ?? s.armor_class ?? '',
        armor_type: data.armor_type ?? s.armor_type ?? '',
        description: data.description || s.description || '',
        stealth_disadvantage: !!(data.stealth_disadvantage ?? s.stealth_disadvantage),
        strength_requirement: data.strength_requirement ?? s.strength_requirement ?? 0,
        weight: data.weight ?? s.weight ?? '',
        cost: data.cost ?? s.cost ?? '',
      }));
    } else {
      setNewTool((s) => ({
        ...s,
        description: data.description || s.description || '',
        weight: data.weight ?? s.weight ?? '',
        cost: data.cost ?? s.cost ?? '',
      }));
    }
  }

  if(!isOpen){ 
    return null;
  }

  return (<>
    <Dialog open={isOpen} onClose={() => onClose(false)} fullWidth maxWidth="lg">
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            {item === null && (

            <Typography variant="h6">Creating New Item</Typography>
            )}
            {item !== null && (

            <Typography variant="h6">Editing '{item.name}'</Typography>
            )}
          <IconButton aria-label="close" onClick={() => onClose(false)} size="large">
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
              <FormControl sx={{ minWidth: 260, flex: 1 }}>
                <TextField
                  label="Item Type"
                  variant="outlined"
                  value={itemType}
                  disabled
                  size="medium"
                />
              </FormControl>

              <FormControl sx={{ minWidth: 260, flex: 1 }}>
                <TextField
                  label="Item Name"
                  variant="outlined"
                  disabled={item ? true : false}   // editable in create mode
                  value={itemType === 'Weapon' ? newWeapon.name : itemType === 'Armor' ? newArmor.name : newTool.name}
                  onChange={(e) => updateActiveItem({ name: e.target.value })}
                  required
                  size="medium"
                />
              </FormControl>

              <FormControl sx={{ minWidth: 140 }}>
                <TextField
                  label="Weight (Lb)"
                  variant="outlined"
                  value={itemType === 'Weapon' ? newWeapon.weight : itemType === 'Armor' ? newArmor.weight : newTool.weight}
                  onChange={(e) => updateActiveItem({ weight: e.target.value })}
                  size="medium"
                  loading={loadingWikidotData}
                />
              </FormControl>

              <FormControl sx={{ minWidth: 140 }}>
                <TextField
                  label="Cost (Gp)"
                  variant="outlined"
                  value={itemType === 'Weapon' ? newWeapon.cost : itemType === 'Armor' ? newArmor.cost : newTool.cost}
                  onChange={(e) => updateActiveItem({ cost: e.target.value })}
                  size="medium"
                  loading={loadingWikidotData}
                />
              </FormControl>
            </Box>

            <Box mt={2}>
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  label="Item Description"
                  variant="outlined"
                  required
                  value={itemType === 'Weapon' ? newWeapon.description : itemType === 'Armor' ? newArmor.description : newTool.description}
                  onChange={(e) => updateActiveItem({ description: e.target.value })}
                  size="medium"
                  multiline
                  minRows={3}
                  loading={loadingWikidotData}
                />
              </FormControl>
            </Box>
          </Paper>

          {/* Weapon Details */}
          {itemType === 'Weapon' && (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Weapon Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl sx={{ minWidth: 160 }}>
                  <TextField
                    label="Range"
                    variant="outlined"
                    value={newWeapon.range}
                    onChange={(e) => updateActiveItem({ range: e.target.value })}
                    size="medium"
                    loading={loadingWikidotData}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 260, flex: 1 }}>
                  <Autocomplete
                    multiple
                    options={weaponProperties}
                    value={newWeapon.properties}
                    onChange={(_, newValue) => { updateActiveItem({ properties: newValue }); }}
                    disableClearable={false}
                    renderInput={(params) => <TextField {...params} label="Weapon Properties" placeholder="Search properties..." />}
                    filterSelectedOptions
                    loading={loadingWikidotData}
                  />
                </FormControl>
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>Attacks</Typography>
              <Stack spacing={1}>
                {newWeapon.attacks.map((attack, idx) => (
                  <Box key={idx} display="flex" gap={2} alignItems="center" p={1} border="1px solid #e0e0e0" borderRadius={1} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 200 }}>
                      <TextField
                        label={`Damage (e.g. 1d6)`}
                        variant="outlined"
                        value={attack.damage ?? ''}
                        onChange={(e) => updateAttackAt(idx, { damage: e.target.value })}
                        size="medium"
                      />
                    </FormControl>

                    <FormControl sx={{ minWidth: 300, flex: 1 }}>
                      <Autocomplete
                        multiple
                        options={damageTypes}
                        value={attack.damage_type ?? []}
                        onChange={(_, newValue) => updateAttackAt(idx, { damage_type: newValue })}
                        disableClearable={false}
                        renderInput={(params) => <TextField {...params} label="Damage Type(s)" placeholder="Select damage types" />}
                        filterSelectedOptions
                      />
                    </FormControl>

                    <IconButton size="small" onClick={() => removeAttackAt(idx)} aria-label="remove-attack">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Box display="flex" justifyContent="center" mt={2}>
                <Button variant="outlined" color="primary" onClick={addAttack}>
                  Add New Attack
                </Button>
              </Box>
            </Paper>
          )}

          {/* Armor Details */}
          {itemType === 'Armor' && (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Armor Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl sx={{ minWidth: 180 }}>
                  <TextField
                    label="Armor Class (AC)"
                    variant="outlined"
                    value={newArmor.armor_class}
                    onChange={(e) => updateActiveItem({ armor_class: e.target.value })}
                    size="medium"
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel id="armor-type-label">Armor Type</InputLabel>
                  <Select
                    labelId="armor-type-label"
                    id="armor-type-select"
                    value={newArmor.armor_type}
                    label="Armor Type"
                    onChange={(e) => updateActiveItem({ armor_type: e.target.value })}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Heavy">Heavy</MenuItem>
                    <MenuItem value="Shield">Shield</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                  <TextField
                    label="Strength Requirement"
                    variant="outlined"
                    value={newArmor.strength_requirement}
                    onChange={(e) => updateActiveItem({ strength_requirement: e.target.value })}
                    size="medium"
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newArmor.stealth_disadvantage}
                      onChange={(e) => updateActiveItem({ stealth_disadvantage: e.target.checked })}
                    />
                  }
                  label="Stealth Disadvantage"
                />
              </Box>
            </Paper>
          )}

          {/* Features */}
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Features</Typography>
            <Divider sx={{ mb: 2 }} />
            {(itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features).map((feature, index) => (
              <Box key={index} display="flex" flexDirection="column" gap={1} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    onClick={() => {
                      const updatedFeatures = (itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features).filter((_, i) => i !== index);
                      updateActiveItem({ features: updatedFeatures });
                    }}
                    size="small"
                    aria-label="delete"
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </Box>

                <TextField
                  label={`Feature ${index + 1} Name`}
                  variant="outlined"
                  value={feature.name}
                  onChange={(e) => {
                    const updatedFeatures = (itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features).map((f, i) =>
                      i === index ? { ...f, name: e.target.value } : f
                    );
                    updateActiveItem({ features: updatedFeatures });
                  }}
                  size="small"
                />
                <TextField
                  label={`Feature ${index + 1} Description`}
                  variant="outlined"
                  value={feature.description}
                  onChange={(e) => {
                    const updatedFeatures = (itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features).map((f, i) =>
                      i === index ? { ...f, description: e.target.value } : f
                    );
                    updateActiveItem({ features: updatedFeatures });
                  }}
                  size="small"
                  multiline
                  rows={4}
                />
              </Box>
            ))}

            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  const updatedFeatures = [
                    ...(itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features),
                    { name: '', description: '' }
                  ];
                  updateActiveItem({ features: updatedFeatures });
                }}
              >
                Add New Feature
              </Button>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Tooltip title="Fetches item information from Wikidot" arrow>
          <span>
            <Button
              onClick={handleWikidotFetch}
              variant="outlined"
              color="secondary"
              disabled={loadingWikidotData || !(itemType === 'Weapon' ? newWeapon.name : itemType === 'Armor' ? newArmor.name : newTool.name)}
              startIcon={<CachedIcon />}
            >
              Fetch from Wikidot
            </Button>
          </span>
        </Tooltip>

        <Button onClick={() => onClose(false)} variant="contained" color="error">
          Cancel
        </Button>
        <Button onClick={() => { SaveItem(); }} variant="contained" color="primary">
          {item ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  </>);
};

export default EditItem;