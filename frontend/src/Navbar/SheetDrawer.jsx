import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';
import SheetSidebar from "../Sheets/SheetSidebar";
import { useState} from "react";
import COLORS from '../constants/colors.js';
function SheetDrawer() {

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(open);
    };

    return ( <div className="-ml-8">
        <Button onClick={toggleDrawer(true)} sx={{ color: COLORS.secondary }}><MenuIcon sx={{ color: COLORS.secondary }}/></Button>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)} PaperProps={{ sx: { backgroundColor: COLORS.primary } }}>
            <div
            className="w-full"
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <SheetSidebar />
            </div>
        </Drawer>
    </div>)
}

export default SheetDrawer;