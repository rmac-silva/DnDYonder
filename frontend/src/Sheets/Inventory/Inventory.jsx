import { useEffect,useState } from "react";
import InventoryItem from "./InventoryItem.jsx";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import COLORS from '../../constants/colors.js';

function Inventory({draft, setDraft}) {

    
    const [itemLines, setItemLines] = useState(GetStartingItems());
    const [loading, setLoading] = useState(true);


    function GetStartingItems() {
        var formattedItems = [];

        if(draft.class.starting_equipment == null || draft.class.starting_equipment.length === 0) {
            // console.log("No starting equipment found. Using previously stored inventory items: ", draft.misc.inventory);
            return draft.misc.inventory;
        } else {

            draft.class.starting_equipment.forEach( (itemEntry) => {
                // console.log("Processing starting equipment itemEntry: ", itemEntry);
    
                //Transforms entries like Any Martial Weapon, Shield into [Martial Weapon], [Shield]
                itemEntry.name.split(",").forEach( (itemName) => {
                    var trimmedName = itemName.trim();
                    if(trimmedName.length > 0) {
                        // console.log("Adding starting equipment item: ", trimmedName);
                        formattedItems.push({name:trimmedName});
                    }
                }); 
            });

            draft.class.starting_equipment = []; //Clear starting equipment so it doesn't get re-added on next load
            setDraft({...draft});

        }

        // console.log("Formatted starting equipment items: ", formattedItems);
        draft.misc.inventory = formattedItems;
        setDraft({...draft});
        return formattedItems;
    }

    useEffect( () => {
        setLoading(true);      
        
        setItemLines(GetStartingItems());
        
        setLoading(false);
    },[]);


    const handleInventoryChange = (itemName,index) => {
        itemLines[index].name = itemName;
        setItemLines([...itemLines]);
        draft.misc.inventory = itemLines;
        setDraft({...draft});
    }

    const handleRemoveItem = (index) => {
        console.log("Removing item at index ", index, "Items: ", itemLines);
        if (window.confirm(`Are you sure you want to remove ${itemLines[index].name}?`)) {
        itemLines.splice(index,1);
        setItemLines([...itemLines]);
        draft.misc.inventory = itemLines;
        setDraft({...draft});
        }

    }

    const handleAddItem = () => {
        itemLines.push({name:""});
        setItemLines([...itemLines]);
    }

    if(loading) {
        return <div className="text-2xl font-bold p-2 mt-6 flex flex-col justify-center border-2 rounded-xl items-center shadow-sm" style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary, color: COLORS.secondary}}>Loading Inventory...</div>;
    }

    return (
        <div className="p-4 mt-6 flex flex-col justify-center border-2 rounded-xl items-center shadow-sm transition-shadow duration-200" style={{borderColor: COLORS.accent, backgroundColor: COLORS.primary}}>
            <h2 className="text-4xl font-bold mb-2" style={{color: COLORS.secondary}}>Inventory</h2>
            <h1 className="text-md font-medium" style={{color: COLORS.secondary}}>Double click to edit</h1>
            {/* Button to add a new blank item */}
            <div className="grid  w-full  text-lg grid-cols-2 gap-y-2 mt-4">
            
            {itemLines.map( (item, index) => (
                <div key={index} className="flex w-full items-center ">

                <InventoryItem index={index}  itemName={item.name} onItemNameChange={handleInventoryChange} />
                        <CancelIcon className=" mr-6 -ml-1 cursor-pointer" fontSize="medium" style={{color: COLORS.accent}} onClick={() => handleRemoveItem(index)}></CancelIcon>
                </div>
            ))} 
                
            </div>
            <Button 
                className="!mx-20 !mt-4" 
                variant="contained" 
                onClick={handleAddItem} 
                sx={{
                    maxHeight: 35,
                    backgroundColor: COLORS.accent,
                    color: COLORS.primary,
                    '&:hover': {
                        backgroundColor: COLORS.accentHover,
                    },
                }}
            >
                <AddIcon></AddIcon>
            </Button>
        </div>
    );
}

export default Inventory;