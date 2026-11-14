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

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      "User-agent: *\nAllow: /\n\nSitemap: https://aryanmali-portfolio.onrender.com/sitemap.xml\n"
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://aryanmali-portfolio.onrender.com/</loc>\n    <lastmod>2026-11-14</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
    );
  });

  // Live social profile proxy with short-term cache and graceful fallbacks
  type SocialPlatform = "linkedin" | "twitter" | "kaggle";
  interface SocialProfile {
    platform: SocialPlatform;
    name: string;
    handle: string;
    avatarUrl: string;
    profileUrl: string;
    syncedAt: string;
    source: "live" | "fallback";
  }

  const SOCIAL_CACHE_TTL_MS = 15 * 60 * 1000;
  const socialProfileCache = new Map<
    SocialPlatform,
    { data: SocialProfile; expiresAt: number }
  >();

  const extractMeta = (html: string, key: string): string | null => {
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
        "i"
      ),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return match[1].trim();
    }
    return null;
  };

  const decodeHtmlEntities = (str: string): string =>
    str
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

  const fetchUnavatarJson = async (providerPath: string): Promise<string | null> => {
    try {
      const resp = await fetch(`https://unavatar.io/${providerPath}?json`, {
        headers: { "User-Agent": "AryanPortfolioSync/1.0" },
        signal: AbortSignal.timeout(4500),
      });
      if (!resp.ok) return null;
      const json = (await resp.json()) as { url?: string };
      if (json?.url && json.url.startsWith("http") && !json.url.includes("fallback")) {
        return json.url;
      }
    } catch {
      // Ignore upstream errors and fall through
    }
    return null;
  };

  const resolveTwitterProfile = async (): Promise<SocialProfile> => {
    const handle = "@Aryanmali021";
    const profileUrl = "https://x.com/Aryanmali021";
    let name = "Aryan Mali";
    let avatarUrl = "https://unavatar.io/x/Aryanmali021";
    let source: "live" | "fallback" = "fallback";

    try {
      const fxResp = await fetch("https://api.fxtwitter.com/Aryanmali021", {
        headers: { "User-Agent": "AryanPortfolioSync/1.0" },
        signal: AbortSignal.timeout(4500),
      });
      if (fxResp.ok) {
        const fxJson = (await fxResp.json()) as {
          user?: { name?: string; screen_name?: string; avatar_url?: string };
        };
        if (fxJson?.user) {
          if (fxJson.user.name) name = fxJson.user.name;
          if (fxJson.user.avatar_url) {
            avatarUrl = fxJson.user.avatar_url.replace("_normal.", "_400x400.");
          }
          source = "live";
          return {
            platform: "twitter",
            name,
            handle: fxJson.user.screen_name ? `@${fxJson.user.screen_name}` : handle,
            avatarUrl,
            profileUrl,
            syncedAt: new Date().toISOString(),
            source,
          };
        }
      }
    } catch {
      // Fallback to unavatar JSON check
    }

    const unavatarUrl = await fetchUnavatarJson("x/Aryanmali021");
    if (unavatarUrl) {
      avatarUrl = unavatarUrl;
      source = "live";
    }

    return {
      platform: "twitter",
      name,
      handle,
      avatarUrl,
      profileUrl,
      syncedAt: new Date().toISOString(),
      source,
    };
  };

  const resolveKaggleProfile = async (): Promise<SocialProfile> => {
    const handle = "aryanmali021";
    const profileUrl = "https://www.kaggle.com/aryanmali021";
    let name = "Aryan Mali";
    let avatarUrl = "https://unavatar.io/kaggle/aryanmali021";
    let source: "live" | "fallback" = "fallback";

    try {
      const resp = await fetch(profileUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (resp.ok) {
        const html = await resp.text();
        const displayNameMatch = html.match(/"displayName"\s*:\s*"([^"]+)"/);
        const avatarMatch = html.match(
          /"(?:userAvatarUrl|thumbnailUrl)"\s*:\s*"(https:[^"]+)"/
        );
        const ogTitle = extractMeta(html, "og:title");
        const ogImage = extractMeta(html, "og:image");

        if (displayNameMatch?.[1] && !displayNameMatch[1].toLowerCase().includes("kaggle")) {
          name = decodeHtmlEntities(displayNameMatch[1]);
          source = "live";
        } else if (
          ogTitle &&
          !ogTitle.toLowerCase().includes("just a moment") &&
          !ogTitle.toLowerCase().startsWith("kaggle:")
        ) {
          const cleaned = decodeHtmlEntities(ogTitle.split("|")[0].trim());
          if (cleaned) {
            name = cleaned;
            source = "live";
          }
        }

        if (avatarMatch?.[1]) {
          avatarUrl = avatarMatch[1].replace(/\\u002F/g, "/");
          source = "live";
        } else if (
          ogImage &&
          ogImage.startsWith("http") &&
          !ogImage.includes("site-logo") &&
          !ogImage.includes("kaggle-transparent")
        ) {
          avatarUrl = decodeHtmlEntities(ogImage);
          source = "live";
        }
      }
    } catch {
      // Fallback to unavatar check below
    }

    if (source === "fallback") {
      const unavatarUrl = await fetchUnavatarJson("kaggle/aryanmali021");
      if (unavatarUrl) {
        avatarUrl = unavatarUrl;
        source = "live";
      }
    }

    return {
      platform: "kaggle",
      name,
      handle,
      avatarUrl,
      profileUrl,
      syncedAt: new Date().toISOString(),
      source,
    };
  };

  const resolveLinkedInProfile = async (): Promise<SocialProfile> => {
    const handle = "aryan-mali-a14015374";
    const profileUrl = "https://www.linkedin.com/in/aryan-mali-a14015374";
    let name = "Aryan Mali";
    let avatarUrl = "https://github.com/aryanmali021.png";
    let source: "live" | "fallback" = "fallback";

    try {
      const resp = await fetch(profileUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (resp.ok) {
        const html = await resp.text();
        const isAuthWall =
          html.includes("authwall") ||
          html.includes("Sign In | LinkedIn") ||
          html.includes("Join LinkedIn");

        if (!isAuthWall) {
          const ogTitle = extractMeta(html, "og:title");
          const ogImage = extractMeta(html, "og:image");

          if (ogTitle) {
            const candidateName = decodeHtmlEntities(
              ogTitle.split(" - ")[0].split("|")[0].trim()
            );
            if (
              candidateName &&
              !candidateName.toLowerCase().includes("linkedin") &&
              !candidateName.toLowerCase().includes("sign up")
            ) {
              name = candidateName;
              source = "live";
            }
          }

          if (ogImage && ogImage.includes("media.licdn.com")) {
            avatarUrl = decodeHtmlEntities(ogImage);
            source = "live";
          }
        }
      }
    } catch {
      // LinkedIn blocks unauthenticated requests frequently; fallback handles cleanly
    }

    if (source === "fallback") {
      const unavatarUrl = await fetchUnavatarJson(`linkedin/${handle}`);
      if (unavatarUrl && !unavatarUrl.includes("static.licdn.com")) {
        avatarUrl = unavatarUrl;
        source = "live";
      }
    }

    return {
      platform: "linkedin",
      name,
      handle,
      avatarUrl,
      profileUrl,
      syncedAt: new Date().toISOString(),
      source,
    };
  };

  app.get("/api/social-profile", async (req, res) => {
    const rawPlatform = String(req.query.platform || "").toLowerCase();
    if (
      rawPlatform !== "linkedin" &&
      rawPlatform !== "twitter" &&
      rawPlatform !== "kaggle"
    ) {
      return res.status(400).json({ error: "Unsupported social platform" });
    }

    const platform = rawPlatform as SocialPlatform;
    const forceRefresh = req.query.refresh === "true";
    const cached = socialProfileCache.get(platform);

    res.setHeader("Cache-Control", "no-store");

    if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
      return res.json(cached.data);
    }

    let profile: SocialProfile;
    if (platform === "twitter") {
      profile = await resolveTwitterProfile();
    } else if (platform === "kaggle") {
      profile = await resolveKaggleProfile();
    } else {
      profile = await resolveLinkedInProfile();
    }

    socialProfileCache.set(platform, {
      data: profile,
      expiresAt: Date.now() + SOCIAL_CACHE_TTL_MS,
    });

    return res.json(profile);
  });

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
- Skills: Python (55%), NumPy (55%), Pandas (40%), JavaScript (45%), Machine Learning (50%), LLMs (30%), Chatbot Development (55%), Prompt Engineering (60%), Git (30%), GitHub (70%), VS Code (75%), Problem Solving (55%).
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
