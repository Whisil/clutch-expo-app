import { colors } from '@/src/constants/colors'
import { Feather } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import VideoOverlayIconButton from './VideoOverlayIconButton'

type VideoPlayPauseToggleProps = {
  isPaused: boolean
  onToggle: () => void
}

const VideoPlayPauseToggle = ({
  isPaused,
  onToggle,
}: VideoPlayPauseToggleProps) => {
  return (
    <VideoOverlayIconButton
      onPress={onToggle}
      style={styles.button}
      icon={
        isPaused ? (
          <Feather name="play" size={16} color={colors.white.default} />
        ) : (
          <Feather name="pause" size={16} color={colors.white.default} />
        )
      }
    />
  )
}

const styles = StyleSheet.create({
  button: {
    bottom: 48,
    left: 12,
  },
})

export default VideoPlayPauseToggle
