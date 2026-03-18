import { colors } from '@/src/constants/colors'
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import Text from './typography/Text'

type ButtonProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  styles?: StyleProp<ViewStyle>
}

const Button = ({ label, onPress, disabled, loading, styles }: ButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        defaultStyles.default,
        (disabled || loading) && defaultStyles.disabled,
        styles,
      ]}
    >
      {loading ? <ActivityIndicator /> : null}
      <Text weight="bold">{label}</Text>
    </Pressable>
  )
}

const defaultStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.green.default,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  disabled: {
    opacity: 0.5,
  },
})

export default Button
