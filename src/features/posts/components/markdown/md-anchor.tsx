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
      className="font-semibold border-b-2 border-blue-300 dark:border-blue-500 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      {...props}
    >
      {children}
    </a>
  )
}

export default MDAnchor
