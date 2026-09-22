import { jsonLdScript } from '@/lib/seo'

/**
 * Ubacuje schema.org podatke kao <script type="application/ld+json">.
 *
 * Ovo je jedini `dangerouslySetInnerHTML` u projektu i jedini način da se
 * JSON-LD ubaci — React bi inače escape-ovao navodnike i razbio JSON.
 * `jsonLdScript` escape-uje `<`, pa naslov knjige sa `</script>` ne može
 * zatvoriti tag i ubaciti markup.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  )
}
