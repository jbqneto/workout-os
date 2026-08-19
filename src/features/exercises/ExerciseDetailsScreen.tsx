import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/core/components/Screen';
import { SectionTitle } from '@/core/components/SectionTitle';
import { colors, radius, spacing } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';

export function ExerciseDetailsScreen() {
  return <Screen>
    <Text style={styles.title}>Hammer Curl</Text><Text style={styles.meta}>Dumbbells · Elbow Flexion</Text>
    <Pressable style={styles.media}><Text style={styles.play}>▶</Text><Text style={styles.watch}>WATCH VIDEO</Text></Pressable>
    <View style={styles.tabs}><Text style={styles.activeTab}>ABOUT</Text><Text style={styles.tab}>HISTORY</Text><Text style={styles.tab}>EXECUTION</Text></View>
    <SectionTitle>Primary muscles</SectionTitle><Text style={styles.body}>Brachialis · Brachioradialis</Text>
    <SectionTitle>Secondary muscles</SectionTitle><Text style={styles.body}>Biceps brachii</Text>
    <SectionTitle>Equipment</SectionTitle><Text style={styles.body}>Dumbbells</Text>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>BACK</Text></Pressable>
  </Screen>;
}
const styles=StyleSheet.create({title:{...typography.display,color:colors.textPrimary},meta:{...typography.bodySmall,color:colors.textSecondary},media:{aspectRatio:16/9,maxHeight:210,borderRadius:radius.md,borderWidth:1,borderColor:colors.outlineVariant,backgroundColor:colors.surfaceHigh,alignItems:'center',justifyContent:'center'},play:{fontSize:38,color:colors.primary},watch:{...typography.labelCaps,color:colors.textPrimary,marginTop:spacing.xs},tabs:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:colors.outlineVariant},activeTab:{...typography.labelCaps,color:colors.primary,flex:1,textAlign:'center',paddingVertical:spacing.sm,borderBottomWidth:2,borderBottomColor:colors.primary},tab:{...typography.labelCaps,color:colors.textSecondary,flex:1,textAlign:'center',paddingVertical:spacing.sm},body:{...typography.body,color:colors.textPrimary},back:{minHeight:48,alignItems:'center',justifyContent:'center'},backText:{...typography.labelCaps,color:colors.primary}});
