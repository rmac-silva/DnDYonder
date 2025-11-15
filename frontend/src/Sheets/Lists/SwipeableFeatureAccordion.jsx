import React, { useState, useRef, useEffect, useCallback } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Long-press delete (with grace + progress animation)
 * - 300ms grace (tap expands only)
 * - Radial progress appears after grace
 * - Hold for 1000ms to delete (fade + scale)
 */
const LONG_PRESS_MS = 1000;
const ACTIVATION_DELAY_MS = 300;

const SwipeableFeatureAccordion = ({ feature, onDelete }) => {
  const [holdActive, setHoldActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const activationTimerRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);

  const startProgressLoop = useCallback(() => {
    startTimeRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(1, elapsed / LONG_PRESS_MS);
      setProgress(p);
      if (p >= 1) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        setIsDeleting(true);
        setTimeout(() => onDelete?.(feature), 250);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [onDelete, feature]);

  const handlePointerDown = (e) => {
    if (isDeleting) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    activationTimerRef.current && clearTimeout(activationTimerRef.current);
    activationTimerRef.current = setTimeout(() => {
      setHoldActive(true);
      setProgress(0);
      startProgressLoop();
    }, ACTIVATION_DELAY_MS);
  };

  const cancelHold = () => {
    if (activationTimerRef.current) {
      clearTimeout(activationTimerRef.current);
      activationTimerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHoldActive(false);
    setProgress(0);
  };

  const handlePointerUp = () => {
    if (!isDeleting) cancelHold();
  };

  useEffect(() => {
    return () => {
      activationTimerRef.current && clearTimeout(activationTimerRef.current);
      rafRef.current && cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const progressOverlayStyle = {
    position: 'absolute',
    inset: 0,
    display: holdActive || isDeleting ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 2,
  };

  const circleSize = 36;
  const progressCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: '50%',
    background: isDeleting
      ? 'linear-gradient(135deg, #dc2626, #7f1d1d)'
      : `conic-gradient(#dc2626 ${progress * 360}deg, rgba(0,0,0,0.12) 0deg)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
    transition: 'transform 200ms ease, opacity 200ms ease',
    transform: isDeleting ? 'scale(0.85)' : holdActive ? 'scale(1)' : 'scale(0.5)',
    opacity: isDeleting ? 0.9 : 1,
  };

  const wrapperStyle = {
    position: 'relative',
    overflow: 'hidden',
    transition: isDeleting ? 'transform 250ms ease, opacity 250ms ease' : 'transform 160ms ease',
    transform: isDeleting ? 'scale(0.92)' : 'scale(1)',
    opacity: isDeleting ? 0 : 1,
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ position: 'relative' }}
    >
      <div style={progressOverlayStyle}>
        <div style={progressCircleStyle}>
            <DeleteIcon style={{ color: '#fff', fontSize: 22 }} />
        </div>
      </div>

      <div style={wrapperStyle}>
        <Accordion
          key={feature?.name}
          sx={{ mb: 1, '&:before': { display: 'none' }, backgroundColor: '#fff' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={(theme) => ({
              px: 2,
              py: 1,
              transition: 'box-shadow 50ms ease, border-color 150ms ease',
              '&:not(.Mui-expanded):hover': { boxShadow: 2 },
              '&.Mui-expanded, &.Mui-expanded:hover': { boxShadow: 'none' },
              '&.Mui-expanded': {
                borderLeft: `2px solid ${theme.palette.grey[300]}`,
                borderRight: `2px solid ${theme.palette.grey[300]}`,
                borderTop: `2px solid ${theme.palette.grey[300]}`,
                borderBottom: 'none',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              },
            })}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-semibold text-lg" style={{ flex: 1 }}>{feature?.name || 'Feature'}</div>
              {feature?.level_requirement != null && (
                <div className="text-sm text-gray-600" style={{ marginLeft: 12 }}>Level {feature.level_requirement}</div>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, px: 2, pb: 2, mb:2}} className='border-2 border-neutral-200 border-t-0 rounded-b-2xl'>
            <div className="text-md ">
              {String(feature?.description || '').split('\n\n').map((p, i) => (
                <p key={i} className="">{p}</p>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default SwipeableFeatureAccordion;