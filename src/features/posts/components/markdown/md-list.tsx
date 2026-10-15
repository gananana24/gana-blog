import type { LiHTMLAttributes, ReactNode } from 'react'

type MDListProps = {
  children: ReactNode
}

export const MDUnorderedList = ({ children }: MDListProps) => {
  return (
    <ul className="mb-7 list-disc space-y-3 pl-7 marker:text-gray-500 [&_ul]:list-disc [&>li>ul]:my-3 [&_li:has(input[type=checkbox])]:list-none">
      {children}
    </ul>
  )
}

export const MDOrderedList = ({ children }: MDListProps) => {
  return <ol className="mb-7 list-decimal space-y-3 pl-7 marker:text-gray-600">{children}</ol>
}

type MDListItemProps = LiHTMLAttributes<HTMLLIElement> & {
  children: ReactNode
}

export const MDListItem = ({ children, ...props }: MDListItemProps) => {
  return (
    <li
      className="text-gray-800 dark:text-gray-200 [&>input[type=checkbox]]:mr-2 [&>input[type=checkbox]]:h-4 [&>input[type=checkbox]]:w-4 [&>input[type=checkbox]]:cursor-pointer [&>input[type=checkbox]]:align-middle [&>input[type=checkbox]]:accent-blue-600 [&:has(input[type=checkbox]:checked)]:text-gray-500 [&:has(input[type=checkbox]:checked)]:line-through [&:has(input[type=checkbox]:checked)]:dark:text-gray-500"
      {...props}
    >
      {children}
    </li>
  )
}
