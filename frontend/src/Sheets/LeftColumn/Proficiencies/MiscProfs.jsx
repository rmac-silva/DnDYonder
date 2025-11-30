import React, { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

export default function MiscProfs({ draft = {}, setDraft }) {
  const theme = useTheme();
  
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
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.baseColor.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
}