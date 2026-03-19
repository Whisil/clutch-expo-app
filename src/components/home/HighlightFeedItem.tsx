import Text from '@/src/components/shared/typography/Text'
import type { FeedItem } from '@/src/types/highlights'
import { VideoView, useVideoPlayer } from 'expo-video'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

type HighlightFeedItemProps = {
  item: FeedItem
  index: number
  isActive: boolean
  height: number
}

const HighlightFeedItem = ({
  item,
  index,
  isActive,
  height,
}: HighlightFeedItemProps) => {
  const player = useVideoPlayer(
    {
      uri: item.videoUrl,
    },
    (nextPlayer) => {
      nextPlayer.loop = true
      nextPlayer.muted = true
    },
  )

  useEffect(() => {
    if (isActive) {
      player.play()
      return
    }

    player.pause()
  }, [isActive, player])

  return (
    <View style={[styles.container, { height }]}>
      <VideoView
        contentFit="cover"
        player={player}
        style={styles.video}
        nativeControls={false}
      />
      <View style={styles.meta}>
        <Text weight="semiBold" style={styles.metaText}>
          Highlight #{index + 1}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 20,
    marginHorizontal: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  meta: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'absolute',
    right: 0,
  },
  metaText: {
    color: '#FFFFFF',
  },
})

export default HighlightFeedItem
