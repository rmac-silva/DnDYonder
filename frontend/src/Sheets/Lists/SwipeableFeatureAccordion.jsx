import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
/**
 * SwipeableFeatureAccordion
 * - swipe left to reveal a Delete button
 * - if swipe exceeds threshold it stays revealed
 * - tap Delete to confirm
 */
const SwipeableFeatureAccordion = ({ feature, onDelete }) => {
    const THRESHOLD = 80; // px to reveal delete
    const MAX_SLIDE = 120; // max translate
    const [translateX, setTranslateX] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const containerRef = useRef(null);

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            // eventData.deltaX: positive = right, negative = left
            const x = clamp(eventData.deltaX, -MAX_SLIDE, MAX_SLIDE);
            // only allow left motion (negative) to reveal delete
            setTranslateX(x < 0 ? x : (revealed ? -THRESHOLD : 0));
        },
        onSwiped: (eventData) => {
            const delta = eventData.deltaX;
            if (delta < -THRESHOLD) {
                // reveal delete area
                setTranslateX(-THRESHOLD);
                setRevealed(true);
            } else {
                // hide
                setTranslateX(0);
                setRevealed(false);
            }
        },
        trackMouse: true,
        preventDefaultTouchmoveEvent: true,
    });

    const handleHide = () => {
        setTranslateX(0);
        setRevealed(false);
    };

    const handleDelete = () => {
        // optional: confirm
        if (window.confirm(`Delete feature "${feature.name}"?`)) {
            onDelete?.(feature);
        } else {
            handleHide();
        }
    };

    return (
        <div
            ref={containerRef}
            {...handlers}
            style={{
                position: 'relative',
                overflow: 'hidden',
                // give a little space between items

            }}
        >
            {/* Delete action revealed on the right */}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: THRESHOLD,
                    background: '#ff5252',
                    display: revealed ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    size="small"
                >
                    Delete
                </Button>
            </div>

            {/* Sliding content */}
            <div
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: 'transform 160ms ease',
                    zIndex: 2,
                }}
            >
                <Accordion
                    key={`${feature.name}-${feature.level_requirement}`}
                    TransitionProps={{ unmountOnExit: true }}
                    sx={{
                        mb: 1,
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.04)',
                        backgroundColor: '#fff',
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ px: 2, py: 1.25 }}
                    >
                        <Slide direction="left" in={true} mountOnEnter unmountOnExit>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 12 }}>
                                <Typography sx={{ fontWeight: 800 }}>{feature.name}</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>Level {feature.level_requirement}</Typography>

                            </div>
                        </Slide>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
                        <Typography className='!text-lg' variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#333', lineHeight: 1.45 }}>
                            {feature.description || 'No description provided.'}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>

        </div>
    );
};

export default SwipeableFeatureAccordion;