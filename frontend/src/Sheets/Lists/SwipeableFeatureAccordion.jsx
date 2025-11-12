import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
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

    function GetTableOfFeature(feature) {
        //Check if the table has feature.table.table_header
        if (feature.tables && feature.tables.length > 0) {
            console.log("Feature has tables:", feature.tables);

            var table_content = [];

            feature.tables.forEach(table => {
                const table_columns = table.num_columns;

                var formatted_header = [];
                if (Array.isArray(table.table_header) == false) {
                    formatted_header.push(
                        <th key={0} colSpan={table_columns} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            {table.table_header}
                        </th>
                    );
                } else {
                    table.table_header.forEach((header, index) => {
                        formatted_header.push(
                            <th key={index} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                {header}
                            </th>
                        );
                    });
                }

                var formatted_rows = [];
                table.table_rows.forEach((row_data, i) => {
                    var row = [];
                    if (Array.isArray(table.table_rows[i])) {
                        for (let j = 0; j < table_columns; j++) {
                            if (j === table_columns - 1) {
                                // We are at the last column, if there's more entries merge them all into the last position
                                let remaining = row_data.slice(j).filter(Boolean).join(" ");
                                row.push(<td key={j} style={{ border: '1px solid #ddd', padding: '8px' }}>{remaining}</td>);
                            } else {
                                const cellData = table.table_rows[i][j];
                                row.push(<td key={j} style={{ border: '1px solid #ddd', padding: '8px' }}>{cellData || ''}</td>);
                            }
                        }
                    } else {
                        // If it's just text, occupy both rows like a header
                        row.push(<td key={0} colSpan={table_columns} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>{table.table_rows[i]}</td>);
                    }

                    formatted_rows.push(<tr key={i}>{row}</tr>);
                });



                table_content.push( <>
                    <br />
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2px' }}>
                        <thead>
                            <tr>
                                {formatted_header}
                            </tr>
                        </thead>
                        <tbody>
                            {formatted_rows}
                        </tbody>
                    </table>
                </>);
            });
            return table_content;
        } else {
            return [];
        }

    }

    function GetFeatureDescription(feature) {
        if (feature.description) {
            //Remove any "\n\n[Table data available, it will be shown in the sheet.]" from the description
            if (feature.description.includes("\n\n[Table data available, it will be shown in the sheet.]")) {
                return feature.description.replace("\n\n[Table data available, it will be shown in the sheet.]", "");
            } else {
                return feature.description;
            }
        } else {
            return "No description available.";
        }
    }

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
                    background: '#ffffff',
                    display: revealed ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleDelete}
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
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        '&:before': { display: 'none' },
                        borderRadius: 2,
                        border: '2px solid #db7f3d',
                        backgroundColor: '#edeae8',
                        '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                            borderColor: '#c46d2f',
                        },
                        transition: 'all 0.2s ease',
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
                            {GetFeatureDescription(feature)}

                        </Typography>
                        {GetTableOfFeature(feature).map((tableElement, index) => (
                            <div key={index}>
                                {tableElement}
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </div>

        </div>
    );
};

export default SwipeableFeatureAccordion;