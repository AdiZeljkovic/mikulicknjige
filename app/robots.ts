import type { MetadataRoute } from 'next'
import { SITE, absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /checkout/ se NAMJERNO ne zabranjuje ovdje. Zabrana u robots.txt
      // spriječila bi crawler da uopšte dohvati stranicu, pa ne bi ni vidio
      // `noindex` u njenom <head>. Zabranjen URL i dalje može završiti u
      // indeksu bez opisa; nedohvaćen noindex ne može ništa.
      disallow: ['/admin/', '/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE.url,
  }
}
