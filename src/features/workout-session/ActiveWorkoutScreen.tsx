import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, touchTarget } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';
import { demoPullExercises } from '@/data/demo/demoData';

const previous = ['40×12', '40×11', '40×10'];

export function ActiveWorkoutScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerAction}><Text style={styles.headerIcon}>‹</Text></Pressable>
        <View style={styles.center}><Text style={styles.headerTitle}>BACK + BICEPS</Text><Text style={styles.elapsed}>◷ Workout · 17:32</Text></View>
        <Pressable style={styles.headerAction}><Text style={styles.headerIcon}>⋮</Text></Pressable>
      </View>
      <View style={styles.progress}><Text style={styles.progressText}>2 of 5 exercises</Text></View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {demoPullExercises.slice(0, 3).map((exercise, exerciseIndex) => (
          <View key={exercise.id} style={styles.card}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.meta}>{exercise.equipment} · Tutorial ▶</Text>
            <View style={styles.chips}><Text style={styles.chip}>{exercise.prescription}</Text><Text style={styles.chip}>{exercise.rir}</Text><Text style={styles.chip}>Rest {exercise.rest}</Text></View>
            <View style={styles.tableHeader}><Text style={styles.hSet}>SET</Text><Text style={styles.hPrev}>PREV</Text><Text style={styles.hField}>KG</Text><Text style={styles.hField}>REPS</Text><Text style={styles.hRir}>RIR</Text><Text style={styles.hDone}>✓</Text></View>
            {[0,1,2].map((setIndex) => {
              const completed = exerciseIndex === 0 && setIndex < 2;
              return (
                <View key={setIndex} style={[styles.setRow, completed && styles.completed]}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  <Text style={styles.prev}>{previous[setIndex]}</Text>
                  <TextInput style={styles.input} keyboardType="decimal-pad" defaultValue={exerciseIndex === 0 ? '40' : ''} placeholder="—" placeholderTextColor={colors.outline} />
                  <TextInput style={styles.input} keyboardType="number-pad" defaultValue={completed ? String(12-setIndex) : ''} placeholder="—" placeholderTextColor={colors.outline} />
                  <TextInput style={styles.rirInput} keyboardType="number-pad" defaultValue={completed ? String(2-setIndex) : ''} placeholder="—" placeholderTextColor={colors.outline} />
                  <Pressable style={styles.doneButton}><Text style={[styles.done, completed && styles.doneActive]}>{completed ? '●' : '○'}</Text></Pressable>
                </View>
              );
            })}
            <Pressable style={styles.secondary}><Text style={styles.secondaryText}>SUBSTITUTE EXERCISE</Text></Pressable>
          </View>
        ))}
        <Pressable onPress={() => router.push('/session/session_demo/complete')} style={styles.finishLink}><Text style={styles.finishLinkText}>Demo: finish workout →</Text></Pressable>
      </ScrollView>

      <View style={styles.timer}>
        <View><Text style={styles.timerLabel}>REST · Lat Pulldown</Text><Text style={styles.timerValue}>01:37</Text></View>
        <View style={styles.timerActions}><Text style={styles.timerAction}>+30s</Text><Text style={styles.timerAction}>SKIP</Text></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 56, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  headerAction: { width: touchTarget, height: touchTarget, alignItems: 'center', justifyContent: 'center' },
  headerIcon: { color: colors.primary, fontSize: 30 },
  center: { alignItems: 'center' },
  headerTitle: { ...typography.headline, color: colors.primary },
  elapsed: { ...typography.dataSmall, color: colors.textSecondary },
  progress: { height: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceLow },
  progressText: { ...typography.labelCaps, color: colors.textSecondary },
  scroll: { padding: spacing.md, paddingBottom: 120, gap: spacing.md },
  card: { borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  exerciseName: { ...typography.headline, color: colors.textPrimary, paddingHorizontal: spacing.sm, paddingTop: spacing.sm },
  meta: { ...typography.bodySmall, color: colors.textSecondary, paddingHorizontal: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, padding: spacing.sm },
  chip: { ...typography.dataSmall, color: colors.textPrimary, backgroundColor: colors.surfaceHigh, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tableHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLow, paddingHorizontal: spacing.sm, height: 28 },
  hSet: { ...typography.labelCaps, color: colors.textSecondary, width: 32, textAlign: 'center' },
  hPrev: { ...typography.labelCaps, color: colors.textSecondary, width: 58 },
  hField: { ...typography.labelCaps, color: colors.textSecondary, flex: 1, textAlign: 'center' },
  hRir: { ...typography.labelCaps, color: colors.textSecondary, width: 46, textAlign: 'center' },
  hDone: { ...typography.labelCaps, color: colors.textSecondary, width: 46, textAlign: 'center' },
  setRow: { minHeight: 50, paddingHorizontal: spacing.sm, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.outlineVariant },
  completed: { backgroundColor: 'rgba(144,215,146,0.08)' },
  setNumber: { ...typography.dataSmall, color: colors.textPrimary, width: 32, textAlign: 'center' },
  prev: { ...typography.dataSmall, color: colors.textSecondary, width: 58 },
  input: { ...typography.dataLarge, color: colors.textPrimary, flex: 1, minHeight: touchTarget, textAlign: 'center' },
  rirInput: { ...typography.dataSmall, color: colors.textPrimary, width: 46, minHeight: touchTarget, textAlign: 'center' },
  doneButton: { width: 46, height: touchTarget, alignItems: 'center', justifyContent: 'center' },
  done: { fontSize: 22, color: colors.textSecondary },
  doneActive: { color: colors.success },
  secondary: { minHeight: touchTarget, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.outlineVariant },
  secondaryText: { ...typography.labelCaps, color: colors.primary },
  timer: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.sm, minHeight: 76, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primaryContainer, backgroundColor: colors.surfaceHigh, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timerLabel: { ...typography.labelCaps, color: colors.textSecondary },
  timerValue: { ...typography.dataLarge, color: colors.textPrimary },
  timerActions: { flexDirection: 'row', gap: spacing.lg },
  timerAction: { ...typography.labelCaps, color: colors.primary, paddingVertical: 12 },
  finishLink: { minHeight: touchTarget, alignItems: 'center', justifyContent: 'center' },
  finishLinkText: { ...typography.bodySmall, color: colors.primary },
});
