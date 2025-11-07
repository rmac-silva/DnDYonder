import { React, useEffect, useState } from 'react'
import { useAuth } from '../../Auth/AuthContext.jsx';
import { Link as RouterLink } from 'react-router-dom';
import CreateNewSheet from './CreateNewSheet.jsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Navbar from '../../Navbar/Navbar.jsx';

/*
TODO: Add confirmation dialog before deleting a sheet
*/
function SheetListings() {

    const [sheets, setSheets] = useState([]);
    const { authUsername, checkAuth } = useAuth();


    const deleteSheet = async (sheetId) => {
        try {
            let payload = {"token" : localStorage.getItem("authToken")}

            const res = await fetch(`http://127.0.0.1:8000/sheets/${authUsername}/${sheetId}`, {
                method: 'DELETE', // or PUT depending on your API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if(!res.ok) throw new Error(`Delete failed: ${res.status}`);

            // const deleted = await res.json(); - Do something with the success message
            
            // Refresh the list of sheets after deletion
            setSheets(sheets.filter(sheet => sheet.id !== sheetId));

        } catch (error) {
            console.error('delete error', error);
            throw error;
        }
    }

    const getClassIcon = (className) => {

        if(className === null || className === undefined) {
            return null;
        }

        switch (className.toLowerCase()) {
            case "artificer":
                return (<i className="fa-solid fa-gears text-4xl"></i>)
            case "barbarian":
                return (<i className="fa-solid fa-droplet text-4xl"></i>)
            case "bard":
                return (<i className="fa-solid fa-music text-4xl"></i>)
            case "cleric":
                return (<i className="fa-solid fa-hands-praying text-4xl"></i>)
            case "druid":
                return (<i className="fa-solid fa-leaf text-4xl"></i>)
            case "fighter":
                return (<i className="fa-solid fa-gavel text-4xl"></i>)
            case "monk":
                return (<i className="fa-solid fa-hand-fist text-4xl"></i>)
            case "paladin":
                return (<i className="fa-solid fa-shield-halved text-4xl"></i>)
            case "ranger":
                return (<i className="fa-solid fa-paw text-4xl"></i>)
            case "rogue":
                return (<i className="fa-solid fa-mask text-4xl"></i>)
            case "sorcerer":
                return (<i className="fa-solid fa-fire text-4xl"></i>)
            case "warlock":
                return (<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 512 512"><path fill="#ffffff" d="m256 16l-32 112l32 32l32-32zM64 96l32 80l64 16zm384 0l-96 96l64-16zm-192 80l-64 48l-128 32c80 16 128 96 192 128c64-32 112.476-110.213 192-128l-128-28.31zm-39.512 52.682l28.342 8.863l-7.45 20.955L256 310.895l18.62-52.395l-7.45-20.955l28.342-8.863c14.923 10.97 24.488 28.03 24.488 47.283C320 309.237 291.47 336 256 336s-64-26.763-64-60.035c0-19.254 9.565-36.314 24.488-47.283M96 336l-64 48l-16 64l32-32l64-48s-16-27.61-16-32m320 0l-16 32l64 48l32 32l-16-64zm-272 64l-16 64l48-48zm112 0l-48 16l48 80l48-80zm112 0l-32 16l48 48z" /></svg>)
            case "wizard":
                return (<i className="fa fa-magic text-4xl"></i>)
        }
    }

    useEffect(() => {
        // Fetch the sheets from the backend
        const fetchSheets = async () => {
            if (authUsername === null) {
                await checkAuth();
                return;
            }

            try {

                const response = await fetch(`http://127.0.0.1:8000/sheets/${authUsername}`,
                    { method: "GET" }
                );
                const data = await response.json();
                if (response.ok) {
                    setSheets(data);
                    // console.log("Fetched sheets:", data);
                }

            } catch (error) {
                console.error("Error fetching sheets:", error);
                setSheets([]);
            }

        };

        fetchSheets();
    }, [checkAuth, authUsername]);

    return (
        <>
            <Navbar />

            <div >
                {/* Show the option to create a single listing */}

                {/* Fetch the sheets from the user, list them here */}
                <div className='mt-4 flex flex-wrap space-y-8'>
                    <CreateNewSheet />
                    {sheets.length !== 0 &&
                        <>
                            {sheets.map(sheet => (
                                
                                <div key={sheet.id}>
                                    <Box
                                        className="!bg-slate-400/50 !w-48 !h-62 !mx-4 !rounded !flex !flex-col !items-center !justify-center relative"
                                    >
                                        <Button
                                            component={RouterLink}
                                            to={`/sheets/${authUsername}/${sheet.id}`}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textTransform: 'none',
                                                p: 0,
                                                gap: 1,
                                                color: 'inherit',
                                            }}
                                        >
                                            {getClassIcon(sheet.class?.class_name)}

                                            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                                                {sheet.name}
                                            </Typography>
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                                                {sheet.class?.class_name}
                                            </Typography>
                                        </Button>
                                        <i
                                            className="fa-solid fa-trash absolute top-4 right-4  cursor-pointer hover:text-red-500"
                                            onClick={() => deleteSheet(sheet.id)}
                                        ></i>
                                    </Box>
                                </div>
                            ))}</>}
                </div>
            </div>
        </>
    )
}

export default SheetListings