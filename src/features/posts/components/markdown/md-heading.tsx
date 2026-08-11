import { isValidElement, type ReactNode } from 'react'

import { toHashHref, toHeadingId } from '@/lib/heading'

const headingClassName = (level: number) => {
  const base =
    'relative -ml-6 w-[calc(100%+1.5rem)] font-bold group text-gray-900 dark:text-gray-100'
  switch (level) {
    case 2:
      return `${base} text-2xl mt-14 mb-10`
    case 3:
      return `${base} text-xl mt-10 mb-6`
    case 4:
      return `${base} text-lg mt-8  mb-4`
    case 5:
      return `${base} text-base mt-6 mb-3`
    default:
      return `${base} text-sm mt-4 mb-2`
  }
}

type MDHeadingProps = {
  level: 2 | 3 | 4 | 5 | 6
  children: ReactNode
  id?: string
}

const getTextContent = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextContent(node.props.children)
  return ''
}

export const MDHeading = ({ level, children, id }: MDHeadingProps) => {
  const text = getTextContent(children)
  // rehype-slugから渡されたIDがあればそれを使う、なければ自分で生成
  const slug = id || toHeadingId(text)

  const Tag = `h${level}` as const

  return (
    <Tag id={slug} aria-label={text || undefined} className={headingClassName(level)}>
      <a
        href={toHashHref(slug)}
        aria-label="To this heading"
        className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 no-underline opacity-0 transition-opacity duration-200 hover:opacity-80 group-hover:opacity-100 group-focus-within:opacity-100 dark:text-gray-500"
      >
        #
      </a>
      <span className="block pl-6">{children}</span>
    </Tag>
  )
}
