import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static("."));

app.post("/explain", async (req, res) => {
  try {
    const input = req.body.word;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `
You are Nan's English Assistant.

Analyze this input:
"${input}"

Return ONLY valid JSON with this structure:

{
  "input": "",
  "type": "word | phrase | english_sentence | chinese_sentence | paragraph",
  "title": "",
  "pronunciation": "",
  "part_of_speech": "",
  "chinese_meaning": "",
  "english_meaning": "",
  "natural_translation": "",
  "academic_translation": "",
  "examples": [],
  "collocations": [],
  "synonyms": [],
  "antonyms": [],
  "common_mistakes": [],
  "formality": "",
  "notes": ""
}

Rules:
- If input is a single English word, fill pronunciation, meanings, examples, collocations, synonyms, antonyms, formality, and mistakes.
- If input is a phrase, explain its meaning, usage, examples, and similar phrases.
- If input is an English sentence, provide Chinese translation, vocabulary notes, grammar notes, and improved English.
- If input is Chinese, provide natural English and academic English.
- Keep content concise and useful for academic writing.
`
        }
      ]
    });

    const text = response.choices[0].message.content;
    const json = JSON.parse(text);

    res.json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});