import { colors } from '@/src/constants/colors'
import { Feather } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import VideoOverlayIconButton from './VideoOverlayIconButton'

type VideoAudioToggleProps = {
  isMuted: boolean
  onToggle: () => void
}

const VideoAudioToggle = ({ isMuted, onToggle }: VideoAudioToggleProps) => {
  return (
    <VideoOverlayIconButton
      onPress={onToggle}
      style={styles.button}
      icon={
        isMuted ? (
          <Feather name="volume-x" size={16} color={colors.white.default} />
        ) : (
          <Feather name="volume-2" size={16} color={colors.white.default} />
        )
      }
    />
  )
}

const styles = StyleSheet.create({
  button: {
    bottom: 48,
    right: 12,
  },
})

export default VideoAudioToggle
