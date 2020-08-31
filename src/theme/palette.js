import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: '#181818',
    main: '#232323',
  },
  secondary: {
    contrastText: white,
    dark: '#ffc400',
    main: '#ffcf33',
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400],
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400],
  },
  text: {
    primary: '#333333',
    secondary: '#737380',
    link: white,
  },
  background: {
    default: '#F1F1F1',
    paper: white,
  },
  icon: white,
};
