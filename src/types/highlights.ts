export type HighlightVideoMap = {
  clutchAutopan: string
  matchWithoutBreaks: string
  clutchLandscape: string
}

export type HighlightThumbnailMap = {
  clutchAutopan: string
  matchWithoutBreaks: string
  clutchLandscape: string
}

export type HighlightEntry = {
  id: number
  videoUrls: HighlightVideoMap
  thumbnailUrls: HighlightThumbnailMap
}

export type HighlightsPagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type HighlightsFeedResponse = {
  data: HighlightEntry[]
  pagination: HighlightsPagination
}

export type FeedItem = {
  id: number
  videoUrls: HighlightVideoMap
  thumbnailUrls: HighlightThumbnailMap
}
