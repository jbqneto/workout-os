import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/core/components/Screen';
import { colors } from '@/core/theme/tokens';
import { typography } from '@/core/theme/typography';
export function PlaceholderScreen({title,description}:{title:string;description:string}){return <Screen><Text style={styles.title}>{title}</Text><Text style={styles.body}>{description}</Text></Screen>}
const styles=StyleSheet.create({title:{...typography.display,color:colors.textPrimary},body:{...typography.body,color:colors.textSecondary}});
