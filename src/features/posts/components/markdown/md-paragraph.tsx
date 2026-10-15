import type { ReactNode } from 'react'

type MDParagraphProps = {
  children: ReactNode
}

const MDParagraph = ({ children }: MDParagraphProps) => {
  return (
    <p className="mb-8 break-words whitespace-pre-wrap text-gray-800 dark:text-gray-200">
      {children}
    </p>
  )
}

export default MDParagraph
