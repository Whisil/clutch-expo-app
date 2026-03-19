import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchHighlights } from '../components/home/highlightsApi'
import {
  FeedItem,
  HighlightEntry,
  HighlightsPagination,
} from '../types/highlights'

type HighlightsState = {
  items: FeedItem[]
  pagination: HighlightsPagination | null
  loading: boolean
  refreshing: boolean
  error: string | null
}

function toFeedItems(entries: HighlightEntry[]): FeedItem[] {
  return entries.map((entry) => {
    return {
      id: entry.id,
      videoUrl: entry.videoUrls.clutchAutopan,
      thumbnailUrl: entry.thumbnailUrls.clutchAutopan,
    }
  })
}

export function useHighlightsFeed() {
  const [state, setState] = useState<HighlightsState>({
    items: [],
    pagination: null,
    loading: true,
    refreshing: false,
    error: null,
  })

  const load = useCallback(async (refreshing = false, signal?: AbortSignal) => {
    setState((previous) => {
      return {
        ...previous,
        loading: refreshing ? previous.loading : true,
        refreshing: refreshing,
        error: null,
      }
    })

    try {
      const response = await fetchHighlights(signal)
      setState({
        items: toFeedItems(response.data),
        pagination: response.pagination,
        loading: false,
        refreshing: false,
        error: null,
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      const message =
        error instanceof Error ? error.message : 'Failed to load highlights'

      setState((previous) => {
        return {
          ...previous,
          loading: false,
          refreshing: false,
          error: message,
        }
      })
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    load(false, abortController.signal).catch(() => undefined)

    return () => {
      abortController.abort()
    }
  }, [load])

  const refresh = useCallback(() => {
    load(true).catch(() => undefined)
  }, [load])

  return useMemo(() => {
    return {
      items: state.items,
      pagination: state.pagination,
      isLoading: state.loading,
      isRefreshing: state.refreshing,
      error: state.error,
      refresh: refresh,
    }
  }, [refresh, state])
}
