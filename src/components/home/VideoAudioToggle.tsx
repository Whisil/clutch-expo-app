import { colors } from '@/src/constants/colors'
import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet } from 'react-native'

type VideoAudioToggleProps = {
  isMuted: boolean
  onToggle: () => void
}

const VideoAudioToggle = ({ isMuted, onToggle }: VideoAudioToggleProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      style={styles.button}
    >
      {isMuted ? (
        <Feather name="volume-x" size={16} color={colors.white.default} />
      ) : (
        <Feather name="volume-2" size={16} color={colors.white.default} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 6,
    position: 'absolute',
    right: 12,
    bottom: 48,
    zIndex: 2,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
  },
})

export default VideoAudioToggle
