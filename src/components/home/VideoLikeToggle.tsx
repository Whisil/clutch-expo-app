import { FontAwesome5 } from '@expo/vector-icons'
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { colors } from '@/src/constants/colors'
import Text from '../shared/typography/Text'

type VideoLikeToggleProps = {
  hasLiked: boolean
  likeCount: number
  onToggle: () => void
  style?: StyleProp<ViewStyle>
}

const VideoLikeToggle = ({
  hasLiked,
  likeCount,
  onToggle,
  style,
}: VideoLikeToggleProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      style={[styles.button, style]}
    >
      <FontAwesome5
        name="heart"
        solid={hasLiked}
        size={24}
        color={hasLiked ? colors.red.default : colors.white.default}
      />
      <Text weight="bold" style={styles.countText}>
        {likeCount > 0 ? likeCount : ''}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 54,
    zIndex: 2,
    gap: 4,
  },
  countText: {
    color: colors.white.default,
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})

export default VideoLikeToggle
