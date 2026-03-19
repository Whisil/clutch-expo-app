import { colors } from '@/src/constants/colors'
import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import Text from '../shared/typography/Text'

type ProfileFieldProps = {
  label: string
  error?: string
  children: ReactNode
}

export default function ProfileField({ label, error, children }: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: colors.red.default,
  },
})
