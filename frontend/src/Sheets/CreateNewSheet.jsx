import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

function CreateNewSheet() {
    // return (
    //     <div className="bg-slate-300 w-58 h-72 mx-4 rounded flex flex-col items-center justify-center">
    //         <Button className='w-full h-full flex flex-col items-center justify-center' href='/NewSheet'>

    //         <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mt-5 block w-full">
    //             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    //         </svg>
    //         <div className='text-3xl'>New</div>
    //         <div className='text-3xl'>Sheet</div>
    //         </Button>
    //     </div>

    // )

    return (
    <Box
      className="!bg-slate-400/50 !w-48 !h-62 !mx-4 !rounded !flex !flex-col !items-center !justify-center"
    >
      <Button
        component={RouterLink}
        to="/NewSheet"
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'none',
          p: 0,
          gap: 1,
          color: 'inherit',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-24 h-24 mt-5 block w-full"
          style={{ width: 96, height: 96, marginTop: 20 }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          New
        </Typography>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Sheet
        </Typography>
      </Button>
    </Box>
  );
}

export default CreateNewSheet