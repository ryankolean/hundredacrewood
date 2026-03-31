# Hundred Acre Wood

Personal site and blog for Ryan Kolean — a record of projects, experiments, and writing.

Built with Vite + React + Tailwind CSS. Deployed to GitHub Pages at [ryankolean.com](https://ryankolean.com).

## Development

```bash
npm install
npm run dev
```

## Adding a post

Create a new JSON file in `content/posts/` following the shape of the existing example:

```json
{
  "id": "my-post-slug",
  "title": "Post Title",
  "excerpt": "Short description shown in the post list.",
  "content": "# Markdown content here",
  "tags": ["tag1", "tag2"],
  "created_date": "2024-06-01T00:00:00.000Z",
  "is_published": true,
  "reading_time": 3,
  "featured_image_url": ""
}
```

## Build

```bash
npm run build
```

Output goes to `dist/`. GitHub Actions deploys automatically on push to `main`.
