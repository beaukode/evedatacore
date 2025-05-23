import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { AppContextProvider } from "./contexts/AppContextProvider.tsx";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ff2b",
      dark: "#009a22",
      light: "#36ba01",
    },
    secondary: {
      main: "#5fbe92",
      light: "#30ffa4",
      dark: "#031624",
    },
    background: {
      default: "#002200",
      paper: "#111111",
    },
    text: {
      primary: "#00ff2b",
      secondary: "#5fbe92",
      disabled: "rgba(0,255,43,0.5)",
    },
    error: {
      main: "#ff0922",
      dark: "#66030d",
      light: "#ff5264",
    },
  },
  components: {
    MuiTextField: { defaultProps: { variant: "standard" } },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontFamily: "Major Mono Display" },
      },
    },
    MuiTableCell: { styleOverrides: { root: { overflow: "hidden" } } },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          fontFamily: "monospace",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // Fix icon alignment in titles
          "& .MuiSvgIcon-root": {
            verticalAlign: "middle",
            marginRight: "8px",
          },
        },
      },
    },
  },
  typography: {
    fontFamily: "monospace",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </StrictMode>
);
