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
