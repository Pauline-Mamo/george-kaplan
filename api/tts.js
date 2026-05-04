export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text, voiceId, stability, similarity, style } = req.body;
  const apiKey = process.env.ELEVEN_KEY;

  if (!apiKey) {
    console.error("ELEVEN_KEY manquante");
    return res.status(500).json({ error: "Clé API manquante côté serveur" });
  }

  if (!text || !voiceId) {
    return res.status(400).json({ error: "text et voiceId requis" });
  }

  console.log("TTS:", voiceId, text.slice(0, 50));

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability:        stability  ?? 0.5,
            similarity_boost: similarity ?? 0.8,
            style:            style      ?? 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("ElevenLabs error:", response.status, JSON.stringify(err));
      return res.status(response.status).json({
        error: err?.detail?.message || err?.detail || JSON.stringify(err)
      });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch(e) {
    console.error("TTS exception:", e.message);
    res.status(500).json({ error: e.message });
  }
}
