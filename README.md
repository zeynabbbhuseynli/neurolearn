# NeuroLearn — Vercel Deploy Version

AI-powered STEM explanations adapted for Dyslexia, ADHD, and Autism learning styles.

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
