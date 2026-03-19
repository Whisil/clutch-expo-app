import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/src/utils/supabase'
import { useSession } from './useSession'

export function useHighlightLike(externalHighlightId: number | string) {
  const { session } = useSession()
  const userId = session?.user.id

  const [hasLiked, setHasLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const highlightIdStr = String(externalHighlightId)

    const fetchLikesData = async () => {
      setLoading(true)

      try {
        const { count, error: countError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('external_highlight_id', highlightIdStr)

        if (!countError && mounted) {
          setLikeCount(count ?? 0)
        }

        if (userId) {
          const { data, error: userLikeError } = await supabase
            .from('likes')
            .select('id')
            .eq('external_highlight_id', highlightIdStr)
            .eq('user_id', userId)
            .maybeSingle()

          if (!userLikeError && mounted) {
            setHasLiked(!!data)
          }
        }
      } catch (err) {
        console.warn('Failed to fetch highlight likes', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchLikesData()

    return () => {
      mounted = false
    }
  }, [externalHighlightId, userId])

  const toggleLike = useCallback(async () => {
    if (!userId) return

    const highlightIdStr = String(externalHighlightId)

    const previousHasLiked = hasLiked
    const previousLikeCount = likeCount

    setHasLiked(!previousHasLiked)
    setLikeCount(previousLikeCount + (previousHasLiked ? -1 : 1))

    try {
      if (!previousHasLiked) {
        const { error } = await supabase.from('likes').insert({
          user_id: userId,
          external_highlight_id: highlightIdStr,
        })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('external_highlight_id', highlightIdStr)
        if (error) throw error
      }
    } catch (err) {
      setHasLiked(previousHasLiked)
      setLikeCount(previousLikeCount)
      console.warn('Failed to toggle like', err)
    }
  }, [userId, externalHighlightId, hasLiked, likeCount])

  return { hasLiked, likeCount, loading, toggleLike }
}
