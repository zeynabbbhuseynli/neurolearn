export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { model, messages } = req.body;
  const systemMsg = messages.find(m => m.role === 'system')?.content || '';
  const userMsg = messages.find(m => m.role === 'user')?.content || '';

  const response = await fetch('https://api.x.ai/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      max_output_tokens: 1000,
      input: `${systemMsg}\n\n${userMsg}`
    })
  });

  const data = await response.json();
  console.log('xai response:', JSON.stringify(data));

  const text = data.output?.[0]?.content?.[0]?.text || '';
  res.status(response.ok ? 200 : response.status).json({
    choices: [{ message: { content: text } }]
  });
}
