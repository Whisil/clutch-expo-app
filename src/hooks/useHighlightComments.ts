import { supabase } from '@/src/utils/supabase'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from './useSession'

export type CommentData = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string | null
    avatar_src: string | null
  } | null
}

export function useHighlightComments(externalHighlightId: number | string) {
  const { session } = useSession()
  const userId = session?.user.id

  const [comments, setComments] = useState<CommentData[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    const highlightIdStr = String(externalHighlightId)
    setLoading(true)

    try {
      const { data, count, error } = await supabase
        .from('comments')
        .select(
          'id, content, created_at, user_id, profiles(full_name, avatar_src)',
          { count: 'exact' },
        )
        .eq('external_highlight_id', highlightIdStr)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setComments(data as unknown as CommentData[])
        setCommentCount(count ?? 0)
      }
    } catch (err) {
      console.warn('Failed to fetch comments', err)
    } finally {
      setLoading(false)
    }
  }, [externalHighlightId])

  useEffect(() => {
    let mounted = true
    fetchComments().then(() => {
      if (!mounted) return
    })
    return () => {
      mounted = false
    }
  }, [fetchComments])

  const addComment = async (content: string) => {
    if (!userId) throw new Error('Not authenticated')
    const highlightIdStr = String(externalHighlightId)

    const trimmed = content.trim()
    if (!trimmed || trimmed.length > 500) {
      throw new Error('Comment must be between 1 and 500 characters.')
    }

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        external_highlight_id: highlightIdStr,
        content: trimmed,
      })
      .select(
        'id, content, created_at, user_id, profiles(full_name, avatar_src)',
      )
      .single()

    if (error) throw error

    if (newComment) {
      setComments((prev) => [newComment as unknown as CommentData, ...prev])
      setCommentCount((prev) => prev + 1)
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!userId) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    if (error) throw error

    setComments((prev) => prev.filter((c) => c.id !== commentId))
    setCommentCount((prev) => Math.max(0, prev - 1))
  }

  return {
    comments,
    commentCount,
    loading,
    addComment,
    deleteComment,
    refreshComments: fetchComments,
  }
}
