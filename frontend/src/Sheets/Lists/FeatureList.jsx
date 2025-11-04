import React, {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Popover from '@mui/material/Popover';

function FeatureList( {label,features}) {

    //Feature hovering
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {

        setOpenedIndex(String(event.currentTarget.id));
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setOpenedIndex("");
        setAnchorEl(null);
    };

    const [openedIndex, setOpenedIndex] = useState("");

    return (
        <Accordion className='!mt-4 '>
                                        <AccordionSummary
                                            expandIcon={<ArrowDownwardIcon />}
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                        >
                                            <Typography component="span" className='!text-xl !font-semibold'>{label} Features</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ul className='list-disc list-inside'>
                                                {features.map((feature, index) => (
                                                    <div key={index} className='!w-fit flex flex-row space-x-2'>

                                                        <Typography
                                                            className='!text-blue-500 !underline !text-2xl !mb-4 !w-fit'
                                                            key={index}
                                                            aria-owns={openedIndex === `class_feature-${index}` ? `mouse-over-${index}` : undefined}
                                                            aria-haspopup="true"
                                                            id={`class_feature-${index}`}
                                                            onMouseEnter={handlePopoverOpen}
                                                            onMouseLeave={handlePopoverClose}>
                                                            {feature.name}
                                                        </Typography>
                                                        <Typography
                                                            className=' !text-2xl !mb-4 !w-fit !ml-2'

                                                        >
                                                            (Lvl. {feature.level_requirement})
                                                        </Typography>

                                                        <Popover
                                                            id={`class_feature-${index}`}
                                                            sx={{ pointerEvents: 'none' }}
                                                            open={openedIndex === `class_feature-${index}`}
                                                            anchorEl={anchorEl}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                            onClose={handlePopoverClose}
                                                            disableRestoreFocus
                                                        >
                                                            <Typography sx={{ p: 1 }}>{feature.description}</Typography>
                                                        </Popover>
                                                    </div>

                                                ))}
                                            </ul>
                                        </AccordionDetails>
                                    </Accordion>
    )
}

export default FeatureList;