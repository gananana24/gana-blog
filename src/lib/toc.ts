import { toHeadingId } from './heading'

export type TocItem = {
  id: string
  text: string
  level: number
}

const getUniqueHeadingId = (baseId: string, idCounts: Map<string, number>): string => {
  const count = idCounts.get(baseId)

  if (count === undefined) {
    idCounts.set(baseId, 0)
    return baseId
  }

  const nextCount = count + 1
  const nextId = `${baseId}-${nextCount}`

  idCounts.set(baseId, nextCount)

  if (idCounts.has(nextId)) return getUniqueHeadingId(baseId, idCounts)

  idCounts.set(nextId, 0)
  return nextId
}

const toPlainHeadingText = (value: string) =>
  value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()

/**
 * Markdownコンテンツから目次を生成
 */
export function generateToc(content: string): TocItem[] {
  // コードブロックを除外
  const codeBlockRegex = /```[\s\S]*?```/g
  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '')

  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TocItem[] = []
  const idCounts = new Map<string, number>()

  let match: RegExpExecArray | null = null

  match = headingRegex.exec(contentWithoutCodeBlocks)
  while (match !== null) {
    const level = match[1].length // ## = 2, ### = 3
    const text = toPlainHeadingText(match[2])
    const id = getUniqueHeadingId(toHeadingId(text), idCounts)

    toc.push({
      id,
      text,
      level
    })

    match = headingRegex.exec(contentWithoutCodeBlocks)
  }

  return toc
}
