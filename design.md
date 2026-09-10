# MoneyTransfers Design System

Inspired by **Google Flights** — clean, minimal, functional.

---

## Colors (CSS Variables)

All colors are defined in `src/app/globals.css` as CSS custom properties.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1a73e8` | Primary actions, active tabs, links |
| `--color-primary-dark` | `#1557b0` | Hover state for primary buttons |
| `--color-primary-light` | `#d2e3fc` | Text selection background |
| `--color-primary-surface` | `#e8f0fe` | Active tab background, light blue surfaces |
| `--color-secondary` | `#fbbc04` | Accent / warning yellow |
| `--color-success` | `#34a853` | Positive values (free fees, good ratings) |
| `--color-danger` | `#ea4335` | Errors, negative values |
| `--color-warning` | `#fbbc04` | Caution states |
| `--color-on-surface` | `#202124` | Primary text |
| `--color-on-surface-variant` | `#5f6368` | Secondary / muted text |
| `--color-outline` | `#dadce0` | Borders, dividers |
| `--color-surface` | `#ffffff` | Page background |
| `--color-surface-dim` | `#f8f9fa` | Section backgrounds (alternating) |
| `--color-surface-container` | `#f1f3f4` | Input backgrounds, tags, chips |

**Rule:** Never use Tailwind's built-in color palette (`gray-500`, `blue-600`, etc.) directly. Always reference CSS variables via `var(--color-*)` or the semantic component props.

---

## Typography

- **Font family:** "Google Sans", "Segoe UI", Roboto, system-ui, sans-serif
- **Smoothing:** antialiased

| Role | Size | Weight | Token |
|------|------|--------|-------|
| Page title | `36px` / `46px` (md) | 400 (normal) | — |
| Section heading | `22px` | 400 (normal) | — |
| Card title | `15px` | 500 (medium) | — |
| Body | `14px` | 400 (normal) | — |
| Small / label | `12px`–`13px` | 400–500 | — |
| Tiny / caption | `11px` | 500 (medium) | — |

**Rule:** Always use explicit pixel sizes (`text-[14px]`), not Tailwind's scale (`text-sm`).

---

## Spacing & Layout

- **Max content width:** `1200px`
- **Page horizontal padding:** `24px` (px-6)
- **Section vertical padding:** `40px` (py-10)
- **Card padding:** `20px` (p-5)
- **Grid gaps:** `12px` (gap-3) for card grids, `16px` (gap-4) for stat grids

**Container** — use the `<Container>` component for all page sections:
```tsx
<Container>content</Container>
<Container as="section" className="py-10 bg-[var(--color-surface-dim)]">...</Container>
```

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| Card resting | none (border only) | Default card state |
| Card hover | `0 1px 6px rgba(32,33,36,0.18)` | Card hover interaction |
| Elevated | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Search bars, floating elements |
| Button hover | `0 1px 3px rgba(0,0,0,0.2)` | Primary button hover |

---

## Border Radius

| Element | Radius |
|---------|--------|
| Cards | `rounded-xl` (12px) |
| Search bars | `rounded-2xl` (16px) |
| Buttons | `rounded-full` (pill) |
| Inputs | `rounded-lg` (8px) |
| Tags / chips | `rounded-full` (pill) |

---

## Components

### `<Container>`
Wraps content at max-width with horizontal padding.

### `<Card>`
White bordered card with optional hover shadow and link behavior.

### `<StatBox>`
Small stat display with label + value. Used in provider details, comparisons.

### `<ProsConsList>`
Green checkmark / red X list for pros and cons.

### `<FilterPill>`
Rounded pill button with optional dropdown arrow. Used for filters and tags.

### `<SectionHeader>`
Section title with optional "View all" link on the right.

### `<PrimaryButton>`
Blue pill button with consistent hover/active states. Supports `<a>` and `<button>`.

### `<ComparisonTable>`
Styled table wrapper with consistent header and row styling.

### `<RatingBadge>`
Color-coded rating pill (Excellent=green, Good=blue, Fair=amber, Poor=red).

### `<ProviderCard>`
Google Flights-style expandable row card for transfer quotes.

### `<ComparisonWidget>`
Google Flights-style connected search bar for currency pair + amount input.

### `<Header>`
Sticky top nav with logo and Google-style product tabs with icons.

### `<Footer>`
4-column footer with links, logo, and disclaimer.

---

## Interaction Patterns

- **Hover on cards:** Elevate with shadow, no color change
- **Active tab:** Blue text + blue background (`--color-primary-surface`)
- **Active tab underline:** 3px blue bottom border (on sort tabs)
- **Filter pills:** Border outline by default, blue border + blue bg when active
- **Buttons:** Darken background + add shadow on hover
- **Expandable rows:** Chevron rotates 180° on expand
- **Focus ring:** 2px solid `--color-primary`, 2px offset

---

## Page Structure

```
<Header />                       ← sticky, white, border-bottom
<main>
  <Container>                    ← max-w-[1200px] mx-auto px-6
    <section>                    ← py-10, alternating bg colors
      <SectionHeader />
      <CardGrid / Content />
    </section>
  </Container>
</main>
<Footer />
```

---

## File Structure

```
src/
├── app/
│   ├── globals.css              ← CSS variables, base styles
│   ├── layout.tsx               ← Root layout (Header + Footer)
│   ├── page.tsx                 ← Homepage
│   ├── send-money/page.tsx      ← Comparison results
│   ├── companies/               ← Provider listings & detail
│   ├── comparison/              ← Side-by-side comparisons
│   ├── currency-converter/      ← Converter tool
│   └── guides/                  ← Articles & resources
├── components/
│   ├── Container.tsx
│   ├── Card.tsx
│   ├── StatBox.tsx
│   ├── ProsConsList.tsx
│   ├── FilterPill.tsx
│   ├── SectionHeader.tsx
│   ├── PrimaryButton.tsx
│   ├── ComparisonTable.tsx
│   ├── RatingBadge.tsx
│   ├── ProviderCard.tsx
│   ├── ComparisonWidget.tsx
│   ├── Header.tsx
│   └── Footer.tsx
└── data/
    └── providers.ts             ← All provider/currency/quote data
```
