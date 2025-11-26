## Michael Gathara's Blog

A Gatsby v5 blog with Markdown-based posts, syntax highlighting, reading time, dark mode, and Firebase Hosting deployment.

### Tech stack
- **Framework**: Gatsby v5 (React 18)
- **Styling**: CSS modules
- **Markdown**: `gatsby-transformer-remark` + `gatsby-remark-prismjs`
- **Images**: `gatsby-plugin-image`, `gatsby-plugin-sharp`, `gatsby-transformer-sharp`
- **Head/SEO**: `react-helmet`
- **Deploy**: Firebase Hosting

### Project layout
The Gatsby site lives under `public/blog` and builds into `public/blog/public`.

```
root
├─ firebase.json                # Firebase hosting config (publishes public/blog/public)
└─ public/
   └─ blog/
      ├─ content/blogs/        # Markdown posts (with frontmatter)
      ├─ src/
      │  ├─ assets/            # Favicons, PWA icons, etc.
      │  ├─ components/        # UI components (e.g., layout.js)
      │  ├─ images/            # Local images used in posts/pages
      │  ├─ pages/             # Top-level pages
      │  └─ templates/         # Blog post template
      ├─ gatsby-*.js           # Gatsby config files
      └─ package.json
```

### Prerequisites
- **Node.js**: 18.x or newer (required by Gatsby v5)
- **npm**: 8+ (bundled with Node 18)
- Optional: `firebase-tools` for deployment

### Getting started (local development)
Run everything from the Gatsby app directory:

```bash
cd public/blog
npm install
npm run develop
```

Open `http://localhost:8000` in your browser.

### Available scripts (in `public/blog`)
- `npm run develop`: Start Gatsby dev server
- `npm run build`: Build production assets into `public/blog/public`
- `npm run serve`: Serve the production build locally
- `npm run clean`: Clear Gatsby caches
- `npm run format`: Run Prettier on the codebase

### Writing posts
Create Markdown files in `public/blog/content/blogs/`. Each post should include frontmatter:

```markdown
---
title: "Post Title"
date: "2024-06-01"
path: "/my_post_path"
desc: "Short description for SEO"
---

Your Markdown content goes here.
```

- **Required frontmatter**: `title`, `date`, `path`, `desc`
- Posts are rendered using `src/templates/blogTemplate.js`

### Images and assets
- Place general images in `public/blog/src/images/` and reference them in components/pages.
- PWA icons and favicons are in `public/blog/src/assets/` and configured via `gatsby-config.js`.
- The footer icon is configured in `src/components/layout.js` and uses `src/assets/redbull.png`.

### SEO and site metadata
Update site metadata in `public/blog/gatsby-config.js` under `siteMetadata`:
- **title**: Blog title
- **description**: Default site description
- **author**: Handle or name
- **siteUrl**: Canonical site URL

### Production build
```bash
cd public/blog
npm run build
```

Artifacts will be output to `public/blog/public`.

### Deployment (Firebase Hosting)
This repo includes `firebase.json` configured to host the Gatsby build output directory `public/blog/public`.

1) Build the site:
```bash
cd public/blog
npm run build
```

2) Deploy from the repository root:
```bash
cd ../..        # back to repo root
firebase deploy --only hosting
```

Notes:
- Install the CLI if needed: `npm i -g firebase-tools`
- Login once: `firebase login`

### Troubleshooting
- If you see errors related to Node version, ensure Node 18+.
- After changing plugins/config, try `npm run clean` then `npm run develop`.
- If images don’t appear, verify source paths and that `gatsby-source-filesystem` includes the directory.
