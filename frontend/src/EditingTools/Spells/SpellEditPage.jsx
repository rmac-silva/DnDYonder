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
import Navbar from '../../Navbar/Navbar';
import SpellsEditPanel from './SpellsEditPanel.jsx'; // use the spell edit panel

export function SpellEditPage() {
    const [spells, setSpells] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);

    const [editedSpell, setEditedSpell] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        let abort = false;
        async function fetchSpells() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/info/spells`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!abort) setSpells(data.spells || []);
            } catch (e) {
                console.error('Failed to fetch spells:', e);
                if (!abort) setSpells([]);
            } finally {
                if (!abort) setLoading(false);
            }
        }
        fetchSpells();
        setRefreshPage(false);
        return () => { abort = true; };
    }, [refreshPage]);

    const groupedByLevel = useMemo(() => {
        const byLevel = {
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
        };
        for (const spell of spells) {
            const level = spell.s_content?.level ?? -1;
            if (level >= 0 && level <= 9) {
                byLevel[level].push(spell);
            }
        }
        const sortByName = (arr) => arr.slice().sort((a, b) =>
            String(a.s_name || '').localeCompare(String(b.s_name || ''))
        );
        return {
            0: sortByName(byLevel[0]),
            1: sortByName(byLevel[1]),
            2: sortByName(byLevel[2]),
            3: sortByName(byLevel[3]),
            4: sortByName(byLevel[4]),
            5: sortByName(byLevel[5]),
            6: sortByName(byLevel[6]),
            7: sortByName(byLevel[7]),
            8: sortByName(byLevel[8]),
            9: sortByName(byLevel[9]),
        };
    }, [spells]);

    async function handleDelete(spell) {
        const name = spell.s_name || '';
        if (!name) return;
        const ok = window.confirm(`Delete spell "${name}"? This cannot be undone.`);
        if (!ok) return;

        try {
            const token = localStorage.getItem('authToken');
            const payload = { spellName: name, token };
            const res = await fetch(`${import.meta.env.VITE_API_URL}/info/spells`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`HTTP ${res.status} - ${errorData.detail || 'Unknown error'}`);
            }
            setRefreshPage(true);
        } catch (err) {
            console.error('Delete failed:', err);
            alert(`Failed to delete spell: ${err.message}`);
        }
    }

    function handleEdit(spell) {
        setEditedSpell(spell);

        setEditOpen(true);
        // TODO: wire up edit panel when ready
    }

    async function handleEditClose(changedValue,spellData=null) {
        setEditOpen(false);
        if (changedValue) {
            //Update the spell in the database
            updateSpell(spellData);
            setRefreshPage(true);
        }
    }

    async function updateSpell(spellData) {
        var payload = {
            'spell': spellData,
            'token': localStorage.getItem('authToken'),
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/info/spells`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`HTTP ${res.status} - ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Edit failed:', error);
            alert(`Failed to edit spell: ${error.message}`);
        }
    }

    const getLevelTitle = (level) => {
        if (level === 0) return 'Cantrips';
        const suffix = level === 1 ? 'st' : level === 2 ? 'nd' : level === 3 ? 'rd' : 'th';
        return `Level: ${level}${suffix}`;
    };

    const Section = ({ level, data }) => {
        const title = getLevelTitle(level);

        if (!data.length) return null;

        return (
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, bgcolor: (t) => t.palette.action.hover }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">{title}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {loading && <CircularProgress />}
                <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                    {data.map((spell) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`spell-${String(spell.s_name)}`}
                            sx={{ '@media (min-width:900px)': { flexBasis: '32.5%', maxWidth: '32.5%' } }}
                        >
                            <Card variant="outlined" sx={{ height: 250, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className='!bg-neutral-50'>
                                <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                    <Typography variant="subtitle1" className='!font-semibold' noWrap title={spell.s_name}>
                                        {spell.s_name}
                                    </Typography>
                                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                                        {spell.s_content?.description && (
                                            <Typography className='text-md'
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxHeight: '4.5em',
                                                }}>
                                                {spell.s_content.description}
                                            </Typography>
                                        )}
                                        <Grid container columnSpacing={2} sx={{ mt: 1 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                                            {spell.s_content?.school && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.primary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        School: {spell.s_content.school}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {spell.s_content?.casting_time && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.primary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        Casting Time: {spell.s_content.casting_time}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {spell.s_content?.range && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.primary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        Range: {spell.s_content.range}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {spell.s_content?.components && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.primary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        Components: {spell.s_content.components}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {spell.s_content?.duration && (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.primary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        Duration: {spell.s_content.duration}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>

                                    </Stack>

                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Button variant="outlined" color="primary" onClick={() => handleEdit(spell.s_content)}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={() => handleDelete(spell)}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        );
    };

    return (
        <>
            <Navbar />

            <SpellsEditPanel
                isOpen={editOpen}
                spellData={editedSpell}
                handleClose={handleEditClose}
            />

            <Box sx={{ p: { xs: 2, md: 3 }, marginTop: '-18px', bgcolor: '#fff', minHeight: '100vh' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Spells</Typography>
                <Stack spacing={2}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                        <Section key={level} level={level} data={groupedByLevel[level]} />
                    ))}
                </Stack>
            </Box>
        </>
    );
}

export default SpellEditPage;
