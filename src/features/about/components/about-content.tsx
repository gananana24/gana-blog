import Image from 'next/image'

import Section from '@/components/layouts/section'
import { Heading1, Heading2 } from '@/components/ui/heading'
import SocialLinks from '@/components/ui/social-links'

const ICON_SIZE = 160

const AboutContent = () => {
  return (
    <>
      <Heading1>About</Heading1>

      <Section>
        <div className="flex flex-col items-center gap-4 mb-6">
          <Image
            src="/gana-icon.png"
            alt="Profile picture"
            width={ICON_SIZE}
            height={ICON_SIZE}
            priority
            className="rounded-full"
          />
          <div className="space-y-4 text-gray-800 dark:text-gray-200">
            <p>
              Hey, there. I&apos;m a web engineer based in Japan.
              <br />I mainly build web applications with React, Next.js, and TypeScript.
              <br />
              My main focus is frontend development, but I also work across backend and
              infrastructure.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <Heading2>Tech Stack</Heading2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200">
          <li>
            <strong className="text-gray-900 dark:text-gray-100">Languages:</strong> TypeScript,
            Python, JavaScript
          </li>
          <li>
            <strong className="text-gray-900 dark:text-gray-100">Frontend:</strong> React, Next.js,
            Material UI
          </li>
          <li>
            <strong className="text-gray-900 dark:text-gray-100">Backend:</strong> FastAPI, Node.js
          </li>
          <li>
            <strong className="text-gray-900 dark:text-gray-100">Infrastructure:</strong> Azure,
            AWS, Terraform, Docker
          </li>
          <li>
            <strong className="text-gray-900 dark:text-gray-100">Testing:</strong> Vitest,
            Playwright, Pytest
          </li>
          <li>
            <strong className="text-gray-900 dark:text-gray-100">Tools:</strong> GitHub Actions,
            Storybook, Git
          </li>
        </ul>
      </Section>

      <Section>
        <Heading2>Blog</Heading2>
        <p className="text-gray-800 dark:text-gray-200">
          On this blog, I write about software development, personal projects, English learning, and
          daily reflections.
          <br />
          This is a place where I organize what I learn and keep small records of what I think about
          over time.
        </p>
      </Section>

      <Section>
        <Heading2>Interests</Heading2>
        <p className="text-gray-800 dark:text-gray-200">
          I like football, coffee, reading, and learning English. I&apos;m also an Arsenal
          supporter.
        </p>
      </Section>

      <Section>
        <Heading2>Social Links</Heading2>
        <SocialLinks />
      </Section>
    </>
  )
}

export default AboutContent
