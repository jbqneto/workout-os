import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, touchTarget } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';

interface PrimaryButtonProps { label: string; onPress: () => void; disabled?: boolean; }

export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: touchTarget, borderRadius: radius.md, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  pressed: { opacity: 0.82 }, disabled: { opacity: 0.4 }, label: { ...typography.body, fontWeight: '700', color: colors.onPrimary },
});
