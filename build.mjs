import { mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const dist = join(import.meta.dirname, 'dist');
const files = ['site.css', 'site.js', 'icon.svg'];
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of files) await copyFile(join(import.meta.dirname, file), join(dist, file));

const routes = [
  ['', 'video', 'TikTok Video Downloader'],
  ['download-tiktok-stories', 'stories', 'TikTok Story Downloader']
];

function header(prefix, mode) {
  const other = mode === 'video' ? ['download-tiktok-stories/', 'Download TikTok Stories'] : ['', 'Download TikTok Videos'];
  return `<header class="site-header"><div class="header-inner"><nav class="desktop-nav" aria-label="Main navigation"><a href="${prefix}${other[0]}">${other[1]}</a></nav></div></header>`;
}

function hero(mode, title) {
  return `<section class="hero"><div class="hero-inner"><h1>${title}</h1><form class="download-form" data-mode="${mode}"><label class="sr-only" for="video-link">TikTok link</label><div class="link-field"><input id="video-link" name="url" type="text" placeholder="Insert a link here" autocomplete="url" inputmode="url" required><button class="paste-button" type="button" title="Paste from clipboard"><span aria-hidden="true">▣</span> Paste</button></div><button class="download-button" type="submit">Download</button></form><p class="hero-note">Paste a public TikTok link to get the available files.</p><div class="form-feedback" role="status" aria-live="polite"></div><div class="result-panel" hidden></div></div></section>`;
}

for (const [path, mode, title] of routes) {
  const prefix = path ? '../' : './';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#252e69"><meta name="description" content="Download public TikTok videos and stories."><title>${title}</title><link rel="icon" href="${prefix}icon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}site.css"><script defer src="${prefix}site.js"></script></head><body data-page="${mode}">${header(prefix, mode)}<main>${hero(mode, title)}</main></body></html>`;
  const folder = join(dist, path);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html);
}

console.log('Built two static pages in dist/');
