import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';

import Navbar from '../../Navbar/Navbar';
import ClassEdit from './ClassEditPanel.jsx'; // use the class edit panel

export function ClassEditPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // edit dialog state (kept if you want to edit/delete classes here)
  const [editedClass, setEditedClass] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let abort = false;
    async function fetchClasses() {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/info/classes`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();
        console.log('Fetched classes:', arr.classes);
        // Normalize: map each row to a display object
        const normalized = arr.classes.map((row) => {
          let content = {};
          try {
            content = typeof row.c_content === 'string' ? JSON.parse(row.c_content) : (row.c_content || {});
          } catch {
            content = {};
          }
          return {
            name: row.c_name || content.class_name || 'Unnamed Class',
            hit_die: content?.hit_die || content?.hit_dice || '',
            hitpoints_per_level: content?.hitpoints_per_level ?? '',
            weapon_proficiencies: content?.weapon_proficiencies || [],
            armor_proficiencies: content?.armor_proficiencies || [],
            // keep raw for edit/delete
            raw: content
          };
        });
        if (!abort) setClasses(normalized);
      } catch (e) {
        console.error('Failed to fetch classes:', e);
        if (!abort) setClasses([]);
      } finally {
        if (!abort) setLoading(false);
      }
    }
    fetchClasses();
    return () => { abort = true; };
  }, []);

  function openEdit(cls) {
    // cls.raw is the parsed c_content
    setEditedClass(cls?.raw || null);
    setEditOpen(true);
  }

  function handleEditClose(success) {
    setEditOpen(false);
    if (success) {
      (async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/info/classes`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const normalized = (data.classes || data).map((row) => {
            let content = {};
            try { content = typeof row.c_content === 'string' ? JSON.parse(row.c_content) : (row.c_content || {}); } catch { content = {}; }
            return {
              name: row.c_name || content.class_name || 'Unnamed Class',
              hit_die: content?.hit_die || content?.hit_dice || '',
              hitpoints_per_level: content?.hitpoints_per_level ?? '',
              weapon_proficiencies: content?.weapon_proficiencies || [],
              armor_proficiencies: content?.armor_proficiencies || [],
              raw: content
            };
          });
          setClasses(normalized);
        } catch (e) {
          console.error('Failed to refresh classes:', e);
        }
      })();
    } else {
        setEditedClass(null);
    }
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: { xs: 2, md: 3 }, marginTop: '-18px', bgcolor: '#fff', minHeight: '100vh' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Classes</Typography>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, bgcolor: (t) => t.palette.action.hover }}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            {(loading ? [] : classes).map((cls) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`class-${String(cls.name)}`}
                sx={{
                  '@media (min-width:900px)': {
                    flexBasis: '32.5%',
                    maxWidth: '32.5%',
                  },
                }}
              >
                <Card variant="outlined" sx={{ height: 230, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fafafa', border: '2px solid #e7e7e7' }}>
                  <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="h6" noWrap title={cls.name}>
                      {cls.name}
                    </Typography>

                    <Stack spacing={.5} sx={{ mt: 1, paddingBottom: 6, marginBottom: 10 }}>
                      {cls.hit_die && (
                        <Typography variant="body1">
                          Hit Die: {cls.hit_die}
                        </Typography>
                      )}
                      {Number.isFinite(Number(cls.hitpoints_per_level)) && (
                        <Typography variant="body1">
                          HP / Level: {cls.hitpoints_per_level}
                        </Typography>
                      )}
                      {Array.isArray(cls.weapon_proficiencies) && cls.weapon_proficiencies.length > 0 && (
                        <Typography
                          variant="body1"
                          noWrap
                          title={cls.weapon_proficiencies.join(', ')}
                        >
                          Weapons: {cls.weapon_proficiencies.join(', ')}
                        </Typography>
                      )}
                      {Array.isArray(cls.armor_proficiencies) && cls.armor_proficiencies.length > 0 && (
                        <Typography
                          variant="body1"
                          noWrap
                          
                          title={cls.armor_proficiencies.join(', ')}
                        >
                          Armor: {cls.armor_proficiencies.join(', ')}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => openEdit(cls)}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Edit dialog with preloaded class */}
      <ClassEdit
        sheet={{ class: editedClass }}                  // supply the selected class
        setSheet={() => {}}                             // not needed for edit modal; stub
        selectClass={() => {}}                          // stub
        disabled={false}
        open={editOpen}                                 // optional: if you wire open prop in panel
        onClose={handleEditClose}          // optional close handler
      />
    </>
  );
}

export default ClassEditPage;