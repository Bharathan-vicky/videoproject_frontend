import { createTheme } from '@mui/material/styles';

const BMW_BLUE = '#0066B1';
const BMW_WHITE = '#FFFFFF';
const BMW_DARK = '#1C1C1E';
const SILVER = '#C0C0C0';
const LIGHT_GRAY = '#F5F5F7';
const ACCENT_RED = '#E4002B';

const theme = createTheme({
  palette: {
    primary: { main: BMW_BLUE, contrastText: BMW_WHITE },
    secondary: { main: SILVER, contrastText: BMW_DARK },
    error: { main: ACCENT_RED },
    background: { default: BMW_WHITE, paper: LIGHT_GRAY },
    text: { primary: BMW_DARK, secondary: '#525252' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '0.02em' },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          padding: '8px 24px'
        },
        contained: {
          background: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 10px rgba(28, 105, 212, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #1657B0 0%, #083D80 100%)',
            boxShadow: '0 6px 15px rgba(28, 105, 212, 0.4)',
            transform: 'translateY(-1px)'
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2
          }
        }
      }
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: BMW_WHITE, color: BMW_DARK } } },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4F8 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }
      }
    }
  }
});

export default theme;


