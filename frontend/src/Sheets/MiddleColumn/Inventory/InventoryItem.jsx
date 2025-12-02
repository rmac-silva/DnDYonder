import { useState, useEffect } from 'react';
import { getItem, getAll } from './ItemCache.js';
import Popover from '@mui/material/Popover';
import ItemHoverInformation from './ItemHoverInformation.jsx';
import TextField from '@mui/material/TextField';
import {  useTheme } from '@mui/material';
function InventoryItem({ itemName, index, onItemNameChange }) {
    const theme = useTheme();
    const [name, setName] = useState(itemName || "");
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);

    //Item hovering
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [onMobile, setOnMobile] = useState(false);

    const handlePopoverOpen = () => {
        setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setOnMobile(true);
        } else {
            setOnMobile(false);
        }

        setLoading(true);
        const itemData = getItem(itemName.split("(")[0].trim());
        if (itemData) {
            setItemData(itemData);
        }

        // console.log("Items in cache:", getAll());
        setLoading(false);
    }, []);

    function handleNameChange(value) {
        setName(value);

        //Check if the new name exists in the ItemCache
        const data = getItem(value.split("(")[0].trim());
        if (data) {
            setItemData(data);
        } else {
            setItemData(null);
        }
    }

    if (loading) {
        return <div>Loading item...</div>;
    }

    return (
        <div className='w-full mr-2'>
            <TextField
                id={`item-${index}`}
                variant="outlined"
                fullWidth
                className='!mb-1'
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => {onItemNameChange(name,index)}}
                onClick={handlePopoverClose}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.baseColor.main, // default border
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main, // hover
                                },

                            },
                        }}
            />
            {itemData && !onMobile &&
                <Popover
                    id={`item-${index}`}
                    sx={{ pointerEvents: 'none', maxWidth: '80vw' }}
                    open={popoverOpen}
                    anchorEl={document.getElementById(`item-${index}`)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <ItemHoverInformation itemName={name} content={itemData} />
                </Popover>
            }
        </div>
    )


}

export default InventoryItem;