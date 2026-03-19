import { colors } from '@/src/constants/colors'
import { useHighlightsFeed } from '@/src/hooks/useHighlightsFeed'
import { StyleSheet, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FeedHeader from './FeedHeader'
import HighlightsFeedList from './HighlightsFeedList'

const topInsetPadding = 12

const HomePageContent = () => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const {
    items,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasNextPage,
    error,
    refresh,
    loadMore,
  } = useHighlightsFeed()

  return (
    <View style={[styles.screen, { paddingTop: insets.top + topInsetPadding }]}>
      <View style={styles.card}>
        <FeedHeader />
        <HighlightsFeedList
          items={items}
          isScreenFocused={isFocused}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          isRefreshing={isRefreshing}
          error={error}
          onRefresh={refresh}
          onLoadMore={loadMore}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.green.light,
    flex: 1,
    paddingHorizontal: topInsetPadding,
    paddingBottom: 90,
  },
  card: {
    flex: 1,
  },
})

export default HomePageContent
