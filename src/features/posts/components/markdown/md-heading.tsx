import { isValidElement, type ReactNode } from 'react'

import { toHashHref, toHeadingId } from '@/lib/heading'

const headingClassName = (level: number) => {
  const base =
    'relative font-bold group text-gray-900 dark:text-gray-100 leading-snug tracking-normal'
  switch (level) {
    case 2:
      return `${base} mt-16 mb-7 text-2xl`
    case 3:
      return `${base} mt-12 mb-5 text-xl`
    case 4:
      return `${base} text-lg mt-10 mb-4`
    case 5:
      return `${base} text-base mt-8 mb-3`
    default:
      return `${base} text-sm mt-6 mb-2`
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
    <Tag id={slug} className={headingClassName(level)}>
      <a
        href={toHashHref(slug)}
        aria-label={`Link to “${text}”`}
        className="absolute right-full top-1/2 hidden -translate-y-1/2 rounded-sm pr-2 text-gray-500 no-underline opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 group-hover:opacity-100 group-focus-within:opacity-100 sm:block dark:text-gray-400 dark:focus-visible:outline-gray-300"
      >
        #
      </a>
      <span>{children}</span>
    </Tag>
  )
}
