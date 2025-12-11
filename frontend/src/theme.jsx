import { createTheme, alpha } from '@mui/material/styles';


// On refresh, randomize the primary color for a given array
const primaryPool = [
'#ffba59',
'#caf760',
'#68d854',
'#66c9ad',
'#73cbe4',
'#7bb0f5',
'#8682ff',
'#dc82ff',
'#ff82f3',
'#ff82b4',
'#ff8282',
'#ff3b58',
'#e8d97f',
'#e8ad3f',
'#ffbe45',
];


// const testCol = '#73cbe4';

const randomPrimary = primaryPool[Math.floor(Math.random() * primaryPool.length)];

const base = createTheme();



const baseColor = base.palette.augmentColor({
  color: { main: '#0a0a0a' },
  name: 'baseColor',
});




const textMain = base.palette.augmentColor({
  color: { main: '#030201' },
  name: 'textMain',
});

const textHighlights = base.palette.augmentColor({
  color: { main: '#f3f3f3' },
  name: 'textHighlights',
});

const textHover = base.palette.augmentColor({
  color: { main: '#ffffff' },
  name: 'textHover',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    baseColor,
    primary: { main: randomPrimary },
    secondary: { main: '#0372da' },
    error: { main: '#e01f1f' },
    success: { main: '#4caf50' },
    background: {
      default: '#3a3a3a',   // page background
      paper: '#f5f5f5',     // cards/dialogs; change to '#2f2f2f' if you want dark surfaces
    },
    textMain,
    textHighlights,
    textHover,
  },
  components: {
    MuiTextField: {
     styleOverrides: {
       root: ({ theme }) => ({
         '& .MuiOutlinedInput-root': {
           '& fieldset': {
             borderColor: theme.palette.baseColor.main,
           },
           '&:hover fieldset': {
             borderColor: theme.palette.primary.main,
           },
           '&.Mui-focused fieldset': {
             borderColor: theme.palette.primary.main,
           },
         },
       }),
     },
   },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          transition: 'background-color 150ms ease, box-shadow 150ms ease',
        },
        // Keep contained buttons from darkening too much on hover
        containedPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.main, // no strong darken
            filter: 'brightness(0.97)',                 // subtle change
            boxShadow: theme.shadows[2],
          },
        }),
        containedSecondary: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            filter: 'brightness(0.97)',
            boxShadow: theme.shadows[2],
          },
        }),
        // Softer hover for outlined/text variants too
        outlinedPrimary: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.primary.main, 0.15),
          color: alpha('#000000',0.8),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.95),
            borderColor: theme.palette.primary.main,
            color: '#000000'
          },
        }),
        outlinedError: ({ theme }) => ({
          '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.95),
            borderColor: theme.palette.error.main,
            color: '#000000'

          },
        }),
        outlinedSuccess: ({ theme }) => ({
          '&:hover': {
            backgroundColor: alpha(theme.palette.success.main, 0.95),
            borderColor: theme.palette.success.main,
            color: '#000000'
          }
        }),
        textPrimary: ({ theme }) => ({
          
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }),
      },
    },
  },
});

export default theme;