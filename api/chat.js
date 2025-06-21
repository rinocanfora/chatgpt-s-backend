import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Solo POST è consentito" });

  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt mancante" });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const risposta = completion.data.choices[0].message.content;
    res.status(200).json({ answer: risposta });
  } catch (errore) {
    console.error("Errore da OpenAI:", errore.response?.data || errore.message);
    res.status(500).json({ error: "Errore nella generazione della risposta." });
  }
}
