import { React,useState,useEffect} from 'react';
import Button from '@mui/material/Button';
function StartingEquipmentSelection({ sheet, setSheet }) {

    const [selectedItems, setSelectedItems] = useState([]); // [ [ {name: "item1", selected: false}, {name: "item2", selected: true} ], [ {...} ] ]

    useEffect(() => {
        // Initialize item choices from sheet, to help manage which items are selected
        const options = sheet.class.starting_equipment_choices;

        // Map over the options to create the initial state
        const initialSelectedItems = options.map(itemSet =>
            itemSet.map(itemOption => ({ name: itemOption.name, selected: false }))
        );

        // Set the selected items state
        setSelectedItems(initialSelectedItems);
    }, [sheet.class.starting_equipment_choices]);

    const handleOptionSelect = (setIndex, optionIndex) => {

        //The set that was changed
        var updatedSet = selectedItems[setIndex];

        //The selected item from the set
        var selectedItem = updatedSet[optionIndex];

        //Check if the clicked option was selected
        if (selectedItem.selected) {
            //Deselect it
            selectedItem.selected = false;

            //Remove it from the sheet starting equipment
            sheet.class.starting_equipment = sheet.class.starting_equipment.filter(i => i.name !== selectedItem.name);

            setSheet({ ...sheet });
        } else {
            //Remove the previously selected item from this set from the sheet starting equipment, if it exists
            var previouslySelected = updatedSet.find(i => i.selected);
            if (previouslySelected) {
                sheet.class.starting_equipment = sheet.class.starting_equipment.filter(i => i.name !== previouslySelected.name);
            }

            //Deselect any other selected option in the set
            for (let i = 0; i < updatedSet.length; i++) {
                updatedSet[i].selected = false;
            }

            //Select the clicked option
            updatedSet[optionIndex].selected = true;

            //Add it to the sheet starting equipment
            sheet.class.starting_equipment.push({ name: selectedItem.name });

            //Update the sheet state
            setSheet({ ...sheet });
        }

        //Update the selected items state
        selectedItems[setIndex] = updatedSet;
        setSelectedItems([...selectedItems]);
        console.log("Sheet Status:", sheet);
    }

    return (<>
        <div className='flex-col mt-4'>
            <div className='mt-2 mb-2 font-semibold text-2xl'>
                Select Your Starting Equipment:
            </div>
            <div className='flex flex-col !space-x-2 mt-4'>

                {/* Item choices */}

                {/* For each set of item choices */}
                {selectedItems.map((item, setIndex) => (
                    <div key={setIndex} className='flex flex-row space-x-2 align-center mb-2'>
                        {/* Create a button for each option in the set. When clicked check if any other option in the set is selected, if so deselect it and select this one. */}
                        {item.map((option, optionIndex) => (
                            <>
                                <Button
                                    key={optionIndex}
                                    variant={option.selected ? 'contained' : 'outlined'}
                                    onClick={() => { handleOptionSelect(setIndex, optionIndex) }}
                                >
                                    {option.name}
                                </Button>
                                {optionIndex < item.length - 1 && <span className='ml-2'> or </span>}
                            </>
                        ))}
                    </div>
                ))}

                {/* Guaranteed or fixed starting items */}
                <div className="mt-4">
                    <span className='font-semibold text-xl'>Starting Equipment:</span>
                {sheet.class?.starting_equipment.map((item, index) => (
                    <div key={index} className='mt-2'>
                        <li>
                        
                        <span className='font-semibold'>{item.name}</span> 
                
                        </li>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </>)
}

export default StartingEquipmentSelection;