export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { files, characters } = req.body;
  const charList = characters.map(c => `${c.id} = ${c.name}`).join(", ");

  const parts = files.map(f => ({
    inline_data: { mime_type: f.mimeType, data: f.base64 }
  }));

  parts.push({
    text: `Tu es un assistant qui extrait des textes de théâtre depuis des photos ou PDF.

Les personnages sont : ${charList}

Extrait TOUTES les répliques parlées.
- Ignore les didascalies (textes en italique décrivant actions/mouvements)
- Ignore le texte barré
- Garde uniquement le texte dit à voix haute

Réponds UNIQUEMENT avec un JSON valide, sans markdown :
[
  {"id": 1, "ch": "A", "text": "texte de la réplique"},
  {"id": 2, "ch": "B", "text": "texte de la réplique"}
]`
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
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
    return res.status(response.status).json({ error: err?.error?.message || "Gemini error" });
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    const lines = JSON.parse(clean);
    res.json({ lines });
  } catch(e) {
    res.status(500).json({ error: "Erreur parsing JSON : " + raw.slice(0, 200) });
  }
}
