export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text, voiceId, stability, similarity, style } = req.body;
  const apiKey = process.env.ELEVEN_KEY;
  console.log("Clé reçue:", JSON.stringify(apiKey));

  console.log("TTS called, key exists:", !!apiKey, "voiceId:", voiceId);

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
          stability: stability ?? 0.5,
          similarity_boost: similarity ?? 0.8,
          style: style ?? 0.2,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("ElevenLabs TTS error:", response.status, err);
    return res.status(response.status).json({
      error: err?.detail?.message || err?.detail || JSON.stringify(err) || "ElevenLabs error"
    });
  }

  res.setHeader("Content-Type", "audio/mpeg");
  const buffer = await response.arrayBuffer();
  res.send(Buffer.from(buffer));
}
