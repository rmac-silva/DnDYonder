import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

export default function MiscProfs({ draft = {}, setDraft }) {
  const theme = useTheme();
  
  const [proficiencies, setProficiencies] = useState('');

  const handleChange = () => {
    let lines = proficiencies.split('\n').map(l => l.trim()).filter(l => l.length);
    draft.misc = draft.misc || {};
    draft.misc.proficiencies = lines;
    setDraft({ ...draft });
  };

  useEffect(() => {
    let mergedProfs = (draft?.misc?.proficiencies || []).join('\n');
    setProficiencies(mergedProfs);
  }, [draft]);

  return (
    <Box mt={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' }, fontWeight: 700, mb: 1 }}>
        Other Proficiencies
      </Typography>

      <Paper variant="" sx={{ width: '100%' }}>
        <Box sx={{ p: 0 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder='No additional proficiencies. You can add your own here.'
            value={proficiencies}
            onChange={(e) => {setProficiencies(e.target.value);}}
            onBlur={handleChange}
            variant="outlined"
            InputProps={{
              sx: {
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                lineHeight: 1.4,
                padding: { xs: '8px', sm: '10px' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.baseColor?.main || '#ddd',
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
        </Box>
      </Paper>
    </Box>
  );
}