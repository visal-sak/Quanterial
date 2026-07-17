# Quanterial

A modern learning platform documentation site — **learn by doing** with bite-sized
lessons, hands-on practice, and adaptive learning paths.

Built with [React Router](https://reactrouter.com),
[Fumadocs](https://fumadocs.dev), and [Tailwind CSS](https://tailwindcss.com).

## Features

- 📚 **Docs** — Introduction, core concepts, learning paths, and an FAQ.
- 🧪 **Lessons** — a hands-on "Quantum Computing 101" mini-course with visuals.
- 🎨 **Themed** — light & dark mode, Geist font, and an animated hero background.
- 🔎 **Search** — built-in full-text search (Ctrl/⌘ + K).

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

## Scripts

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the development server                 |
| `npm run build`       | Build for production                         |
| `npm run start`       | Serve the production build                   |
| `npm run types:check` | Generate route types and run the typechecker |

## Project structure

```
app/
  components/    UI + hero and background components
  lib/           shared config, source loader, layout options
  routes/        home, docs, search, not-found
content/
  docs/          MDX docs — Introduction, Concepts, Lessons, Help
public/          static assets (favicon, images, fonts)
```

## Writing docs

Add or edit MDX files under [`content/docs`](content/docs). Use `meta.json` files to
control the sidebar order and section separators. Frontmatter supports `title`,
`description`, and an `icon` (any [Lucide](https://lucide.dev) icon name).

## License

MIT
