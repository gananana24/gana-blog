import Image from 'next/image'
import Link from 'next/link'

import { SOCIAL_LINKS } from '@/constants/sns'

const HeroContent = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 md:space-y-14">
      <Image
        priority
        src="/gana-icon.png"
        alt="Gana's avatar"
        width={112}
        height={112}
        className="rounded-full object-cover"
      />

      <div className="space-y-6 md:space-y-8 text-center max-w-2xl">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight -rotate-1">
            Gana
          </h1>
        </div>

        <div className="space-y-5">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            web engineer based in Japan
          </p>

          <p className="text-base text-gray-500 dark:text-gray-500 leading-relaxed">
            Front-end focused, building simple and useful things.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-2 md:pt-4">
        <Link
          href={SOCIAL_LINKS.github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity -rotate-6 dark:invert"
          aria-label="GitHub"
        >
          <Image src={SOCIAL_LINKS.github.src} alt="GitHub" width={24} height={24} />
        </Link>
        <Link
          href={SOCIAL_LINKS.x.href}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity rotate-2 dark:invert"
          aria-label="X (Twitter)"
        >
          <Image src={SOCIAL_LINKS.x.src} alt="X" width={24} height={24} />
        </Link>
        <Link
          href={SOCIAL_LINKS.zenn.href}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity -rotate-3"
          aria-label="Zenn"
        >
          <Image src={SOCIAL_LINKS.zenn.src} alt="Zenn" width={24} height={24} />
        </Link>
      </div>
    </div>
  )
}

export default HeroContent
