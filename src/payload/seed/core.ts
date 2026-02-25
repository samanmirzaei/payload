import type { Payload } from 'payload'

import { upsertByField } from './utils'

export const seedCore = async (payload: Payload): Promise<void> => {
  // Globals (updateGlobal is effectively an upsert)
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Example Site',
      siteUrl: 'https://example.com',
      defaultLanguage: 'en',
      contactEmail: 'contact@example.com',
      contactPhone: '+1 (555) 010-0200',
      socialLinks: [
        { label: 'LinkedIn', url: 'https://www.linkedin.com' },
        { label: 'GitHub', url: 'https://github.com' },
      ],
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      defaultTitle: 'Example Site',
      titleTemplate: '%s | Example Site',
      defaultMetaDescription: 'A reusable Payload starter seeded with generic content for development.',
      defaultOgImageUrl: 'https://example.com/og-default.jpg',
      robots: {
        noIndex: false,
        noFollow: false,
      },
      organization: {
        name: 'Example Organization',
        logoUrl: 'https://example.com/logo.png',
        sameAsLinks: [{ url: 'https://www.linkedin.com' }, { url: 'https://github.com' }],
      },
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      announcementText: 'Welcome! This is seeded development content.',
      navigationItems: [
        { label: 'Home', href: '/', openInNewTab: false },
        { label: 'Blog', href: '/blog', openInNewTab: false },
        { label: 'Contact', href: '/contact', openInNewTab: false },
      ],
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      copyrightText: '© 2026 Example Site. All rights reserved.',
      footerNavigationItems: [
        { label: 'Privacy', href: '/privacy', openInNewTab: false },
        { label: 'Terms', href: '/terms', openInNewTab: false },
      ],
      footerNote: 'Seeded content for development. Replace with project-specific details.',
    },
    overrideAccess: true,
  })

  // Categories
  const newsCategory = await upsertByField<{ id: string }>(payload, {
    collection: 'categories',
    field: 'slug',
    value: 'news',
    data: {
      title: 'News',
      slug: 'news',
      description: 'Announcements and updates.',
    },
  })

  const guidesCategory = await upsertByField<{ id: string }>(payload, {
    collection: 'categories',
    field: 'slug',
    value: 'guides',
    data: {
      title: 'Guides',
      slug: 'guides',
      description: 'Helpful how-tos and explainers.',
    },
  })

  // Home page
  await upsertByField(payload, {
    collection: 'pages',
    field: 'slug',
    value: 'home',
    data: {
      title: 'Home',
      slug: 'home',
      layout: [
        {
          blockType: 'hero',
          headline: 'Modular Payload Starter',
          subheadline: 'A reusable foundation for corporate and ecommerce websites.',
          primaryButton: { label: 'Get Started', href: '/getting-started' },
          secondaryButton: { label: 'View Blog', href: '/blog' },
        },
        {
          blockType: 'richText',
          content:
            'This is seeded content. In Step 5 we switched Pages/Posts to use structured blocks for layouts.',
        },
        {
          blockType: 'cta',
          title: 'Ready to customize?',
          description: 'Add your project-specific modules and blocks without changing the core starter.',
          buttonLabel: 'Explore Modules',
          buttonHref: '/modules',
        },
        {
          blockType: 'faq',
          title: 'FAQ',
          items: [
            { question: 'Is this production-ready?', answer: 'It is a starter scaffold designed to be extended.' },
            { question: 'Can I add commerce later?', answer: 'Yes—enable the optional commerce module.' },
          ],
        },
      ],
      seo: {
        metaTitle: 'Home',
        metaDescription: 'Seeded homepage for a modular Payload CMS starter.',
        canonicalUrl: 'https://example.com/',
        noIndex: false,
        noFollow: false,
        openGraph: {
          title: 'Home',
          description: 'Seeded homepage for a modular Payload CMS starter.',
          imageUrl: 'https://example.com/og-home.jpg',
        },
        twitter: {
          title: 'Home',
          description: 'Seeded homepage for a modular Payload CMS starter.',
          card: 'summary_large_image',
          imageUrl: 'https://example.com/og-home.jpg',
        },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  // Posts
  await upsertByField(payload, {
    collection: 'posts',
    field: 'slug',
    value: 'welcome',
    data: {
      title: 'Welcome',
      slug: 'welcome',
      excerpt: 'A seeded post to validate the Posts collection and block layouts.',
      categories: [newsCategory.id],
      layout: [
        {
          blockType: 'richText',
          content:
            'This is a seeded post. Replace with real editorial content. Blocks provide a structured, typed layout.',
        },
        {
          blockType: 'cta',
          title: 'Next step',
          description: 'Add more blocks and tighten access rules per project needs.',
          buttonLabel: 'Read Docs',
          buttonHref: '/docs',
        },
      ],
      seo: {
        metaTitle: 'Welcome',
        metaDescription: 'Seeded welcome post.',
        canonicalUrl: 'https://example.com/blog/welcome',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'Welcome', description: 'Seeded welcome post.', imageUrl: '' },
        twitter: { title: 'Welcome', description: 'Seeded welcome post.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  await upsertByField(payload, {
    collection: 'posts',
    field: 'slug',
    value: 'blocks-and-modeling',
    data: {
      title: 'Blocks and Content Modeling',
      slug: 'blocks-and-modeling',
      excerpt: 'Why a modular block system helps keep content structured and reusable.',
      categories: [guidesCategory.id],
      layout: [
        { blockType: 'hero', headline: 'Structured Layouts', subheadline: 'Blocks are a typed alternative to shortcodes.' },
        {
          blockType: 'faq',
          title: 'Common questions',
          items: [
            { question: 'Can blocks be reused across modules?', answer: 'Yes—shared blocks live under src/payload/shared/blocks.' },
            { question: 'Can commerce reuse these blocks?', answer: 'Yes—Products already reuse layoutBlocks.' },
          ],
        },
      ],
      seo: {
        metaTitle: 'Blocks and Content Modeling',
        metaDescription: 'Seeded guide post about blocks.',
        canonicalUrl: 'https://example.com/blog/blocks-and-modeling',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'Blocks and Content Modeling', description: 'Seeded guide post about blocks.', imageUrl: '' },
        twitter: { title: 'Blocks and Content Modeling', description: 'Seeded guide post about blocks.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })
}

