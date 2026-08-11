import { describe, expect, it } from 'vitest'

import { generateToc } from './toc'

describe('generateToc', () => {
  it('should generate table of contents from h2 and h3 headings', () => {
    const content = `
# H1 (ignored)
## First Heading
### Subheading
## Second Heading
#### H4 (ignored)
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: 'first-heading', text: 'First Heading', level: 2 },
      { id: 'subheading', text: 'Subheading', level: 3 },
      { id: 'second-heading', text: 'Second Heading', level: 2 }
    ])
  })

  it('should exclude headings inside code blocks', () => {
    const content = `
## Real Heading

\`\`\`markdown
## This is in a code block
### Should not appear
\`\`\`

### Another Real Heading
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: 'real-heading', text: 'Real Heading', level: 2 },
      { id: 'another-real-heading', text: 'Another Real Heading', level: 3 }
    ])
  })

  it('should handle duplicate headings with incremental IDs', () => {
    const content = `
## Heading
## Heading
## Heading
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: 'heading', text: 'Heading', level: 2 },
      { id: 'heading-1', text: 'Heading', level: 2 },
      { id: 'heading-2', text: 'Heading', level: 2 }
    ])
  })

  it('should avoid ID collisions with existing numbered headings', () => {
    const content = `
## Heading
## Heading 1
## Heading
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: 'heading', text: 'Heading', level: 2 },
      { id: 'heading-1', text: 'Heading 1', level: 2 },
      { id: 'heading-2', text: 'Heading', level: 2 }
    ])
  })

  it('should handle Japanese headings', () => {
    const content = `
## 見出し
### サブ見出し
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: '見出し', text: '見出し', level: 2 },
      { id: 'サブ見出し', text: 'サブ見出し', level: 3 }
    ])
  })

  it('uses the label of a linked heading for its text and ID', () => {
    const result = generateToc('## [Linked heading](https://example.com)')

    expect(result).toEqual([{ id: 'linked-heading', text: 'Linked heading', level: 2 }])
  })

  it('should handle headings with special characters', () => {
    const content = `
## Hello, World!
### Test & Review
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: 'hello-world', text: 'Hello, World!', level: 2 },
      { id: 'test--review', text: 'Test & Review', level: 3 }
    ])
  })

  it('should match rehype-slug style IDs for punctuation-heavy headings', () => {
    const content = `
### 1. ステアリング (Steering / コンテキスト収集)
`

    const result = generateToc(content)

    expect(result).toEqual([
      {
        id: '1-ステアリング-steering--コンテキスト収集',
        text: '1. ステアリング (Steering / コンテキスト収集)',
        level: 3
      }
    ])
  })

  it('should return empty array when no headings found', () => {
    const content = `
This is just text.
No headings here.
`

    const result = generateToc(content)

    expect(result).toEqual([])
  })

  it('should handle multiple code blocks', () => {
    const content = `
## First

\`\`\`js
## Not a heading
\`\`\`

## Second

\`\`\`md
## Also not a heading
\`\`\`

## Third
`

    const result = generateToc(content)

    expect(result).toEqual([
      { id: 'first', text: 'First', level: 2 },
      { id: 'second', text: 'Second', level: 2 },
      { id: 'third', text: 'Third', level: 2 }
    ])
  })
})
