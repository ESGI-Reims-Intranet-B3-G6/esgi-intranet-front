import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import baseApi from "./services";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { frFR } from "@mui/material/locale";
import { frFR as frFRDataGrid } from '@mui/x-data-grid/locales';

const theme = createTheme(
	{
		palette: {
			mode: 'dark',
		},
	},
	frFR,
  frFRDataGrid
);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
    <ApiProvider api={baseApi}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
			  <App />
      </ThemeProvider>
    </ApiProvider>
	</StrictMode>
);
