'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { markdownComponents } from './markdown'

type PostContentProps = {
  content: string
}

const PostContent = ({ content }: PostContentProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  )
}

export default PostContent
