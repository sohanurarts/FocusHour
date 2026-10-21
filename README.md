# Hour Tracker (PWA)

Static app, no build step.

## Upload to GitHub + publish
1. Upload ALL files in this folder to the repo root (no sub-folders needed).
2. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Your app URL will be `https://<username>.github.io/<repo>/`

## Make the Android app
1. Open https://www.pwabuilder.com and paste the URL above.
2. Fix nothing: manifest, service worker and icons are already included.
3. Package for Stores > Android, download, and keep the signing key file safe.

## Notes
- Data is stored on the device (localStorage key `ht`).
- After changing any file, bump `V` in `sw.js` (e.g. hour-tracker-v2) so installed apps update.
