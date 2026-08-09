import { unstable_cache } from 'next/cache'

const MAX_HTML_BYTES = 512 * 1024
const REQUEST_TIMEOUT_MS = 8_000
const REVALIDATE_SECONDS = 24 * 60 * 60

export type LinkCardMetadata = {
  title: string
  description?: string
  image?: string
  siteName: string
}

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .trim()

const cleanText = (value?: string) =>
  value ? decodeHtmlEntities(value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')) : undefined

const readAttributes = (tag: string) => {
  const attributes = new Map<string, string>()
  const attributePattern = /([:\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g

  for (const match of tag.matchAll(attributePattern)) {
    attributes.set(match[1].toLowerCase(), decodeHtmlEntities(match[3]))
  }

  return attributes
}

const toAbsoluteHttpUrl = (value: string | undefined, baseUrl: string) => {
  if (!value) return undefined

  try {
    const url = new URL(value, baseUrl)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

const parseLinkCardHtml = (html: string, pageUrl: string): LinkCardMetadata => {
  const metadata = new Map<string, string>()

  for (const tag of html.match(/<meta\s+[^>]*>/gi) ?? []) {
    const attributes = readAttributes(tag)
    const key = attributes.get('property') ?? attributes.get('name')
    const content = attributes.get('content')

    if (key && content && !metadata.has(key.toLowerCase())) {
      metadata.set(key.toLowerCase(), content)
    }
  }

  const canonicalTag = (html.match(/<link\s+[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i) ??
    [])[0]
  const canonicalAttributes = canonicalTag ? readAttributes(canonicalTag) : undefined
  const imageSourceTag = (html.match(/<link\s+[^>]*>/gi) ?? []).find((tag) =>
    readAttributes(tag).get('rel')?.toLowerCase().split(/\s+/).includes('image_src')
  )
  const imageSource = imageSourceTag ? readAttributes(imageSourceTag).get('href') : undefined
  const productImageTag = (html.match(/<img\s+[^>]*>/gi) ?? []).find((tag) => {
    const attributes = readAttributes(tag)
    return (
      attributes.get('id') === 'landingImage' ||
      attributes.get('data-a-image-name') === 'landingImage'
    )
  })
  const productImageAttributes = productImageTag ? readAttributes(productImageTag) : undefined
  const resolvedPageUrl =
    toAbsoluteHttpUrl(metadata.get('og:url') ?? canonicalAttributes?.get('href'), pageUrl) ??
    pageUrl
  const page = new URL(resolvedPageUrl)
  const productTitleTag = (html.match(/<span\s+[^>]*>[\s\S]*?<\/span>/gi) ?? []).find((tag) => {
    const openingTag = tag.match(/^<span\s+[^>]*>/i)?.[0]
    return openingTag ? readAttributes(openingTag).get('id') === 'productTitle' : false
  })
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  const title =
    cleanText(
      productTitleTag ?? metadata.get('og:title') ?? metadata.get('twitter:title') ?? titleTag
    ) ?? page.hostname
  const description = cleanText(
    metadata.get('og:description') ??
      metadata.get('twitter:description') ??
      metadata.get('description')
  )
  const image = toAbsoluteHttpUrl(
    metadata.get('og:image:secure_url') ??
      metadata.get('og:image') ??
      metadata.get('twitter:image') ??
      imageSource ??
      productImageAttributes?.get('src') ??
      productImageAttributes?.get('data-old-hires'),
    resolvedPageUrl
  )
  const siteName = cleanText(metadata.get('og:site_name')) ?? page.hostname.replace(/^www\./, '')

  return {
    title,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    siteName
  }
}

const parseHttpUrl = (value: string) => {
  const url = new URL(value)

  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol')
  if (url.username || url.password) throw new Error('Credentials are not allowed')

  return url
}

const fetchMetadata = async (value: string) => {
  const url = parseHttpUrl(value)
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'GanaLinkCard/1.0 (+https://gananana.me)'
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  })

  if (!response.ok) throw new Error(`Upstream returned ${response.status}`)

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new Error('URL does not point to HTML')
  }

  const html = (await response.text()).slice(0, MAX_HTML_BYTES)
  return parseLinkCardHtml(html, response.url || url.toString())
}

// URLs come from repository-owned Markdown. Do not expose this as an arbitrary URL proxy.
export const fetchLinkCardMetadata = unstable_cache(fetchMetadata, ['link-card-metadata'], {
  revalidate: REVALIDATE_SECONDS
})
