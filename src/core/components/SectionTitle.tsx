import { StyleSheet, Text } from 'react-native';
import { colors } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';
export function SectionTitle({ children }: { children: string }) { return <Text style={styles.text}>{children.toUpperCase()}</Text>; }
const styles = StyleSheet.create({ text: { ...typography.labelCaps, color: colors.textSecondary } });
