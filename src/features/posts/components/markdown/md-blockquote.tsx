import type { ReactNode } from 'react'

type MDBlockquoteProps = {
  children: ReactNode
}

const MDBlockquote = ({ children }: MDBlockquoteProps) => {
  return (
    <blockquote className="my-8 rounded-lg bg-gray-200/70 px-6 py-5 [&>*:last-child]:mb-0 **:text-gray-700! dark:bg-gray-800 dark:**:text-gray-300!">
      {children}
    </blockquote>
  )
}

export default MDBlockquote
