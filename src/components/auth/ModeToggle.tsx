import { colors } from '@/src/constants/colors'
import { Pressable, StyleSheet, View } from 'react-native'
import Text from '../shared/typography/Text'
import type { AuthMode } from './SignUpContent'

function ModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: AuthMode
  onChange: (next: AuthMode) => void
  disabled?: boolean
}) {
  return (
    <View style={styles.segmented}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => onChange('signIn')}
        style={[
          styles.segmentBtn,
          mode === 'signIn' && styles.segmentBtnActive,
        ]}
      >
        <Text weight="semiBold" style={styles.segmentText}>
          Log In
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => onChange('signUp')}
        style={[
          styles.segmentBtn,
          mode === 'signUp' && styles.segmentBtnActive,
        ]}
      >
        <Text weight="semiBold" style={styles.segmentText}>
          Sign Up
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  segmented: {
    backgroundColor: colors.white.mellow,
    borderRadius: 999,
    flexDirection: 'row',
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 999,
  },
  segmentBtnActive: {
    backgroundColor: colors.green.default,
  },
  segmentText: {
    fontSize: 14,
  },
})

export default ModeToggle
