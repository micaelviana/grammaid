"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#212121", // Cinza escuro (quase preto)
      light: "#424242",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#616161", // Cinza médio
      light: "#9e9e9e",
      dark: "#424242",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff", // Fundo branco
      paper: "#fafafa", // Cinza muito claro
    },
    text: {
      primary: "#212121", // Preto/cinza escuro
      secondary: "#757575", // Cinza médio
    },
    error: {
      main: "#dc2626",
      light: "##f20253",
    },
    warning: {
      main: "#ea580c",
    },
    info: {
      main: "#424242",
    },
    success: {
      main: "#616161",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          backgroundColor: "#272c36",
        },
      },
    },
  },
});

export default theme;
