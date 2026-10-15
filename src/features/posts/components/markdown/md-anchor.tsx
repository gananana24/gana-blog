import type { ReactNode } from 'react'

import { getYouTubeVideoId, isPlainUrlText } from '@/lib/youtube'

import MDYouTubeEmbed from './md-youtube-embed'

type MDAnchorProps = {
  href?: string
  children: ReactNode
}

const MDAnchor = ({ href, children, ...props }: MDAnchorProps) => {
  const youtubeVideoId = getYouTubeVideoId(href)
  if (youtubeVideoId && isPlainUrlText(children, href)) {
    return <MDYouTubeEmbed videoId={youtubeVideoId} />
  }

  const isHeading = href?.startsWith('#')
  if (isHeading) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-sm font-semibold underline decoration-blue-400 decoration-2 underline-offset-4 transition-colors hover:decoration-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:decoration-blue-500 dark:hover:decoration-blue-300"
      {...props}
    >
      {children}
    </a>
  )
}

export default MDAnchor
