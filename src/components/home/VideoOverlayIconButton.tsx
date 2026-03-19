import type { ReactNode } from 'react'
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

type VideoOverlayIconButtonProps = {
  onPress: () => void
  icon: ReactNode
  style?: StyleProp<ViewStyle>
}

const VideoOverlayIconButton = ({
  onPress,
  icon,
  style,
}: VideoOverlayIconButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, style]}
    >
      {icon}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    width: 32,
    zIndex: 2,
  },
})

export default VideoOverlayIconButton
