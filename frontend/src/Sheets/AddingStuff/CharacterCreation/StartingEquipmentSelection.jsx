import { React,useState,useEffect} from 'react';
import Button from '@mui/material/Button';
function StartingEquipmentSelection({ sheet, setSheet, onValid, selectedItems, setSelectedItems }) {

    

    useEffect(() => {
        // Initialize item choices from sheet, to help manage which items are selected
        const options = sheet.class.starting_equipment_choices;

        if(!options || options.length === 0) {
            onValid(true); //No choices to be made, so it's valid
            return;
        }

        // Map over the options to create the initial state
        const initialSelectedItems = options.map(itemSet =>
            itemSet.map(itemOption => {
            const nameCounts = itemOption.reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + 1;
                return acc;
            }, {});
            const joinedName = Object.entries(nameCounts)
                .map(([name, count]) => (count > 1 ? `${name} (${count})` : name))
                .join(", ");
            return { name: joinedName, selected: false };
            })
        );

        // Set the selected items state
        setSelectedItems(initialSelectedItems);
    }, [sheet.class.starting_equipment_choices]);

    const allChoicesMade = () => {
        var allMade = true;
        //Chekcs if all item sets have a selected item
        selectedItems.forEach(itemSet => {
            
            const hasSelected = itemSet.some(item => (item.selected === true)); //Checks if an element of an array has a certain element
           
            if (!hasSelected) {
                
                allMade = false; //You can't just return true here because you're inside a function scope for each element in the array. That's why it wanted to do a forloop instead.
            }
        })

        return allMade;
    }

    const handleOptionSelect = (setIndex, optionIndex) => {

        //The set that was changed
        var updatedSet = selectedItems[setIndex];

        //The selected item from the set
        var selectedItem = updatedSet[optionIndex];

        //Check if the clicked option was selected
        if (selectedItem.selected) {
            //Deselect it
            selectedItem.selected = false;

            //Remove it from the sheet starting equipment. Remove only 1 instance in case of duplicates
            var removed = false;
            sheet.class.starting_equipment = sheet.class.starting_equipment.filter(i => {
                if (i.name === selectedItem.name && !removed) {
                    removed = true;
                    return false;
                }
                return true;
            });

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
        //Update the form validity
        onValid(allChoicesMade());
        //Update the selected items state
        selectedItems[setIndex] = updatedSet;
        setSelectedItems([...selectedItems]);
        
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
                        {item.map((options, optionIndex) => (
                            <div key={optionIndex}>
                                <Button
                                    
                                    variant={options.selected ? 'contained' : 'outlined'}
                                    onClick={() => { handleOptionSelect(setIndex, optionIndex) }}
                                >
                                    {options.name}
                                </Button>
                                {optionIndex < item.length - 1 && <span className='ml-2'> or </span>}
                            </div>
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