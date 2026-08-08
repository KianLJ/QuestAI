export const maxDuration = 60;

const MODELS = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-preview-05-20",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();

      if (response.status === 503 || response.status === 429) {
        console.warn(`Model ${model} unavailable (${response.status}), trying next...`);
        lastError = { status: response.status, data };
        continue;
      }

      if (!response.ok) {
        console.error(`Gemini API error on ${model}:`, response.status, JSON.stringify(data));
        return res.status(response.status).json(data);
      }

      // Log the raw response so we can see what Gemini actually returns
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log(`Success with ${model}. Raw text (first 500 chars):`, rawText.slice(0, 500));

      return res.status(200).json(data);
    } catch (e) {
      console.error(`Proxy error on ${model}:`, e.message);
      lastError = { status: 502, data: { error: e.message } };
    }
  }

  console.error("All models failed:", JSON.stringify(lastError));
  return res.status(lastError?.status || 503).json(lastError?.data || { error: "All models unavailable" });
}
