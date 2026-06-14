# NeuroLearn
Not every brain thinks the same. Neither does NeuroLearn.

AI-powered STEM explanations adapted for Dyslexia, ADHD, and Autism learning styles.

Live: https://neurolearn-omega.vercel.app

## What it does

NeuroLearn adapts any STEM topic to match how your brain learns.
Pick a learner profile, enter a topic, and get a personalized
explanation plus a comprehension quiz — powered by Gemini 2.5 Flash.

## How it works

1. User selects a learner profile
2. User enters any STEM topic
3. Frontend calls /api/explain (Vercel serverless function)
4. Serverless function proxies the request to Gemini 2.5 Flash
5. Response is rendered as a structured explanation and quiz

## Learner profiles

- Dyslexia-Friendly: short sentences, highlighted keywords, extra spacing
- ADHD-Friendly: key point first, numbered chunks, no filler
- Autism-Friendly: literal structure using IS / DOES / WHY

## Files

- `index.html` — website structure
- `styles.css` — design and layout
- `config.js` — model and endpoint settings (no key here)
- `prompts.js` — learner profile prompts
- `script.js` — app logic
- `api/explain.js` — serverless proxy for Gemini API

## Setup

1. Clone the repo
2. Add `GEMINI_API_KEY` to your Vercel environment variables
3. Deploy to Vercel

## Built for

DSH Hacks V1
AI x STEM Education
