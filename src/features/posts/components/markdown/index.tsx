import type { Components } from 'react-markdown'
import MDAnchor from './md-anchor'
import MDBlockquote from './md-blockquote'
import MDCodeBlock from './md-code-block'
import MDDelete from './md-delete'
import MDEmphasis from './md-emphasis'
import { MDHeading } from './md-heading'
import MDHorizontalRule from './md-horizontal-rule'
import MDImage from './md-image'
import { MDListItem, MDOrderedList, MDUnorderedList } from './md-list'
import MDParagraph from './md-paragraph'
import MDStrong from './md-strong'
import {
  MDTable,
  MDTableBody,
  MDTableCell,
  MDTableHead,
  MDTableHeadCell,
  MDTableRow
} from './md-table'

// Individual exports
export { default as MDAnchor } from './md-anchor'
export { default as MDBlockquote } from './md-blockquote'
export { default as MDCodeBlock } from './md-code-block'
export { default as MDDelete } from './md-delete'
export { default as MDEmphasis } from './md-emphasis'
export { MDHeading } from './md-heading'
export { default as MDHorizontalRule } from './md-horizontal-rule'
export { default as MDImage } from './md-image'
export { MDListItem, MDOrderedList, MDUnorderedList } from './md-list'
export { default as MDParagraph } from './md-paragraph'
export { default as MDStrong } from './md-strong'
export {
  MDTable,
  MDTableBody,
  MDTableCell,
  MDTableHead,
  MDTableHeadCell,
  MDTableRow
} from './md-table'
export { default as MDYouTubeEmbed } from './md-youtube-embed'

// Markdown components map for ReactMarkdown
export const markdownComponents: Components = {
  code: ({ className, children, ...props }) => (
    <MDCodeBlock className={className} {...props}>
      {children}
    </MDCodeBlock>
  ),
  h2: ({ children, id }) => (
    <MDHeading level={2} id={id}>
      {children}
    </MDHeading>
  ),
  h3: ({ children, id }) => (
    <MDHeading level={3} id={id}>
      {children}
    </MDHeading>
  ),
  h4: ({ children, id }) => (
    <MDHeading level={4} id={id}>
      {children}
    </MDHeading>
  ),
  h5: ({ children, id }) => (
    <MDHeading level={5} id={id}>
      {children}
    </MDHeading>
  ),
  h6: ({ children, id }) => (
    <MDHeading level={6} id={id}>
      {children}
    </MDHeading>
  ),
  p: ({ children }) => <MDParagraph>{children}</MDParagraph>,
  table: ({ children }) => <MDTable>{children}</MDTable>,
  tbody: ({ children }) => <MDTableBody>{children}</MDTableBody>,
  tr: ({ children }) => <MDTableRow>{children}</MDTableRow>,
  thead: ({ children }) => <MDTableHead>{children}</MDTableHead>,
  th: ({ children }) => <MDTableHeadCell>{children}</MDTableHeadCell>,
  td: ({ children }) => <MDTableCell>{children}</MDTableCell>,
  ul: ({ children }) => <MDUnorderedList>{children}</MDUnorderedList>,
  ol: ({ children }) => <MDOrderedList>{children}</MDOrderedList>,
  li: ({ children }) => <MDListItem>{children}</MDListItem>,
  img: ({ src, alt }) => <MDImage src={src} alt={alt} />,
  hr: () => <MDHorizontalRule />,
  a: ({ children, href, ...props }) => (
    <MDAnchor href={href} {...props}>
      {children}
    </MDAnchor>
  ),
  blockquote: ({ children }) => <MDBlockquote>{children}</MDBlockquote>,
  strong: ({ children }) => <MDStrong>{children}</MDStrong>,
  em: ({ children }) => <MDEmphasis>{children}</MDEmphasis>,
  del: ({ children }) => <MDDelete>{children}</MDDelete>
}
