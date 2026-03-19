import type {
  HighlightEntry,
  HighlightThumbnailMap,
  HighlightVideoMap,
  HighlightsFeedResponse,
} from '@/src/types/highlights'

const demosEndpoint =
  'https://jslnnchztrhhrzytyzql.supabase.co/functions/v1/clutch-demos'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function parseVideoMap(value: unknown): HighlightVideoMap {
  if (!isRecord(value)) {
    throw new Error('Invalid video payload')
  }

  const {
    clutch_autopan: clutchAutopan,
    match_wo_breaks: matchWithoutBreaks,
    clutch_landscape: clutchLandscape,
  } = value

  if (
    typeof clutchAutopan !== 'string' ||
    typeof matchWithoutBreaks !== 'string' ||
    typeof clutchLandscape !== 'string'
  ) {
    throw new Error('Missing video URLs')
  }

  return {
    clutchAutopan,
    matchWithoutBreaks,
    clutchLandscape,
  }
}

function parseThumbnailMap(value: unknown): HighlightThumbnailMap {
  if (!isRecord(value)) {
    throw new Error('Invalid thumbnail payload')
  }

  const {
    clutch_autopan: clutchAutopan,
    match_wo_breaks: matchWithoutBreaks,
    clutch_landscape: clutchLandscape,
  } = value

  if (
    typeof clutchAutopan !== 'string' ||
    typeof matchWithoutBreaks !== 'string' ||
    typeof clutchLandscape !== 'string'
  ) {
    throw new Error('Missing thumbnail URLs')
  }

  return {
    clutchAutopan,
    matchWithoutBreaks,
    clutchLandscape,
  }
}

function parseEntry(value: unknown): HighlightEntry {
  if (!isRecord(value)) {
    throw new Error('Invalid entry payload')
  }

  const { id, highlight_urls: highlightUrls } = value

  if (typeof id !== 'number' || !isRecord(highlightUrls)) {
    throw new Error('Missing entry fields')
  }

  const videoUrls = parseVideoMap(highlightUrls.highlight_video_urls)
  const thumbnailUrls = parseThumbnailMap(
    highlightUrls.highlight_thumbnail_urls,
  )

  return {
    id,
    videoUrls,
    thumbnailUrls,
  }
}

function parseResponse(value: unknown): HighlightsFeedResponse {
  if (!isRecord(value)) {
    throw new Error('Invalid highlights payload')
  }

  const { data, pagination } = value

  if (!Array.isArray(data) || !isRecord(pagination)) {
    throw new Error('Missing highlights sections')
  }

  const {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_next: hasNext,
    has_prev: hasPrev,
  } = pagination

  if (
    typeof page !== 'number' ||
    typeof pageSize !== 'number' ||
    typeof total !== 'number' ||
    typeof totalPages !== 'number' ||
    typeof hasNext !== 'boolean' ||
    typeof hasPrev !== 'boolean'
  ) {
    throw new Error('Invalid pagination fields')
  }

  return {
    data: data.map(parseEntry),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  }
}

type FetchHighlightsParams = {
  page?: number
  signal?: AbortSignal
}

export async function fetchHighlights({
  page = 1,
  signal,
}: FetchHighlightsParams = {}): Promise<HighlightsFeedResponse> {
  const endpoint = `${demosEndpoint}?page=${page}`

  const response = await fetch(endpoint, {
    method: 'GET',
    signal: signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch feed (${response.status})`)
  }

  const payload = (await response.json()) as unknown
  return parseResponse(payload)
}
