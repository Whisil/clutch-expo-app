import { colors } from '@/src/constants/colors'
import { FontAwesome5 } from '@expo/vector-icons'
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Text from '../shared/typography/Text'

type VideoCommentToggleProps = {
  commentCount: number
  onToggle: () => void
  style?: StyleProp<ViewStyle>
}

const VideoCommentToggle = ({
  commentCount,
  onToggle,
  style,
}: VideoCommentToggleProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      style={[styles.button, style]}
    >
      <FontAwesome5
        name="comment-dots"
        solid={false}
        size={24}
        color={colors.white.default}
      />
      <Text weight="bold" style={styles.countText}>
        {commentCount > 0 ? commentCount : ''}
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

export default VideoCommentToggle
