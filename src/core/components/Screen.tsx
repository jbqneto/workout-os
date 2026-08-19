import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/core/theme/tokens';

interface ScreenProps extends PropsWithChildren { scroll?: boolean; contentStyle?: ViewStyle; }

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const content = scroll ? <ScrollView contentContainerStyle={[styles.content, contentStyle]}>{children}</ScrollView> : <View style={[styles.fill, styles.content, contentStyle]}>{children}</View>;
  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:colors.background}, fill:{flex:1}, content:{paddingHorizontal:spacing.md,paddingVertical:spacing.lg,gap:spacing.md} });
