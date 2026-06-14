export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { model, messages } = req.body;

  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: 'user', parts: [{ text: m.content }] }));

  const systemMsg = messages.find(m => m.role === 'system')?.content || '';

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemMsg }] },
      contents,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await response.json();
  console.log('gemini response:', JSON.stringify(data));
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  res.status(response.ok ? 200 : response.status).json({
    choices: [{ message: { content: text } }]
  });
}
