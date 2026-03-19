import { colors } from '@/src/constants/colors'
import { useHighlightsFeed } from '@/src/hooks/useHighlightsFeed'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FeedHeader from './FeedHeader'
import HighlightsFeedList from './HighlightsFeedList'

const HomePageContent = () => {
  const insets = useSafeAreaInsets()
  const { items, pagination, isLoading, isRefreshing, error, refresh } =
    useHighlightsFeed()

  return (
    <View style={[styles.screen, { padding: insets.top + 12 }]}>
      <View style={styles.card}>
        <FeedHeader />
        <HighlightsFeedList
          items={items}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          error={error}
          onRefresh={refresh}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.green.light,
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 90,
  },
  card: {
    flex: 1,
  },
})

export default HomePageContent
