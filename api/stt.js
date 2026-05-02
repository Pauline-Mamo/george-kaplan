export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { audio, mimeType } = req.body;
  const audioBuffer = Buffer.from(audio, "base64");
  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: mimeType });
  formData.append("file", blob, "recording.webm");
  formData.append("model", "scribe_v1");
  formData.append("language", "fr");
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVEN_KEY },
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({ error: err?.detail?.message || "STT error" });
  }
  const data = await response.json();
  res.json({ text: data.text || "" });
}
