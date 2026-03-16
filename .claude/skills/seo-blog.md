---
name: seo-blog
description: >
  Generate maximum-SEO blog posts for SendMoneyCompare with real market research,
  real images (Unsplash API), human-first writing, inline visuals, authoritative
  references, and Google E-E-A-T compliance for YMYL finance content.
---

# SEO Blog Post Generator — Maximum Optimization

Create blog posts for sendmoneycompare.com that rank on page 1 of Google Search.
This skill covers the full pipeline: market research, keyword strategy, competitive
analysis, human-quality writing, real image sourcing, inline visuals, authoritative
references, and structured data — producing a complete BlogPost entry for
`src/data/blog-posts.ts`.

## Usage

```
/seo-blog <topic or keyword>
```

Examples:
- `/seo-blog how to send money to Nigeria`
- `/seo-blog best apps for recurring international transfers`
- `/seo-blog digital wallets vs bank transfers`

If no topic is given, ask the user what topic they want to write about.

---

## Phase 1: Deep Market Research & Keyword Strategy

**Do NOT skip this phase.** Use web search extensively. Every blog post must be backed
by real market data, not assumptions.

### 1.1 Search Intent Classification

Search the primary topic on Google and classify the intent:

| Intent Type | Trigger Words | Content Strategy | SERP Target |
|-------------|--------------|-----------------|-------------|
| Informational | "how to", "what is", "guide", "explained" | Step-by-step guide, definitions, visuals | Featured snippets, PAA boxes |
| Commercial Investigation | "best", "compare", "vs", "review", "cheapest" | Comparison tables, pros/cons, verdict | Rich results, comparison carousels |
| Transactional | "send money to X", "transfer to", "buy" | CTA-heavy, corridor-specific, pricing | Local packs, product listings |

### 1.2 Real Keyword Research (Use Web Search)

Search Google for the topic and mine these sources:
1. **Google autocomplete** — Type the topic and note all suggestions
2. **People Also Ask** — Expand every PAA box and record all questions (these become FAQs and H2s)
3. **Related searches** — Scroll to bottom of SERP for long-tail variations
4. **Competitor H2 headings** — Open top 5 results, note their section structure
5. **Google Trends** — Check if the topic is trending up or down

Produce a keyword map:

```
Primary keyword:     "cheapest way to send money to Nigeria" (use in title, H1, meta, first paragraph)
Secondary keywords:  3-5 phrases for H2 headings
Long-tail keywords:  5-8 conversational queries (PAA targets)
LSI/semantic terms:  Related concepts to weave naturally into body text
```

### 1.3 Competitive Gap Analysis (Use Web Search)

For the primary keyword, analyze the top 5 ranking pages:
- **What they cover well** — Topics we must also cover to be comprehensive
- **What they miss** — Gaps we fill with our proprietary data (real-time quotes from 16+ providers across 48 currencies, aggregated from 13 scraper sources)
- **Their content format** — Tables, lists, images, videos, calculators
- **Their word count** — Aim for 20-30% more depth (not padding — substance)
- **Their sources** — What do they cite? We need stronger references
- **Their freshness** — Are they dated? We win with current 2026 data

### 1.4 Topic Cluster Mapping

Identify where this post fits in our content ecosystem:
- **Pillar page** — Does a pillar page exist that this post should support?
- **Cluster siblings** — What related posts already exist in our blog?
- **Bidirectional linking plan** — Which existing posts should link TO this one and vice versa?

Topic clusters drive ~30% more organic traffic and hold rankings 2.5x longer than standalone pieces.

### 1.5 Present Research Brief to User

Before writing, present this brief and **wait for approval**:

```
TOPIC BRIEF
===========
Title:              [Proposed title, primary keyword front-loaded, under 60 chars]
Primary keyword:    [Exact phrase]
Secondary keywords: [3-5 phrases]
Search intent:      [Informational / Commercial / Transactional]
Category:           [Guides / Education / Business / Research / Corridors / Reviews]
Estimated read:     [X min]
Competitor gaps:    [2-3 opportunities we'll exploit]
Unique angle:       [What makes our version 10x better — usually our data]
Topic cluster:      [Pillar page it supports, if any]
Outline:            [Proposed H2 headings]
Image plan:         [Featured image + X inline images]
Reference sources:  [Key authorities we'll cite]
```

---

## Phase 2: Human-First Content Creation

### 2.1 Writing Voice — Sound Like a Human, Not an AI

**This is critical.** Human-written content outperforms AI-sounding content by 47% in
engagement. Follow these rules strictly:

#### NEVER use these AI-tell phrases:
- "In today's fast-paced world..."
- "In this article, we will explore..."
- "It's important to note that..."
- "Let's dive in..."
- "In conclusion..."
- "When it comes to..."
- "Navigate the complexities of..."
- "In the realm of..."
- "A comprehensive guide to..."
- "Unlock the secrets of..."

#### DO write like this:
- **Start with a real scenario:** "Last month, a reader asked us why her $500 transfer to Lagos cost $47 with her bank but only $4.50 with Wise. The short answer: exchange rate markup."
- **Use first-person plural:** "We compared", "We analyzed", "Our data shows"
- **Be conversational:** Write as if explaining to a smart friend over coffee
- **Show personality:** "Spoiler alert: your bank is almost certainly ripping you off"
- **Use specific numbers:** "$7.33 fee" not "a small fee"; "₹91,596" not "a competitive amount"
- **Vary sentence length:** Mix short punchy sentences with longer explanatory ones. Like this. Then elaborate when the topic needs more breathing room and the reader benefits from a fuller explanation.
- **Include real-world examples:** "If you send $1,000 USD to India through Wise, your recipient gets ₹91,596. Through Wells Fargo? Just ₹89,349 — that's ₹2,247 less."
- **Acknowledge trade-offs:** "Wise has the best exchange rate, but Remitly is faster for small amounts to India."

### 2.2 Title Rules

- **60 characters max** — prevents SERP truncation
- **Primary keyword first** — front-load for both SEO and scanability
- **Include the year** — "2026" signals freshness (when relevant)
- **Use power modifiers** — numbers, brackets, parentheses increase CTR
  - Good: "Send Money to Nigeria: 7 Cheapest Ways in 2026"
  - Good: "Wise vs Remitly [2026]: Which Saves You More?"
  - Bad: "A Comprehensive Guide to Sending Money Internationally"
  - Bad: "Everything You Need to Know About Money Transfers"

### 2.3 Meta Description Rules

- **150-160 characters exactly** — too short wastes SERP space, too long gets truncated
- **Primary keyword within first 80 chars** — bolded in search results
- **Include a compelling value prop** — why click THIS result over others?
- **Use active voice with specific data** — "We compared 16+ providers to find the cheapest way to send money to Nigeria. See real rates, fees, and how much your recipient actually gets."
- **Must be unique** — never duplicate another page's meta description

### 2.4 Content Structure (HTML Sections)

```
Section 1: Hook — Open Strong
  - Lead with a surprising stat, real scenario, or provocative question
  - Include primary keyword naturally in first 100 words
  - Tell the reader exactly what they'll learn and why it matters to their wallet
  - Keep it 2-3 paragraphs max

Section 2: Context / Background
  - Establish why this topic matters NOW (freshness signal)
  - Reference recent data, regulatory changes, or market shifts
  - Include first inline image here (with descriptive alt text)
  - Link to 1-2 authoritative external sources

Section 3-N: Core Content (each H2 targets a secondary keyword)
  - ANSWER FIRST FORMAT: Put the direct answer in the first sentence of each section
    (this wins featured snippets — Google pulls 40-60 word answers from the first paragraph under an H2)
  - Use H3 subheadings for scanability within sections
  - Include comparison data from our providers (specific amounts, rates, fees)
  - Add inline images to break up text and explain concepts visually
  - Cross-link to relevant internal pages naturally
  - Cite authoritative sources with external links

Section N+1: Summary / What to Do Next
  - Actionable 3-5 bullet takeaways (not a rehash of the article)
  - Clear CTA to use the comparison tool
  - Links to 2-3 related guides for continued reading
```

### 2.5 HTML Content Format

All content is HTML (not Markdown). Allowed elements:

```html
<p>              — paragraphs (keep under 3-4 sentences each)
<strong>         — emphasis (NOT <b>)
<em>             — subtle emphasis
<ul>/<ol>/<li>   — lists (Google loves lists for featured snippets)
<h3>             — sub-sections within a section (H2 is the section heading)
<a href="/path"> — internal links (no target="_blank")
<a href="https://..." target="_blank" rel="noopener noreferrer nofollow"> — external links
<img>            — inline images (see Phase 3)
<figure>/<figcaption> — images with captions (preferred for inline images)
<blockquote>     — for quoting sources or highlighting key stats
<table>/<thead>/<tbody>/<tr>/<th>/<td> — comparison tables (great for SEO)
```

### 2.6 Answer-First Formatting (Win Featured Snippets)

Structure answers to win Google's featured snippets and AI Overview citations:

**For definitions (paragraph snippets):**
```html
<h2>What Is an Exchange Rate Markup?</h2>
<p>An exchange rate markup is the difference between the mid-market rate (the real
exchange rate you see on Google) and the rate a provider offers you. Most banks
charge 2-4% markup, while services like Wise charge 0%. On a $1,000 transfer,
this means your recipient could lose $20-$40.</p>
```

**For processes (list snippets):**
```html
<h2>How to Send Money to Nigeria</h2>
<ol>
<li><strong>Compare providers</strong> — Enter USD to NGN in our comparison tool</li>
<li><strong>Create an account</strong> — Sign up and verify your identity (passport or ID)</li>
<li><strong>Enter recipient details</strong> — Nigerian bank account number and bank name</li>
<li><strong>Choose payment method</strong> — Bank debit is cheapest, card is fastest</li>
<li><strong>Send and track</strong> — Most transfers arrive within 1-24 hours</li>
</ol>
```

**For comparisons (table snippets):**
```html
<table>
<thead><tr><th>Provider</th><th>Fee</th><th>Rate Markup</th><th>Recipient Gets</th></tr></thead>
<tbody>
<tr><td>Wise</td><td>$7.33</td><td>0%</td><td>₦1,534,200</td></tr>
<tr><td>Remitly</td><td>$0</td><td>0.45%</td><td>₦1,527,800</td></tr>
</tbody>
</table>
```

### 2.7 Internal Linking Strategy

Every blog post MUST include at minimum:

| Link Type | Minimum Count | Anchor Text Rule |
|-----------|--------------|-----------------|
| Other `/guides/` posts | 3-4 | Descriptive: "our guide to exchange rate markups" |
| `/send-money/` corridor pages | 2-3 | Natural: "compare USD to NGN providers" |
| `/companies/` provider pages | 2-3 | Provider name: "Wise" or "read our Wise review" |
| `/compare/` comparison pages | 1-2 | "see how Wise compares to Remitly" |
| `/send-money` comparison tool | 1 | Clear CTA: "use our free comparison tool" |

**Anchor text rules:**
- NEVER use "click here", "read more", "this article", "learn more"
- ALWAYS use descriptive text that tells Google what the linked page is about
- Vary anchor text — don't use the exact same phrase for every link to the same page

### 2.8 External References & Citations (E-E-A-T Signals)

**Every blog post MUST cite 5-7 authoritative external sources.** This is non-negotiable
for YMYL (Your Money Your Life) finance content.

#### Preferred reference sources (search for real, current data):
- **World Bank** — Global remittance data, migration reports
- **Central banks** — Exchange rate data (Federal Reserve, Bank of England, RBI, CBN)
- **IMF** — International financial stability reports
- **KNOMAD** — Remittance pricing data
- **FCA / FinCEN / CFPB** — Regulatory information
- **Provider official blogs** — Wise blog, Remitly blog (for feature announcements)
- **Reuters / Bloomberg** — Market data and financial news
- **Statista** — Industry statistics
- **G20 reports** — Remittance cost targets

#### How to cite in content:
```html
<p>According to the <a href="https://remittanceprices.worldbank.org/"
target="_blank" rel="noopener noreferrer nofollow">World Bank's Remittance
Prices Worldwide database</a>, the global average cost of sending $200
was 6.2% in Q4 2025 — still above the UN's 3% target.</p>
```

#### Citation rules:
- **Inline citations** — Link to sources where you reference them, not in a footnote section
- **Use real URLs** — Search for the actual source URL, don't guess or fabricate
- **Descriptive anchor text** — "World Bank's remittance cost data" not "source"
- **Fresh sources** — Prefer 2025-2026 data; never cite anything older than 2023
- **Add a "Sources & Methodology" section** at the end of data-heavy posts:
```html
<h3>Sources & Methodology</h3>
<p>Data in this article is based on real quotes collected from provider APIs
and websites on [date]. Exchange rates and fees change frequently — use our
<a href="/send-money">comparison tool</a> for the latest rates. External
data sources include the World Bank Remittance Prices Worldwide database
and provider-published fee schedules.</p>
```

### 2.9 E-E-A-T Signals for YMYL Content

Since money transfer content is "Your Money Your Life" (YMYL), Google applies stricter
quality standards. Every post must demonstrate:

**Experience:**
- Reference "our analysis of real-time quotes from 16+ providers across 48 currencies"
- Use specific examples: "When we tested sending $500 to the Philippines..."
- Show we've actually used and compared these services

**Expertise:**
- Include precise financial data (exact fees, exchange rates, received amounts)
- Explain financial concepts clearly (markup, mid-market rate, SWIFT codes)
- Use correct financial terminology

**Authoritativeness:**
- Cite authoritative sources (World Bank, central banks, regulators)
- Cross-link to our other in-depth guides (building topical authority)
- Reference our data methodology

**Trustworthiness:**
- Be balanced — mention limitations and trade-offs, not just positives
- Disclose that we use affiliate links (already handled in site footer)
- Use current, verifiable data
- Include "Last updated" dates (handled by `updatedAt` field)

---

## Phase 3: Real Images & Visual Content

**Every blog post needs real images that explain and enhance the content.**
Do NOT just suggest placeholder descriptions. Actually source and download real images.

### 3.1 Featured Image (Required)

Download a real image from Unsplash API for the featured/hero image:

```bash
# Search Unsplash for a relevant image
curl -s "https://api.unsplash.com/search/photos?query=KEYWORD&orientation=landscape&per_page=3&client_id=${UNSPLASH_ACCESS_KEY}" | jq '.results[0].urls.regular'
```

If the Unsplash API key is not available, use web search to find a high-quality,
free-to-use image from unsplash.com, pexels.com, or pixabay.com. Download it to
`public/images/blog/`.

**Featured image specs:**
- Dimensions: **1200 x 630px** (optimal for OG sharing + blog hero)
- Format: JPEG (Next.js auto-converts to WebP/AVIF)
- Max file size: 150-200KB
- File name: descriptive, hyphenated: `send-money-to-nigeria-comparison.jpg`
- Alt text: Post title (matches existing pattern)

### 3.2 Inline Content Images (2-4 per post)

Add inline images within the HTML content to break up text and visually explain concepts.
These are critical for engagement and dwell time.

**Types of inline images to include:**

1. **Comparison screenshots** — Show actual provider interfaces or rate comparisons
2. **Data visualizations** — Charts, graphs showing fee comparisons or trends
3. **Process diagrams** — Step-by-step visual flows (SVG preferred)
4. **Contextual photos** — Relevant photos that set the scene (city, culture, people)

**How to add inline images in HTML content:**
```html
<figure style="margin: 24px 0;">
  <img src="/images/blog/nigeria-transfer-comparison-chart.jpg"
       alt="Bar chart comparing fees for sending $1,000 USD to Nigeria across 8 providers"
       width="800" height="450" loading="lazy" />
  <figcaption style="font-size: 14px; color: #5f6368; margin-top: 8px; text-align: center;">
    Fee comparison for sending $1,000 USD to Nigeria — data collected March 2026
  </figcaption>
</figure>
```

**Inline image specs:**
- Dimensions: **800 x 450px** for standard content width
- Format: JPEG or SVG (for diagrams)
- Max file size: 80-120KB
- File name: descriptive, include topic keyword
- Alt text: **Descriptive, under 125 characters** — describe WHAT the image shows, front-load the keyword
  - Good: "Bar chart comparing fees for sending $1,000 USD to Nigeria across 8 providers"
  - Bad: "chart" or "image1" or "comparison"

### 3.3 Image SEO Rules

- **Descriptive file names** — `exchange-rate-markup-comparison.jpg` NOT `IMG_4532.jpg`
- **Alt text on every image** — under 125 characters, describes the image, includes keyword naturally
- **Place images near relevant text** — Google uses surrounding text to understand image context
- **Use `<figure>` + `<figcaption>`** — Provides semantic context and visual caption
- **Lazy load below-fold images** — Add `loading="lazy"` to all inline images
- **First image (featured) gets `priority`** — Already handled in the guides page template

### 3.4 Creating Data Visualizations

For data-driven posts, create simple comparison visuals:

**Option A: HTML tables styled as visuals** (simplest, most SEO-friendly)
```html
<table>
<thead><tr><th>Provider</th><th>Fee</th><th>Exchange Rate</th><th>Recipient Gets</th><th>Total Cost</th></tr></thead>
<tbody>
<tr style="background: #e8f5e9;"><td><strong>Wise</strong></td><td>$7.33</td><td>Mid-market</td><td>₦1,534,200</td><td>0.73%</td></tr>
<tr><td>Remitly</td><td>$0</td><td>-0.45%</td><td>₦1,527,800</td><td>1.14%</td></tr>
</tbody>
</table>
```

**Option B: Download/create chart images** for complex visualizations and save to
`public/images/blog/`.

---

## Phase 4: FAQ Section (Rich Snippet Optimization)

### 4.1 Research Real PAA Questions

Use web search to find actual "People Also Ask" questions for the primary keyword.
Search the primary keyword on Google and expand every PAA box.

Target 4-6 questions that:
- **Actually appear in Google PAA** — verified through search, not guessed
- **We can answer with authority** using our data
- **Target long-tail keywords** that bring additional search traffic
- **Haven't been fully answered** in the main content sections

### 4.2 FAQ Writing Rules

- **Question format**: Match EXACTLY how users phrase it in Google
  - Good: "How much does it cost to send money to Nigeria?"
  - Bad: "What are the costs associated with international remittances to Nigeria?"

- **Answer format**: ANSWER FIRST in 1-2 sentences, then 1-2 sentences of supporting detail
  - Good: "Sending $1,000 to Nigeria typically costs between $4.50 and $47 depending on the provider. Wise charges $7.33 with no markup, while banks like Chase charge $0 upfront but take 3%+ through hidden exchange rate markups."
  - Bad: "There are many factors that determine the cost of sending money to Nigeria, including fees, exchange rates, and..."

- **Include specific data** — exact fees, provider names, amounts
- **Include keywords naturally** in both questions and answers

FAQs auto-generate **FAQPage JSON-LD** structured data, making the post eligible for
FAQ rich snippets in Google Search (accordion-style results that take up more SERP space).

---

## Phase 5: Technical SEO Checklist

Run through EVERY item before finalizing. A single missed item can cost rankings.

### Metadata Validation
- [ ] `slug`: URL-friendly, contains primary keyword, 3-5 words, no stop words (a, the, of, to)
- [ ] `title`: Under 60 chars, primary keyword in first 30 chars, includes year if relevant
- [ ] `metaDescription`: 150-160 chars exactly, primary keyword in first 80 chars, compelling value prop, active voice
- [ ] `excerpt`: 1-2 sentences, compelling, different from metaDescription, used in listing cards
- [ ] `category`: One of: Guides | Education | Business | Research | Corridors | Reviews
- [ ] `readTime`: Word count / 200, rounded up, format "X min read"
- [ ] `publishedAt`: Today's date (YYYY-MM-DD)
- [ ] `updatedAt`: Same as publishedAt for new posts
- [ ] `author`: "SendMoneyCompare Team"
- [ ] `tags`: 5-7 relevant tags, check existing posts for tag consistency

### Content Quality
- [ ] Primary keyword in: title, meta description, first 100 words, at least one H2, URL slug
- [ ] Secondary keywords in: H2 headings, body paragraphs (each used 2-3 times naturally)
- [ ] LSI/semantic terms woven throughout body text
- [ ] No keyword stuffing — every sentence reads naturally to a human
- [ ] Every section adds unique value (delete any section that's filler)
- [ ] Minimum 1,500 words of substantive content (aim 2,000-3,000 for pillar content)
- [ ] Uses answer-first format under H2s (first paragraph directly answers the heading)
- [ ] Varies sentence length (short + long, no uniform AI-style paragraphs)
- [ ] Includes specific data points (exact fees, exchange rates, amounts)
- [ ] Balanced perspective — mentions trade-offs and limitations

### Images
- [ ] Featured image downloaded to `public/images/blog/` (1200x630, under 200KB)
- [ ] 2-4 inline images within content sections
- [ ] All images have descriptive alt text (under 125 chars, includes keyword)
- [ ] All images have descriptive file names (hyphenated, keyword-rich)
- [ ] All inline images use `loading="lazy"`
- [ ] Images placed near relevant text (not randomly)
- [ ] `<figure>` + `<figcaption>` used for inline images with captions

### Internal Links
- [ ] 3-4 links to other `/guides/` posts (descriptive anchor text)
- [ ] 2-3 links to `/send-money/` corridor pages
- [ ] 2-3 links to `/companies/` provider pages
- [ ] 1-2 links to `/compare/` comparison pages
- [ ] 1 link to comparison tool (`/send-money` or specific corridor)
- [ ] All anchor text is descriptive (NEVER "click here" or "read more")
- [ ] Anchor text varies (not same phrase repeated)

### External References (E-E-A-T)
- [ ] 5-7 authoritative external citations with real, verified URLs
- [ ] Citations are inline (at point of reference), not in a footnote section
- [ ] All external links: `target="_blank" rel="noopener noreferrer nofollow"`
- [ ] Anchor text describes the source: "World Bank remittance data" not "source"
- [ ] Sources are fresh (2025-2026 preferred, nothing before 2023)
- [ ] "Sources & Methodology" section included for data-heavy posts

### Structured Data (Auto-generated by page template)
- [ ] Article schema auto-generated (headline, datePublished, dateModified, author, image)
- [ ] `faqs` array: 4-6 items with real PAA questions — triggers FAQPage schema
- [ ] `howToSteps` array: present if the post is a how-to guide — triggers HowTo schema
- [ ] `relatedSlugs`: 3-4 existing blog post slugs for sidebar cross-links

### Comparison Blocks
- [ ] Main comparison block present (Best Overall, Fastest, Cheapest — minimum 3 categories)
- [ ] Comparison block uses real data from our providers (not guessed)
- [ ] Every provider name in comparison block links to its `/companies/` page
- [ ] CTA link to comparison tool at bottom of comparison block
- [ ] 1-2 inline mini-comparisons sprinkled in body content where multiple providers are mentioned

### Corridor Integration
- [ ] All relevant corridors mentioned in article link to their `/send-money/` pages
- [ ] Corridor-specific data used in examples (e.g., "USD to NGN" not just "to Nigeria")
- [ ] Multi-corridor posts include a corridor comparison table with links

### Data Report Elements (if applicable)
- [ ] Executive summary with 3-5 key findings at top
- [ ] Methodology section explaining data collection
- [ ] Quotable stats formatted as blockquotes for journalist pickup
- [ ] Category set to "Research" for data reports
- [ ] Full data tables included for reference and citation

### Duplicate Content Prevention
- [ ] Title is unique (not used by any existing post)
- [ ] Meta description is unique
- [ ] Content doesn't substantially overlap existing guides (check existing slugs)
- [ ] Slug is unique
- [ ] No large blocks of text copied from other pages on the site

---

## Phase 6: Output & Implementation

### 6.1 Generate the BlogPost Object

Produce the complete TypeScript object matching the `BlogPost` interface in
`src/data/blog-posts.ts`:

```typescript
{
  slug: "keyword-rich-url-slug",
  title: "Primary Keyword — Compelling Title (2026)",
  metaDescription: "150-160 char description with primary keyword in first 80 chars and clear value prop.",
  excerpt: "Compelling 1-2 sentence summary for listing cards — different from metaDescription.",
  category: "Guides",
  readTime: "X min read",
  publishedAt: "YYYY-MM-DD",
  updatedAt: "YYYY-MM-DD",
  author: "SendMoneyCompare Team",
  tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  featuredImage: "/images/blog/descriptive-file-name.jpg", // optional but strongly recommended
  sections: [
    {
      heading: "H2 Heading Targeting Secondary Keyword",
      content: `<p>Answer-first opening paragraph...</p>
<figure style="margin: 24px 0;">
  <img src="/images/blog/inline-image-name.jpg"
       alt="Descriptive alt text under 125 chars with keyword"
       width="800" height="450" loading="lazy" />
  <figcaption style="font-size: 14px; color: #5f6368; margin-top: 8px; text-align: center;">
    Caption describing the image with data source attribution
  </figcaption>
</figure>
<p>More content with <a href="/guides/related-guide">descriptive internal link</a>
and <a href="https://real-source.org/data" target="_blank"
rel="noopener noreferrer nofollow">authoritative external reference</a>.</p>`,
    },
    // ... more sections with inline images and references
  ],
  faqs: [
    {
      question: "Exact PAA question from Google search?",
      answer: "Direct answer first with specific data. Then 1-2 sentences of supporting detail with provider names and exact numbers.",
    },
    // ... 4-6 FAQs
  ],
  howToSteps: [ // Only if the post is a how-to guide
    { name: "Step 1: Compare providers", text: "Enter your amount and corridor..." },
  ],
  relatedSlugs: ["existing-slug-1", "existing-slug-2", "existing-slug-3"],
}
```

### 6.2 Implementation Steps

After generating content, execute these steps:

1. **Download featured image** from Unsplash/Pexels to `public/images/blog/[name].jpg`
2. **Download/create inline images** (2-4) to `public/images/blog/`
3. **Add the BlogPost object** to the `blogPosts` array in `src/data/blog-posts.ts`
4. **Update related posts** — Add this post's slug to `relatedSlugs` of 2-3 related existing posts (bidirectional linking)
5. **Verify build passes** — Run `npm run build` and fix any issues
6. **Verify the page** — Run `npm run dev` and check the post renders correctly at `/guides/[slug]`

---

## Phase 7: Post-Publish Optimization

After the post is live, execute these SEO amplification steps:

### 7.1 Internal Link Injection

Search the ENTIRE codebase for opportunities to link TO this new post from existing pages.
Target 3-5 places across these content files:

- `src/data/blog-posts.ts` — Other blog post sections/content (18+ posts)
- `src/data/news.ts` — News articles that mention related topics (6+ items)
- `src/data/comparison-articles.ts` — Head-to-head provider comparisons
- `src/data/corridors.ts` — Corridor page content
- `src/data/provider-reviews.ts` — Provider review content

Use the Grep tool (not bash grep) to find mentions of the topic keyword across
these files. Add natural links from existing content to the new post. This is
critical for passing link equity and helping Google discover the new page.

### 7.2 Sitemap Verification

The post auto-appears in sitemap via `src/app/sitemap.ts` (reads from blogPosts array).
Verify by checking the sitemap output includes the new URL.

### 7.3 Suggest Social & Promotion

Provide the user with:
- **Twitter/X post** — 280 chars max, hook + key insight + link
- **LinkedIn post** — 3-5 sentences, professional tone, key data point
- **Email snippet** — For newsletter, highlighting the main takeaway

### 7.4 Content Refresh Schedule

Remind the user: "Update this post every 3 months with fresh data from our scrapers.
Pages updated quarterly gain an average 4.6 positions in Google rankings."

---

## Phase 8: Comparison Blocks (Required in Every Article)

**Every blog post MUST include at least one comparison block.** Google prioritizes
comparison content in search results, and these blocks dramatically improve click-through
rates and dwell time.

### 8.1 Provider Comparison Block Format

Include a structured "best provider" comparison block in every article. This should
appear early in the content (within the first 2-3 sections) and highlight:

```html
<div style="background: #f8f9fa; border-radius: 16px; padding: 24px; margin: 24px 0;">
  <h3 style="margin-top: 0;">Quick Comparison: Best Providers for [Corridor/Use Case]</h3>
  <table>
    <thead>
      <tr><th>Category</th><th>Provider</th><th>Why</th></tr>
    </thead>
    <tbody>
      <tr style="background: #e8f5e9;">
        <td><strong>🏆 Best Overall</strong></td>
        <td><a href="/companies/wise">Wise</a></td>
        <td>Mid-market rate, $7.33 fee on $1,000</td>
      </tr>
      <tr>
        <td><strong>⚡ Fastest Transfer</strong></td>
        <td><a href="/companies/remitly">Remitly</a></td>
        <td>Instant delivery to mobile wallets</td>
      </tr>
      <tr>
        <td><strong>💰 Cheapest Option</strong></td>
        <td><a href="/companies/wise">Wise</a></td>
        <td>Lowest total cost (fee + rate combined)</td>
      </tr>
      <tr>
        <td><strong>🏦 Best for Large Amounts</strong></td>
        <td><a href="/companies/ofx">OFX</a></td>
        <td>No fees on transfers over $1,000</td>
      </tr>
    </tbody>
  </table>
  <p style="font-size: 14px; color: #5f6368; margin-bottom: 0;">
    Based on real quotes collected [date]. <a href="/send-money">Compare live rates →</a>
  </p>
</div>
```

### 8.2 Comparison Block Rules

- **Use real data** — Pull actual fees and rates from our provider data, never guess
- **Always include these three categories minimum:**
  1. **Best Overall** — Highest recipient amount (best total value)
  2. **Fastest Provider** — Quickest delivery time
  3. **Cheapest Provider** — Lowest fee (may differ from "best overall" due to rate markup)
- **Add context-specific categories** when relevant:
  - "Best for First-Time Senders" (easiest signup)
  - "Best for Large Amounts" (lower fees at scale)
  - "Best for Recurring Transfers" (auto-send features)
  - "Best for Cash Pickup" (widest agent network)
- **Link every provider name** to its `/companies/` page
- **Include a CTA link** to the comparison tool at the bottom
- **Cite the data date** so readers know it's current

### 8.3 Inline Mini-Comparisons

In addition to the main comparison block, sprinkle **mini-comparisons** throughout
the article wherever you mention multiple providers:

```html
<blockquote style="border-left: 4px solid #1a73e8; padding: 12px 16px; background: #e8f0fe; border-radius: 0 8px 8px 0; margin: 16px 0;">
  <strong>Quick comparison:</strong> For $1,000 USD → INR, Wise delivers ₹91,596
  (fee: $7.33) while Remitly delivers ₹91,100 (fee: $0). Wise wins on total value,
  but Remitly is faster for bank deposits.
  <a href="/compare/wise-vs-remitly">See full comparison →</a>
</blockquote>
```

These mini-comparisons:
- Target featured snippet opportunities (Google loves concise comparisons)
- Drive clicks to our `/compare/` pages
- Demonstrate real expertise with specific numbers

---

## Phase 9: Programmatic Corridor Page Integration

### 9.1 Corridor Page Cross-Linking

Our programmatic corridor pages at `/send-money/[country-to-country]` (e.g.,
`/send-money/usa-to-india`) are high-traffic landing pages. Every blog post should
strategically link to and from these pages.

**When writing a blog post:**
- Identify ALL relevant corridors mentioned in the article
- Link to each corridor page using natural anchor text:
  ```html
  <p>If you're sending dollars to Nigeria, <a href="/send-money/usa-to-nigeria">compare
  the latest USD to NGN rates</a> across all providers on our platform.</p>
  ```
- Use corridor-specific data in examples (e.g., "USD to NGN" not just "to Nigeria")

**After publishing:**
- Check if relevant corridor pages could benefit from linking TO the new blog post
- Add contextual links from corridor page content or related guides sections

### 9.2 Corridor-Specific Blog Posts

When the blog topic is corridor-specific (e.g., "send money to India"), the post
should serve as a comprehensive companion to the programmatic corridor page:

| Corridor Page (`/send-money/`) | Blog Post (`/guides/`) |
|-------------------------------|----------------------|
| Live rates, fees, comparison table | In-depth guide: tips, regulations, best methods |
| Transactional intent (ready to send) | Informational intent (researching options) |
| Auto-updated by scrapers | Manually curated expertise + context |
| Links TO the guide for more detail | Links TO corridor page for live rates |

**This bidirectional linking between corridor pages and blog posts creates a powerful
topic cluster that dominates search results for the entire corridor.**

### 9.3 Multi-Corridor Blog Posts

For posts that cover multiple corridors (e.g., "cheapest way to send money abroad"),
include a **corridor comparison table**:

```html
<h3>Cost Comparison Across Popular Corridors</h3>
<table>
  <thead>
    <tr><th>Corridor</th><th>Cheapest Provider</th><th>Fee</th><th>Recipient Gets</th><th>Compare</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>USD → INR</td><td>Wise</td><td>$7.33</td><td>₹91,596</td>
      <td><a href="/send-money/usa-to-india">See all rates →</a></td>
    </tr>
    <tr>
      <td>USD → NGN</td><td>Wise</td><td>$7.33</td><td>₦1,534,200</td>
      <td><a href="/send-money/usa-to-nigeria">See all rates →</a></td>
    </tr>
    <tr>
      <td>GBP → PKR</td><td>Wise</td><td>£5.21</td><td>PKR 356,800</td>
      <td><a href="/send-money/uk-to-pakistan">See all rates →</a></td>
    </tr>
  </tbody>
</table>
```

This table format:
- Drives traffic to multiple corridor pages simultaneously
- Wins table rich results in Google
- Demonstrates data breadth (builds authority)

---

## Phase 10: Original Data Reports (Link Magnet Strategy)

### 10.1 When to Write a Data Report

If the blog topic lends itself to original research or data analysis, frame the post
as an **original data report**. These are our most powerful content type because they:
- **Attract backlinks** — Journalists and bloggers cite original research
- **Establish authority** — Positions SendMoneyCompare as an industry data source
- **Generate social shares** — Data-driven insights are highly shareable
- **Win featured snippets** — Google surfaces unique data in search results

**Indicators that a post should be a data report:**
- Topic involves trends, costs, or market analysis
- We have proprietary data others don't (real-time quotes from 16+ providers across 48 currencies via 13 scraper sources)
- The topic is newsworthy or tied to current events
- Existing coverage relies on outdated or limited data

### 10.2 Data Report Format

Data reports follow a specific structure that maximizes link-worthiness:

```
Title format: "[Topic]: [Year] Data Report" or "[Year] [Topic] Report: [Key Finding]"
Examples:
  - "2026 Remittance Cost Report: Which Providers Are Actually Cheapest?"
  - "International Transfer Fees: 2026 Data Report Across 48 Currencies"
  - "The Real Cost of Sending Money Home: 2026 Analysis of 16+ Providers"
```

**Required sections for data reports:**

1. **Executive Summary** — Key findings in 3-5 bullet points (journalists grab these)
2. **Methodology** — How we collected data, sample size, date range
   ```html
   <h3>Methodology</h3>
   <p>This report analyzes <strong>real transfer quotes</strong> collected from
   <strong>16+ providers</strong> across <strong>48 supported currencies</strong> between
   [start date] and [end date]. Quotes were collected via direct API integrations and
   automated browser scraping of provider websites. All amounts are based on a
   benchmark transfer of $1,000 USD unless otherwise noted.</p>
   ```
3. **Key Findings** — 4-6 data-backed insights, each with supporting evidence
4. **Corridor-by-Corridor Breakdown** — Tables comparing costs across corridors
5. **Provider Rankings** — Who's cheapest, fastest, most improved
6. **Trend Analysis** — How costs compare to previous periods (cite World Bank data)
7. **Recommendations** — Actionable advice based on the data
8. **Full Data Tables** — Comprehensive reference tables (great for citations)

### 10.3 Making Data Reports Link-Worthy

To maximize backlink potential:

- **Lead with a surprising finding** — "Banks charge 5x more than fintech providers for
  the same transfer" gets cited more than "We compared transfer costs"
- **Create quotable stats** — Write 2-3 stats as standalone sentences that journalists
  can copy directly:
  ```html
  <blockquote>
    <p>"The average cost of sending $1,000 from the US to Nigeria is $14.50 through
    digital providers, compared to $47.00 through traditional banks — a <strong>224%
    markup</strong> that costs immigrants an estimated $X billion annually."</p>
  </blockquote>
  ```
- **Include embeddable visuals** — Charts and tables that other sites want to share
- **Reference the report as a proper publication** — Use phrases like "according to
  SendMoneyCompare's 2026 Remittance Cost Report" in other blog posts to build
  internal citation credibility
- **Tag it as "Research" category** — Helps Google classify it as original research

### 10.4 Data Report Cross-Referencing

After publishing a data report:
- **Update ALL existing blog posts** that reference cost data to cite the new report
- **Add links from corridor pages** where the report covers that corridor
- **Create derivative content** — Turn individual findings into shorter blog posts
  that link back to the full report (e.g., "Why Banks Charge 5x More for Transfers"
  → links to the full 2026 Remittance Cost Report)

---

## Reference: Existing Blog Posts

Always read `src/data/blog-posts.ts` for the latest list before writing.
Never duplicate an existing topic — instead, propose a complementary angle.

**Always read `src/data/blog-posts.ts` at runtime for the latest list.** This snapshot
may be outdated. Current slugs (23 posts as of March 2026):

- cheapest-way-to-send-money-internationally
- how-to-send-money-abroad
- exchange-rate-markup-explained
- money-transfer-safety-guide
- swift-codes-explained
- iban-numbers-explained
- best-money-transfer-apps
- wise-vs-remitly-comparison
- send-money-to-india-guide
- business-international-payments-guide
- global-remittance-trends-2026
- wire-transfer-guide
- best-money-transfer-services
- money-transfer-promo-codes-referral-programs
- send-money-home-ramadan-eid-2026
- cost-of-sending-1000-abroad
- send-money-to-pakistan-guide
- multi-currency-accounts-exchange-rates
- send-money-to-philippines-guide
- send-money-to-mexico-guide
- send-money-to-nigeria-guide
- send-money-to-bangladesh-guide
- send-money-uk-to-india-guide

---

## Reference: Available Providers (16 hardcoded + scraped)

Always read `src/data/providers.ts` at runtime for the latest. These are the hardcoded
providers with `/companies/` pages you can link to:

| Slug | Name | Notes |
|------|------|-------|
| wise | Wise | Mid-market rate, transparent fees |
| remitly | Remitly | Fast delivery, mobile-first |
| ofx | OFX | No fees on large transfers |
| xe | XE | Currency data authority |
| western-union | Western Union | Largest cash pickup network |
| worldremit | WorldRemit | Mobile wallet delivery |
| revolut | Revolut | Multi-currency app |
| paypal | PayPal | Ubiquitous, higher fees |
| moneygram | MoneyGram | Cash pickup network |
| xoom | Xoom (PayPal) | PayPal's remittance arm |
| torfx | TorFX | UK-focused, large transfers |
| instarem | InstaReM | Asia-Pacific specialist |
| taptap-send | TapTap Send | Africa/Asia corridors |
| ace-money-transfer | ACE Money Transfer | Pakistan/South Asia |

**Additional providers in scraped data** (via Monito, MoneyTransfers, RemitFinder aggregators):
RIA, XE Transfer, Paysend, Panda Remit, CurrencyFair, Moneycorp, SendWave, TransferGo,
Skrill, Currencies Direct, and others. These appear in quotes but don't have dedicated
`/companies/` pages.

## Reference: Popular Corridors (8 defined)

These are the primary corridors defined in `src/data/providers.ts`:

| Corridor | Route Slug | Currencies |
|----------|-----------|------------|
| USA to India | `/send-money/usa-to-india` | USD → INR |
| UK to Europe | `/send-money/uk-to-europe` | GBP → EUR |
| USA to Philippines | `/send-money/usa-to-philippines` | USD → PHP |
| USA to Mexico | `/send-money/usa-to-mexico` | USD → MXN |
| UK to India | `/send-money/uk-to-india` | GBP → INR |
| Canada to India | `/send-money/canada-to-india` | CAD → INR |
| USA to Nigeria | `/send-money/usa-to-nigeria` | USD → NGN |
| UK to Pakistan | `/send-money/uk-to-pakistan` | GBP → PKR |

**48 currencies supported total** — see `currencies[]` array in `src/data/providers.ts`
for the full list (includes USD, GBP, EUR, CAD, AUD, INR, PHP, MXN, NGN, PKR, BDT,
JPY, CNY, BRL, KES, GHS, ZAR, AED, SGD, NZD, and 28 more).

## Reference: Other Content Data Files

When cross-linking, be aware of these additional data sources:

| File | Content | Count |
|------|---------|-------|
| `src/data/news.ts` | News articles at `/news/[slug]` | 12+ items |
| `src/data/comparison-articles.ts` | `/compare/` page content | Multiple |
| `src/data/corridors.ts` | Corridor page content | Multiple |
| `src/data/provider-reviews.ts` | Provider review content | Multiple |
| `src/data/promos.ts` | Promo codes and referral data | Multiple |

---

## Reference: SEO Do's and Don'ts (Google Official + Industry Research)

### DO — High Impact
- Write for humans first, optimize for search engines second
- Use answer-first format under H2s (wins featured snippets)
- Include 5-7 authoritative external citations (boosts E-E-A-T)
- Add real images with descriptive alt text (image search traffic)
- Build topic clusters with bidirectional internal links (+30% traffic)
- Use comparison tables (triggers table rich results)
- Include specific data: exact fees, rates, and amounts
- Update content quarterly with fresh data (+4.6 avg position gain)
- Use `<figure>` + `<figcaption>` for images (semantic context)
- Vary sentence length and structure (human writing signal)
- Include a "Sources & Methodology" section for data posts
- **Include comparison blocks in EVERY article** — Best Overall, Fastest, Cheapest (Google loves these)
- **Link to programmatic corridor pages** (`/send-money/`) from every relevant mention
- **Create original data reports** using our proprietary quote data — these attract backlinks
- **Add mini-comparisons** as inline callouts wherever multiple providers are discussed

### DON'T — Common Mistakes
- Don't use AI-tell phrases ("In today's world", "Let's dive in", "It's important to note")
- Don't stuff keywords — Google understands synonyms and penalizes stuffing
- Don't use the `<meta name="keywords">` tag (Google ignores it since 2009)
- Don't use vague anchor text ("click here", "read more", "this article")
- Don't fabricate reference URLs — search for the real source or don't cite it
- Don't create thin content to target a keyword — substance over length
- Don't duplicate content from other pages on the site
- Don't just change the date without substantive content updates (Google detects this)
- Don't obsess over keyword density — there is no magic number
- Don't use uniform paragraph/sentence lengths (signals AI-generated content)
- Don't skip images — text-only posts underperform by 30%+ in engagement
