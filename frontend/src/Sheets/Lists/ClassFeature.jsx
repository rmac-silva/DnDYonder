import React, { useState, useEffect, useCallback,memo } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Memoized per-feature editor
const FeatureItem = memo(function FeatureItem({ feature, index, onChange, onBlur, onDelete }) {


  

  // Render using the passed feature object. All mutation goes through callbacks.
  return (
    <Box display="flex" flexDirection="column" gap={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <div className='flex  space-x-2'>
        <TextField
          label={`Feature ${index + 1} Name`}
          variant="outlined"
          value={feature.name}
          onChange={(e) => onChange(index, { name: e.target.value }, false)}
          onBlur={(e) => onBlur(index, { name: e.target.value })}
          size="medium"
          className='w-1/2 !mr-2'
        />

        <TextField
          label={`Level Requirement`}
          type='number'
          variant="outlined"
          value={feature.level_requirement}
          onChange={(e) => onChange(index, { level_requirement: e.target.value }, false)}
          onBlur={(e) => onBlur(index, { level_requirement: e.target.value })}
          size="medium"
          className='w-1/8'
        />

        <Box display="flex" justifyContent="flex-end">
          <IconButton
            onClick={() => onDelete(index)}
            aria-label="delete"
          >
            <CloseIcon className='absolute left-125 bottom-5 text-red-500 !text-4xl' />
          </IconButton>
        </Box>
      </div>

      <TextField
        label={`Feature ${index + 1} Description`}
        variant="outlined"
        value={feature.description}
        onChange={(e) => onChange(index, { description: e.target.value }, false)}
        onBlur={(e) => onBlur(index, { description: e.target.value })}
        size="small"
        multiline
        rows={6}
      />
    </Box>
  );
}, (prevProps, nextProps) => {
  // shallow compare feature object reference and index/handlers identity
  // If feature reference didn't change and callbacks are stable, skip re-render.
  return prevProps.feature === nextProps.feature &&
         prevProps.onChange === nextProps.onChange &&
         prevProps.onBlur === nextProps.onBlur &&
         prevProps.onDelete === nextProps.onDelete;
});

const GetClassFeats = ({ onChange, label, classFeatures, newClass }) => {

  const [loadingWikidotData, setLoadingWikidotData] = useState(false);

  const [localClassFeats, setLocalClassFeats] = useState(classFeatures || []);
  // This listing is used in a new class, where no class features are defined yet.
  // Since classes do not share feats, we don't need to fetch them from the database.

  function handleWikidotData(data) {
      // console.log("Wikidot data received:", data);
  
      var ignored_keys = ['Class Features']
  
      var new_class_features = [];
      for (const [key, value] of Object.entries(data)) {
        if(ignored_keys.includes(key)) {
          continue;
        }
  
        var new_feature = {
          name: key,
          description: value.content,
          table: value.table || {},
          level_requirement: value.level_required || 1,
          benefits: []
        };
        new_class_features.push(new_feature);
      }
      // immutably set the new features array so React re-renders
      onChange(new_class_features);
    }
  
    async function handleWikidotFetch() {
      setLoadingWikidotData(true);
      
      if(label === "Class") {
        await fetchWikidotClassData(newClass.class_name);
      }
    }

    async function fetchWikidotClassData(className) {

      if(className === '') {
        alert('Please provide a class name to fetch from Wikidot.');
        setLoadingWikidotData(false);
        return;
      }
  
      try {
        const res = await fetch(`http://127.0.0.1:8000/wikidot/class/${newClass.class_name}`, {
          method: 'GET',
        });
  
        if (!res.ok) {
          throw new Error(`Wikidot fetch failed: ${res.status}`);
        }
  
        const data = await res.json();
        handleWikidotData(data);
  
        setLoadingWikidotData(false);
      } catch (error) {
        console.error("Error fetching from Wikidot:", error);
        setLoadingWikidotData(false);
      }

    }

  // sync when parent provides new features
  useEffect(() => {
    setLocalClassFeats(classFeatures || []);
  }, [classFeatures]);


  // stable helper: update one feature immutably
  const updateFeatureAt = useCallback((index, patch, propagate = false) => {
    setLocalClassFeats(prev => {
      const next = prev.map((f, i) => i === index ? { ...f, ...patch } : f);
      if (propagate && typeof onChange === 'function') {
        onChange(next);
      }
      return next;
    });
  }, [onChange]);

  const handleFeatureChange = useCallback((index, patch, propagate = false) => {
    updateFeatureAt(index, patch, propagate);
  }, [updateFeatureAt]);

  const handleFeatureBlur = useCallback((index, patch) => {
    // blur should propagate down to parent
    updateFeatureAt(index, patch, true);
  }, [updateFeatureAt]);

  const handleDeleteFeature = useCallback((index) => {
    setLocalClassFeats(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (typeof onChange === 'function') onChange(next);
      return next;
    });
  }, [onChange]);

  return (<>
    <Box display="flex" flexDirection="column" gap={2} alignItems="stretch" mt={2} mb={2}>
      <Typography variant="h6" gutterBottom>
        {label} Features
      </Typography>

      {localClassFeats.map((feature, index) => (
        <FeatureItem
          key={index}
          feature={feature}
          index={index}
          onChange={handleFeatureChange}
          onBlur={handleFeatureBlur}
          onDelete={handleDeleteFeature}
        />
      ))}

      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={handleWikidotFetch} loading={loadingWikidotData} variant="contained" color="success">Fetch from Wikidot</Button>
        <button
          onClick={() => {
            const updatedFeatures = [
              ...localClassFeats,
              { name: '', description: '', table : {}, level_requirement: 1, benefits: []}
            ];
            setLocalClassFeats(updatedFeatures);
            if (typeof onChange === 'function') onChange(updatedFeatures);
          }}
          className="ml-2 bg-blue-500 font-semibold text-white"
          style={{
            padding: '10px 20px',
            border: '2px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Add New Feature
        </button>
      </Box>
    </Box>
  </>)
}

export default GetClassFeats;