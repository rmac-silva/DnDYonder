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

  // Prefer spells_known; fall back to other keys only if empty/absent
  const getSpellSource = () => {
    const known = draft?.class?.spellcasting?.spells_known;
    if (Array.isArray(known) && known.length) return known;

    const spells = draft?.spells;
    if (Array.isArray(spells) && spells.length) return spells;

    const classSpells = draft?.class?.spellcasting?.spells;
    if (Array.isArray(classSpells) && classSpells.length) return classSpells;

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

    const spellcastingLevel = Number(draft?.class?.spellcasting?.max_level_spellslots ?? 0);
    const filtered = ordered.filter(spell => (spell.level ?? 0) <= spellcastingLevel);

    setSortedSpells(filtered);
  }, [
    draft?.class?.spellcasting?.spells_known,   // primary source
    draft?.spells,                               // fallback source
    draft?.class?.spellcasting?.spells,          // fallback source
    draft?.class?.spellcasting?.max_level_spellslots,
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

    return (
        <Box sx={{ width: '100%', mt: 6, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
            {/* Add new spell UI */}


            {/* Header */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 0.6fr 0.80fr 0.9fr 1.1fr',
                    px: 2,
                    py: 1,
                    borderBottom: '1px solid #ddd',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '.5px',
                    textTransform: 'uppercase',
                    color: '#111',
                    alignItems: 'center'
                }}
            >
                <span>Name</span>
                <span className=''>Time</span>
                <span className=''>Range</span>
                <span className=''>School</span>
                <span className=''>Components</span>
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
                        key={`${spell.id ?? spell.name}-${i}`}
                        disableGutters
                        sx={{
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                            borderBottom: '1px solid #eee',
                            borderRadius: 0
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                px: 2,
                                py: 1,
                                minHeight: '48px',
                                transition: 'background 0.4s ease',
                                background: grads.collapsed,
                                '& .MuiAccordionSummary-content': { margin: 0, width: '100%' },
                                '&.Mui-expanded': { background: grads.expanded },
                                '&:hover': { background: grads.hover }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    alignItems: 'center',
                                    width: '100%',
                                    gridTemplateColumns: 'minmax(160px,1.5fr) minmax(70px,0.7fr) minmax(90px,0.8fr) minmax(120px,1fr) minmax(140px,1fr)',
                                    fontSize: 14
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600 }}>
                                        {spell.name}
                                    </span>
                                    <span style={{ fontSize: 12, opacity: .75 }}>
                                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                                    </span>
                                </Box>
                                <span>{getCastTime(spell) || '—'}</span>
                                <span>{spell.range || '—'}</span>
                                <span>{getSchool(spell)}</span>
                                <span style={{ fontSize: 13,marginRight:4 }}>{spell.components || '—'}</span>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2, py: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: 1.5 }}
                            >
                                {spell.description || 'No description.'}
                            </Typography>
                            <Box display={"flex"}>

                                <Typography
                                    variant="body2"
                                    className='!text-xs font-normal '
                                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: 1.5, mr: 0.5 }}
                                >
                                    {"Cast time:"}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className='!text-xs font-normal !text-neutral-600'
                                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, mb: 1.5 }}
                                >
                                    {spell.casting_time || 'No description.'}
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
            <Box sx={{ mb: 1.5 }}>
                <AddNewSpell draft={draft} setDraft={setDraft} onAdd={handleAddSpell} />
            </Box>
        </Box>
    );
}

export default SpellList;