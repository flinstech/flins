import { createFileRoute } from '@tanstack/react-router'

const SITE_URL = 'https://flins.tech'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
