import type { TextStyle } from 'react-native';
export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' } satisfies TextStyle,
  headline: { fontSize: 20, lineHeight: 28, fontWeight: '600' } satisfies TextStyle,
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' } satisfies TextStyle,
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' } satisfies TextStyle,
  dataLarge: { fontSize: 24, lineHeight: 32, fontWeight: '600', fontFamily: 'monospace' } satisfies TextStyle,
  dataSmall: { fontSize: 12, lineHeight: 16, fontWeight: '500', fontFamily: 'monospace' } satisfies TextStyle,
  labelCaps: { fontSize: 11, lineHeight: 16, fontWeight: '700', letterSpacing: 0.9 } satisfies TextStyle,
} as const;
