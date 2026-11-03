# Video Saver

An ad-free, static TikTok link downloader. It includes video, story/photo, and audio views, plus mobile and contact pages. It uses a public third-party media service from the browser, so availability and quality depend on that service and on the source post. Private posts are not accessible.

## Build

Install Node.js, then run:

```sh
npm install
npm run build
```

The complete static website is in `dist/`. Its `index.html` and the folders for the other pages can be uploaded to any static host.

## Put it on GitHub Pages

1. Create a GitHub repository and upload the contents of this `app` folder.
2. In the repository, open **Settings > Pages** and set the source to **GitHub Actions**.
3. The included workflow builds and publishes the site after you upload or change files on the `main` branch. Check the **Actions** tab for the published address.

The site uses relative links, so it works both at a custom domain and under a GitHub project path.

## Limits

- Download links are fetched from TikWM, which may change or limit access later.
- An HD choice appears only when the service returns an HD file.
- The Android page describes adding the website to a home screen; it does not ship an APK.
- The contact form opens the visitor's email app with a prepared message. The site has no hosted inbox.
