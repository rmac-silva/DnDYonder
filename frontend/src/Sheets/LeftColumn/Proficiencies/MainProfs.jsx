import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AdjustIcon from "@mui/icons-material/Adjust";
import { grey } from "@mui/material/colors";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MainProfs({ draft, setDraft }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Defensive access: ensure arrays and normalize to lowercase for robust matching
  const armorProfsRaw = (draft.class?.armor_proficiencies || []).concat(draft.race?.armor_proficiencies || []);
  const weaponProfsRaw = (draft.class?.weapon_proficiencies || []).concat(draft.race?.weapon_proficiencies || []);

  const armorProfs = armorProfsRaw.map((s) => String(s).toLowerCase());
  const weaponProfs = weaponProfsRaw.map((s) => String(s).toLowerCase());
  
  const hasArmor = (name) => armorProfs.includes(name.toLowerCase());
  const hasWeapon = (name) => weaponProfs.includes(name.toLowerCase());

  // Support slight name variations (Shield vs Shields)
  const hasShields = () =>
    armorProfs.includes('shield') || armorProfs.includes('shields');

  const ToggleProficiency = (name, desiredState) => {
    if(desiredState === false) { // Was checked, removing proficiency
      draft.class.armor_proficiencies = (draft.class.armor_proficiencies || []).filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
      draft.class.weapon_proficiencies = (draft.class.weapon_proficiencies || []).filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
      draft.race.armor_proficiencies = (draft.race.armor_proficiencies || []).filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
      draft.race.weapon_proficiencies = (draft.race.weapon_proficiencies || []).filter(
          (prof) =>  prof.toLowerCase() !== name.toLowerCase()
        );
    } else {
      // Was unchecked, adding proficiency
      if (['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'].includes(name)) {
        draft.class.armor_proficiencies = draft.class.armor_proficiencies || [];
        if (!draft.class.armor_proficiencies.includes(name)) draft.class.armor_proficiencies.push(name);
      } else {
        draft.class.weapon_proficiencies = draft.class.weapon_proficiencies || [];
        if (!draft.class.weapon_proficiencies.includes(name)) draft.class.weapon_proficiencies.push(name);
      }
    }

    setDraft({ ...draft }); //Update the draft
  }

  const rowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1,
    // keep checkbox and label in a consistent position and prevent label overflow
    // label is now flexible and will wrap to next line if needed
    '.label': {
      fontWeight: 500,
      color: 'text.secondary',
      flex: 1,
      minWidth: 0,
      whiteSpace: 'normal',
      overflow: 'visible',
      wordBreak: 'break-word',
    }
  };

  const checkboxSx = {
    padding: 0,
    color: grey[400],
    "&.Mui-checked": { color: "#1f1f1f" },
    transform: isSmall ? 'scale(0.85)' : 'scale(1)',
  };

  return (
    <Box mt={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
      <Typography sx={{ fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' }, fontWeight: 700, mb: 1 }}>
        Proficiencies
      </Typography>

      <Paper variant="outlined" sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        <Box
          component="section"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, // 1 col on xs/sm, 2 cols on md+
            gap: 1.5,
            alignItems: 'start'
          }}
        >
          {/* Column 1 */}
          <Box>
            <Box sx={rowSx}>
              <Checkbox
                icon={<CircleOutlinedIcon fontSize={isSmall ? "small" : "medium"} />}
                checkedIcon={<AdjustIcon fontSize={isSmall ? "small" : "medium"} />}
                size={isSmall ? "small" : "medium"}
                checked={hasArmor('Light Armor')} 
                onChange={(e) => {ToggleProficiency("Light Armor", e.target.checked);}}
                sx={checkboxSx}
              />
              <Box className="label" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>Light Armor</Box>
            </Box>

            <Box sx={rowSx}>
              <Checkbox
                icon={<CircleOutlinedIcon fontSize={isSmall ? "small" : "medium"} />}
                checkedIcon={<AdjustIcon fontSize={isSmall ? "small" : "medium"} />}
                size={isSmall ? "small" : "medium"}
                checked={hasArmor('Medium Armor')} 
                onChange={(e) => {ToggleProficiency("Medium Armor", e.target.checked);}}
                sx={checkboxSx}
              />
              <Box className="label" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>Medium Armor</Box>
            </Box>

            <Box sx={rowSx}>
              <Checkbox
                icon={<CircleOutlinedIcon fontSize={isSmall ? "small" : "medium"} />}
                checkedIcon={<AdjustIcon fontSize={isSmall ? "small" : "medium"} />}
                size={isSmall ? "small" : "medium"}
                checked={hasArmor('Heavy Armor')} 
                onChange={(e) => {ToggleProficiency("Heavy Armor", e.target.checked);}}
                sx={checkboxSx}
              />
              <Box className="label" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>Heavy Armor</Box>
            </Box>
          </Box>

          {/* Column 2 */}
          <Box>
            <Box sx={rowSx}>
              <Checkbox
                icon={<CircleOutlinedIcon fontSize={isSmall ? "small" : "medium"} />}
                checkedIcon={<AdjustIcon fontSize={isSmall ? "small" : "medium"} />}
                size={isSmall ? "small" : "medium"}
                checked={hasWeapon('Simple Weapons')} 
                onChange={(e) => {ToggleProficiency("Simple Weapons", e.target.checked);}}
                sx={checkboxSx}
              />
              <Box className="label" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>Simple Weapons</Box>
            </Box>

            <Box sx={rowSx}>
              <Checkbox
                icon={<CircleOutlinedIcon fontSize={isSmall ? "small" : "medium"} />}
                checkedIcon={<AdjustIcon fontSize={isSmall ? "small" : "medium"} />}
                size={isSmall ? "small" : "medium"}
                checked={hasWeapon('Martial Weapons')} 
                onChange={(e) => {ToggleProficiency("Martial Weapons", e.target.checked);}}
                sx={checkboxSx}
              />
              <Box className="label" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>Martial Weapons</Box>
            </Box>
            
            <Box sx={rowSx}>
              <Checkbox
                icon={<CircleOutlinedIcon fontSize={isSmall ? "small" : "medium"} />}
                checkedIcon={<AdjustIcon fontSize={isSmall ? "small" : "medium"} />}
                size={isSmall ? "small" : "medium"}
                checked={hasShields()} 
                onChange={(e) => {ToggleProficiency("Shields", e.target.checked);}}
                sx={checkboxSx}
              />
              <Box className="label" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>Shields</Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
