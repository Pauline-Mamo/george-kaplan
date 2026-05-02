export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { audio, mimeType } = req.body;
  const apiKey = process.env.ELEVEN_KEY;

  console.log("STT called, key exists:", !!apiKey, "mimeType:", mimeType);

  const audioBuffer = Buffer.from(audio, "base64");
  const ext = mimeType?.includes("mp4") ? "mp4"
    : mimeType?.includes("ogg") ? "ogg"
    : mimeType?.includes("wav") ? "wav"
    : "webm";

  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: mimeType || "audio/webm" });
  formData.append("file", blob, `recording.${ext}`);
  formData.append("model_id", "scribe_v1");
  formData.append("language_code", "fr");

  const response = await fetch(
    "https://api.elevenlabs.io/v1/speech-to-text",
    {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("ElevenLabs STT error:", response.status, err);
    return res.status(response.status).json({
      error: err?.detail?.message || err?.detail || JSON.stringify(err) || "STT error"
    });
  }

  const data = await response.json();
  console.log("STT result:", data);
  res.json({ text: data.text || "" });
}
