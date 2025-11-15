import React, { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext.jsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

function CreateNewSheet({onUpdate}) {
  const [isHovered, setIsHovered] = useState(false);
  const [shareLink, setShareLink] = useState("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const { authUsername } = useAuth();

  const handleImport = async (string) => {
    
    //Convert to HTML safe text
    var shareLinkSafe = string.replace(':','-')
    var payload = {"username":authUsername};
    try {
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/import/${shareLinkSafe}`, {
                method: 'POST', // or PUT depending on your API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(`Import failed: ${res.status}`);

            //Close the dialog
            handleCloseShareDialog();

            //Refresh the page to show the new sheet
            onUpdate();

        } catch (error) {
            console.error('delete error', error);
            throw error;
        }

  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
    setShareLink("");
  }

  async function handleInput(e) {
    setShareLink(e.target.value);
    
    var content = e.target.value.split(":");
    if(content[0].length === 64 && content[1].length > 0) {
      console.log("Valid share code detected, attempting import...");
      //Try to automatically import the sheet
      await handleImport(e.target.value);
    }
  }

  return (<>
    <Dialog
      open={shareDialogOpen}
      onClose={handleCloseShareDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Shareable Link
        <IconButton
          onClick={handleCloseShareDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 1,
          wordBreak: 'break-all',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {/* Input where we will write the share code */}
          <TextField
            value={shareLink}
            fullWidth
            variant="outlined"
            label="Shareable Link"
            onChange={(e) => {handleInput(e);}}
          >

          </TextField>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseShareDialog} variant='outlined'>Close</Button>
      </DialogActions>
    </Dialog>

    <Box
      className="group !w-48 !h-62 !mx-4 !rounded-xl !flex !flex-col !items-center !justify-center"
      style={{ backgroundColor: '#1b1b1b' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ width: 96, height: 96, marginTop: 20 }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

          <Typography variant="h5" component="div" sx={{ fontWeight: 600, mt: 2 }}>
            New
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Sheet
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 2,
          }}
        >
          <Button
            component={RouterLink}
            to="/NewSheet"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              width: '100%',
              color: 'white',
              borderColor: 'white',

            }}
          >
            Create New
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => setShareDialogOpen(true)}
            sx={{
              width: '100%',
              color: 'white',
              borderColor: 'white',

            }}
          >
            Import
          </Button>
        </Box>
      )}
    </Box>
  </>
  );
}

export default CreateNewSheet;