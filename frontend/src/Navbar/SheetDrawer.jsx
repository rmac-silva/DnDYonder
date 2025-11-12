import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';
import SheetSidebar from "../Sheets/SheetSidebar";
import { useState} from "react";
function SheetDrawer() {

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(open);
    };

    return ( <div className="-ml-8">
        <Button onClick={toggleDrawer(true)} sx={{ color: '#1a1a1a' }}><MenuIcon sx={{ color: '#1a1a1a' }}/></Button>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)} PaperProps={{ sx: { backgroundColor: '#edeae8' } }}>
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