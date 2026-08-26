import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteOrigin = 'https://princenaar.github.io';
const ignoredDirectories = new Set([
  '.git',
  '.idea',
  '.playwright-cli',
  '.playwright-mcp',
  'node_modules',
  'output',
  'playwright-report',
  'test-results'
]);

async function listFiles(directory, predicate) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolutePath, predicate));
    else if (predicate(absolutePath)) files.push(absolutePath);
  }
  return files.sort();
}

function relative(absolutePath) {
  return path.relative(root, absolutePath).replaceAll(path.sep, '/');
}

function idsIn(html) {
  return [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/giu)].map(match => match[2]);
}

function localReferences(html) {
  return [...html.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gisu)]
    .map(match => match[2].trim())
    .filter(value => value && !/^(?:data:|https?:|mailto:|tel:|javascript:)/iu.test(value));
}

function localTarget(pagePath, reference) {
  const hashIndex = reference.indexOf('#');
  const beforeHash = hashIndex === -1 ? reference : reference.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : decodeURIComponent(reference.slice(hashIndex + 1));
  const pathname = decodeURIComponent(beforeHash.split('?')[0]);
  let target = pathname ? path.resolve(path.dirname(pagePath), pathname) : pagePath;
  if (pathname.endsWith('/')) target = path.join(target, 'index.html');
  return { target, fragment };
}

async function exists(absolutePath) {
  try {
    return (await stat(absolutePath)).isFile();
  } catch {
    return false;
  }
}

function publicUrl(pagePath) {
  const page = relative(pagePath);
  if (page === 'index.html') return `${siteOrigin}/`;
  if (page.endsWith('/index.html')) return `${siteOrigin}/${page.slice(0, -'index.html'.length)}`;
  return `${siteOrigin}/${page}`;
}

const htmlFiles = await listFiles(root, file => file.endsWith('.html'));
const siteSourceFiles = await listFiles(root, file => /\.(?:css|html|js)$/iu.test(file));
const sourceText = (await Promise.all(siteSourceFiles.map(file => readFile(file, 'utf8')))).join('\n');
const pageHtml = new Map(await Promise.all(htmlFiles.map(async file => [file, await readFile(file, 'utf8')])));
const pageIds = new Map([...pageHtml].map(([file, html]) => [file, new Set(idsIn(html))]));
const errors = [];

for (const [pagePath, html] of pageHtml) {
  const ids = idsIn(html);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of duplicateIds) errors.push(`${relative(pagePath)}: duplicate id #${id}`);

  for (const reference of localReferences(html)) {
    const { target, fragment } = localTarget(pagePath, reference);
    if (!await exists(target)) {
      errors.push(`${relative(pagePath)}: missing local target ${reference}`);
      continue;
    }
    if (fragment && target.endsWith('.html')) {
      const targetIds = pageIds.get(target) ?? new Set(idsIn(await readFile(target, 'utf8')));
      if (!targetIds.has(fragment)) errors.push(`${relative(pagePath)}: missing fragment ${reference}`);
    }
  }
}

const imageFiles = await listFiles(path.join(root, 'images'), () => true);
for (const imagePath of imageFiles) {
  const marker = `images/${path.basename(imagePath)}`;
  if (!sourceText.includes(marker)) errors.push(`${relative(imagePath)}: unreferenced image`);
}

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/giu)].map(match => match[1].trim()).sort();
const expectedUrls = htmlFiles.map(publicUrl).sort();
for (const url of expectedUrls.filter(url => !sitemapUrls.includes(url))) errors.push(`sitemap.xml: missing ${url}`);
for (const url of sitemapUrls.filter(url => !expectedUrls.includes(url))) errors.push(`sitemap.xml: unexpected ${url}`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push('sitemap.xml: duplicate <loc> entry');

if (errors.length) {
  console.error(`Static site check failed with ${errors.length} problem(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Static site check passed: ${htmlFiles.length} pages, ${imageFiles.length} referenced images, ${sitemapUrls.length} sitemap URLs.`);
}
