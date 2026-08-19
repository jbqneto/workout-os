import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/core/components/Screen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { SectionTitle } from '@/core/components/SectionTitle';
import { SurfaceCard } from '@/core/components/SurfaceCard';
import { colors, spacing } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';
export function ExerciseSubstitutionScreen(){return <Screen><Text style={styles.title}>Substitute Lat Pulldown</Text><SectionTitle>Recommended by plan</SectionTitle><SurfaceCard><Text style={styles.name}>Assisted Pull-up</Text><Text style={styles.meta}>Vertical Pull</Text><Text style={styles.available}>✓ Available at Fitness Hut</Text></SurfaceCard><SectionTitle>Other alternatives</SectionTitle><SurfaceCard><Text style={styles.name}>Machine Pulldown</Text><Text style={styles.meta}>Vertical Pull · Available</Text></SurfaceCard><SurfaceCard><Text style={[styles.name,styles.disabled]}>Band Pulldown</Text><Text style={styles.meta}>Required equipment unavailable</Text></SurfaceCard><View style={{height:spacing.sm}}/><PrimaryButton label="USE ASSISTED PULL-UP" onPress={()=>{}}/></Screen>}
const styles=StyleSheet.create({title:{...typography.display,color:colors.textPrimary},name:{...typography.headline,color:colors.textPrimary},meta:{...typography.bodySmall,color:colors.textSecondary,marginTop:4},available:{...typography.bodySmall,color:colors.success,marginTop:spacing.xs},disabled:{color:colors.outline}});
