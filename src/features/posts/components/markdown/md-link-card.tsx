/* eslint-disable @next/next/no-img-element */

import { ExternalLink } from 'lucide-react'

import { fetchLinkCardMetadata, type LinkCardMetadata } from '@/lib/link-card'

type MDLinkCardProps = {
  href: string
}

const getHostname = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return href
  }
}

const getMetadata = async (href: string): Promise<LinkCardMetadata | undefined> => {
  try {
    return await fetchLinkCardMetadata(href)
  } catch {
    return undefined
  }
}

const LinkCard = ({ href, metadata }: MDLinkCardProps & { metadata?: LinkCardMetadata }) => {
  const hostname = getHostname(href)
  const title = metadata?.title ?? href
  const siteName = metadata?.siteName ?? hostname
  const image = metadata?.image

  return (
    <span className="my-6 block">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title}を開く`}
        className="flex min-h-32 overflow-hidden rounded-xl border border-gray-300 bg-transparent no-underline transition-colors hover:bg-gray-100/60 dark:border-gray-600 dark:hover:bg-gray-800/40"
      >
        <span className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-6">
          <span className="block min-w-0">
            <span className="line-clamp-2 wrap-break-word font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {title}
            </span>
            {metadata?.description && (
              <span className="mt-2 line-clamp-2 wrap-break-word text-sm leading-5 text-gray-500 dark:text-gray-400">
                {metadata.description}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="truncate">{siteName}</span>
            <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
          </span>
        </span>

        {image && (
          <span className="relative flex w-32 shrink-0 items-center justify-center bg-transparent p-6 before:absolute before:inset-y-5 before:left-0 before:w-px before:bg-gray-300 sm:w-40 dark:before:bg-gray-600">
            {/* biome-ignore lint/performance/noImgElement: remote link-card images intentionally use their source URL */}
            <img src={image} alt="" loading="lazy" className="max-h-36 max-w-full object-contain" />
          </span>
        )}
      </a>
    </span>
  )
}

export const MDLinkCardFallback = ({ href }: MDLinkCardProps) => <LinkCard href={href} />

const MDLinkCard = async ({ href }: MDLinkCardProps) => (
  <LinkCard href={href} metadata={await getMetadata(href)} />
)

export default MDLinkCard
