export const colors = {
  black: {
    default: '#000000',
    light: '#0E0E0E',
  },
  grey: {
    default: '#5E5E5E',
    dark: '#181818',
  },
  white: {
    default: '#FFFFFF',
    mellow: '#F5F1EE',
  },
  purple: {
    default: '#7A6BF4',
    light: '#C3ACFF',
  },
  green: {
    default: '#2BD887',
    mid: '#8FE887',
    dark: '#25C17A',
    light: '#E5FFCE',
  },
  yellow: {
    default: '#FFC800',
    light: '#FFF7DF',
  },
  red: {
    default: '#F63F57',
    light: '#FFD3D9',
  },
  blue: {
    default: '#0B66F8',
    light: '#ACDAFF',
  },
  accent: {
    mint: '#D1DFEE',
    green: '#DCFF00',
    pink: '#FED8D7',
  },
}

export const colorMap = {
  white: {
    backgroundColor: colors.white.mellow,
    color: colors.black.default,
    accentColor: colors.purple.default,
  },
  yellow: {
    backgroundColor: colors.yellow.light,
    color: colors.black.default,
    accentColor: colors.purple.default,
  },
  purple: {
    backgroundColor: colors.purple.light,
    color: colors.black.default,
    accentColor: colors.black.default,
  },
  grey: {
    backgroundColor: colors.grey.dark,
    color: colors.white.default,
    accentColor: colors.yellow.default,
  },
  green: {
    backgroundColor: colors.green.light,
    color: colors.black.default,
    accentColor: colors.green.default,
  },
  blue: {
    backgroundColor: colors.blue.light,
    color: colors.black.default,
    accentColor: colors.blue.default,
  },
  red: {
    backgroundColor: colors.red.light,
    color: colors.black.default,
    accentColor: colors.red.default,
  },
  transparent: {
    backgroundColor: 'transparent',
    color: colors.white.default,
    accentColor: colors.purple.default,
  },
}
