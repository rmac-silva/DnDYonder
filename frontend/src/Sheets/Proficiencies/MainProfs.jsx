import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";
import COLORS from '../../constants/colors.js';


export default function MainProfs({ draft, setDraft }) {
  // Defensive access: ensure arrays and normalize to lowercase for robust matching
  const armorProfsRaw = draft.class?.armor_proficiencies.concat(draft.race.armor_proficiencies) || [];
  const weaponProfsRaw = draft.class?.weapon_proficiencies.concat(draft.race.weapon_proficiencies) || [];

  const armorProfs = armorProfsRaw.map((s) => String(s).toLowerCase());
  const weaponProfs = weaponProfsRaw.map((s) => String(s).toLowerCase());
  
  const hasArmor = (name) => armorProfs.includes(name.toLowerCase());
  const hasWeapon = (name) => weaponProfs.includes(name.toLowerCase());

  // Support slight name variations (Shield vs Shields)
  const hasShields = () =>
    armorProfs.includes('shield') || armorProfs.includes('shields');

  const ToggleProficiency = (name, desiredState) => {
    if(desiredState === false) { // Was checked, removing proficiency
      draft.class.armor_proficiencies = draft.class.armor_proficiencies.filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
      draft.class.weapon_proficiencies = draft.class.weapon_proficiencies.filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
      draft.race.armor_proficiencies = draft.class.armor_proficiencies.filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
      draft.race.weapon_proficiencies = draft.class.weapon_proficiencies.filter( //Remove from the race too
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
    } else {
      // Was unchecked, adding proficiency
      if (['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'].includes(name)) {
        draft.class.armor_proficiencies.push(name); //Default to class, don't bother adding to the race again
      } else {
        draft.class.weapon_proficiencies.push(name);
      }
    }

    setDraft({ ...draft }); //Update the draft
  }

  return (
    <Box mt={4} className='flex flex-col items-center'>
      <Typography className='!text-3xl !font-semibold' gutterBottom>
        Proficiencies
      </Typography>

      <Paper variant="outlined" className='w-full' sx={{ p: 3, border: `2px solid ${COLORS.accent}`, borderRadius: 2, backgroundColor: COLORS.primary, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
                onChange={(e) => {ToggleProficiency("Light Armor", e.target.checked);}}
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: COLORS.secondary,
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
                onChange={(e) => {ToggleProficiency("Medium Armor", e.target.checked);}}
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: COLORS.secondary,
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
                onChange={(e) => {ToggleProficiency("Heavy Armor", e.target.checked);}}
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: COLORS.secondary,
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
                onChange={(e) => {ToggleProficiency("Simple Weapons", e.target.checked);}}
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: COLORS.secondary,
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
                onChange={(e) => {ToggleProficiency("Martial Weapons", e.target.checked);}}
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: COLORS.secondary,
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
                onChange={(e) => {ToggleProficiency("Shields", e.target.checked);}}
                sx={{
                  padding: 0,
                  color: grey[400],

                  "&.Mui-checked": {
                    color: COLORS.secondary,
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
