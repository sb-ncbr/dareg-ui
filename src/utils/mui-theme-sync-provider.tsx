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
              root: {
                backgroundColor: "#f5f5f5",
              },
              indicator: {
                backgroundColor: "#27272a",
                height: 4,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
                "&.Mui-selected": {
                  color: "#27272a",
                },
                "&:not(.Mui-selected)": {
                  color: "#555",
                },
              },
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
