import type { ReactNode } from 'react'

import Footer from '@/components/layouts/footer'
import Header from '@/components/layouts/header'

const PagesLayout = ({ children }: { children: ReactNode }) => (
  <>
    <a
      href="#main-content"
      className="sr-only fixed top-4 left-4 z-50 rounded-md bg-white px-4 py-2 font-semibold text-gray-900 shadow-md focus:not-sr-only dark:bg-gray-800 dark:text-gray-100"
    >
      Skip to content
    </a>
    <Header />
    <main id="main-content" tabIndex={-1} className="flex grow flex-col px-6 pt-32">
      <div className="container mx-auto flex w-full max-w-2xl grow flex-col">{children}</div>
    </main>
    <Footer />
  </>
)

export default PagesLayout
