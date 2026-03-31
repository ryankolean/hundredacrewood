# Legacy Platform → Static GitHub Pages Migration

**Date:** 2026-03-31
**Status:** Approved

## Summary

Migrate ryankolean.com (Hundred Acre Wood blog) from a legacy hosted platform SDK to a fully static Vite + React site deployable to GitHub Pages. All legacy backend dependencies (auth, entity CRUD, file upload) are replaced with static data and the admin write interface is removed from routing.

## Architecture

- **Data layer:** Static JSON files in `content/posts/`. Loaded via `import.meta.glob` in `src/data/posts.js`.
- **API layer:** `src/api/entities.js` re-implemented as an in-memory filter/find interface over the posts array. `src/api/integrations.js` replaced with no-op stubs.
- **Auth:** Removed entirely. `User.me()` always throws; all pages that called it have the auth block stripped. The nav no longer shows login/logout.
- **Routing:** Only `Blog` (`/`) and `Post` (`/post?id=...`) are in the router. `Write`, `EditPost`, and `Profile` files are kept but not routed.
- **Deployment:** GitHub Actions workflow builds Vite → `dist/` → deploys to GitHub Pages. `CNAME` file points to `ryankolean.com`. `public/404.html` handles SPA routing.

## Data Shape

Each post JSON file:

```json
{
  "id": "string (slug)",
  "title": "string",
  "excerpt": "string",
  "content": "string (markdown)",
  "tags": ["string"],
  "created_date": "ISO 8601",
  "is_published": true,
  "reading_time": 0,
  "featured_image_url": ""
}
```

## Files Changed

| File | Action |
|------|--------|
| `src/api/legacyClient.js` | Deleted |
| `src/api/entities.js` | Rewritten — static in-memory BlogPost + stub User |
| `src/api/integrations.js` | Rewritten — all no-op stubs |
| `src/data/posts.js` | Created — glob-imports content/posts/*.json |
| `content/posts/hello-world.json` | Created — example post |
| `src/pages/Layout.jsx` | Auth UI removed |
| `src/pages/Blog.jsx` | User.me() call removed |
| `src/pages/Post.jsx` | User.me(), admin edit/delete removed |
| `src/pages/index.jsx` | Write/EditPost/Profile routes removed |
| `package.json` | Remove legacy SDK, add `react-markdown@^8`, rename to `ryankolean-site` |
| `index.html` | Local favicon, title "Ryan Kolean" |
| `README.md` | Replaced with site description |
| `.gitignore` | Added — excludes node_modules/, dist/, .env |
| `CNAME` | `ryankolean.com` |
| `public/404.html` | SPA redirect for GitHub Pages |
| `.github/workflows/deploy.yml` | Vite build + GitHub Pages deploy action |
