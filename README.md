# NeuroLearn — Vercel Deploy Version

AI-powered STEM explanations adapted for Dyslexia, ADHD, and Autism learning styles.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo on [vercel.com](https://vercel.com)
3. In Vercel → Settings → Environment Variables, add:
   - `XAI_API_KEY` = your xAI key (starts with `xai-`)
4. Deploy — done!

## How it works

- `/api/explain.js` is a serverless proxy that holds the API key securely on the server
- The frontend calls `/api/explain` instead of xAI directly, fixing CORS issues
- Your API key is never exposed in the browser source

## Files

- `index.html` — website structure
- `styles.css` — design and layout
- `config.js` — model and endpoint settings (no key here)
- `prompts.js` — learner profile prompts
- `script.js` — app logic
- `api/explain.js` — serverless proxy for xAI API
