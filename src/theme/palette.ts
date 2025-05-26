import { PaletteOptions } from '@mui/material/styles'

const palette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#000',
    white: '#FFF',
  },
  primary: {
    light: '#5B70AD',
    main: '#051094',
    dark: '#5A5FE0',
    contrastText: '#FFF',
  },
  secondary: {
    light: '#7F889B',
    main: '#6D788D',
    dark: '#606A7C',
    contrastText: '#FFF',
  },
  success: {
    light: '#83E542',
    main: '#72E128',
    dark: '#64C623',
    contrastText: '#FFF',
  },
  error: {
    light: '#FF625F',
    main: '#FF4D49',
    dark: '#E04440',
    contrastText: '#FFF',
  },
  warning: {
    light: '#FDBE42',
    main: '#FDB528',
    dark: '#DF9F23',
    contrastText: '#FFF',
  },
  info: {
    light: '#40CDFA',
    main: '#26C6F9',
    dark: '#21AEDB',
    contrastText: '#FFF',
  },
  grey: {
    '50': '#FAFAFA',
    '100': '#F5F5F5',
    '200': '#EEEEEE',
    '300': '#E0E0E0',
    '400': '#BDBDBD',
    '500': '#9E9E9E',
    '600': '#757575',
    '700': '#616161',
    '800': '#424242',
    '900': '#212121',
    A100: '#D5D5D5',
    A200: '#AAAAAA',
    A400: '#616161',
    A700: '#303030',
  },
  text: {
    primary: 'rgba(0, 0, 0, 1)',
    secondary: 'rgba(76, 78, 100, 0.68)',
    disabled: 'rgba(76, 78, 100, 0.38)',
  },
  background: {
    paper: '#FFF',
    default: '#F7F7F9',
  },
  action: {
    active: 'rgba(76, 78, 100, 0.54)',
    hover: 'rgba(76, 78, 100, 0.05)',
    hoverOpacity: 0.05,
    selected: 'rgba(76, 78, 100, 0.08)',
    disabled: 'rgba(76, 78, 100, 0.26)',
    disabledBackground: 'rgba(76, 78, 100, 0.12)',
    focus: 'rgba(76, 78, 100, 0.12)',
    selectedOpacity: 0.08,
    disabledOpacity: 0.38,
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
  },
  divider: 'rgba(76, 78, 100, 0.12)',
  contrastThreshold: 4.5,
  tonalOffset: 0.2,
}

export default palette
