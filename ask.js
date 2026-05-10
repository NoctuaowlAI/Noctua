exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST Only" };

  try {
    const { prompt } = JSON.parse(event.body);
    // Matches your Netlify environment variable exactly
    const API_KEY = process.env.OPENROUTER_KEY; 

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001",
        "messages": [{ "role": "user", "content": prompt }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ content: data.choices[0].message.content })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};