import { React, useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const GetClassFeats = ({ onChange, label }) => {


  // This listing is used in a new class, where no class features are defined yet.
  // Since classes do not share feats, we don't need to fetch them from the database.
  const [classFeatures, setClassFeatures] = useState([]);

  const updateActiveClassFeats = (value, propagate = false) => {
    setClassFeatures(value); //Take the current state S, copy it and update with the value overwriting any duplicate fields
    if(propagate) {
      onChange(value); //Propagate the change to the parent component
    }
  }

  return (<>
    <Box display="flex" flexDirection="column" gap={2} alignItems="stretch" mt={2} mb={2}>
      <Typography variant="h6" gutterBottom>
        {label} Features
      </Typography>
      {classFeatures.map((feature, index) => (
        <Box key={index} display="flex" flexDirection="column" gap={1} p={2} border="1px solid #ccc" borderRadius="8px">

          {/* Delete icon */}
          
          
          {/* Feature name */}
          <div className='flex  space-x-2'>

          <TextField
            label={`Feature ${index + 1} Name`}
            variant="outlined"
            value={feature.name}
            onChange={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, name: e.target.value } : f //If the index matches, we change the feature F with the new name. Otherwise we leave it as is
            );
            updateActiveClassFeats( updatedFeatures ); //Update the state with the new array
            }}
            onBlur={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, name: e.target.value } : f //If the index matches, we change the feature F with the new name. Otherwise we leave it as is
            );
            updateActiveClassFeats( updatedFeatures,true ); //Update the state with the new array
            }}
            size="medium"
            className='w-1/2 !mr-2'
            />

          {/* Level requirement */}
          <TextField
            label={`Level Requirement`}
            type='number'
            variant="outlined"
            value={feature.level_requirement}
            onChange={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, level_requirement: e.target.value } : f //If the index matches, we change the feature F with the new name. Otherwise we leave it as is
            );
            updateActiveClassFeats( updatedFeatures ); //Update the state with the new array
          }}
          onBlur={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, level_requirement: e.target.value } : f //If the index matches, we change the feature F with the new name. Otherwise we leave it as is
            );
            updateActiveClassFeats( updatedFeatures,true ); //Update the state with the new array
            }}
          size="medium"
          className='w-1/8'
          />

          <Box display="flex" justifyContent="flex-end">
            <IconButton
              onClick={() => {
                const updatedFeatures = classFeatures.filter((_, i) => i !== index); //Returns all elements except the one with the current index. 
                updateActiveClassFeats(updatedFeatures); //We then set the classFeatures to this new array, without the selected one.
              }}
              
              aria-label="delete"
            >
              <CloseIcon className='absolute left-125 bottom-5 text-red-500 !text-4xl' />
            </IconButton>
          </Box>
          </div>

          {/* Feature Description */}
          <TextField
            label={`Feature ${index + 1} Description`}
            variant="outlined"
            value={feature.description}
            onChange={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, description: e.target.value } : f
              );
              
              updateActiveClassFeats(updatedFeatures);
            }}
            onBlur={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, description: e.target.value } : f //If the index matches, we change the feature F with the new name. Otherwise we leave it as is
            );
            updateActiveClassFeats( updatedFeatures,true ); //Update the state with the new array
            }}
            size="small"
            multiline
            rows={3}
          />

          {/* Feature Benefits:
            TODO - The benefits will have a set of keyords that the user can select from.
            For example, at low levels a druid can select two skill proficiencies from a list.
            This would be a CHOOSE_FROM_LIST type of benefit, with amount = 2.
            But then we would have to be able to understand we are choosing skill proficiencies,
            and then automatically add them to the character sheet. This is too complex for now.

            However, for subclasses, we can have a simple benefit keyword that's just SUBCLASS_SELECTION 
            that prompts the user to select a subclass when they reach the required level.

            This brings up the question, how do users define subclasses? Answer: In the menu
            where they select the subclass, when they reach the appropriate level, we can have
            an "Add New Subclass" button that allows them to define a new subclass, which would
            then add the appropriate features and proficiencies automatically.

            Another fixed benefit could be "SPELLCASTING" which would automatically add
            spellcasting ability and spells known to the character sheet. It would basically 
            show the spellcasting section in the character sheet.

            So for now, we will just leave this as TODO. But in the future it will 
            be a select dropdown menu
            */}
          {/* <TextField
            label={`Feature ${index + 1} Benefits`}
            variant="outlined"
            value={feature.benefits}
            onChange={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, benefits: e.target.value } : f
              );
              updateActiveClassFeats(updatedFeatures);
            }}
              onBlur={(e) => {
              const updatedFeatures = classFeatures.map((f, i) =>
                i === index ? { ...f, benefits: e.target.value } : f //If the index matches, we change the feature F with the new name. Otherwise we leave it as is
            );
            updateActiveClassFeats( updatedFeatures,true ); //Update the state with the new array
            }}
            size="small"
            multiline
            rows={2}
          /> */}

        </Box>
      ))}
      <Box display="flex" justifyContent="center" mt={2}>
        <button
          onClick={() => {
            const updatedFeatures = [
              ...classFeatures,
              { name: '', description: '', level_requirement: 0, benefits: []}
            ];
            updateActiveClassFeats( updatedFeatures );
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
  </>)
}

export default GetClassFeats;