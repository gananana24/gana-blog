import { MarkdownAsync } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { markdownComponents } from './markdown'

type PostContentProps = {
  content: string
}

const PostContent = ({ content }: PostContentProps) =>
  MarkdownAsync({
    children: content,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeRaw, rehypeSlug],
    components: markdownComponents
  })

export default PostContent
