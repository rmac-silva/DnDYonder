import { useEffect,useState } from "react";
import InventoryItem from "./InventoryItem.jsx";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";

function Inventory({draft, setDraft}) {

    
    const [itemLines, setItemLines] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect( () => {
        setLoading(true);
        //Fetch the inventory items from the draft.class.starting_equipment array.
        var startingItems = draft.class?.starting_equipment;
        var localItemArray = [];
        if(startingItems.length > 0) {
            //There's still starting equipment to add, assuming this is the first time loading the inventory. Set them under misc.items
            draft.misc.inventory = startingItems;
            draft.class.starting_equipment = []; //Clear out starting equipment so we don't re-add them again
            setDraft({...draft});
            
            localItemArray = startingItems; //Since the startingItems will only be available next update
        } else {
            //Simply load the items already present under misc.items
            // console.log("Loading existing inventory items...", draft.misc.inventory);
            localItemArray = draft.misc.inventory;
        } 

        //Join the array elements into a single string for easy editing.
        
        setItemLines(localItemArray);
        
        setLoading(false);
    },[]);


    const handleInventoryChange = (itemName,index) => {
        itemLines[index].name = itemName;
        setItemLines([...itemLines]);
        draft.misc.inventory = itemLines;
        setDraft({...draft});
    }

    const handleRemoveItem = (index) => {
        itemLines.splice(index,1);
        setItemLines([...itemLines]);
        draft.misc.inventory = itemLines;
        setDraft({...draft});

    }

    const handleAddItem = () => {
        itemLines.push({name:""});
        setItemLines([...itemLines]);
    }

    if(loading) {
        return <div className="text-2xl font-bold p-2 mt-6 flex flex-col justify-center border-2 border-gray-400 rounded-md items-center">Loading Inventory...</div>;
    }

    return (
        <div className="p-2 mt-6 flex flex-col justify-center border-2 border-gray-400 rounded-md items-center">
            <h2 className="text-4xl font-bold mb-2">Inventory</h2>
            <h1 className="text-md font-medium ">Double click to edit</h1>
            {/* Button to add a new blank item */}
            <div className="grid  w-full  text-lg grid-cols-2 gap-y-2 mt-4">
            
            {itemLines.map( (item, index) => (
                <div key={index} className="flex w-full items-center ">

                <InventoryItem index={index}  itemName={item.name} onItemNameChange={handleInventoryChange} />
                        <CancelIcon className=" mr-6 -ml-1  !text-red-600 cursor-pointer" fontSize="medium" onClick={() => handleRemoveItem(index)}></CancelIcon>
                </div>
            ))} 
                
            </div>
            <Button className="!mx-20 !mt-4" variant="contained" onClick={handleAddItem} sx={{maxHeight:35}} >
                <AddIcon></AddIcon>
            </Button>
        </div>
    );
}

export default Inventory;