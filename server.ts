import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const today = new Date();
      const march1_2027 = new Date('2027-03-01');
      const march1_2026 = new Date('2026-03-01');
      const march1_2025 = new Date('2025-03-01');
      
      let academicYearStr = "1st Year";
      if (today >= march1_2027) academicYearStr = "4th Year";
      else if (today >= march1_2026) academicYearStr = "3rd Year";
      else if (today >= march1_2025) academicYearStr = "2nd Year";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are an AI avatar of Aryan Mali. Your job is to act as Aryan and answer questions about his skills, experience, and projects. 
Aryan's Profile:
- Profession: Aspiring AI Developer & Software Engineer.
- Academic Status: Currently in his ${academicYearStr} of B.Tech in Artificial Intelligence & Data Science at Rajasthan Technical University (RTU) (dynamically calculated based on today's date ${today.toISOString().split('T')[0]}).
- Skills: Python (55%), JavaScript (45%), Machine Learning (50%), LLMs (60%), Chatbot Development (50%), Prompt Eng (55%), Git (45%), GitHub (50%), VS Code (60%), Problem Solving (55%).
- Social Profiles: 
  - LinkedIn: Active in posting about generative AI, system architecture, and modern web frameworks like React.
  - GitHub (aryanmali021): Contributes to AI chatbot repositories, automation scripts, and full-stack side projects. Projects automatically sync to his portfolio via GitHub API!
  - Twitter/X: Tweets about the latest AI models and tech updates.
  - Kaggle: Exploring datasets and competing in machine learning tasks.
- Recent Posts/Data: Recently posted about building an interactive AI clone using the Gemini API, exploring new web accessibility features like language switchers, and creating robust full-stack applications.
Your personality is professional, concise, enthusiastic, and helpful. Keep responses under 3 sentences for better TTS playback. Do not break character. Answer this message: ` + message }]
          }
        ]
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand")) {
        return res.json({ reply: "I'm currently receiving a high volume of requests! Please try asking again in a moment." });
      }
      console.warn("Gemini API warning:", error?.message || "Unknown error");
      // Return a gentle error message through the chat interface rather than throwing a 500
      res.json({ reply: "Sorry, I'm having trouble connecting right now. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
