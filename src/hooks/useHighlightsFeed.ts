import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  loadingMore: boolean
  refreshing: boolean
  error: string | null
}

const toFeedItems = (entries: HighlightEntry[]): FeedItem[] => {
  return entries.map((entry) => {
    return {
      id: entry.id,
      videoUrls: entry.videoUrls,
      thumbnailUrls: entry.thumbnailUrls,
    }
  })
}

export const useHighlightsFeed = () => {
  const [state, setState] = useState<HighlightsState>({
    items: [],
    pagination: null,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
  })
  const requestLocksRef = useRef({
    loading: false,
    loadingMore: false,
    refreshing: false,
  })

  const acquireRequestLock = useCallback(
    ({ append, refreshing }: { append: boolean; refreshing: boolean }) => {
      const locks = requestLocksRef.current

      if (append && locks.loadingMore) {
        return false
      }

      if (!append && refreshing && locks.refreshing) {
        return false
      }

      if (!append && !refreshing && locks.loading) {
        return false
      }

      requestLocksRef.current = {
        loading: !append && !refreshing,
        loadingMore: append,
        refreshing: refreshing,
      }

      return true
    },
    [],
  )

  const releaseRequestLocks = useCallback(() => {
    requestLocksRef.current = {
      loading: false,
      loadingMore: false,
      refreshing: false,
    }
  }, [])

  const load = useCallback(
    async ({
      page,
      refreshing,
      append,
      signal,
    }: {
      page: number
      refreshing: boolean
      append: boolean
      signal?: AbortSignal
    }) => {
      if (!acquireRequestLock({ append, refreshing })) {
        return
      }

      setState((previous) => {
        return {
          ...previous,
          loading: !append && !refreshing,
          loadingMore: append,
          refreshing: refreshing,
          error: null,
        }
      })

      try {
        const response = await fetchHighlights({ page, signal })
        const nextItems = toFeedItems(response.data)

        setState((previous) => {
          return {
            items: append ? [...previous.items, ...nextItems] : nextItems,
            pagination: response.pagination,
            loading: false,
            loadingMore: false,
            refreshing: false,
            error: null,
          }
        })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          releaseRequestLocks()
          return
        }

        const message =
          error instanceof Error ? error.message : 'Failed to load highlights'

        setState((previous) => {
          return {
            ...previous,
            loading: false,
            loadingMore: false,
            refreshing: false,
            error: message,
          }
        })
        releaseRequestLocks()
        return
      }

      releaseRequestLocks()
    },
    [acquireRequestLock, releaseRequestLocks],
  )

  useEffect(() => {
    const abortController = new AbortController()
    load({
      page: 1,
      refreshing: false,
      append: false,
      signal: abortController.signal,
    }).catch(() => undefined)

    return () => {
      abortController.abort()
    }
  }, [load])

  const refresh = useCallback(() => {
    load({
      page: 1,
      refreshing: true,
      append: false,
    }).catch(() => undefined)
  }, [load])

  const loadMore = useCallback(() => {
    if (!state.pagination?.hasNext || state.loadingMore || state.loading) {
      return
    }

    load({
      page: state.pagination.page + 1,
      refreshing: false,
      append: true,
    }).catch(() => undefined)
  }, [load, state.loading, state.loadingMore, state.pagination])

  return useMemo(() => {
    return {
      items: state.items,
      pagination: state.pagination,
      isLoading: state.loading,
      isLoadingMore: state.loadingMore,
      isRefreshing: state.refreshing,
      hasNextPage: state.pagination?.hasNext ?? false,
      error: state.error,
      refresh: refresh,
      loadMore: loadMore,
    }
  }, [loadMore, refresh, state])
}
