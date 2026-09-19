# 06 — Datové zdroje Aničky a znalostní vrstva

Anička (digitální asistentka obce) odpovídá z živých dat portálu. Tahle příručka
popisuje, jaká data má k dispozici — hodí se pro ladění chatbotů, budování
vlastních odpovědí nebo napojení přes MCP nástroj `znalosti_anicky`.

## Živé datové zdroje (čtení)

| Zdroj | Obsah | Zdrojová tabulka |
|---|---|---|
| Úřední deska | aktivní oznámení (titulek, datum, štítek, text, url) | `notices` |
| Krizová upozornění | aktivní bannery (info / warning / danger) | `alerts` |
| Kalendář akcí | nadcházející akce (titulek, čas, místo, kategorie) | `events` |
| Projekty hlasování | participativní rozpočet (titulek, cena, hlasy) | `projects` |
| Životní situace | návody krok za krokem (kategorie, shrnutí, kroky, kontakt) | `lifeSituations` |
| Hlášení závad | počet otevřených + nová hlášení | `reports` |
| Konfigurace obce | kontakty, úřední hodiny, poplatky, datová schránka | `municipalityConfig` |
| Sémantická cache | naučené odpovědi Aničky (0-token zásahy) | `semanticCache` |

## Externí nástroje Aničky (kontrolované)

| Nástroj | Omezení |
|---|---|
| `vyhledat_na_webu` | internet-search platformy, max 300 znaků dotazu, výstup zkrácen na 4000 |
| `precist_stranku` | **allowlist URL**: gov.cz, cehovice.cz, kraje, obvyklé zpravodajské weby; zkráceno na 4000 |
| `shrnut_youtube` | jen validní YouTube URL |
| `precist_pdf` | jen PDF z oficiálních domén (gov.cz, cehovice.cz, kraje, úřady) |
| `preloz_text` | překlad vybraného textu |
| `vyrobit_obrazek` | AI obrázek — **nikdy není schválen pro úřední použití** |
| `precti_nahlas` | TTS, výstup MP3 |
| `prepsat_audio` | přepis zvuku z veřejné URL |

**Pravidlo označení:** Výstupy z internetu a AI média jsou v odpovědích Aničky
výslovně označeny jako neoficiální / neschválené.

## Zapisovací akce Aničky (všechny gated)

| Akce | Výsledek |
|---|---|
| `nahlasit_zavadu` | hlášení do `reports` se statusem „nové" |
| `navrhnout_oznameni` | návrh do schvalovací fronty (`tasks`, status `pending`) |

Anička nemůže publikovat, mazat ani měnit schválený obsah.

## Sémantická cache (0-token odpovědi)

- Shované otázky a odpovědi (`semanticCache`, normalizovaná otázka jako klíč)
- Zásah = okamžitá odpověď bez LLM volání (levné a rychlé)
- Publikace nového oznámení/upozornění invaliduje celou cache
- Statistika: `entries` (naučené odpovědi), `hits` (zásahy)

## Doporučení pro vlastní chatboty

1. **Čtěte data přes MCP** (`uredni_deska`, `kalendar_akci`, …) — nikdy je
   nedržte ve statickém promptu; portál je živý.
2. **Respektujte schvalovací tok** — váš bot může navrhovat, ne publikovat.
3. **Označujte zdroj** — pokud odpovídáte z internetu, řekněte to. Oficiální
   informace mají jít z dat portálu.
4. **Neposílejte PII** — kontakty do hlášení jsou volitelné; anonymita je
   výchozí cesta.
