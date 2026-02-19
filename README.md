# taltech-geo

A Nuxt 3 frontend app for browsing geological localities from the Estonian Geological Survey public API.

Live URL:
https://spectreh.github.io/taltech-geo-test/

Features:
- Server-side search (`name__icontains`) with debounce
- Pagination (limit/offset, page size selector)
- Locality detail view
- Leaflet map on detail page when coordinates are available

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
