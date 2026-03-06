# Custom Tie Designer

A simple web app to design a custom tie: choose colors, patterns, add a logo, set the height, see a real-time preview, and download your design as PNG or save the design as JSON.

## Features

- **Colors** – Pick a main tie color and a pattern color (color picker + hex input).
- **Patterns** – Solid, Stripes, Dots, Paisley, Diagonal stripes, Check.
- **Logo** – Upload an image to place on the tie (centered); remove with one click.
- **Height** – Slider from 70% to 130% for tie length; preview updates live.
- **Real-time preview** – Canvas updates as you change any option.
- **Download** – Export the current design as a PNG image.
- **Save design** – Export design options (and logo as base64) as a JSON file for later.
- **AI tie check (optional)** – Stub button and description; you can plug in your own API (e.g. OpenAI, Claude) to get a “worth” or style comment.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then go to `http://localhost:8000` (or the port shown).

## Deploy on GitHub Pages

1. Create a new repository on GitHub (e.g. `custom-tie-designer`).

2. Push this project into it:

   ```bash
   cd "c:\Users\ANIEBIET\Documents\work\tie work\v1"
   git init
   git add index.html style.css app.js README.md
   git commit -m "Custom Tie Designer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/custom-tie-designer.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages** → under “Build and deployment”, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
   - Save.

4. After a minute or two, the site will be at:
   `https://YOUR_USERNAME.github.io/custom-tie-designer/`

No build step is required; the site is static HTML, CSS, and JavaScript.

## Enabling the AI “worth” check

The “Check worth” button is a stub. To make it real:

1. Choose an AI API (e.g. OpenAI, Anthropic Claude).
2. Either:
   - Call the API from a **serverless function** (e.g. Vercel, Netlify) and call that from the frontend, or
   - Use a small backend that accepts the current design description (or image) and returns a score or comment.
3. In the frontend, replace the stub in `app.js` (around the `checkWorth` click handler) with a `fetch()` to your endpoint and show the response in `#aiResult`.

Never put API keys in the frontend; use environment variables in your serverless or backend.

## File structure

```
├── index.html   # Page structure and controls
├── style.css    # Layout and styling
├── app.js       # State, tie rendering, patterns, download, save
└── README.md    # This file
```

## License

Use and modify as you like.
