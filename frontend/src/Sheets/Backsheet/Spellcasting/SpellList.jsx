import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddNewSpell from './AddNewSpell';
import Button from '@mui/material/Button';

/*
Columns: Name | Time | Range | School | Components
Click row -> expand to show description (accordion)
Keeps existing state vars (sortedSpells, newSpells, forceRefresh) — plug your fetch / select logic back where indicated.
*/

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

function getSchoolGradients(schoolRaw) {
    const school = String(schoolRaw || '').toLowerCase();
    switch (school) {
        case 'abjuration':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.05) 0%, rgba(57, 160, 250,.05) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.05) 0%, rgba(57, 160, 250,.05) 100%)'
            };
        case 'conjuration':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(170, 66, 245,0.05) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(170, 66, 245,0.05) 100%)'
            };
        case 'divination':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(245, 221, 66,0.10) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(245, 221, 66,0.10) 100%)'
            };
        case 'enchantment':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(245, 66, 203,0.05) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(245, 66, 203,0.05) 100%)'
            };
        case 'evocation':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(252, 86, 3,0.10) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(252, 86, 3,0.10) 100%)'
            };
        case 'illusion':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(54, 188, 245,0.05) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(54, 188, 245,0.05) 100%)'
            };
        case 'necromancy':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(148, 8, 153,0.05) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(148, 8, 153,0.05) 100%)'
            };
        case 'transmutation':
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(255, 255, 255,0.25) 100%)',
                hover: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(186, 111, 24,0.10) 100%)',
                expanded: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(186, 111, 24,0.10) 100%)'
            };
        default:
            return {
                collapsed: 'linear-gradient(0deg, rgba(255, 255, 255,0.25) 0%, rgba(/*DEFAULT R2,G2,B2,0.35*/) 100%)',
                expanded: 'linear-gradient(0deg, rgba(/*DEFAULT R1,G1,B1,0.06*/) 0%, rgba(/*DEFAULT R2,G2,B2,0.22*/) 100%)'
            };
    }
}

function SpellList({ draft, setDraft }) {
    const [sortedSpells, setSortedSpells] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [onMobile, setOnMobile] = useState(window.innerWidth < 768);
    const [spellcastingLevel, setSpellcastingLevel] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setOnMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prefer spells_known; fall back to other keys only if empty/absent
    const getSpellSource = () => {
        const known = draft?.class?.spellcasting?.spells_known;
        if (Array.isArray(known) && known.length) return known;

        return [];
    };

    // Sort whenever the source or level changes
    useEffect(() => {
        const source = getSpellSource();
        const ordered = [...source].sort((a, b) => {
            const la = Number(a.level ?? 0);
            const lb = Number(b.level ?? 0);
            if (la !== lb) return la - lb;
            return String(a.name).localeCompare(String(b.name));
        });

        setSpellcastingLevel(Number(draft?.class?.spellcasting?.max_level_spellslots ?? 0));


        setSortedSpells(ordered);
        console.log("Filtered spells: ", ordered);
    }, [
        draft?.class?.spellcasting?.spells_known,   // primary source
        draft?.class?.spellcasting?.max_level_spellslots,  // affects filtering
        forceRefresh,
    ]);

    const persistSpells = () => {
        // ensure effect runs even if object ref didn’t change elsewhere
        setForceRefresh(v => !v);
    };

    // Add new spell (called by AddNewSpell)
    const handleAddSpell = (spellObj) => {
        console.log("Adding spell:", spellObj);

        persistSpells();
    };

    // Delete (long-press or button)
    const handleDeleteSpell = (spellObj) => {

        //Confirmation window
        if (!window.confirm(`Are you sure you want to delete the spell "${spellObj.name}"?`)) {
            return;
        }

        draft.class.spellcasting.spells_known = draft.class.spellcasting.spells_known.filter(s =>
            !(s.name === spellObj.name && s.level === spellObj.level)
        );
        setDraft({ ...draft });
        setForceRefresh(true);
    };

    const getSchool = (s) =>
        s?.school || s?.school_of_magic || s?.school_name || '—';

    const getCastTime = (s) => {
        return s.casting_time.split(',')[0];
    }

    const columnTemplates = {
        xs: 'minmax(90px,1.4fr) minmax(50px,0.5fr) minmax(60px,0.7fr) minmax(75px,0.8fr) minmax(85px,1fr)',
        sm: 'minmax(110px,1.5fr) minmax(60px,0.6fr) minmax(75px,0.8fr) minmax(95px,0.9fr) minmax(105px,1.1fr)',
        md: 'minmax(130px,1.5fr) minmax(65px,0.6fr) minmax(85px,0.8fr) minmax(110px,0.9fr) minmax(120px,1.1fr)',
        lg: 'minmax(150px,1.5fr) minmax(70px,0.6fr) minmax(90px,0.8fr) minmax(120px,0.9fr) minmax(140px,1.1fr)',
        xl: '1.5fr 0.6fr 0.80fr 0.9fr 1.1fr'
    };
    // NEW: linear spacing scale (xl is baseline)
    const spacingScale = {
        px: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
        pyHeader: { xs: 0.50, sm: 0.55, md: 0.70, lg: 0.85, xl: 1 },
        pyRow: { xs: 0.40, sm: 0.50, md: 0.55, lg: 0.65, xl: 0.75 },
        gap: { xs: 0.25, sm: 0.40, md: 0.55, lg: 0.70, xl: 0.75 },
        minHeight: { xs: '38px', sm: '40px', md: '44px', lg: '46px', xl: '48px' }
    };

    return (
        <Box sx={{ width: '100%', mt: 6, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
            {/* Horizontal scroll container (mobile only) */}
            <Box
                sx={{
                    width: '100%',
                    overflowX: onMobile ? 'auto' : 'visible',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {/* Fixed inner width so header/rows can scroll horizontally on small screens */}
                <Box sx={{ minWidth: onMobile ? 720 : 'auto' }}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: columnTemplates.xs,
                                sm: columnTemplates.sm,
                                md: columnTemplates.md,
                                lg: columnTemplates.lg,
                                xl: columnTemplates.xl
                            },
                            px: spacingScale.px,
                            py: spacingScale.pyHeader,
                            borderBottom: '1px solid #ddd',
                            fontSize: { xs: 10.5, sm: 11.25, md: 12.25, xl: 15 },
                            fontWeight: 600,
                            letterSpacing: '.5px',
                            textTransform: 'uppercase',
                            color: '#111',
                            alignItems: 'center',
                            gap: spacingScale.gap
                        }}
                    >
                        <span>Name</span>
                        <span>Time</span>
                        <span>Range</span>
                        <span>School</span>
                        <span>Components</span>
                    </Box>

                    {sortedSpells.length === 0 && (
                        <Typography variant="body2" sx={{ opacity: .7, px: 2, py: 1 }}>
                            No spells added.
                        </Typography>
                    )}

                    {sortedSpells.map((spell, i) => {
                        const grads = getSchoolGradients(getSchool(spell));
                        return (
                            <Accordion
                                key={`${spell.id ?? titleCase(spell.name)}-${i}`}
                                disableGutters
                                sx={{
                                    '&:before': { display: 'none' },
                                    boxShadow: 'none',
                                    borderBottom: '1px solid #eee',
                                    borderRadius: 0,
                                    width: '100%',
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20, xl: 22 } }} />}
                                    sx={{
                                        px: spacingScale.px,
                                        py: spacingScale.pyRow,
                                        minHeight: spacingScale.minHeight,
                                        transition: 'background 0.4s ease',
                                        background: grads.collapsed,
                                        '& .MuiAccordionSummary-content': { margin: 0, width: '100%' },
                                        '&.Mui-expanded': { background: grads.expanded },
                                        '&:hover': { background: grads.hover },
                                        // remove inner scroll; outer container handles it
                                        overflow: 'visible',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            alignItems: 'center',
                                            width: '100%',
                                            gridTemplateColumns: {
                                                xs: columnTemplates.xs,
                                                sm: columnTemplates.sm,
                                                md: columnTemplates.md,
                                                lg: columnTemplates.lg,
                                                xl: columnTemplates.xl
                                            },
                                            fontSize: { xs: 12, sm: 11.5, md: 12.5, xl: 15 },
                                            gap: spacingScale.gap,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/*If the spell has a level higher than the current spellcasting lvl. grey out the name and other informations */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, rowGap: { xs: 0.15, sm: 0.2, md: 0.25 } }}>
                                            <span  style={{ fontWeight: 600, lineHeight: 1.05, fontSize: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: (spell.level > spellcastingLevel) ? '#888' : 'inherit' }}>
                                                {titleCase(spell.name)}
                                            </span>

                                            <Box sx={{ fontSize: { xs: 10, sm: 11, md: 12, xl: 14 }, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }} className='!text-neutral-600 !font-normal !italic '>
                                                {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                                            </Box>
                                        </Box>
                                        <span style={{ whiteSpace: 'nowrap', lineHeight: 1, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}>{getCastTime(spell) || '—'}</span>
                                        <span style={{ whiteSpace: 'nowrap', lineHeight: 1, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}>{spell.range || '—'}</span>
                                        <span style={{ whiteSpace: 'nowrap', lineHeight: 1, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}>{getSchool(spell)}</span>
                                        <span style={{ fontSize: '0.68rem', marginRight: 4, whiteSpace: 'nowrap', lineHeight: 1, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}>{spell.components || '—'}</span>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 2, py: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: 1.5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                    >
                                        {spell.description || 'No description.'}
                                    </Typography>


                                    {/* Smaller details */}
                                    <Box display={"flex"}>

                                        <Typography
                                            variant="body2"
                                            className='!text-xs !font-semibold '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mr: 0.5, color: (spell.level > spellcastingLevel) ? '#888' : '#000000'  }}
                                        >
                                            {"Range:"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className='!text-xs font-normal '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: .5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {spell.range || 'No range.'}
                                        </Typography>
                                    </Box>
                                    <Box display={"flex"}>

                                        <Typography
                                            variant="body2"
                                            className='!text-xs !font-semibold '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mr: 0.5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {"School:"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className='!text-xs font-normal '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: .5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {spell.school || 'No school.'}
                                        </Typography>
                                    </Box>
                                    <Box display={"flex"}>

                                        <Typography
                                            variant="body2"
                                            className='!text-xs !font-semibold '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mr: 0.5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {"Cast time:"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className='!text-xs font-normal '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: .5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {spell.casting_time || 'No description.'}
                                        </Typography>
                                    </Box>
                                    <Box display={"flex"}>
                                        <Typography
                                            variant="body2"
                                            className='!text-xs !font-semibold '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: 1.5, mr: 0.5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {"Components:"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className='!text-xs font-normal '
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: 1.5, color: (spell.level > spellcastingLevel) ? '#888' : 'inherit'  }}
                                        >
                                            {spell.components || '—'}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            borderWidth: 1.5,
                                            '&:hover': {
                                                backgroundColor: (t) => t.palette.error.main,
                                                color: (t) => t.palette.error.contrastText,
                                                borderColor: (t) => t.palette.error.main
                                            }
                                        }}
                                        onClick={() => handleDeleteSpell(spell)}
                                    >
                                        Delete
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>
            </Box>

            <Box
                sx={{
                    mb: 1.5,
                    width: '100%',
                    maxWidth: '100%',
                    px: { xs: 1.25, sm: 0 },
                    overflowX: onMobile ? 'auto' : 'visible',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <Box sx={{ width: '90%', maxWidth: '90%' }}>
                    <AddNewSpell draft={draft} setDraft={setDraft} onAdd={handleAddSpell} />
                </Box>
            </Box>
        </Box>
    );
}

export default SpellList;