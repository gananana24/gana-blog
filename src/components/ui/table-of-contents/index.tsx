'use client'

import { useEffect, useRef } from 'react'

import { toHashHref } from '@/lib/heading'
import type { TocItem } from '@/lib/toc'

type TableOfContentsProps = {
  items: TocItem[]
}

type TocDomEntry = {
  id: string
  heading: HTMLElement
  item: HTMLElement
  link: HTMLAnchorElement
}

type TocPosition = {
  entry: TocDomEntry
  activationTop: number
}

const getScrollMarginTop = (element: HTMLElement): number => {
  return Number.parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0
}

const buildTocEntries = (nav: HTMLElement, items: TocItem[]): TocDomEntry[] => {
  // 目次リンクと本文見出しをIDで紐づけ、スクロール中にDOM探索しなくて済むようにする。
  const tocItems = new Map(
    Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-toc-id]')).flatMap((link) => {
      const id = link.dataset.tocId
      const item = link.closest('li')

      if (!id || !item) return []

      return [[id, { item, link }]] as const
    })
  )

  return items.flatMap((item) => {
    const heading = document.getElementById(item.id)
    const tocItem = tocItems.get(item.id)

    if (!heading || !tocItem) return []

    return [{ id: item.id, heading, item: tocItem.item, link: tocItem.link }]
  })
}

const getTocPositions = (entries: TocDomEntry[]): TocPosition[] =>
  // 見出し位置はスクロール中に毎回DOMから読まず、初期化時とレイアウト変化時に再計算する。
  // scroll-margin-top を差し引き、アンカー遷移で見出しが止まる位置とactive判定を揃える。
  entries.map((entry) => ({
    entry,
    activationTop:
      entry.heading.getBoundingClientRect().top + window.scrollY - getScrollMarginTop(entry.heading)
  }))

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const navRef = useRef<HTMLElement>(null)
  const activeEntryRef = useRef<TocDomEntry | undefined>(undefined)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const entries = buildTocEntries(nav, items)
    if (entries.length === 0) return

    // 記事遷移時に前の記事のactive DOM参照が残らないように初期化する。
    activeEntryRef.current = undefined
    const positionsRef: { current: TocPosition[] } = { current: getTocPositions(entries) }

    const updateActiveItem = () => {
      // アンカー遷移時と同じスクロール位置を通過済みの最後の見出しをactiveにする。
      const nextEntry =
        positionsRef.current.findLast((position) => position.activationTop <= window.scrollY)
          ?.entry ?? entries[0]

      if (activeEntryRef.current?.id === nextEntry.id) return

      if (activeEntryRef.current) {
        activeEntryRef.current.item.dataset.active = 'false'
        activeEntryRef.current.link.removeAttribute('aria-current')
      }

      nextEntry.item.dataset.active = 'true'
      nextEntry.link.setAttribute('aria-current', 'location')
      activeEntryRef.current = nextEntry
    }

    const refreshPositions = () => {
      // 画像読み込みやリサイズで見出し位置が動くため、必要なタイミングで位置キャッシュを更新する。
      positionsRef.current = getTocPositions(entries)
      updateActiveItem()
    }

    updateActiveItem()
    window.addEventListener('scroll', updateActiveItem, { passive: true })
    window.addEventListener('resize', refreshPositions)
    window.addEventListener('load', refreshPositions)

    return () => {
      window.removeEventListener('scroll', updateActiveItem)
      window.removeEventListener('resize', refreshPositions)
      window.removeEventListener('load', refreshPositions)
    }
  }, [items])

  if (items.length === 0) return null

  return (
    <nav ref={navRef} aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-gray-400">ON THIS PAGE</p>

      <ul>
        {items.map((item) => (
          <li key={item.id} data-active="false" className="group">
            <a
              href={toHashHref(item.id)}
              data-toc-id={item.id}
              className="relative block py-0.5 pl-4 leading-6 text-gray-400 transition-colors duration-150 ease-out hover:text-gray-950 group-data-[active=true]:text-gray-900 dark:hover:text-gray-100 dark:group-data-[active=true]:text-gray-100"
            >
              <span
                aria-hidden="true"
                className="absolute top-0.5 bottom-0.5 left-0 w-0.5 rounded-full bg-gray-950 opacity-0 transition-opacity duration-150 ease-out group-data-[active=true]:opacity-100 dark:bg-gray-100"
              />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
