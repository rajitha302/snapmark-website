// Post-build smoke check. Reads out/index.html and asserts the
// load-bearing contracts from the spec are present.
// Usage: node scripts/verify-site.mjs  (or: npm run verify)

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const outDir = resolve(ROOT, 'out');
const indexPath = resolve(outDir, 'index.html');

const failures = [];
function check(label, cond) {
  if (!cond) failures.push(label);
  else console.log(`  ✓ ${label}`);
}

if (!existsSync(indexPath)) {
  console.error(`✗ out/index.html not found. Run 'npm run build' first.`);
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf8');

console.log('Checking out/index.html…');

check('title tag present', /<title[^>]*>Snapmark/i.test(html));
check(
  'meta description mentions AI chats',
  /<meta[^>]+name="description"[^>]+ai chats?/i.test(html),
);
check('open graph title present', /property="og:title"/.test(html));
check('twitter card present', /name="twitter:card"/.test(html));
check('SoftwareApplication JSON-LD present', /"SoftwareApplication"/.test(html));
check(
  'Install CTA links to VS Code Marketplace',
  /href="https:\/\/marketplace\.visualstudio\.com\/items\?itemName=RajithaDisanayaka\.snapmark"/.test(
    html,
  ),
);
check('GitHub link present', /href="https:\/\/github\.com\/rajitha302\/Snapmark"/.test(html));
check('H1 present', /<h1[^>]*>.*Annotate screenshots/i.test(html));
check('features section heading present', /Three things the marketplace/i.test(html));
check('"Blur sensitive regions" wording used (not "Redact")', /Blur sensitive regions/.test(html));
check(
  '"Redact" NOT used in marketing copy (allowed only in SEO keywords meta)',
  (() => {
    // Strip the keywords meta-tag content before scanning — "redact" is allowed
    // to appear in the keywords array for search discoverability, but must NOT
    // appear anywhere else in user-visible markup. Also strip the serialized
    // metadata that Next.js embeds for hydration.
    let stripped = html.replace(/<meta[^>]+name=["']keywords["'][^>]*>/gi, '');
    // Also strip the escaped JSON serialization of keywords in Next.js hydration data
    stripped = stripped.replace(/\\?"name\\"?:\\"?keywords\\"?[^}]*\\?"/gi, '');
    return !/redact/i.test(stripped);
  })(),
);
check('how-it-works heading present', /How it works/i.test(html));
check('works-with strip present', /Claude Code/.test(html) && /Cursor/.test(html));
check('keyboard shortcut kbd rendered', /<kbd[^>]*>.*⌘⇧A.*<\/kbd>/.test(html));

if (!existsSync(resolve(outDir, 'sitemap.xml'))) failures.push('sitemap.xml emitted');
else console.log('  ✓ sitemap.xml emitted');

if (!existsSync(resolve(outDir, 'robots.txt'))) failures.push('robots.txt emitted');
else console.log('  ✓ robots.txt emitted');

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log('\n✓ All checks passed.');
