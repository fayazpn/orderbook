import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AppRouter from './AppRouter';
import { THEME_OBJECT } from './constants/theme-constants';

function App() {
  const theme = createTheme(THEME_OBJECT);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
