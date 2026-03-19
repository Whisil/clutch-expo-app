import Heading from '@/src/components/shared/typography/Heading'
import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import { StyleSheet, View } from 'react-native'

const FeedHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Heading weight="black">Highlights</Heading>
        <Text style={styles.subtitle}>Swipe up to browse clips</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  textGroup: {
    gap: 2,
  },
  subtitle: {
    opacity: 0.55,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.white.mellow,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 40,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
})

export default FeedHeader
