import React, { useState, useRef } from 'react';
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
 * SwipeableFeatureAccordion
 * - swipe left to reveal a Delete button
 * - if swipe exceeds threshold it stays revealed
 * - tap Delete to confirm
 */
const SwipeableSpellAccordion = ({ spell, onDelete }) => {
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
        if (window.confirm(`Delete spell "${spell.name}"?`)) {
            onDelete?.(spell);
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
                    <DeleteIcon />
                </Button>
            </div>

            {/* Sliding content */}
            <div
            className='inset-shadow-xl'
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: 'transform 160ms ease',
                    zIndex: 2,
                }}
            >
                <Accordion
                    key={`${spell.name}-${spell.level_requirement}`}
                    
                    className='!shadow-sm  '
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

                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'left', width: '100%', }}>
                                <div className="px-2 bg-amber-50 rounded w-full">

                                    <div className="font-semibold text-xl">{spell.name}</div>

                                    {/* Range / Casting Time */}
                                    <div className="text-md"><strong>Casting Time:</strong> {spell.casting_time}</div>
                                    <div className="flex space-x-2">
                                        
                                        <div className="text-md"><strong>Range:</strong> {spell.range}</div>
                                        <div className="text-md"><strong>Level:</strong> {spell.level}</div>
                                    </div>

                                    <div className="text-md"><strong className="!text-md">Duration:</strong> {spell.duration}</div>
                                </div>


                            </Box>
                        </Slide>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }} className='!bg-amber-50'>
                        <div className=" px-2 border-t-2 ">

                            <div className="text-sm mt-2"><strong >Components:</strong> {spell.components}</div>
                            <div className="mt-2 text-sm">{spell.description.split("\n\n").map((para, index) => (
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