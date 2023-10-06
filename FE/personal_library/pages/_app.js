import '@/styles/globals.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#059669",
    },
    secondary: {
      main: "#059669",
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
  <ThemeProvider theme={theme}>  
    <Component  {...pageProps} />
  </ThemeProvider>)
}
