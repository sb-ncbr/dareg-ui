"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { useTheme } from "next-themes";

export function MuiThemeProviderSync({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "Inter, sans-serif",
        },
        components: {
          MuiFormControl: {
            styleOverrides: {
              root: {
                marginTop: "6px",
                marginBottom: "6px",
              },
            },
          },
          MuiGrid: {
            defaultProps: {
              rowSpacing: 64,
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                "&.Mui-disabled": {
                  opacity: 1,
                  color: "#666",
                },

                "& input.Mui-disabled": {
                  color: "#666",
                  WebkitTextFillColor: "#666",
                  opacity: 1,
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                "&.Mui-disabled": {
                  color: "#888",
                  opacity: 1,
                },
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "var(--sidebar-background)"
                    : "var(--sidebar)",
                color:
                  theme.palette.mode === "dark"
                    ? "var(--sidebar-foreground)"
                    : "var(--sidebar-foreground)",
                minHeight: 48,
              }),
              indicator: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "var(--sidebar-accent-foreground)"
                    : "var(--sidebar-accent-foreground)",
                height: 3,
              }),
            },
          },
          MuiTab: {
            styleOverrides: {
              root: ({ theme }) => ({
                textTransform: "none",
                fontWeight: 500,
                color:
                  theme.palette.mode === "dark"
                    ? "var(--sidebar-foreground)"
                    : "var(--sidebar-accent-foreground)", // <-- Use dark green for light theme
                minHeight: 48,
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "var(--sidebar-accent)"
                      : "var(--sidebar-accent)",
                  color:
                    theme.palette.mode === "dark"
                      ? "var(--sidebar-accent-foreground)"
                      : "var(--sidebar-accent-foreground)",
                },
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "var(--sidebar-accent)"
                      : "var(--sidebar-accent)",
                  color:
                    theme.palette.mode === "dark"
                      ? "var(--sidebar-accent-foreground)"
                      : "var(--sidebar-accent-foreground)",
                },
              }),
            },
          },
          MuiTextField: {
            defaultProps: {
              fullWidth: true,
              margin: "normal",
            },
            styleOverrides: {
              root: {
                width: "100%",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark" ? "#000000" : "#fff", // or your preferred color
                width: "100%",
                maxWidth: "100%",
              }),
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                width: "570px",
                padding: "1px", // or your preferred spacing
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: "none !important",
                borderRadius: 0,
                border: "none",
              },
            },
          },
        },

        palette: {
          mode: theme === "dark" ? "dark" : "light",
        },
      }),
    [theme]
  );

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}
