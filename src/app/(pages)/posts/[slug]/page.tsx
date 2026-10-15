import Image from 'next/image'
import { notFound } from 'next/navigation'
import Script from 'next/script'

import Breadcrumb from '@/components/layouts/breadcrumb'
import ScrollToTop from '@/components/layouts/scroll-to-top'
import ShareButton from '@/components/ui/share-button'
import TableOfContents from '@/components/ui/table-of-contents'
import { getLocalPosts, getPostBySlug, getRelatedPosts } from '@/features/posts/server/posts'
import { BASE_URL } from '@/lib/envs'
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData
} from '@/lib/structured-data'

import PostContent from '@/features/posts/components/post-content'
import PostList from '@/features/posts/components/post-list'
import ReadPostTracker from '@/features/posts/components/read-post-tracker'
import { createPostReadKey } from '@/features/posts/utils/post-read-key'

import type { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  const canonicalUrl = new URL(post.href, BASE_URL)
  const description = post.excerpt || `${post.title}について書いた記事です。`

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: 'Gana',
      locale: 'ja_JP',
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description
    }
  }
}

export async function generateStaticParams() {
  const posts = await getLocalPosts()

  return posts.map((post) => ({
    slug: post.slug
  }))
}

const PostPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params
  const post = await getPostBySlug(params.slug)

  if (!post) notFound()

  const postUrl = new URL(post.href, BASE_URL).toString()
  const breadcrumbItems = [{ label: 'Posts', href: '/posts' }, { label: post.title }]

  const parsedDate = new Date(post.publishedAt)
  const dateTime = Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString()

  // 構造化データを生成
  const articleStructuredData = generateArticleStructuredData(post)
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems)
  const relatedPosts = await getRelatedPosts(post)

  return (
    <>
      <ReadPostTracker postKey={createPostReadKey(post)} />

      {/* 構造化データ (JSON-LD) */}
      <Script id="article-structured-data" type="application/ld+json">
        {JSON.stringify(articleStructuredData)}
      </Script>
      <Script id="breadcrumb-structured-data" type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </Script>

      <article className="font-sans">
        <Breadcrumb items={breadcrumbItems} />
        <header className="border-b border-gray-300 dark:border-gray-600 mb-12">
          <div className="flex flex-col items-center gap-8 pb-8">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={`${post.title}の記事サムネイル`}
                width={64}
                height={64}
              />
            ) : null}
            <h1 className="max-w-2xl text-balance text-center text-2xl font-semibold leading-normal text-gray-900 sm:text-3xl dark:text-gray-100">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={dateTime}>{post.formattedDate}</time>
            </div>
          </div>
        </header>

        <div className="relative">
          {post.toc.length > 0 && (
            <aside className="absolute top-0 bottom-0 left-full ml-14 w-64 hidden xl:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <TableOfContents items={post.toc} />
              </div>
            </aside>
          )}

          <PostContent content={post.content} />

          <div className="mt-8 flex justify-center items-center gap-4">
            <ShareButton title={post.title} url={postUrl} />
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-16" aria-labelledby="related-posts-heading">
              <h2
                id="related-posts-heading"
                className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                Related posts
              </h2>
              <PostList posts={relatedPosts} />
            </section>
          )}
        </div>
      </article>

      <ScrollToTop />
    </>
  )
}

export default PostPage
