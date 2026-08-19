import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/core/theme/tokens';
export function SurfaceCard({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) { return <View style={[styles.card, style]}>{children}</View>; }
const styles = StyleSheet.create({ card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.outlineVariant,borderRadius:radius.md,padding:spacing.md} });
