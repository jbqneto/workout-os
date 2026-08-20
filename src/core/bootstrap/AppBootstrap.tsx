import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { getDatabase } from '@/core/db/database';
import { colors, radius, spacing, touchTarget } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';

type BootstrapState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string };

export function AppBootstrap({ children }: PropsWithChildren) {
  const [state, setState] = useState<BootstrapState>({ status: 'loading' });

  const initialize = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      await getDatabase();
      setState({ status: 'ready' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown database initialization error';
      setState({ status: 'error', message });
    }
  }, []);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (state.status === 'ready') return children;

  if (state.status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Unable to open Workout OS</Text>
        <Text style={styles.message}>{state.message}</Text>
        <Pressable accessibilityRole="button" onPress={() => void initialize()} style={styles.retryButton}>
          <Text style={styles.retryText}>RETRY</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.message}>Preparing local training data…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  title: { ...typography.headline, color: colors.textPrimary, textAlign: 'center' },
  message: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  retryButton: {
    minHeight: touchTarget,
    minWidth: 140,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  retryText: { ...typography.labelCaps, color: colors.background },
});
