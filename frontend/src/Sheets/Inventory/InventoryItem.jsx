import { useState, useEffect } from 'react';
import { getItem, getAll } from './ItemCache.js';
import Popover from '@mui/material/Popover';
import ItemHoverInformation from './ItemHoverInformation.jsx';
import TextField from '@mui/material/TextField';
function InventoryItem({ itemName, index, onItemNameChange }) {
    const [name, setName] = useState(itemName || "");
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);

    //Item hovering
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handlePopoverOpen = () => {
        setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };

    useEffect(() => {
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
                                backgroundColor: '#edeae8',
                                '& fieldset': {
                                    borderColor: '#db7f3d',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#c46d2f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#c46d2f',
                                },
                            },
                }}
            />
            {itemData &&
                <Popover
                    id={`item-${index}`}
                    sx={{ 
                        pointerEvents: 'none', 
                        maxWidth: '80vw',
                        '& .MuiPaper-root': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            border: 'none',
                        },
                    }}
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