export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { model, messages } = req.body;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  console.log('xai response:', JSON.stringify(data));
  res.status(response.status).json(data);
}
