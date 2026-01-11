import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    Stack,
    Card,
    CardContent,
    CardActions,
    Button
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from '../../Navbar/Navbar.jsx';
import RaceEditPanel from './RaceEditPanel.jsx'; // use the spell edit panel
import { useNotification } from '../../Utils/NotificationContext.jsx';
export function RaceEditPage() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const { showNotification } = useNotification();
    const [editedRace, setEditedRace] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        let abort = false;
        async function fetchRaces() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/info/races`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                console.log('Fetched races:', data.races);
                if (!abort) setRaces(data.races || []);
            } catch (e) {
                console.error('Failed to fetch races:', e);
                if (!abort) setRaces([]);
            } finally {
                if (!abort) setLoading(false);
            }
        }
        fetchRaces();
        setRefreshPage(false);
        return () => { abort = true; };
    }, [refreshPage]);

    const displayRaces = useMemo(() => {
        const makeName = (race) => {
            const name = race.race || '';
            const subname = race.subrace || '';
            const combined = `${subname ? `${subname} ` : ''}${name}`.trim();
            return combined || 'Unnamed Race';
        };

        return (races || [])
            .map((race) => ({ ...race.r_content, _displayName: makeName(race.r_content) }))
            .sort((a, b) => a._displayName.localeCompare(b._displayName));
    }, [races]);
    

    async function handleDelete(race) {

        const name = race.race || '';
        const subname = race.subrace || '';
        var finalName = (subname ? `${subname}` : '') + ` ${name}`.trim();
        if (!name) return;

        const ok = window.confirm(`Delete race "${finalName}"? This cannot be undone.`);
        if (!ok) return;


        try {
            const token = localStorage.getItem('authToken');
            const payload = { raceName: finalName, token };
            const res = await fetch(`${import.meta.env.VITE_API_URL}/info/races`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`${errorData.detail || 'Unknown error'}`);
            }
            setRefreshPage(true);
        } catch (err) {
            console.error('Delete failed:', err);
            showNotification(`Failed to delete race: ${err.message}`, 'error');
        }
    }

    function handleEdit(race) {
        setEditedRace(race);

        setEditOpen(true);
        
    }

    async function handleEditClose(changedValue,raceData=null) {
        setEditOpen(false);
        if (changedValue) {
            //Update the spell in the database
            updateRace(raceData);
            setRefreshPage(true);
        }
    }

    async function updateRace(raceData) {
        var payload = {
            'race': raceData,
            'token': localStorage.getItem('authToken'),
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/info/races`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(` ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Edit failed:', error);
            showNotification(`Failed to edit race: ${error.message}`, 'error');
        }
    }



    return (
        <>
            <Navbar />

            <RaceEditPanel
                isOpen={editOpen}
                raceData={editedRace}
                handleClose={handleEditClose}
            />

            <Box sx={{ p: { xs: 2, md: 3 }, marginTop: '-18px', bgcolor: '#fff', minHeight: '100vh' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Races</Typography>

                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, bgcolor: (t) => t.palette.action.hover }}>
                    {loading && !displayRaces.length && (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                        {displayRaces.map((race) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={`race-${String(race._displayName)}`}
                                sx={{
                                    '@media (min-width:900px)': {
                                        flexBasis: '32.5%',
                                        maxWidth: '32.5%',
                                    },
                                }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: 230,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        backgroundColor: '#fafafa',
                                        border: '2px solid #e7e7e7',
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                        <Typography variant="h6" noWrap title={race._displayName}>
                                            {race._displayName}
                                        </Typography>

                                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                                            {race.creature_type && (
                                                <Typography variant="body2">
                                                    Type: {race.creature_type}
                                                </Typography>
                                            )}
                                            {race.size && (
                                                <Typography variant="body2">
                                                    Size: {race.size}
                                                </Typography>
                                            )}
                                            {race.alignment && (
                                                <Typography variant="body2">
                                                    Alignment: {race.alignment}
                                                </Typography>
                                            )}
                                            {race.speed !== undefined && race.speed !== null && (
                                                <Typography variant="body2">
                                                    Speed: {race.speed} ft.
                                                </Typography>
                                            )}
                                            {Array.isArray(race.languages) && race.languages.length > 0 && (
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    title={race.languages.join(', ')}
                                                >
                                                    Languages: {race.languages.join(', ')}
                                                </Typography>
                                            )}
                                            {Array.isArray(race.armor_proficiencies) && race.armor_proficiencies.length > 0 && (
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    title={race.armor_proficiencies.join(', ')}
                                                >
                                                    Armor: {race.armor_proficiencies.join(', ')}
                                                </Typography>
                                            )}
                                            {Array.isArray(race.weapon_proficiencies) && race.weapon_proficiencies.length > 0 && (
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    title={race.weapon_proficiencies.join(', ')}
                                                >
                                                    Weapons: {race.weapon_proficiencies.join(', ')}
                                                </Typography>
                                            )}
                                            {Array.isArray(race.tool_proficiencies) && race.tool_proficiencies.length > 0 && (
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    title={race.tool_proficiencies.join(', ')}
                                                >
                                                    Tools: {race.tool_proficiencies.join(', ')}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>

                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(race)}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={() => handleDelete(race)}>
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

export default RaceEditPage;
