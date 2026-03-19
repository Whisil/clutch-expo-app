import { colors } from '@/src/constants/colors'
import { Feather } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import VideoOverlayIconButton from './VideoOverlayIconButton'

type VideoFullscreenToggleProps = {
  onPress: () => void
}

const VideoFullscreenToggle = ({ onPress }: VideoFullscreenToggleProps) => {
  return (
    <VideoOverlayIconButton
      onPress={onPress}
      style={styles.button}
      icon={<Feather name="maximize" size={16} color={colors.white.default} />}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    bottom: 48,
    right: 52,
  },
})

export default VideoFullscreenToggle
