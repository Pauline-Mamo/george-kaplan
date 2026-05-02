export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text, voiceId, stability, similarity, style } = req.body;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVEN_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability, similarity_boost: similarity, style, use_speaker_boost: true },
      }),
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({ error: err?.detail?.message || "ElevenLabs error" });
  }
  res.setHeader("Content-Type", "audio/mpeg");
  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
}
