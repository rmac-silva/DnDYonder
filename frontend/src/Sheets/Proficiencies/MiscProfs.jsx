import React, { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function MiscProfs({ draft = {}, setDraft }) {
  // Instead of "Loading" the proficiencies, when selecting the class these will just be added to the variable draft.misc.proficiencies.
  //This prevents overwriting user input, leaving it to the player to define and manage the old proficiencies if they change class.
  // const tool = draft.class?.tool_proficiencies || [];
  // const weaponRaw = draft.class?.weapon_proficiencies || [];

   // exclusions for weapon list
  // const exclusions = new Set(['simple weapons', 'martial weapons']);

  // const normalize = (s) => String(s ?? '').trim();

  // const weaponFiltered = weaponRaw
  //   .map(normalize) //Turn all to lowercase
  //   .filter((s) => s.length > 0 && !exclusions.has(s.toLowerCase())); //Exclude all empty and simple/martial weapon proficiencie
  

   // Merge + dedupe (case-insensitive, preserve original casing from first occurrence)
  // const merged = [...tool, ...weaponFiltered];
  

  // const placeholderText =
  //   merged.length > 0 ? merged.join('\n') : 'No additional proficiencies. You can add your own here.';

  // local editable value (starts empty so placeholder is visible)
  const [proficiencies, setProficiencies] = useState('');

  const handleChange = () => {

    let lines = proficiencies.split('\n')
    draft.misc.proficiencies = lines;
    setDraft({ ...draft });
    
  };

  useEffect(() => {
    var mergedProfs = "";
    draft?.misc?.proficiencies?.forEach(prof => {
      mergedProfs += prof + "\n";
    });
    setProficiencies(mergedProfs.trim());
  }, []);
  

  const loadProficiencies = () => {
    /*When you select a class, change draft.misc.proficiencies to include the tool and weapon proficiencies. This should only be done
    upon class select. Making it even more relevant to select the class prior to editing the sheet.

    For now just load whatever is stored on the sheet.
    But a question surges, how do we remove the old ones if we change class? We might delete stuff the player has 
    written. */
  }

  return (
    <Box mt={4} className='flex flex-col items-center !w-full'>
      <Typography className='!text-2xl !font-semibold' >
        Other Proficiencies
      </Typography>

      <Paper variant="" className="!w-full" >
        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder='No additional proficiencies. You can add your own here.'
          value={proficiencies}
          onChange={(e) => {setProficiencies(e.target.value);}}
          onBlur={handleChange}
          variant="outlined"
        />
      </Paper>
    </Box>
  );
}