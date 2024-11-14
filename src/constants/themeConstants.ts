import { ThemeOptions } from '@mui/material';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

export const FONT_WEIGHT = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  xxxxl: 38,
} as const;

export const THEME_OBJECT: ThemeOptions = {
  palette: {
    background: {
      default: 'rgb(10, 11, 13)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      disabled: '#808080',
    },
    primary: {
      main: '#2194FF',
    },
    secondary: {
      main: '#69B7FF',
    },
    success: {
      main: '#27ad75',
    },
    warning: {
      main: '#c29521',
    },
    error: {
      main: '#f0616d',
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: 'Lato',
    h1: {
      fontSize: FONT_SIZES.xxxxl,
      fontWeight: FONT_WEIGHT.semibold,
    },
    h2: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: FONT_WEIGHT.semibold,
    },
    h3: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHT.semibold,
    },
    h4: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHT.semibold,
    },
    h5: {
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHT.semibold,
    },
    h6: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHT.semibold,
    },
    subtitle1: {
      fontSize: FONT_SIZES.xs,
      color: '#fff',
    },
    subtitle2: {
      fontSize: FONT_SIZES.xs,
      color: '#8a919e',
    },
    body1: {
      fontSize: FONT_SIZES.sm,
    },
    body2: {
      fontSize: FONT_SIZES.sm,
      color: '#BBBBBB',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: FONT_SIZES.sm,
          fontWeight: FONT_WEIGHT.medium,
          textDecoration: 'none',
          borderRadius: '8px',
          '&.Mui-disabled': {
            background: 'none',
            backgroundColor: '#434343',
            color: '#808080',
          },
        },
        containedPrimary: {
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #2194ffff 25%, #69b7ffff 75%)',
          boxShadow: '0px 0px 17px 2px #2386e2d3',
        },
        outlined: {
          border: '1px solid #2194FF',
        },
        text: {
          '&.Mui-disabled': {
            backgroundColor: 'transparent',
          },
          ':hover': {
            backgroundColor: 'transparent',
            color: '#fff',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '.MuiDialog-paper': {
            borderRadius: '0.8rem',
            backgroundColor: '#111111',
            padding: '1rem',
            position: 'relative',
            '.MuiIconButton-root': {
              position: 'absolute',
              right: '1rem',
              top: '1rem',
            },
          },
          '.MuiSvgIcon-root': {
            color: '#fff',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: FONT_SIZES.xs,
          fontWeight: FONT_WEIGHT.semibold,
          color: '#2194FF',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#232627',
          backgroundColor: '#19191933',
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: '#808080',
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: '#69B7FF',
          },
          fontWeight: FONT_WEIGHT.semibold,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: FONT_SIZES.xs,
          fontWeight: FONT_WEIGHT.medium,
          color: '#BBB',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          borderColor: '#232627',
          fontWeight: FONT_WEIGHT.medium,
          textTransform: 'capitalize',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          padding: '1.5rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '0',
          backgroundColor: 'transparent',
        },
        head: {
          borderBottom: '1px solid #232627',
          color: '#808080',
        },
        body: {
          fontWeight: FONT_WEIGHT.regular,
          padding: '2rem 1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgb(10, 11, 13)',
          border: '1px solid rgb(50, 53, 61)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          '&.base-select .MuiMenuItem-root': {
            fontSize: FONT_SIZES.xs,
            [`&:hover`]: {
              backgroundColor: '#010308',
            },
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        enterTouchDelay: 0,
      },
      styleOverrides: {
        tooltip: {
          background: '#000',
          backdropFilter: 'blur(6.7rem)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.8rem 1rem',
          fontSize: '1.2rem',
          color: '#BBB',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1B1B1B',
        },
        root: {
          '.MuiMenu-list': {
            padding: 0,
            '.MuiMenuItem-root': {
              padding: '1.5rem',
              borderBottom: '1px solid #2D2D2D',
              // '&:hover': {
              //   backgroundColor: '#222222',
              // },
              '&:last-child': {
                borderBottom: 'none',
              },
              '&.Mui-selected': {
                backgroundColor: 'inherit',
                // '&:hover': {
                //   backgroundColor: '#222222',
                // },
              },
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            fontSize: FONT_SIZES.xl,
          },
          '&.Mui-checked': {
            color: '#2194FF',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: FONT_SIZES.xs,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#FFFF',
          fontSize: FONT_SIZES.lg,
        },
      },
    },
  },
};
