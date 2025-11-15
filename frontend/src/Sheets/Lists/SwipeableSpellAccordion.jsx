import React, { useState, useRef, useEffect, useCallback } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slide from '@mui/material/Slide';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Long-press delete:
 * - 300ms grace period (so quick tap just expands)
 * - After grace, radial progress appears
 * - Hold for LONG_PRESS_MS to trigger delete
 * - Deletion animates (fade + scale down) before callback
 */
const LONG_PRESS_MS = 1000;
const ACTIVATION_DELAY_MS = 300;

const SwipeableSpellAccordion = ({ spell, onDelete }) => {
  const [holdActive, setHoldActive] = useState(false);      // after grace period
  const [progress, setProgress] = useState(0);              // 0..1 after activation
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
        // trigger delete animation
        setIsDeleting(true);
        setTimeout(() => onDelete?.(spell), 250); // allow animation to finish
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [onDelete, spell]);

  const handlePointerDown = (e) => {
    if (isDeleting) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Start grace period (no progress yet)
    activationTimerRef.current && clearTimeout(activationTimerRef.current);
    activationTimerRef.current = setTimeout(() => {
      setHoldActive(true);
      setProgress(0);
      startProgressLoop();
    }, ACTIVATION_DELAY_MS);
  };

  const cancelHold = () => {
    // If still in grace period
    if (activationTimerRef.current) {
      clearTimeout(activationTimerRef.current);
      activationTimerRef.current = null;
    }
    // If progress already running
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

  // Styles
  const progressOverlayStyle = {
    position: 'absolute',
    inset: 0,
    display: holdActive || isDeleting ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 2,
  };

  const circleSize = 54;
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
      {/* Progress / deletion overlay */}
      <div style={progressOverlayStyle}>
        <div style={progressCircleStyle}>
          <DeleteIcon style={{ color: '#fff', fontSize: 22 }} />
        </div>
      </div>

      <div style={wrapperStyle}>
        <Accordion
          key={spell.id ?? `${spell.name}-${spell.level_requirement}`}
          sx={{
            mb: 1,
            '&:before': { display: 'none' },
            backgroundColor: '#fff',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 2, py: 1.25 }}
            className='!bg-amber-50'
          >
            <Slide direction="left" in={true} mountOnEnter unmountOnExit>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="px-2 bg-amber-50 rounded w-full">
                  <div className="font-semibold text-xl">{spell.name}</div>
                  <div className="text-md"><strong>Casting Time:</strong> {spell.casting_time}</div>
                  <div className="flex space-x-2">
                    <div className="text-md"><strong>Range:</strong> {spell.range}</div>
                    <div className="text-md"><strong>Level:</strong> {spell.level}</div>
                  </div>
                  <div className="text-md"><strong>Duration:</strong> {spell.duration}</div>
                </div>
              </Box>
            </Slide>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }} className='!bg-amber-50'>
            <div className="px-2 border-t-2">
              <div className="text-sm mt-2"><strong>Components:</strong> {spell.components}</div>
              <div className="mt-2 text-sm">
                {String(spell.description || '').split('\n\n').map((para, i) => (
                  <p key={i} className="mt-2">{para}</p>
                ))}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default SwipeableSpellAccordion;