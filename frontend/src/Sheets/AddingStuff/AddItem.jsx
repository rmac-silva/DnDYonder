/** This class will be responsible for creating an item: Armor, Tool or Weapon. It will serve as an abstraction
 * Since the weapons might have different properties than armor or tools, we will need to create subclasses for each type of item.
 */

import { React, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ItemCache from '../Inventory/ItemCache';

const AddItem = ({ onAddItem, isOpen, itemTypeDefault }) => {
    const [itemType, setItemType] = useState(itemTypeDefault || 'Weapon'); // Default to 'Weapon'

    const emptyTool = {
        name: '', description: '', weight: '', cost: '',
        features: [],
    }
    const [newTool, setNewTool] = useState(emptyTool);

    const emptyWeapon = {
        name: '', description: '', weight: '', cost: '',
        features: [],
        attacks: [{
            damage: '',
            damage_type: [],
        }],
        range: '',
        properties: [],
    }
    const [newWeapon, setNewWeapon] = useState(emptyWeapon);

    const weaponProperties = [
        "Ammunition", "Finesse", "Heavy", "Light", "Loading", "Range", "Reach", "Special", "Thrown", "Two-Handed", "Versatile"
    ];

    const damageTypes = [
        "Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"
    ];

    const emptyArmor = {
        name: '', description: '', weight: '', cost: '',
        features: [],
        armor_class: '',
        armor_type: '',
        stealth_disadvantage: false,
        strength_requirement: 0,
    }
    const [newArmor, setNewArmor] = useState(emptyArmor);

    const validateItem = (item) => {
        // Check if the item has a name and description
        if (!item.name || !item.description) {
            return false;
        }

        // Additional validation logic can go here

        return true;
    }

    const saveNewItemToBackend = async (item) => {

        const payload = {
            'item': item,
            'type': itemType,
            'token': localStorage.getItem('authToken'),
        }
        console.log(item);
        const res = await fetch('http://127.0.0.1:8000/info/save_item', {
            method: 'POST', // or PUT depending on your API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Save failed: ${res.status}`);
        } else {
            ItemCache.ForceCacheRefresh();//Update the cache after adding a new item
        }

    }


    const CreateItem = async () => {

        console.log("Creating item", itemType);
        if (itemType === 'Weapon' && validateItem(newWeapon)) {

            await saveNewItemToBackend(newWeapon);
            onAddItem(newWeapon);
            setNewWeapon(emptyWeapon);

        }
        else if (itemType === 'Armor' && validateItem(newArmor)) {
            await saveNewItemToBackend(newArmor);
            onAddItem(newArmor);
            setNewArmor(emptyArmor);
        }
        else if (itemType === 'Tool' || itemType === "Misc." && validateItem(newTool)) {
            await saveNewItemToBackend(newTool);
            onAddItem(newTool);
            setNewTool(emptyTool);
        }

        

    };

    const updateActiveItem = (value) => {
        if (itemType === 'Weapon') {
            setNewWeapon((s) => ({ ...s, ...value })); //Take the current state S, copy it and update with the value overwriting any duplicate fields
        }
        else if (itemType === 'Armor') {
            setNewArmor((s) => ({ ...s, ...value }));
        }
        else if (itemType === 'Tool' || itemType === "Misc.") {
            setNewTool((s) => ({ ...s, ...value }));
        }
    }

    // Helpers specifically for attacks array (keeps component code cleaner)
    const addAttack = () => {
        const updated = [...newWeapon.attacks, { damage: '', damage_type: [] }];
        updateActiveItem({ attacks: updated });
    };

    const updateAttackAt = (index, partial) => {
        const updated = newWeapon.attacks.map((a, i) => i === index ? { ...a, ...partial } : a);
        updateActiveItem({ attacks: updated });
    };

    const removeAttackAt = (index) => {
        const updated = newWeapon.attacks.filter((_, i) => i !== index);
        updateActiveItem({ attacks: updated });
    };

    return (<>
        <Dialog open={isOpen} onClose={() => onAddItem(null)} fullWidth maxWidth="lg">
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Create New Item</Typography>
                    <IconButton aria-label="close" onClick={() => onAddItem(null)} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
                    <FormControl sx={{ minWidth: 250 }}>
                        <InputLabel id="item-type-label">Item Type</InputLabel>
                        <Select
                            labelId="item-type-label"
                            id="item-type-select"
                            value={itemType}
                            label="Item Type"
                            onChange={(e) => setItemType(e.target.value)}
                        >
                            <MenuItem value="Weapon">Weapon</MenuItem>
                            <MenuItem value="Tool">Tool</MenuItem>
                            <MenuItem value="Armor">Armor</MenuItem>
                            <MenuItem value="Misc.">Misc.</MenuItem>
                        </Select>
                    </FormControl>

                    {/**Item name, Item description, weight and cost */}
                    <FormControl sx={{ minWidth: 230 }}>

                        <TextField
                            label="Item Name"
                            variant="outlined"
                            value={itemType === 'Weapon' ? newWeapon.name : itemType === 'Armor' ? newArmor.name : newTool.name}
                            onChange={(e) => updateActiveItem({ name: e.target.value })}
                            required={true}
                            size="large"
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: 130, width: 130 }}>
                        <TextField
                            label="Weight (Lb)"
                            variant="outlined"
                            value={itemType === 'Weapon' ? newWeapon.weight : itemType === 'Armor' ? newArmor.weight : newTool.weight}
                            onChange={(e) => updateActiveItem({ weight: e.target.value })}
                            size="large"
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: 130, width: 130 }}>
                        <TextField
                            label="Cost (Gp)"
                            variant="outlined"
                            value={itemType === 'Weapon' ? newWeapon.cost : itemType === 'Armor' ? newArmor.cost : newTool.cost}
                            onChange={(e) => updateActiveItem({ cost: e.target.value })}
                            size="large"
                        />
                    </FormControl>
                </Box>

                <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
                    <FormControl sx={{ minWidth: 800, width: '100%' }}>
                        <TextField
                            label="Item Description"
                            variant="outlined"
                            required
                            value={itemType === 'Weapon' ? newWeapon.description : itemType === 'Armor' ? newArmor.description : newTool.description}
                            onChange={(e) => updateActiveItem({ description: e.target.value })}
                            size="large"
                        />
                    </FormControl>
                </Box>

                {itemType === 'Weapon' &&

                    <Box display="flex" flexDirection="column" gap={2} alignItems="stretch" mt={2} mb={2}>
                        

                        {/* other weapon fields: range & properties */}
                        <Box display="flex" gap={2} alignItems="center" mt={0}>
                            <FormControl sx={{ minWidth: 160, width: 160 }}>
                                <TextField
                                    label="Range"
                                    variant="outlined"
                                    value={newWeapon.range}
                                    onChange={(e) => updateActiveItem({ range: e.target.value })}
                                    size="large"
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: 240 }}>
                                <Autocomplete
                                    multiple
                                    options={weaponProperties}
                                    value={newWeapon.properties}
                                    onChange={(_, newValue) => { updateActiveItem({ properties: newValue }); }}
                                    disableClearable={false}
                                    renderInput={(params) => <TextField {...params} label="Weapon Properties" placeholder="Search Prop..." />}
                                    filterSelectedOptions
                                />
                            </FormControl>
                        </Box>

                        {/* Attacks list: each attack has damage + damage_type (multiple) */}
                        <Typography variant="subtitle1">Attacks</Typography>
                        {newWeapon.attacks.map((attack, idx) => (
                            <Box key={idx} display="flex" gap={2} alignItems="center" p={1} border="1px solid #e0e0e0" borderRadius={1}>
                                <FormControl sx={{ minWidth: 200 }}>
                                    <TextField
                                        label={`Damage (1d6)`}
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

                                <Box display="flex" alignItems="center">
                                    <IconButton size="small" onClick={() => removeAttackAt(idx)} aria-label="remove-attack">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}

                        <Box display="flex" justifyContent="center" mt={1}>
                            <Button variant="outlined" color="primary" onClick={addAttack}>
                                Add New Attack
                            </Button>
                        </Box>
                    </Box>
                }

                {itemType === 'Armor' &&

                    <Box display="flex" gap={2} alignItems="center" mt={2} mb={2}>
                        <FormControl sx={{ minWidth: 160, width: 160 }}>
                            <TextField
                                label="Armor Class (AC)"
                                variant="outlined"
                                value={newArmor.armor_class}
                                onChange={(e) => updateActiveItem({ armor_class: e.target.value })}
                                size="large"
                            />
                        </FormControl>
                        <FormControl sx={{ minWidth: 250 }}>
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
                        <FormControl sx={{ minWidth: 160, width: 160 }}>
                            <TextField
                                label="Strength Requirement"
                                variant="outlined"
                                value={newArmor.strength_requirement}
                                onChange={(e) => updateActiveItem({ strength_requirement: e.target.value })}
                                size="large"
                            />
                        </FormControl>
                        <Typography>Stealth Disadvantage:</Typography>
                        <Checkbox
                            checked={newArmor.stealth_disadvantage}
                            onChange={(e) => updateActiveItem({ stealth_disadvantage: e.target.checked })}
                        />
                    </Box>
                }

                {/* Features */}
                <Box display="flex" flexDirection="column" gap={2} alignItems="stretch" mt={2} mb={2}>
                    <Typography variant="h6" gutterBottom>
                        Features
                    </Typography>
                    {(itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features).map((feature, index) => (
                        <Box key={index} display="flex" flexDirection="column" gap={1} p={2} border="1px solid #ccc" borderRadius="8px">
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                    onClick={() => {
                                        const updatedFeatures = (itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features).filter((_, i) => i !== index);
                                        updateActiveItem({ features: updatedFeatures });
                                    }}
                                    size="small"
                                    aria-label="delete"
                                >
                                    <CloseIcon className='text-red-500' />
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
                        <button
                            onClick={() => {
                                const updatedFeatures = [
                                    ...(itemType === 'Weapon' ? newWeapon.features : itemType === 'Armor' ? newArmor.features : newTool.features),
                                    { name: '', description: '' }
                                ];
                                updateActiveItem({ features: updatedFeatures });
                            }}
                            className="bg-blue-500 font-semibold text-white"
                            style={{
                                padding: '10px 20px',
                                border: '2px solid #ccc',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            Add New Feature
                        </button>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center" mt={2}>
                    <button
                        onClick={() => { CreateItem(); }}
                        className="bg-green-600 text-2xl font-extrabold mt-4 text-white"
                        style={{
                            padding: '10px 20px',
                            border: '2px solid #ccc',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        Create
                    </button>
                </Box>

            </DialogContent>
        </Dialog>
    </>);
};

export default AddItem;