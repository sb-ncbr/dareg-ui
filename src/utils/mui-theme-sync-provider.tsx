"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { useTheme } from "next-themes";

function getRadiusPx(): number {
  if (typeof document !== "undefined") {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--radius")
      .trim();
    if (value) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return value.includes("rem") ? Math.round(num * 16) : num;
      }
    }
  }
  return 10; // 0.625rem default
}

/**
 * Resolve a CSS custom property to a hex color string.
 * MUI palette does not support CSS var() syntax, so we read the
 * computed value (which browsers return as rgb/rgba) and convert it.
 */
function cssVarToHex(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;

  const el = document.createElement("div");
  el.style.color = `var(${varName})`;
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  document.body.appendChild(el);

  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);

  const rgbMatch = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .padStart(6, "0")
    );
  }

  return fallback;
}

/** Light-mode fallback hex values (synced with globals.css) */
const LIGHT_FALLBACKS: Record<string, string> = {
  "--primary": "#257400",
  "--primary-foreground": "#ffffff",
  "--secondary": "#f7f7f7",
  "--secondary-foreground": "#343434",
  "--background": "#ffffff",
  "--foreground": "#3d3d3d",
  "--card": "#ffffff",
  "--popover": "#ffffff",
  "--muted": "#f7f7f7",
  "--muted-foreground": "#8e8e8e",
  "--accent": "#f7f7f7",
  "--destructive": "#ef4444",
  "--destructive-foreground": "#ef4444",
  "--border": "#ebebeb",
  "--input": "#ebebeb",
  "--ring": "#b4b4b4",
};

/** Dark-mode fallback hex values (synced with globals.css) */
const DARK_FALLBACKS: Record<string, string> = {
  "--primary": "#257400",
  "--primary-foreground": "#ffffff",
  "--secondary": "#444444",
  "--secondary-foreground": "#fafafa",
  "--background": "#0a0a0a",
  "--foreground": "#fafafa",
  "--card": "#252525",
  "--popover": "#252525",
  "--muted": "#444444",
  "--muted-foreground": "#b4b4b4",
  "--accent": "#444444",
  "--destructive": "#b42318",
  "--destructive-foreground": "#b42318",
  "--border": "#444444",
  "--input": "#444444",
  "--ring": "#707070",
};

function resolveColors(
  isDark: boolean
): Record<string, string> {
  const fallbacks = isDark ? DARK_FALLBACKS : LIGHT_FALLBACKS;
  const resolved: Record<string, string> = {};
  for (const key of Object.keys(fallbacks)) {
    resolved[key] = cssVarToHex(key, fallbacks[key]);
  }
  return resolved;
}

export function MuiThemeProviderSync({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = React.useMemo(() => resolveColors(isDark), [isDark]);

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          primary: {
            main: colors["--primary"],
            contrastText: colors["--primary-foreground"],
          },
          secondary: {
            main: colors["--secondary"],
            contrastText: colors["--secondary-foreground"],
          },
          background: {
            default: colors["--background"],
            paper: colors["--card"],
          },
          text: {
            primary: colors["--foreground"],
            secondary: colors["--muted-foreground"],
          },
          divider: colors["--border"],
          error: {
            main: colors["--destructive"],
            contrastText: colors["--destructive-foreground"],
          },
          action: {
            hover: colors["--accent"],
            selected: colors["--accent"],
            disabled: colors["--muted-foreground"],
            disabledBackground: colors["--muted"],
          },
        },
        typography: {
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          button: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
          },
          body1: {
            fontSize: "0.875rem",
          },
          body2: {
            fontSize: "0.75rem",
          },
        },
        shape: {
          borderRadius: getRadiusPx(),
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: "var(--radius)",
                fontWeight: 500,
                fontSize: "0.875rem",
                padding: "0.5rem 1rem",
                minHeight: "2.25rem",
              },
              contained: {
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--primary)",
                  filter: "brightness(0.95)",
                  boxShadow: "none",
                },
              },
              outlined: {
                borderColor: "var(--input)",
                color: "var(--foreground)",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                  borderColor: "var(--input)",
                },
              },
              text: {
                color: "var(--foreground)",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              fullWidth: true,
              margin: "dense",
              variant: "outlined",
              size: "small",
            },
            styleOverrides: {
              root: {
                width: "100%",
                marginTop: "0.25rem",
                marginBottom: "0.25rem",
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius)",
                backgroundColor: "var(--background)",
                fontSize: "0.875rem",
                minHeight: "2.25rem",
                "&.Mui-disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
                "& input.Mui-disabled": {
                  WebkitTextFillColor: "var(--muted-foreground)",
                  opacity: 1,
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius)",
                backgroundColor: "var(--background)",
                "& fieldset": {
                  borderColor: "var(--input)",
                  borderWidth: "1px",
                  top: 0,
                },
                "& fieldset legend": {
                  display: "none",
                },
                "&:hover fieldset": {
                  borderColor: "var(--input)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 1px var(--ring)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--ring)",
                },
                "&.Mui-error fieldset": {
                  borderColor: "var(--destructive)",
                },
              },
              input: {
                padding: "0.625rem 0.75rem",
                fontSize: "0.875rem",
                height: "auto",
              },
              notchedOutline: {
                legend: {
                  display: "none",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                position: "relative",
                transform: "translate(0, 0) scale(1)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--foreground)",
                marginBottom: "0.25rem",
                "&.Mui-focused": {
                  color: "var(--primary)",
                },
                "&.Mui-disabled": {
                  color: "var(--muted-foreground)",
                  opacity: 0.5,
                },
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, 0) scale(1)",
                },
                "&.MuiInputLabel-outlined": {
                  position: "relative",
                  transform: "translate(0, 0) scale(1)",
                },
                "&.MuiInputLabel-outlined.MuiInputLabel-shrink": {
                  transform: "translate(0, 0) scale(1)",
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius)",
                backgroundColor: "var(--background)",
                fontSize: "0.875rem",
                minHeight: "2.25rem",
              },
              icon: {
                color: "var(--muted-foreground)",
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                padding: "0.25rem",
                color: "var(--border)",
                "&.Mui-checked": {
                  color: "var(--primary)",
                },
                "&.Mui-disabled": {
                  color: "var(--muted-foreground)",
                  opacity: 0.5,
                },
                "& .MuiSvgIcon-root": {
                  width: "1rem",
                  height: "1rem",
                },
              },
            },
          },
          MuiTable: {
            styleOverrides: {
              root: {
                borderCollapse: "collapse",
                borderColor: "var(--border)",
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: "var(--muted)",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: "var(--border)",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                color: "var(--foreground)",
              },
              head: {
                fontWeight: 500,
                color: "var(--foreground)",
                backgroundColor: "var(--muted)",
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--accent)",
                  "&:hover": {
                    backgroundColor: "var(--accent)",
                  },
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius)",
                boxShadow:
                  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                backgroundImage: "none",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                width: "100%",
                maxWidth: "100%",
                backgroundImage: "none",
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                padding: "1.5rem",
                width: "auto",
                "&:last-child": {
                  paddingBottom: "1.5rem",
                },
              },
            },
          },
          MuiTabs: {
            defaultProps: {
              textColor: "inherit",
            },
            styleOverrides: {
              root: {
                backgroundColor: "var(--sidebar)",
                color: "var(--foreground)",
                minHeight: "2.25rem",
              },
              indicator: {
                backgroundColor: "var(--primary)",
                height: 2,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
                color: "var(--foreground)",
                minHeight: "2.25rem",
                opacity: 0.7,
                "&.Mui-selected": {
                  backgroundColor: "var(--sidebar-accent)",
                  color: "var(--primary)",
                  opacity: 1,
                },
                "&:hover": {
                  backgroundColor: "var(--sidebar-accent)",
                  color: "var(--primary)",
                  opacity: 1,
                },
              },
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                borderRadius: "var(--radius)",
                fontSize: "0.75rem",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              },
              arrow: {
                color: "var(--popover)",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius)",
                padding: "0.5rem",
                color: "var(--foreground)",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius)",
                height: "1.5rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-foreground)",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                backgroundImage: "none",
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                fontSize: "1.125rem",
                fontWeight: 600,
                padding: "1rem 1.5rem",
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                padding: "1rem 1.5rem",
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  "&:hover": {
                    backgroundColor: "var(--primary)",
                    filter: "brightness(0.95)",
                  },
                },
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                fontSize: "0.875rem",
                minHeight: "2.25rem",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  "&:hover": {
                    backgroundColor: "var(--primary)",
                    filter: "brightness(0.95)",
                  },
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                "&.Mui-checked": {
                  color: "var(--background)",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "var(--primary)",
                    opacity: 1,
                  },
                },
              },
              track: {
                backgroundColor: "var(--muted)",
                opacity: 1,
              },
              thumb: {
                backgroundColor: "var(--background)",
              },
            },
          },
          MuiSlider: {
            styleOverrides: {
              root: {
                color: "var(--primary)",
              },
              track: {
                backgroundColor: "var(--primary)",
              },
              rail: {
                backgroundColor: "var(--muted)",
              },
              thumb: {
                backgroundColor: "var(--primary)",
              },
            },
          },
          MuiRadio: {
            styleOverrides: {
              root: {
                color: "var(--border)",
                "&.Mui-checked": {
                  color: "var(--primary)",
                },
              },
            },
          },
          MuiFormHelperText: {
            styleOverrides: {
              root: {
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
                marginLeft: "0",
                marginTop: "0.375rem",
                marginBottom: "0",
                lineHeight: 1.4,
                minHeight: 0,
                "&:empty": {
                  display: "none",
                  margin: 0,
                  padding: 0,
                  minHeight: 0,
                },
                "&.Mui-error": {
                  color: "var(--destructive)",
                  marginTop: "0.25rem",
                  marginBottom: "0",
                },
              },
            },
          },
          MuiGrid: {
            defaultProps: {
              spacing: 2,
              rowSpacing: 3,
            },
            styleOverrides: {
              root: {
                "&.MuiGrid-grid-xs-grow": {
                  paddingBottom: "0.75rem",
                },
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: "transparent",
                minHeight: "2.5rem",
                padding: "0.5rem 0",
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              h4: {
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              },
              h5: {
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              },
              h6: {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--foreground)",
                marginBottom: "0.25rem",
              },
              subtitle1: {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--foreground)",
              },
              subtitle2: {
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--muted-foreground)",
              },
              body1: {
                fontSize: "0.875rem",
                color: "var(--foreground)",
              },
              body2: {
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.4,
              },
            },
          },
        },
      }),
    [theme]
  );

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}

