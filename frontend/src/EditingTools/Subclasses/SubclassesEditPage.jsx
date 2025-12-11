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
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from '../../Navbar/Navbar';
import SubclassEditPanel from './SubclassesEditPanel.jsx'; // use the class edit panel

export function SubclassEditPage() {
  const [subclasses, setSubclasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  // edit dialog state (kept if you want to edit/delete classes here)
  const [editedSubclass, setEditedSubclass] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let abort = false;

    async function fetchSubclasses() {
      setLoading(true);
      try {

        const res = await fetch(`${import.meta.env.VITE_API_URL}/info/subclasses`, {
          headers: {
            method: 'GET',
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();
        // console.log('Fetched subclasses:', arr.subclasses);
        setSubclasses(arr.subclasses);

      } catch (e) {
        console.error('Failed to fetch classes:', e);
        if (!abort) setSubclasses([]);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchSubclasses();
    setForceRefresh(false);
    return () => { abort = true; };
  }, [forceRefresh]);


  function openEdit(subClass) {
    // cls.raw is the parsed c_content
    setEditedSubclass(subClass || null);
    setEditOpen(true);
  }

  async function deleteSubclass(subClass) {
    try {
      setLoading(true);
      var payload = {
        'subclass_name': subClass.name,
        'class_name': subClass.class_name,
        'token': localStorage.getItem('authToken'),
      }


      const res = await fetch(`${import.meta.env.VITE_API_URL}/info/subclasses`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      } else {
        console.log("Deleted subclass:", payload)
        setForceRefresh(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to delete subclass:', error);
      setLoading(false);
      return;
    }
  }

  async function createNewSubclass(subClass) {
    try {

      setLoading(true);

      const payload = {
        'subclass': subClass,
        'token': localStorage.getItem('authToken'),
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/info/subclasses`, {
        method: 'POST', // or PUT depending on your API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      } else {
        console.log("Deleted subclass:", payload)
        setForceRefresh(true);
      }

      setLoading(false);

    } catch (error) {
      console.error('Failed to delete subclass:', error);
      setLoading(false);
      return;
    }
  }

  async function onSubmit(success, updatedSubclass = null) {
    setEditOpen(false);

    if (success) {
      if (editedSubclass === null) {
        await createNewSubclass(updatedSubclass);
      } else {
        await saveUpdatedSubclass(updatedSubclass);
      }
      setForceRefresh(true);
    }


    setEditedSubclass(null);
  }

  async function saveUpdatedSubclass(updatedSubclass) {
    var payload = {
      'subclass': updatedSubclass,
      'token': localStorage.getItem('authToken'),
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/info/subclasses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Update failed: ${res.detail}`);
      } else {
        console.log("Updated subclass:", payload)
        setForceRefresh(true);
      }

    } catch (error) {
      console.error('Failed to update subclass:', error);
    }
  }

  function addSubclass() {
    setEditedSubclass(null);
    setEditOpen(true);
  }



  return (
    <>
      <Navbar />

      {/* The edit dialog */}
      <SubclassEditPanel
        dialogOpen={editOpen}
        editedSubclass={editedSubclass}
        onSubmit={onSubmit}
      />

      <Box sx={{ p: { xs: 2, md: 3 }, mx: 2, borderRadius: 2, bgcolor: '#fff' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Subclasses</Typography>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, bgcolor: (t) => t.palette.action.hover }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Subclasses</Typography>
            <Button variant="outlined" color="primary" onClick={addSubclass}>
              Add New Subclass
            </Button>
          </Box>

          {/* If the page is loading, place a spinner element here*/}
          {loading && <CircularProgress />}
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }} >
            {(loading ? [] : subclasses).map((subClass) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`class-${String(subClass.sc_content.name)}`}
                sx={{
                  '@media (min-width:900px)': {
                    flexBasis: '32.5%',
                    maxWidth: '32.5%',
                  },
                }}
              >
                <Card variant="outlined" sx={{ height: 230, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fafafa', border: '2px solid #e7e7e7' }}>
                  <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="h6" noWrap title={subClass.sc_content.name}>
                      {subClass.sc_content.name}
                    </Typography>

                    <Stack spacing={.5} sx={{ mt: 1, paddingBottom: 6, marginBottom: 10 }}>
                      <Typography variant="body1">
                        Class: {subClass.sc_content.class_name}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxHeight: '4.5em',
                        }}
                        title={subClass.sc_content.description}
                      >
                        {subClass.sc_content.description}
                      </Typography>


                    </Stack>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => openEdit(subClass.sc_content)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => deleteSubclass(subClass.sc_content)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>



    </>
  );
}

export default SubclassEditPage;