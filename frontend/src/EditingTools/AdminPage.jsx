import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import Navbar from '../Navbar/Navbar';

export function AdminPage() {
    return (
        <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <Navbar />
            <Paper
                sx={{
                    width: '100%',

                    marginTop: '-18px',
                    minHeight: '93vh',
                    boxSizing: 'border-box',
                }}
                elevation={3}
            >
                <Grid container spacing={2} style={{ height: '100%' }}>
                    <div className='flex flex-col w-full'>

                        <Grid item xs={12} padding={2}>
                            <h1 className='text-5xl font-semibold'>Admin Page</h1>
                        </Grid>
                        <Grid className=' mr-2 grid grid-cols-3 gap-x-2 gap-y-8 !w-full px-4 !h-min-200'  >
                            <Button variant="outlined" href="/admin/items" color='primary' className='w-full !py-10 text-center !text-3xl p-2' >
                                Edit Items
                            </Button>
                            <Button variant="outlined" href="/admin/classes" color='primary' className='w-full !py-10 text-center !text-3xl p-2' >
                                Edit Classes
                            </Button>

                            <Button variant="outlined" href="/admin/subclasses" color='primary' className='w-full py-10 text-center !text-3xl p-2' >
                                Edit Subclasses
                            </Button>

                        </Grid>
                    </div>
                </Grid>
            </Paper>
        </div>
    )
}