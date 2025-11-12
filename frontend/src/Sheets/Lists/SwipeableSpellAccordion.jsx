import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * SwipeableSpellAccordion -> Long-press to delete variant
 * - remains an accordion
 * - long-press (hold pointer/touch) shows a progress animation
 * - if held long enough, plays a quick delete animation and calls onDelete(spell)
 */
const SwipeableSpellAccordion = ({ spell, onDelete }) => {
    const LONG_PRESS_MS = 1000; // hold time required to trigger delete
    const [translateX, setTranslateX] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const containerRef = useRef(null);

    // long-press state
    const pressStartRef = useRef(0);
    const rafRef = useRef(null);
    const delayTimeoutRef = useRef(null);
    const [pressProgress, setPressProgress] = useState(0); // 0..1
    const [isPressing, setIsPressing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // swipe handlers (preserve original swipe behavior)
    const THRESHOLD = 80; // px to reveal delete
    const MAX_SLIDE = 120; // max translate
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            const x = clamp(eventData.deltaX, -MAX_SLIDE, MAX_SLIDE);
            setTranslateX(x < 0 ? x : (revealed ? -THRESHOLD : 0));
        },
        onSwiped: (eventData) => {
            const delta = eventData.deltaX;
            if (delta < -THRESHOLD) {
                setTranslateX(-THRESHOLD);
                setRevealed(true);
            } else {
                setTranslateX(0);
                setRevealed(false);
            }
        },
        trackMouse: true,
        preventDefaultTouchmoveEvent: true,
    });

    // long-press animation loop
    const tickPress = useCallback(() => {
        const start = pressStartRef.current;
        if (!start) return;
        const elapsed = Date.now() - start;
        const progress = Math.min(1, elapsed / LONG_PRESS_MS);
        setPressProgress(progress);
        if (progress >= 1) {
            // completed
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            setIsPressing(false);
            setPressProgress(1);
            // play deletion animation then call onDelete
            setIsDeleting(true);
            // small delay to allow CSS delete animation to show
            setTimeout(() => {
                onDelete?.(spell);
            }, 220);
            return;
        }
        rafRef.current = requestAnimationFrame(tickPress);
    }, [onDelete, spell]);

    // pointer down/up handlers (works for mouse and touch)
    const handlePointerDown = (e) => {
        // avoid starting long-press when interacting with form controls inside
        if (isDeleting) return;
        // left mouse only or touch
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        // Wait 300ms before starting the delete progress
        delayTimeoutRef.current = setTimeout(() => {
            pressStartRef.current = Date.now();
            setIsPressing(true);
            setPressProgress(0);
            // start RAF loop
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(tickPress);
        }, 300);
        
        // capture pointer so we still get up events
        e.target.setPointerCapture?.(e.pointerId);
    };

    const handlePointerUp = (e) => {
        // Clear the delay timeout if it hasn't fired yet
        if (delayTimeoutRef.current) {
            clearTimeout(delayTimeoutRef.current);
            delayTimeoutRef.current = null;
        }
        
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        pressStartRef.current = 0;
        setIsPressing(false);
        setPressProgress(0);
        // release pointer capture
        try { e.target.releasePointerCapture?.(e.pointerId); } catch {}
    };

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
        };
    }, []);

    // styles for progress indicator and delete animation
    const progressStyle = {
        position: 'absolute',
        inset: 0,
        display: isPressing || isDeleting ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 3,
    };

    const progressCircleSize = 48;
    const circleInner = {
        width: progressCircleSize,
        height: progressCircleSize,
        borderRadius: '50%',
        background: `conic-gradient(rgba(220,38,38,0.95) ${pressProgress * 360}deg, rgba(0,0,0,0.08) 0deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        transition: isDeleting ? 'transform 180ms ease, opacity 180ms ease' : 'none',
        transform: isDeleting ? 'scale(0.85)' : 'scale(1)',
        opacity: isDeleting ? 0.75 : 1,
    };

    // deleted animation applied to sliding content
    const slidingStyle = {
        transform: `translateX(${translateX}px)`,
        transition: isDeleting ? 'transform 220ms ease, opacity 220ms ease' : 'transform 160ms ease',
        opacity: isDeleting ? 0.0 : 1,
        zIndex: 2,
    };

    return (
        <div
            ref={containerRef}
            {...handlers}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={(e) => { if (isPressing) handlePointerUp(e); }}
            style={{
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* visual delete hint on right when revealed via swipe */}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: THRESHOLD,
                    display: revealed ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => {
                        if (window.confirm(`Delete spell "${spell.name}"?`)) onDelete?.(spell);
                    }}
                    size="small"
                    sx={{
                        backgroundColor: '#db7f3d',
                        color: '#edeae8',
                        '&:hover': {
                            backgroundColor: '#c46d2f',
                        },
                    }}
                >
                    <DeleteIcon />
                </Button>
            </div>

            {/* progress indicator / long-press feedback */}
            <div style={progressStyle} aria-hidden>
                <div style={circleInner}>
                    {/* optional inner icon */}
                    <DeleteIcon style={{ color: 'white', fontSize: 20 }} />
                </div>
            </div>

            {/* Sliding content */}
            <div
                className='inset-shadow-xl'
                style={slidingStyle}
            >
                <Accordion
                    key={`${spell.name}-${spell.level_requirement}`}
                    className='!shadow-sm'
                    sx={{
                        mb: 1,
                        '&:before': { display: 'none' },
                        backgroundColor: '#edeae8',
                        transformOrigin: 'center left',
                        border: '2px solid #db7f3d',
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                            borderColor: '#c46d2f',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ px: 2, py: 1.25, backgroundColor: '#edeae8' }}
                        className='!bg-edeae8'
                    >
                        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left', width: '100%' }}>
                                <div className="px-2 rounded w-full" style={{backgroundColor: '#edeae8', color: '#1a1a1a'}}>
                                    <div className="font-semibold text-xl" style={{color: '#1a1a1a'}}>{spell.name}</div>
                                    <div className="text-md" style={{color: '#1a1a1a'}}><strong>Casting Time:</strong> {spell.casting_time}</div>
                                    <div className="flex space-x-2">
                                        <div className="text-md" style={{color: '#1a1a1a'}}><strong>Range:</strong> {spell.range}</div>
                                        <div className="text-md" style={{color: '#1a1a1a'}}><strong>Level:</strong> {spell.level}</div>
                                    </div>
                                    <div className="text-md" style={{color: '#1a1a1a'}}><strong className="!text-md">Duration:</strong> {spell.duration}</div>
                                </div>
                            </Box>
                        </Slide>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0, px: 2, pb: 2, backgroundColor: '#edeae8' }} className='!bg-edeae8'>
                        <div className=" px-2 border-t-2" style={{borderColor: '#db7f3d'}}>
                            <div className="text-sm mt-2" style={{color: '#1a1a1a'}}><strong >Components:</strong> {spell.components}</div>
                            <div className="mt-2 text-sm" style={{color: '#1a1a1a'}}>{String(spell.description || '').split("\n\n").map((para, index) => (
                                <p className="mt-2" key={index}>{para}</p>
                            ))}</div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
};

export default SwipeableSpellAccordion;