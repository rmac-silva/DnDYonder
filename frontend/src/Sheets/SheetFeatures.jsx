//This holds the class and racial features. Also have an option for the player to add their own features if needed.

import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import AddFeatureDialog from './Lists/AddFeatureDialog.jsx';
import SwipeableFeatureAccordion from './Lists/SwipeableFeatureAccordion.jsx';

function SubclassInfo({ draft, setDraft }) {
  const [sheetFeatures, setSheetFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false); // new

  useEffect(() => {
    // build combined, filtered and sorted features once
    const classFeatures = (draft?.class?.class_features || []).filter(f => parseInt(f.level_requirement) <= parseInt(draft?.stats?.level));
    const raceFeatures = (draft?.race?.race_features || []).filter(f => parseInt(f.level_requirement) <= parseInt(draft?.stats?.level));
    const subclassFeatures = (draft?.class.subclass?.features || []).filter(f => parseInt(f.level_requirement) <= parseInt(draft?.stats?.level));
    // console.log('Subclass features:', subclassFeatures);
    const combined = [...classFeatures, ...raceFeatures, ...subclassFeatures].sort((a, b) => a.level_requirement - b.level_requirement);
    setSheetFeatures(combined);
    setLoading(false);
  }, [draft?.race?.race_features, draft?.class?.class_features, draft?.subclass?.features, draft?.stats?.level, draft.class?.subclass?.selected]);

  if (loading) {
    return <div>Loading features...</div>;
  }

  const handleAddFeature = (feat) => {
    // add to class features by default, ensure arrays exist, then sort
    setDraft(prev => {
      const next = { ...(prev || {}) };
      next.class = { ...(next.class || {}) };
      const arr = Array.isArray(next.class.class_features) ? [...next.class.class_features] : [];
      arr.push(feat);
      arr.sort((a, b) => (parseInt(a.level_requirement) || 0) - (parseInt(b.level_requirement) || 0));
      next.class.class_features = arr;
      return next;
    });
  };

  const handleRemoveFeature = (feat) => {
    //Check if it's in class features
    var class_feats = draft.class.class_features;
    if (class_feats.includes(feat)) { //Remove from class features
      draft.class.class_features = class_feats.filter(f => f !== feat);
      setDraft({ ...draft });
      return;
    } else { //Remove from race features
      draft.race.race_features = draft.race.race_features.filter(f => f !== feat);
      setDraft({ ...draft });
      return;
    }
  }

  return (
    <div
      style={{
        // fill available sheet height and use internal scrolling
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div
        style={{
          border: '2px solid #db7f3d',
          borderRadius: 12,
          padding: 16,
          background: '#edeae8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = '#c46d2f'}}
        onMouseLeave={(e) => {e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#db7f3d'}}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 0 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 900, letterSpacing: 0.4 }}>
              Features
            </Typography>
          </div>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />
          <div style={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Features from your class and race that are available at your current level.
            </Typography>
          </div>

          {/* Add feature button */}
          <div style={{ flex: 0 }}>
            <Button 
                variant="contained" 
                size="small" 
                onClick={() => setAddDialogOpen(true)}
                sx={{
                    backgroundColor: '#db7f3d',
                    color: '#edeae8',
                    '&:hover': {
                        backgroundColor: '#c46d2f',
                    },
                }}
            >
              Add feature
            </Button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
          {sheetFeatures.length === 0 && (
            <div style={{ color: '#666' }}>No features available at this level.</div>
          )}

          {sheetFeatures.map((feature) => (
            <SwipeableFeatureAccordion key={`${feature.name}-${feature.level_requirement}`} feature={feature} onDelete={handleRemoveFeature} />
          ))}
        </div>
      </div>

      <AddFeatureDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddFeature}
      />
    </div>
  );
}
export default SubclassInfo;