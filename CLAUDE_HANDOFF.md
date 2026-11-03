# Claude handoff

## What is already done

The `app/` folder contains a dependency-free static TikTok link downloader called Video Saver. It has five pages: video, stories/photos, audio, Android home-screen instructions, and contact. The layout is responsive, has no ads or payment gate, and uses relative paths for GitHub Pages. `build.mjs` generates the ready-to-host site in `dist/`; `.github/workflows/pages.yml` publishes it through GitHub Actions. `README.md` explains setup and limits.

The downloader in `site.js` checks for a public TikTok URL, asks the public TikWM API for available media, and shows video, audio, or photo choices. It offers HD only when the service returns an HD URL. It tries to save the file through the browser and opens the media URL as a fallback. Changing the input clears old results. The contact form opens an email draft; there is no hosted inbox. The Android page does not contain an APK.

Earlier work ran `npm ci`, `npm run build`, syntax checks, and Craft Anything's `rebuild_check`. The five generated pages existed, and the check reported 14/14 behavioral claims passing. Its roughly 33% visual likeness is expected because the original screenshots include ads and a consent overlay that this version intentionally excludes. A prior public-media request and CORS test worked on 2026-11-03, but availability depends on TikWM and the source post. The design of the original post-submit result was not captured, so that panel is an estimate.

## Prompt to give Claude

Continue the project in this `app/` folder. The original request was: "Recreate ssstik.io as the simplest ad-free TikTok downloader I can host on GitHub, without ads blocking HD downloads." A working static first version is already here. Read `README.md`, `build.mjs`, `site.js`, `site.css`, and this handoff before changing anything. Preserve the ad-free design and GitHub Pages compatibility. Review the downloader for real bugs, verify it with a public TikTok link where possible, and fix issues you find. HD must remain conditional on what the public media service actually supplies; do not promise guaranteed full HD or private-post access. Run `npm run build` from `app/` and check the generated pages. Summarize changes and any remaining service limitations in plain language. Do not modify files outside `app/`.
