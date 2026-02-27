import type { Payload } from 'payload'

import { upsertByField } from './utils'

/**
 * Corporate seed profile (content-only).
 *
 * This extends the common core seed with a couple of extra corporate pages.
 */
export const seedCorporate = async (payload: Payload): Promise<void> => {
  await upsertByField(payload, {
    collection: 'pages',
    field: 'slug',
    value: 'about',
    data: {
      title: 'About',
      slug: 'about',
      layout: [
        { blockType: 'hero', headline: 'About', subheadline: 'A simple about page seeded for development.' },
        {
          blockType: 'richText',
          content:
            'This is seeded corporate content. Replace with your real story, mission, and team information.',
        },
        {
          blockType: 'cta',
          title: 'Want to get in touch?',
          description: 'Use the contact page to collect enquiries (frontend implementation later).',
          buttonLabel: 'Contact',
          buttonHref: '/contact',
        },
      ],
      seo: {
        metaTitle: 'About',
        metaDescription: 'Seeded about page.',
        canonicalUrl: 'https://example.com/about',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'About', description: 'Seeded about page.', imageUrl: '' },
        twitter: { title: 'About', description: 'Seeded about page.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  await upsertByField(payload, {
    collection: 'pages',
    field: 'slug',
    value: 'contact',
    data: {
      title: 'Contact',
      slug: 'contact',
      layout: [
        { blockType: 'hero', headline: 'Contact', subheadline: 'Seeded contact page for development.' },
        {
          blockType: 'richText',
          content:
            'Add your contact details here, and connect a frontend form later. This starter focuses on the backend/admin.',
        },
        {
          blockType: 'faq',
          title: 'Contact FAQ',
          items: [
            { question: 'How fast do you respond?', answer: 'This is seed data — configure your real SLA later.' },
            { question: 'Do you offer support?', answer: 'This is seed data — tailor to your business.' },
          ],
        },
      ],
      seo: {
        metaTitle: 'Contact',
        metaDescription: 'Seeded contact page.',
        canonicalUrl: 'https://example.com/contact',
        noIndex: false,
        noFollow: false,
        openGraph: { title: 'Contact', description: 'Seeded contact page.', imageUrl: '' },
        twitter: { title: 'Contact', description: 'Seeded contact page.', card: 'summary_large_image', imageUrl: '' },
      },
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })
}

