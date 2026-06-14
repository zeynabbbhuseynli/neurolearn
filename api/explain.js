export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  console.log('request body:', JSON.stringify(req.body));

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  console.log('xai response:', JSON.stringify(data));
  res.status(response.status).json(data);
}
