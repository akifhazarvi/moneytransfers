/** Audit initial HTML discovery paths. Run after a build:
 * node scripts/check-crawl-paths.mjs [--report]
 * JSON goes to stdout; --report records failures without a nonzero exit.
 * This measures available links, not Google's actual crawl or indexing choices.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';

const app = join(process.cwd(), '.next/server/app');
const origin = 'https://sendmoneycompare.com';
const priority = ['usa-to-india', 'usa-to-pakistan', 'usa-to-philippines', 'uk-to-india', 'uk-to-nigeria'];
const guidePairs = {
  'usa-to-india': 'send-money-to-india-from-usa-guide',
  'uk-to-india': 'send-money-uk-to-india-guide',
  'uk-to-nigeria': 'send-money-uk-to-nigeria-guide',
  'uk-to-bangladesh': 'send-money-uk-to-bangladesh-guide',
  'usa-to-kenya': 'send-money-to-kenya-from-usa-guide',
};
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []);
}
function pathOf(href, base = '/') {
  try {
    const url = new URL(href, origin + base);
    if (url.origin !== origin) return null;
    return url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  } catch { return null; }
}
/** React streams Suspense content into a hidden <div id="S:n"> at the end of the
 * body and splices it over <template id="B:n"> with $RC. Raw HTML therefore puts
 * that markup outside <main>; put it back before judging where a link sits. */
function resolveStreamedContent($, html) {
  for (const [, boundary, segment] of html.matchAll(/\$RC\("([^"]+)","([^"]+)"\)/g)) {
    const target = $(`template[id="${boundary}"]`);
    const source = $(`div[hidden][id="${segment}"]`);
    if (target.length && source.length) target.replaceWith(source.contents());
  }
}
const pages = new Map();
for (const file of walk(app)) {
  const route = file.slice(app.length).replace(/\.html$/, '');
  if (route !== '/en' && !route.startsWith('/en/')) continue;
  const path = pathOf(route);
  const html = readFileSync(file, 'utf8');
  const $ = load(html);
  resolveStreamedContent($, html);
  const links = new Set();
  const mainLinks = new Set();
  $('a[href]').each((_, a) => {
    if (($(a).attr('rel') || '').split(/\s+/).includes('nofollow')) return;
    const target = pathOf($(a).attr('href'), path);
    if (!target || target === path) return;
    links.add(target);
    // Main content = inside <main>, minus the site-wide header/footer. A <nav>
    // INSIDE <main> counts: the /send-money hub renders its corridor index as a
    // semantic <nav>, and excluding that made 207 submitted URLs look as though
    // nothing but boilerplate pointed at them. Only chrome outside <main> is
    // boilerplate here.
    if ($(a).closest('main').length && !$(a).closest('header,footer').length) mainLinks.add(target);
  });
  const noindex = $('meta[name="robots"],meta[name="googlebot"]').toArray()
    .some(e => /\b(noindex|none)\b/i.test($(e).attr('content') || ''));
  pages.set(path, { links, mainLinks, indexable: !noindex && $('link[rel="canonical"]').attr('href') === origin + (path === '/' ? '' : path) });
}
function paths(field) {
  const found = new Map([['/', ['/']]]);
  const queue = ['/'];
  for (let i = 0; i < queue.length; i++) {
    const source = queue[i];
    for (const target of pages.get(source)?.[field] || []) {
      if (!pages.has(target) || found.has(target)) continue;
      found.set(target, [...found.get(source), target]);
      queue.push(target);
    }
  }
  return found;
}
const allPaths = paths('links');
const mainPaths = paths('mainLinks');
const submitted = [...new Set([...readFileSync(join(app, 'sitemap.xml.body'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => pathOf(m[1])))];
const unreachable = submitted.filter(p => !allPaths.has(p));
const errors = unreachable.map(p => `No initial-HTML path from homepage to submitted URL: ${p}`);
const priorities = priority.map(slug => {
  const path = '/send-money/' + slug;
  const direct = pages.get('/')?.mainLinks.has(path) || false;
  if (!direct || !pages.get(path)?.indexable || !submitted.includes(path)) errors.push(`Priority route must be directly linked in homepage main content, indexable and submitted: ${path}`);
  return { path, directHomepageMainLink: direct, indexable: pages.get(path)?.indexable ?? false,
    shortestPath: allPaths.get(path) || null,
    incomingPages: [...pages.values()].filter(p => p.links.has(path)).length };
});
const guideLinks = Object.entries(guidePairs).map(([corridor, guide]) => {
  const source = '/send-money/' + corridor;
  const target = '/guides/' + guide;
  const linked = pages.get(source)?.mainLinks.has(target) || false;
  if (!linked || !pages.has(target)) errors.push(`Missing rendered corridor-to-guide link: ${source} -> ${target}`);
  return { source, target, linked };
});
/** Submitted URLs whose only inbound link is their hub index. Reported, not
 * failed: the /send-money hub indexing all 436 corridors is deliberate (see
 * shouldNoindex in corridor-tiers.ts). It is the /guides and /news entries here
 * that tend to be real — editorial pages nothing contextual points at, which is
 * what sitemap-allowlists.ts means when it annotates a guide "top stranded". */
const inbound = new Map(submitted.map(p => [p, 0]));
for (const page of pages.values())
  for (const target of page.links) if (inbound.has(target)) inbound.set(target, inbound.get(target) + 1);
const stranded = {};
for (const [path, n] of inbound) {
  if (n > 1) continue;
  (stranded[path.split('/')[1] || '(home)'] ??= []).push({ path, inboundPages: n });
}
console.log(JSON.stringify({ measuredAt: new Date().toISOString(), scope: 'Local build, English initial HTML; excludes nofollow anchors. Main content excludes nav/header/footer. Not a Google crawl measurement.',
  pages: pages.size, submitted: submitted.length, unreachable,
  submittedWithoutMainContentPath: submitted.filter(p => !mainPaths.has(p)),
  strandedByFamily: Object.fromEntries(Object.entries(stranded)
    .map(([f, rs]) => [f, { count: rs.length, paths: f === 'send-money' ? rs.slice(0, 5).map(r => r.path) : rs.map(r => r.path) }])
    .sort((a, b) => b[1].count - a[1].count)),
  priority: priorities, guideLinks, errors }, null, 2));
if (errors.length && !process.argv.includes('--report')) process.exitCode = 1;
