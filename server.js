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
    const word = req.body.word;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `You are Nan's English Assistant.

The user may enter:
- one English word
- an English phrase or collocation
- an English sentence
- a Chinese sentence
- a short paragraph

Input:
${word}

Respond based on the input type.

If it is an English word, include:
1. Pronunciation (IPA)
2. Chinese meaning
3. English meaning
4. Part of speech
5. Example sentences
6. Common collocations
7. Synonyms and differences
8. Antonyms if useful
9. Formality level
10. Common mistakes

If it is an English phrase or collocation, include:
1. Chinese meaning
2. English explanation
3. Natural usage
4. Example sentences
5. Similar phrases

If it is an English sentence or paragraph, include:
1. Chinese translation
2. Vocabulary notes
3. Grammar notes
4. More natural version
5. More academic version if applicable

If it is Chinese, translate it into:
1. Natural English
2. More academic English if applicable
3. Alternative expressions

Keep the answer clear, concise, and useful for academic writing.`
        }
      ]
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});