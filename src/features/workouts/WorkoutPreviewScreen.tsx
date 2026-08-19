import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/core/components/Screen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { SurfaceCard } from '@/core/components/SurfaceCard';
import { colors, spacing } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';
import { demoPullExercises } from '@/data/demo/demoData';
export function WorkoutPreviewScreen(){return <Screen contentStyle={styles.content}><Text style={styles.title}>Back + Biceps</Text><Text style={styles.meta}>Fitness Hut · ~45 min</Text>{demoPullExercises.map((exercise,index)=><SurfaceCard key={exercise.id}><View style={styles.row}><Text style={styles.order}>{index+1}</Text><View style={styles.flex}><Text style={styles.exercise}>{exercise.name}</Text><Text style={styles.prescription}>{exercise.prescription} · {exercise.rir}</Text></View><Text style={styles.handle}>≡</Text></View></SurfaceCard>)}<PrimaryButton label="START WORKOUT" onPress={()=>router.replace('/session/session_demo')}/></Screen>}
const styles=StyleSheet.create({content:{paddingBottom:32},title:{...typography.display,color:colors.textPrimary},meta:{...typography.body,color:colors.textSecondary,marginBottom:spacing.sm},row:{flexDirection:'row',alignItems:'center',gap:spacing.sm},order:{...typography.dataSmall,color:colors.primary},flex:{flex:1},exercise:{...typography.headline,color:colors.textPrimary},prescription:{...typography.dataSmall,color:colors.textSecondary,marginTop:4},handle:{fontSize:24,color:colors.textSecondary}});
