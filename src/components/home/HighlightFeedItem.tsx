import Text from '@/src/components/shared/typography/Text'
import { useHighlightComments } from '@/src/hooks/useHighlightComments'
import { useHighlightLike } from '@/src/hooks/useHighlightLike'
import type { FeedItem } from '@/src/types/highlights'
import { VideoView, useVideoPlayer } from 'expo-video'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import CommentsModal from './CommentsModal'
import HighlightVariantSwitcher, {
  type HighlightVariant,
} from './HighlightVariantSwitcher'
import VideoAudioToggle from './VideoAudioToggle'
import VideoCommentToggle from './VideoCommentToggle'
import VideoFullscreenToggle from './VideoFullscreenToggle'
import VideoLikeToggle from './VideoLikeToggle'
import VideoPlayPauseToggle from './VideoPlayPauseToggle'

type HighlightFeedItemProps = {
  item: FeedItem
  index: number
  isActive: boolean
  height: number
}

const fullscreenSyncIntervalMs = 200
const fullscreenExitResumeDelayMs = 80

const HighlightFeedItem = ({
  item,
  index,
  isActive,
  height,
}: HighlightFeedItemProps) => {
  const [selectedVariant, setSelectedVariant] =
    useState<HighlightVariant>('clutchAutopan')
  const [isMuted, setIsMuted] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCommentsVisible, setIsCommentsVisible] = useState(false)
  const videoRef = useRef<VideoView>(null)
  const wasPlayingBeforeFullscreenRef = useRef(false)

  const { hasLiked, likeCount, toggleLike } = useHighlightLike(item.id)

  const {
    comments,
    commentCount,
    loading: commentsLoading,
    addComment,
    deleteComment,
  } = useHighlightComments(item.id)

  const selectedVideoUrl = useMemo(() => {
    return item.videoUrls[selectedVariant]
  }, [item.videoUrls, selectedVariant])

  const source = isActive ? { uri: selectedVideoUrl } : null

  const player = useVideoPlayer(source, (nextPlayer) => {
    nextPlayer.loop = true
    nextPlayer.muted = isMuted
  })

  useEffect(() => {
    if (isActive && !isPaused) {
      try {
        player.play()
      } catch {
        return
      }
      return
    }

    try {
      player.pause()
    } catch {
      return
    }
  }, [isActive, isPaused, player])

  useEffect(() => {
    player.muted = isMuted
  }, [isMuted, player])

  const syncStateFromPlayer = useCallback(() => {
    setIsMuted(player.muted)
    setIsPaused(!player.playing)
  }, [player])

  useEffect(() => {
    if (!isFullscreen) {
      return
    }

    const intervalId = setInterval(() => {
      syncStateFromPlayer()
    }, fullscreenSyncIntervalMs)

    return () => {
      clearInterval(intervalId)
    }
  }, [isFullscreen, syncStateFromPlayer])

  const handleEnterFullscreen = useCallback(() => {
    videoRef.current?.enterFullscreen().catch(() => undefined)
  }, [])

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      try {
        player.play()
        setIsPaused(false)
      } catch {
        return
      }
      return
    }

    try {
      player.pause()
      setIsPaused(true)
    } catch {
      return
    }
  }, [isPaused, player])

  return (
    <View style={[styles.container, { height }]}>
      <HighlightVariantSwitcher
        selectedVariant={selectedVariant}
        onSelect={setSelectedVariant}
      />

      {!isFullscreen && (
        <>
          <VideoLikeToggle
            hasLiked={hasLiked}
            likeCount={likeCount}
            onToggle={toggleLike}
            style={styles.likeToggle}
          />
          <VideoCommentToggle
            commentCount={commentCount}
            onToggle={() => {
              setIsCommentsVisible(true)
              try {
                player.pause()
                setIsPaused(true)
              } catch {
                /* ignore */
              }
            }}
            style={styles.commentToggle}
          />
        </>
      )}

      <VideoAudioToggle
        isMuted={isMuted}
        onToggle={() => setIsMuted((previous) => !previous)}
      />
      <VideoPlayPauseToggle isPaused={isPaused} onToggle={handleTogglePause} />
      <VideoFullscreenToggle onPress={handleEnterFullscreen} />
      <VideoView
        ref={videoRef}
        contentFit="contain"
        fullscreenOptions={{
          enable: true,
          orientation: 'landscape',
          autoExitOnRotate: true,
        }}
        onFullscreenEnter={() => {
          wasPlayingBeforeFullscreenRef.current = player.playing
          setIsFullscreen(true)
          syncStateFromPlayer()
        }}
        onFullscreenExit={() => {
          setIsFullscreen(false)
          syncStateFromPlayer()
          if (wasPlayingBeforeFullscreenRef.current) {
            setTimeout(() => {
              try {
                player.play()
                setIsPaused(false)
              } catch {
                return
              }
            }, fullscreenExitResumeDelayMs)
          }
        }}
        player={player}
        style={styles.video}
        nativeControls={isFullscreen}
      />
      <View style={styles.meta}>
        <Text weight="semiBold" style={styles.metaText}>
          Highlight #{index + 1}
        </Text>
      </View>

      <CommentsModal
        visible={isCommentsVisible}
        onClose={() => setIsCommentsVisible(false)}
        comments={comments}
        loading={commentsLoading}
        onAddComment={addComment}
        onDeleteComment={deleteComment}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  video: {
    backgroundColor: '#000000',
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
  likeToggle: {
    position: 'absolute',
    right: 14,
    bottom: 140,
    zIndex: 3,
  },
  commentToggle: {
    position: 'absolute',
    right: 14,
    bottom: 80,
    zIndex: 3,
  },
})

export default HighlightFeedItem
