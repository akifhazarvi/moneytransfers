---
name: seo-blog
description: >
  Create SEO-driven, Search Console-informed content for SendMoneyCompare that
  supports organic growth, commercial rankings, and YMYL-safe publishing.
  Use this for guides and supporting editorial content that strengthens
  /send-money, /compare, and /companies pages.
---

# SEO Content System For SendMoneyCompare

This skill is for building organic growth content that helps SendMoneyCompare:
- earn impressions and clicks from Google Search
- expand topical authority in remittances, FX, and cross-border payments
- push authority into commercial pages
- publish YMYL-safe content with strong sourcing

This is not a generic "write a blog post" prompt.
This is a production workflow for SEO, growth, and content strategy.

The system must stay dynamic.
Do not assume a fixed keyword roadmap, fixed page priority, or fixed site bottleneck.
Each run should infer priorities from:
- current Search Console data
- current site coverage
- current rankings and impressions
- current SERP behavior
- current business goals stated by the user

## Core Principle

Every content decision must answer all 3 questions:
1. Why will this rank?
2. Why does this matter to the business?
3. Which commercial pages will benefit from it?

If a draft cannot answer those 3 questions, do not write it yet.

Also apply this Google-aligned rule:
- content must be created primarily to help people, not primarily to manipulate search rankings

If the piece feels search-engine-first, rewrite the plan before drafting.

---

## Supported Use Cases

Use this skill when the user wants to:
- create a new guide
- improve an existing guide
- turn Search Console impressions into content actions
- target a keyword cluster
- build supporting content for a commercial page
- create finance content that must be factually careful

Do not use this skill by default for:
- provider reviews
- comparison pages
- breaking news
- corridor landing pages

Those may require different templates or direct updates to existing page types.

---

## Output Types

Before writing, decide what the page should be.

### 1. Guide (`/guides/`)
Use when intent is:
- informational
- commercial investigation with educational framing
- evergreen explanation
- data-backed research

Examples:
- cheapest way to send money internationally
- exchange rate markup explained
- best money transfer apps
- international business payments guide

### 2. News (`/news/`)
Use only when:
- the topic is genuinely new
- there is a direct source URL
- the value is freshness, not evergreen explanation

If the topic will still matter in 3 months, prefer a guide instead.

### 3. Compare (`/compare/[slug]`)
Use when intent is explicitly:
- `x vs y`
- comparison/decision-stage

If the user asks for a blog on `wise vs remitly`, challenge the page type and route it to compare.

### 4. Provider Review (`/companies/[slug]`)
Use when the intent is brand-review driven:
- `wise review`
- `is remitly safe`
- `western union fees`

### 5. Corridor Page (`/send-money/[corridor]`)
Use when intent is directly transactional:
- `send money from usa to india`
- `cheapest way to send money to nigeria`

If the topic belongs here, do not create a redundant guide unless there is a distinct informational angle.

---

## Phase 1: Decide If New Content Should Exist

Do not start drafting immediately.
First decide whether the best move is:
- create new content
- update an existing page
- merge content into another page
- improve internal linking only

Use a hard decision, not a vague recommendation.
Every run must end Phase 1 with exactly one of:
- `PUBLISH NEW`
- `UPDATE EXISTING`
- `MERGE INTO EXISTING`
- `DO NOT WRITE`

### 1.1 Check Existing Site Coverage

Review existing:
- `/guides/`
- `/news/`
- `/compare/`
- `/companies/`
- `/send-money/`

If an existing page already targets the same intent, prefer improving that page.

Rules:
- One primary intent per page
- Do not create near-duplicates
- Do not create a guide if a corridor page should own the keyword
- Do not create news if a guide will age better

### 1.2 Check Search Console Signal First

If Search Console data is available, use it before planning new content.

Interpretation rules:
- Existing page has impressions but low rank: improve that page first
- Existing page ranks positions 4-15: optimize title, intro, links, and depth
- Existing page ranks positions 16-40: improve internal links and supporting content
- No page has impressions for the cluster: new content may be justified

Priority order:
1. Improve an existing impression-earning page
2. Build support content for a page already being tested
3. Create net-new content only when the site lacks coverage

Use Search Console and Insights-style logic:
- top pages: protect and expand winners
- trending-up pages: support them with links and adjacent content
- trending-down pages: refresh or merge if needed
- rising queries: decide whether to update an existing page or create support content

### 1.3 Business Fit Test

Do not create content unless it supports at least one of these:
- `/send-money`
- a high-value corridor page
- `/compare`
- a provider page
- a strategic keyword cluster already showing in Search Console

### 1.4 Decision Framework

Use this decision logic:

#### `PUBLISH NEW`
Choose this only when:
- no existing page owns the intent well
- there is clear ranking opportunity
- the topic supports a business goal
- the page can offer distinct value

#### `UPDATE EXISTING`
Choose this when:
- an existing page already has impressions
- the page is the natural canonical owner of the topic
- rank/CTR/depth can be improved without creating a new URL

#### `MERGE INTO EXISTING`
Choose this when:
- the idea is too close to an existing page
- a new page would split authority
- the incremental value is better as a new section on an existing page

#### `DO NOT WRITE`
Choose this when:
- the topic has weak business value
- the site has no authority path to rank it
- the content would be thin, repetitive, or speculative
- the user would be better served by fixing existing pages first

### 1.5 Required Decision Output

Before any draft, state:

```text
DECISION
========
Outcome:
Why:
Owning page:
Business impact:
Risk if we create a new page:
```

Do not hardcode strategic priorities.
Instead, determine current priority clusters from:
- Search Console impressions
- ranking pages already being tested
- commercial value
- topical authority gaps
- user-stated business goals

You may mention current candidate clusters, but label them as current opportunities, not permanent strategy.

---

## Phase 2: Search Intent And Keyword Strategy

Use web search when needed for current SERP behavior and freshness.
For YMYL topics, prioritize primary sources.

### 2.1 Classify Intent

Classify the keyword as one of:
- Informational
- Commercial investigation
- Transactional
- News/freshness
- Utility/reference

Then map it to the correct page type.

### 2.2 Build A Keyword Map

Produce:
- Primary keyword
- Secondary keywords
- Long-tail questions
- Semantic entities
- Commercial support pages this content should strengthen

Do not force a keyword if Google is clearly rewarding a different angle.
Do not assume yesterday's winner is today's priority.

### 2.3 SERP Reality Check

Study the current SERP and answer:
- Are the top results guides, tools, comparisons, or news?
- Is Google rewarding freshness, depth, brand trust, or utility?
- What subtopics appear repeatedly?
- What angle is missing or weak?

### 2.4 Competitor Gap Analysis

For the top results, identify:
- coverage they all include
- missing sections
- stale data
- weak sourcing
- weak examples
- weak internal-commercial path

Your content must not just be "more words."
It must be more useful, more current, more specific, or more decision-helpful.

### 2.5 Dynamic Opportunity Scoring

For each content opportunity, score it qualitatively on:
- ranking potential
- commercial value
- freshness dependence
- support value for existing pages
- effort required

Then decide whether it is:
- publish now
- update an existing page
- monitor only
- deprioritize

---

## Phase 3: Topic Brief

Before drafting, produce a brief and align on it.

Use this structure:

```text
TOPIC BRIEF
===========
Page type:
Primary keyword:
Primary keyword intent modifier:
Secondary keywords:
Long-tail questions:
Semantic entities:
Search intent:
Audience:
Business goal:
Primary conversion path:
Existing page to support:
Why this should exist:
Why this can rank:
Why this matters commercially:
Competitor gaps:
Unique angle:
Outline:
Internal links to include:
Internal link context:
Anchor text plan:
Title candidates:
Meta description candidates:
External source plan:
Freshness requirement:
```

If a new page is not justified, say so and recommend:
- update existing page
- merge into another page
- improve internal links instead

If the decision is not `PUBLISH NEW`, do not generate a full new article draft by default.
Instead generate:
- update plan
- merge plan
- link plan
- title/meta refresh plan

---

## Phase 4: YMYL And Source Rules

This site is in finance. Treat all money-transfer, banking, FX, regulation, and tax content as YMYL.

### 4.1 Source Hierarchy

Use sources in this order:
1. Official institutions, regulators, central banks, provider documentation, filings
2. Reputable trade publications or major newsrooms
3. Secondary commentary, only if clearly labeled

### 4.2 Never Publish These As Facts Without Verification

- fees
- exchange-rate claims
- provider availability
- regulation or tax details
- launch dates
- licensing status
- product feature claims

### 4.3 Source Requirements By Content Type

For guides:
- cite strong current sources where claims need support
- use direct URLs where possible

For news:
- direct article, bulletin, filing, or press release URL is mandatory
- no generic homepages as source URLs

For analysis:
- explicitly label analysis vs verified fact

### 4.4 Claims And Data Rules

Do not hardcode site-scale claims such as:
- provider count
- corridor count
- quote count

Those should come from current data or be omitted.

If exact counts are not safely available, use durable phrasing:
- "dozens of providers"
- "multiple corridors"
- "our comparison data"

### 4.5 Human Review Threshold

Treat the following as requiring especially careful review before publication:
- taxes
- regulation
- licensing
- provider feature availability
- provider pricing claims
- country-specific compliance advice
- financial safety recommendations

If a topic falls into one of these areas, prefer:
- official sources
- direct source URLs
- conservative wording
- explicit uncertainty where needed

---

## Phase 5: Writing Standards

Write like a senior financial content editor, not an AI template.

### 5.1 Voice

Target voice:
- direct
- specific
- informed
- plain English
- commercially aware

Avoid:
- fluff
- hype
- generic SEO intros
- filler transitions
- fake confidence

### 5.2 Bad Openers

Do not use:
- "In today's fast-paced world"
- "In this article, we will"
- "When it comes to"
- "Let's dive in"
- "It is important to note"
- "A comprehensive guide"

### 5.3 Good Openers

Open with one of:
- a real money example
- a surprising cost difference
- a market shift
- a user problem
- a direct answer

Example:
- "A bank can turn a $1,000 transfer into a $40 mistake without ever showing you a fee. The culprit is usually exchange-rate markup."

### 5.4 Human Quality Rules

- Use exact numbers when they are verified
- Acknowledge trade-offs
- Show who the recommendation is for
- Explain why one option wins
- Keep paragraphs short
- Use varied sentence length

Google-aligned quality checks:
- add original information, analysis, examples, or framing
- do not just summarize what other sites already say
- make sure the reader can achieve their goal after reading
- make sure the page fits the site's real focus and audience

---

## Phase 6: SEO Rules

### 6.1 Titles

Use these principles:
- primary keyword near the front
- clear value proposition
- avoid bloated titles
- year only when freshness matters

Operational rules:
- target 45-60 characters when possible
- avoid titles over 60 characters unless the tradeoff is clearly worth it
- do not stuff multiple keyword variants into one title
- title must match the actual SERP angle
- title should read naturally to humans first, not like a keyword list
- produce 3 title options before finalizing
- choose one primary title and explain why it is best
- keep the title text aligned with the main visible page title and H1
- make the title distinctive from surrounding navigation or repeated template text
- avoid misleading clickbait or withholding the answer

Preferred title patterns by intent:
- informational: `What Is X?`, `How X Works`, `X Explained`
- commercial investigation: `Best X`, `Cheapest X`, `X vs Y`, `Top X in 2026`
- research/data: `X Trends in 2026`, `X Statistics`, `X Report`

Good:
- `International Business Payments: Best Options for SMEs in 2026`
- `Cheapest Way to Send Money Internationally in 2026`

Avoid rigid formulas.
Do not optimize titles mechanically at the expense of CTR.

Google title-link alignment rules:
- the page `<title>`, H1, and on-page framing should broadly agree
- avoid boilerplate-heavy titles across many pages
- avoid vague labels like "Guide" or "Home" without context
- avoid overlong titles that are likely to be rewritten

### 6.2 Meta Descriptions

Target:
- roughly 140-160 characters
- clear reason to click
- support the title
- reflect the page honestly

Operational rules:
- keep primary keyword in the first half when natural
- include a clear value promise or decision benefit
- avoid vague filler like "learn everything you need to know"
- produce 2-3 options before finalizing
- do not repeat the title mechanically
- if the page is commercial-investigation content, mention comparison/data/value explicitly

Snippet rules:
- write a strong opening paragraph because Google may generate snippets from page text, not just the meta description
- make the first 1-2 paragraphs useful, specific, and query-relevant
- avoid generic openings that waste snippet potential

Do not chase exact character counts mechanically.

### 6.3 Heading Structure

The page should:
- answer the main question quickly
- cover the expected subtopics
- include commercially useful sections when relevant

Typical high-performing structure:
1. Hook / direct answer
2. Why this matters now
3. Core explanation or comparison
4. Real examples / data / table
5. Who should use what
6. Mistakes / risks / hidden costs
7. What to do next

Heading rules:
- exactly one H1
- use H2s for primary sections only
- use H3s only when they improve scanability
- each H2 should map to either a secondary keyword, a major user question, or a conversion-supporting topic
- do not create decorative headings with no search or reader value

### 6.4 Featured Snippet / AI Overview Formatting

Use answer-first sections:
- direct definition paragraph
- concise process lists
- comparison tables
- bullet takeaways

But do not over-template the entire article for snippets.
Depth still matters.

### 6.5 Image Rules

Use images only when they genuinely improve comprehension or preview quality.

Rules:
- featured image should not be a logo
- featured image should be large enough for strong previews
- image alt text should describe the image plainly
- do not add decorative images just to satisfy a template
- if the article is a candidate for Discover-like visibility, prefer high-quality, large featured images

### 6.6 Language And Consistency Rules

If the page is written in English:
- title
- headings
- metadata
- image alt text

should all be in English and aligned with the page language.

Do not mix languages in titles or metadata unless the page itself is genuinely multilingual.

---

## Phase 7: Internal Linking Strategy

This is mandatory.
Every guide should strengthen the revenue architecture.

### 7.1 Required Link Types

Each guide should usually include:
- 2-4 links to related guides
- 1-3 links to corridor pages
- 1-3 links to provider pages
- 1-2 links to compare pages
- 1 link to `/send-money`

These are minimums, not blind quotas.
Link only where context supports the destination.

### 7.2 Anchor Text Rules

Use descriptive anchors.
Avoid:
- click here
- read more
- this page
- learn more

Good anchors:
- `compare money transfer providers`
- `send money from the UK to India`
- `our Wise review`
- `Wise vs Remitly`
- `exchange rate markup guide`

Anchor text rules for this app:
- use natural-language anchors that fit the sentence
- keep anchors specific to the destination page's intent
- vary anchors across the site
- avoid linking multiple times in the same article with nearly identical anchors unless needed
- prefer anchors that help the commercial page rank, but do not make them awkward

Google-aligned link rules:
- links must be standard crawlable `<a href="...">` links
- do not rely on non-crawlable link patterns for important internal navigation
- anchor text should help users and search engines understand the destination
- links should connect genuinely relevant pages, not just pass equity mechanically

### 7.3 Internal Link Context Mapping

Before finalizing a blog, explicitly map where links should appear and why.

For each internal link, define:
- destination URL
- anchor text
- section where it appears
- reason for inclusion
- whether it supports discovery, trust, or conversion

Use this structure:

```text
INTERNAL LINK PLAN
==================
1. URL:
   Anchor:
   Place in article:
   Why here:
   Supports:
```

Context rules:
- early article links should usually support understanding or trust
- mid-article links should usually support comparison or evaluation
- late-article links should usually support action or conversion
- do not dump all links in the final paragraph
- every article should have at least one link path into:
  - a commercial tool page
  - a transactional or corridor page when relevant
  - a provider or compare page when relevant

### 7.4 Commercial Support Rule

Before finalizing a guide, explicitly list:
- which pages it should support
- which anchors should point there

If a guide does not help any commercial page, reconsider the topic.

### 7.5 Link Relationship Rules By Page Type

When writing a guide, decide which of these relationships apply:

- Guide -> Corridor
  Use when the guide explains a sending problem, destination, cost, or transfer method.

- Guide -> Provider
  Use when a provider is a meaningful example, recommendation, or trade-off.

- Guide -> Compare
  Use when the reader is in evaluation mode and choosing between brands.

- Guide -> Tool
  Use when the reader can act immediately using `/send-money` or a utility page.

- Guide -> Guide
  Use when the linked guide genuinely deepens understanding.

The blog should not just "contain links."
It should create a deliberate authority and conversion path.

### 7.6 Mandatory Link Context Audit

Before finalizing any blog, check:
- does the article link to the best existing related guide?
- does it link to the best matching corridor page?
- does it link to the right provider or comparison page for evaluation intent?
- does it give the reader a natural next action through `/send-money` or another tool?

If not, the article is incomplete.

---

## Phase 8: Content Format For This Site

Default output should fit the site's content data model and actual publishing flow.

When writing a guide for `src/data/blog-posts.ts`, provide:
- title
- metaDescription
- excerpt
- category
- readTime
- tags
- sections with headings and HTML content
- FAQs when useful
- internal link plan
- source list

Also provide:
- primary keyword
- secondary keywords
- title length
- meta description length
- why this page should rank
- which pages this blog is intended to strengthen
- people-first value summary
- why this is not search-engine-first content

All body content should be HTML, not Markdown.

Use only supported HTML elements already used in the codebase:
- `<p>`
- `<strong>`
- `<em>`
- `<ul>`, `<ol>`, `<li>`
- `<h3>`
- `<a>`
- `<blockquote>`
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- `<figure>`, `<figcaption>` when needed

Only include images if they materially improve the content.
Do not add images just to satisfy a template.

### 8.1 Page-Type Template Library

Use the right structure for the right page type.

#### Guide Template
Use for evergreen informational/commercial-investigation content.

Recommended structure:
1. Direct answer / hook
2. Why it matters now
3. Core explanation
4. Comparison or examples
5. Best options / recommendations
6. Mistakes / risks / hidden costs
7. What to do next
8. FAQs

#### Research / Data Guide Template
Use for trends, statistics, annual reports, regulatory landscape explainers.

Recommended structure:
1. Key finding
2. What changed
3. Data breakdown
4. Why it matters commercially
5. Implications for senders/businesses
6. Supporting examples
7. What to do next

#### Support Guide Template
Use for pages designed mainly to strengthen corridor, compare, or provider pages.

Recommended structure:
1. Short direct answer
2. Key decision factors
3. Comparison logic
4. Examples / use cases
5. Internal pathways to money pages

#### News Analysis Template
Use only when the content is genuinely freshness-driven but still needs interpretation.

Recommended structure:
1. What happened
2. Why it matters
3. Who is affected
4. Impact on pricing/transfers/providers
5. What readers should do next

Do not use a guide template blindly for every topic.

---

## Phase 9: Search Console Feedback Loop

This is what turns content writing into growth.

After a page exists, use Search Console data to decide what happens next.

### 9.1 If Impressions Exist But Clicks Are Low

Check:
- title quality
- meta quality
- search intent mismatch
- whether the page is ranking too low for CTR to matter
- whether the snippet-worthy opening is weak

If average position is worse than 20, ranking is the problem, not CTR.

### 9.2 If Position Is 4-15

Prioritize:
- stronger intro
- better title
- exact-match internal links
- FAQ coverage
- better alignment with SERP intent
- stronger snippet text in the opening paragraphs
- better support from adjacent pages

### 9.3 If A Query Cluster Starts Appearing

Do not immediately create many pages.
First ask:
- which existing page is Google already testing?
- can that page be improved?
- what support piece would help it most?

Do not create a new page if an existing page is already the likely canonical fit for that query cluster.

### 9.4 Content Expansion Logic

Expand clusters only when:
- a strategic query theme appears in Search Console
- an existing page is already being tested
- the new content clearly supports a commercial page

### 9.5 Dynamic Priority Reset

At the start of each run, reassess:
- which queries are rising
- which pages are newly getting impressions
- which pages are near page 1
- which content types are leading discovery
- which commercial pages are under-supported

Do not reuse old assumptions unless current data still supports them.

### 9.6 Post-Publish Optimization Rules

After content is published, define what to do based on Search Console behavior.

#### After 3-7 days
Check:
- indexing
- first impressions
- which queries triggered impressions
- whether the intended page is the one Google chose

Actions:
- if impressions are appearing on the wrong page, strengthen internal links and intent signals
- if there are no impressions, reassess title, internal links, and crawl path

#### After 7-21 days
Check:
- emerging queries
- average position
- CTR where position is <15
- whether adjacent pages should link in

Actions:
- rewrite title/meta if rankings are near page 1 but CTR is weak
- expand sections if queries suggest missing subtopics
- add exact contextual internal links from pages already earning impressions

#### After 21-45 days
Check:
- whether the page is consolidating into a stable keyword cluster
- whether it is helping adjacent commercial pages
- whether a support article or merge is needed

Actions:
- build supporting content only if the page shows real traction
- merge or prune weak near-duplicate content if authority is fragmenting

### 9.7 Search Console Action Output

When reviewing existing content, output:

```text
SEARCH CONSOLE ACTION PLAN
==========================
Observed signal:
Likely issue:
Recommended action:
Pages to update:
Internal links to add:
Whether to publish support content:
Review window:
```

---

## Phase 10: Quality Gate Before Publishing

Before considering a piece complete, verify:

### Strategy
- correct page type chosen
- clear target keyword and intent
- supports at least one commercial page
- content fits the site's real focus and audience

### SEO
- title and meta are strong
- title length is acceptable
- title matches the right SERP angle
- primary keyword usage is natural
- secondary keywords are covered without stuffing
- page is not duplicative
- internal linking plan is explicit
- headings match SERP intent
- opening paragraphs are snippet-worthy
- title, H1, and page framing are aligned

### Content
- opening is strong
- claims are specific
- examples are concrete
- trade-offs are acknowledged
- no AI filler language
- blog has useful internal links in the right context
- the article supports the app's revenue pages, not just the blog
- content offers original value, not just paraphrase
- reader can complete their goal after reading

### YMYL
- sensitive claims are sourced
- direct source URLs where needed
- no fabricated data
- no stale numbers copied from old drafts
- confidence level matches evidence

### Google Alignment
- content is people-first, not search-engine-first
- title is descriptive and not clickbait
- links are crawlable and use good anchor text
- images are useful and not purely decorative
- the article would still be worth publishing if search traffic did not exist

If any of the above fails, revise before publishing.

---

## Required Final Deliverable Format

Unless the user asks otherwise, final output from this skill should include:

```text
SEO SUMMARY
- Page type
- Primary keyword
- Secondary keywords
- Long-tail questions
- Semantic entities
- Search intent
- Commercial pages supported
- People-first value summary

METADATA
- Title option 1
- Title option 2
- Title option 3
- Chosen title
- Title length
- Meta option 1
- Meta option 2
- Chosen meta
- Meta length

INTERNAL LINK PLAN
- URL / anchor / section / reason / supports

GOOGLE ALIGNMENT CHECK
- Why this is people-first
- Why this should not be considered search-engine-first
- Snippet strategy
- Title/H1 alignment note

SOURCE PLAN
- primary sources
- secondary sources

CONTENT DRAFT
- structured for src/data/blog-posts.ts
```

If the decision is not `PUBLISH NEW`, replace `CONTENT DRAFT` with one of:
- `UPDATE PLAN`
- `MERGE PLAN`
- `NO-WRITE RECOMMENDATION`

---

## No-Write Rules

Do not draft a new blog when:
- an existing page already owns the topic
- the keyword belongs on a commercial page instead
- there is no clear internal link path to business pages
- the content would rely on weak or unverifiable claims
- the topic is too broad for the site's current authority
- Search Console suggests improving an existing page is the higher-leverage move

In these cases, be explicit and recommend the better action.

---

## Default Workflow

When invoked, follow this order:
1. Determine whether new content should exist
2. Choose correct page type
3. Review existing site coverage
4. Review Search Console signals if available
5. Research SERP and sources
6. Produce topic brief
7. Get approval if appropriate
8. Draft content
9. Add internal linking plan
10. Run quality gate

---

## What Good Looks Like For SendMoneyCompare

A strong piece of content for this site should do all of the following:
- rank for a clear keyword cluster
- answer a real user problem
- show stronger judgment than generic AI content
- cite good sources
- link naturally into `/send-money`, `/compare`, and `/companies`
- improve the site's authority in remittances, FX, or cross-border payments
- create a path from informational traffic to commercial pages

If it only "fills the blog," it is not good enough.

If it follows a stale SEO plan that no longer matches live search behavior, it is not good enough.
