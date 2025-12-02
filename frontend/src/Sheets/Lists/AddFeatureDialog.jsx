import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Paper, Typography, Divider, Stack } from '@mui/material';

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
    <Dialog open={!!open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Create Feature</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Basics</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Level Requirement"
                type="number"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                inputProps={{ min: 0 }}
                sx={{ minWidth: 160 }}
                required
              />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={6}
              fullWidth
            />
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="contained" color="error">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleAdd} disabled={!title.trim()}>
          Add Feature
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFeatureDialog;