import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";


export default function MainProfs({ draft = {} }) {
  // Defensive access: ensure arrays and normalize to lowercase for robust matching
  const armorProfsRaw = draft.class?.armor_proficiencies || [];
  const weaponProfsRaw = draft.class?.weapon_proficiencies || [];

  const armorProfs = armorProfsRaw.map((s) => String(s).toLowerCase());
  const weaponProfs = weaponProfsRaw.map((s) => String(s).toLowerCase());

  const hasArmor = (name) => armorProfs.includes(name.toLowerCase());
  const hasWeapon = (name) => weaponProfs.includes(name.toLowerCase());

  // Support slight name variations (Shield vs Shields)
  const hasShields = () =>
    armorProfs.includes('shield') || armorProfs.includes('shields');

  return (
    <Box mt={4} className='flex flex-col items-center'>
      <Typography className='!text-3xl !font-semibold' gutterBottom>
        Proficiencies
      </Typography>

      <Paper variant="outlined" className='w-full' sx={{ p: 2 }}>
        <Box
          component="section"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap={2}
          alignItems="start"
        >
          {/* Column 1 */}
          <Box display="flex" flexDirection="column" gap={1}>
            {/* <FormControlLabel
            
              control={<Checkbox checked={hasArmor('Light Armor')}  />}
              label="Light Armor"
            /> */}
            <div className='flex mb-4'>
              <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={hasArmor('Light Armor')} 
                readOnly
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: "#1f1f1f",
                  },
                }}
              />
              <div className="mx-1 font-medium text-gray-600 text-center focus-visible:outline-none">Light Armor</div>
            </div>

            <div className='flex mb-4'>
              <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={hasArmor('Medium Armor')} 
                readOnly
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: "#1f1f1f",
                  },
                }}
              />
              <div className="mx-1 font-medium text-gray-600 text-center focus-visible:outline-none">Medium Armor</div>
            </div>
            <div className='flex mb-4'>
              <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={hasArmor('Heavy Armor')} 
                readOnly
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: "#1f1f1f",
                  },
                }}
              />
              <div className="mx-1 font-medium text-gray-600 text-center focus-visible:outline-none" >Heavy Armor</div>
            </div>
          </Box>

          {/* Column 2 */}
          <Box display="flex" flexDirection="column" gap={1}>
            <div className='flex mb-4'>
              <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={hasWeapon('Simple Weapons')} 
                readOnly
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: "#1f1f1f",
                  },
                }}
              />
              <div className="mx-1 font-medium text-gray-600 text-center focus-visible:outline-none">Simple Weapons</div>
            </div>

            <div className='flex mb-4'>
              <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={hasWeapon('Martial Weapons')} 
                readOnly
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: "#1f1f1f",
                  },
                }}
              />
              <div className="mx-1 font-medium text-gray-600 text-center focus-visible:outline-none">Martial Weapons</div>
            </div>
            
            <div className='flex mb-4'>
              <Checkbox
                icon={<CircleOutlinedIcon />}
                checkedIcon={<AdjustIcon />}
                size="medium"
                checked={hasShields()} 
                readOnly
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: "#1f1f1f",
                  },
                }}
              />
              <div className="mx-1 font-medium text-gray-600 text-center focus-visible:outline-none">Shields</div>
            </div>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
