export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { files, characters } = req.body;
  const charList = characters.map(c => `${c.id} = ${c.name}`).join(", ");

  // Only use first 8 files max to stay under limits
  const limitedFiles = files.slice(0, 8);

  const parts = limitedFiles.map(f => ({
    inline_data: {
      mime_type: f.mimeType.includes("pdf") ? "application/pdf" : f.mimeType,
      data: f.base64
    }
  }));

  parts.push({
    text: `Tu es un assistant qui extrait des textes de théâtre.
Les personnages sont : ${charList}
Extrait UNIQUEMENT les répliques dites à voix haute. Ignore didascalies et texte barré.
Réponds UNIQUEMENT avec du JSON valide sans markdown :
[{"id":1,"ch":"A","text":"texte"},{"id":2,"ch":"B","text":"texte"}]`
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Gemini error:", response.status, JSON.stringify(err));
      return res.status(response.status).json({
        error: err?.error?.message || `Gemini error ${response.status}`
      });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const lines = JSON.parse(clean);
    res.json({ lines });

  } catch(e) {
    console.error("Extract error:", e.message);
    res.status(500).json({ error: e.message });
  }
}
