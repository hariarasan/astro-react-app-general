import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '800' as const, color: colors.black },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.black },
  h3: { fontSize: 16, fontWeight: '700' as const, color: colors.black },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.black },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.grey },
  button: { fontSize: 16, fontWeight: '700' as const, color: colors.white },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
};
