import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const AddFeatureDialog = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');

  const clear = () => { setTitle(''); setLevel(''); setDescription(''); };

  const handleCancel = () => {
    clear();
    onClose?.();
  };

  const handleAdd = () => {
    const lvl = parseInt(level || '0', 10);
    if (!title || Number.isNaN(lvl) || lvl < 0) return;
    const newFeat = {
      id: `userfeat-${Date.now()}`,
      name: title,
      level_requirement: lvl,
      description: description || '',
      source: 'custom',
    };
    onAdd?.(newFeat);
    clear();
    onClose?.();
  };

  return (
    <Dialog open={!!open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Create Feature</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField
            label="Level Requirement"
            type="number"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            inputProps={{ min: 0 }}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={6}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>Add Feature</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFeatureDialog;