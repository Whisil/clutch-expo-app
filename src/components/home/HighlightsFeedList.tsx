import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import type { FeedItem } from '@/src/types/highlights'
import { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewToken,
} from 'react-native'
import HighlightFeedItem from './HighlightFeedItem'

const defaultFeedHeight = 520
const minFeedHeight = 240
const itemBottomGap = 14
const prefetchDistance = 1

type HighlightsFeedListProps = {
  items: FeedItem[]
  isScreenFocused: boolean
  isLoading: boolean
  isLoadingMore: boolean
  hasNextPage: boolean
  isRefreshing: boolean
  error: string | null
  onRefresh: () => void
  onLoadMore: () => void
}

const FeedEmptyState = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator color={colors.green.default} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.emptyState}>
      <Text weight="semiBold">No clips available yet</Text>
    </View>
  )
}

const HighlightsFeedList = ({
  items,
  isScreenFocused,
  isLoading,
  isLoadingMore,
  hasNextPage,
  isRefreshing,
  error,
  onRefresh,
  onLoadMore,
}: HighlightsFeedListProps) => {
  const [feedHeight, setFeedHeight] = useState(defaultFeedHeight)
  const [activeItemId, setActiveItemId] = useState<number | null>(null)

  const viewabilityConfig = useMemo(() => {
    return {
      itemVisiblePercentThreshold: 75,
    }
  }, [])

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<FeedItem>[] }) => {
      const [nextVisible] = viewableItems
      if (nextVisible?.item?.id) {
        setActiveItemId(nextVisible.item.id)
      }

      const currentIndex = nextVisible?.index
      if (
        typeof currentIndex === 'number' &&
        hasNextPage &&
        !isLoadingMore &&
        currentIndex >= items.length - (prefetchDistance + 1)
      ) {
        onLoadMore()
      }
    },
    [hasNextPage, isLoadingMore, items.length, onLoadMore],
  )

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = Math.max(minFeedHeight, event.nativeEvent.layout.height)
    setFeedHeight(nextHeight)
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      const shouldPlay = isScreenFocused
        ? activeItemId === null
          ? index === 0
          : activeItemId === item.id
        : false

      return (
        <HighlightFeedItem
          item={item}
          index={index}
          isActive={shouldPlay}
          height={feedHeight - itemBottomGap}
        />
      )
    },
    [activeItemId, feedHeight, isScreenFocused],
  )

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {error ? (
        <View style={styles.errorBanner}>
          <Text weight="medium" style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}
      <FlatList
        data={items}
        decelerationRate="fast"
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={colors.green.default}
            onRefresh={onRefresh}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={feedHeight}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ListEmptyComponent={<FeedEmptyState isLoading={isLoading} />}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loadingMoreWrap}>
              <ActivityIndicator color={colors.green.default} size="small" />
            </View>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorBanner: {
    backgroundColor: colors.red.light,
    borderColor: 'rgba(246, 63, 87, 0.35)',
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 14,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  errorText: {
    color: colors.black.default,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  loadingMoreWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
})

export default HighlightsFeedList
