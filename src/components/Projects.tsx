import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  metrics: string;
  github: string;
  liveUrl?: string;
}

const defaultProjects: ProjectItem[] = [
  {
    title: "Tech Stack Recommender",
    description: "An AI-powered application to recommend the best tech stack for your next project based on specific requirements.",
    tech: ["Python", "Machine Learning", "Recommendation"],
    metrics: "Tech Stack Matching",
    github: "https://github.com/aryanmali021/Tech-Stack-Recommender"
  },
  {
    title: "Iris Classification Model",
    description: "A machine learning pipeline for classifying Iris flowers into three species based on sepal and petal features.",
    tech: ["Python", "Scikit-Learn", "Data Science"],
    metrics: "Classification",
    github: "https://github.com/aryanmali021/Iris_classificationModel"
  },
  {
    title: "Clone.AI Chatbot",
    description: "Engineered a context-aware chatbot utilizing API integrations for advanced processing, featuring persistent history and secure authentication to improve conversational accuracy.",
    tech: ["Python", "LLMs", "APIs"],
    metrics: "Chatbot Development",
    github: "https://github.com/aryanmali021"
  },
  {
    title: "AI Image Detector",
    description: "Developed a machine learning classification system with the help of AI to effectively identify and categorize AI-generated images.",
    tech: ["Python", "Machine Learning"],
    metrics: "Image Classification",
    github: "https://github.com/aryanmali021"
  },
  {
    title: "Finance Management System",
    description: "Designed a comprehensive application to track expenses, manage budgets, and optimize financial decisions.",
    tech: ["Python", "Data Structure"],
    metrics: "Resource Optimization",
    github: "https://github.com/aryanmali021/personal_finance_management_app"
  },
  {
    title: "Smart Irrigation System (Hardware)",
    description: "Built an automated sensor-based hardware solution to optimize water usage and efficiency.",
    tech: ["Hardware", "Sensors", "Automation"],
    metrics: "Hardware & IoT",
    github: "https://github.com/aryanmali021"
  }
];

const IGNORED_URL_HOSTS = [
  'github.com',
  'raw.githubusercontent.com',
  'user-images.githubusercontent.com',
  'shields.io',
  'img.shields.io',
  'badge.fury.io',
  'localhost',
  '127.0.0.1',
  'example.com',
  'linkedin.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'youtu.be',
  'kaggle.com',
  'opensource.org',
];

const DEPLOYMENT_HOST_REGEX =
  /\.(?:vercel\.app|netlify\.app|onrender\.com|github\.io|web\.app|firebaseapp\.com|herokuapp\.com|railway\.app|fly\.dev|streamlit\.app|pages\.dev|surge\.sh)$/i;

const sanitizeCandidateUrl = (rawUrl: string): string | null => {
  const cleaned = rawUrl.trim().replace(/[),.;'">\]]+$/, '');
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    const host = parsed.hostname.toLowerCase();
    if (IGNORED_URL_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
      return null;
    }
    if (/\.(?:png|jpe?g|gif|svg|webp|ico|pdf|mp4|zip)$/i.test(parsed.pathname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
};

const extractLiveUrlFromReadme = (readme: string): string | undefined => {
  if (!readme) return undefined;

  // 1. Markdown links with live/demo labels (skip image badge wrappers)
  const mdLinkRegex = /(?<!!)\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  for (const match of readme.matchAll(mdLinkRegex)) {
    const label = match[1];
    const url = sanitizeCandidateUrl(match[2]);
    if (
      url &&
      /\b(live|demo|preview|visit|view\s*live|view\s*site|website|deployed|web\s*app|try\s*it|app)\b/i.test(
        label
      )
    ) {
      return url;
    }
  }

  // 2. HTML anchor links with live/demo labels
  const htmlLinkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of readme.matchAll(htmlLinkRegex)) {
    const url = sanitizeCandidateUrl(match[1]);
    const label = match[2].replace(/<[^>]+>/g, '');
    if (
      url &&
      /\b(live|demo|preview|visit|view\s*live|view\s*site|website|deployed|web\s*app|try\s*it|app)\b/i.test(
        label
      )
    ) {
      return url;
    }
  }

  // 3. Lines explicitly labeled Live / Demo / Website / Deployed followed by a URL
  const lines = readme.split(/\r?\n/);
  for (const line of lines) {
    if (
      /\b(live\s*(?:demo|link|url|site|preview|app)?|demo\s*(?:link|url)?|deployed\s*(?:at|link|url)?|website|view\s*live|visit\s*(?:site|app|here)?)\b/i.test(
        line
      )
    ) {
      const urls = line.match(/https?:\/\/[^\s)>"'\]]+/gi);
      if (urls) {
        for (const candidate of urls) {
          const valid = sanitizeCandidateUrl(candidate);
          if (valid) return valid;
        }
      }
    }
  }

  // 4. Known hosting platform URLs anywhere in README (e.g. vercel.app, onrender.com, github.io)
  const allUrls = readme.match(/https?:\/\/[^\s)>"'\]]+/gi) || [];
  for (const candidate of allUrls) {
    const valid = sanitizeCandidateUrl(candidate);
    if (!valid) continue;
    try {
      const host = new URL(valid).hostname.toLowerCase();
      if (
        DEPLOYMENT_HOST_REGEX.test(host) ||
        valid.toLowerCase().includes('huggingface.co/spaces/')
      ) {
        return valid;
      }
    } catch {
      // Ignore invalid URL
    }
  }

  return undefined;
};

const fetchRepoReadme = async (fullName: string, defaultBranch: string): Promise<string> => {
  const branches = Array.from(new Set([defaultBranch || 'main', 'main', 'master']));
  const filenames = ['README.md', 'readme.md'];

  for (const branch of branches) {
    for (const filename of filenames) {
      try {
        const res = await fetch(
          `https://raw.githubusercontent.com/${fullName}/${branch}/${filename}`
        );
        if (res.ok) {
          return await res.text();
        }
      } catch {
        // Try next candidate
      }
    }
  }
  return '';
};

export default function Projects() {
  const [projectsToDisplay, setProjectsToDisplay] = useState<ProjectItem[]>(defaultProjects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/aryanmali021/repos?sort=updated&per_page=6')
      .then(res => {
         if (!res.ok) throw new Error("Failed to fetch from Github");
         return res.json();
      })
      .then(async (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = await Promise.all(
            data.map(async (repo): Promise<ProjectItem> => {
              const readmeText = await fetchRepoReadme(
                repo.full_name,
                repo.default_branch || 'main'
              );
              const readmeLiveUrl = extractLiveUrlFromReadme(readmeText);
              const homepageUrl = repo.homepage ? sanitizeCandidateUrl(repo.homepage) : null;

              return {
                title: repo.name.replace(/[-_]/g, ' '),
                description: repo.description || "A dynamic project fetched from my GitHub.",
                tech:
                  repo.topics && repo.topics.length > 0
                    ? repo.topics.slice(0, 3)
                    : repo.language
                    ? [repo.language]
                    : [],
                metrics: "GitHub Project",
                github: repo.html_url,
                liveUrl: readmeLiveUrl || homepageUrl || undefined,
              };
            })
          );
          setProjectsToDisplay(formatted);
        }
        setIsLoading(false);
      })
      .catch(err => {
         console.error("Github API error, using default static projects", err);
         setIsLoading(false);
      });
  }, []);

  return (
    <motion.section 
      id="projects" 
      className="py-20 relative z-10 scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-12 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">Deployed Architectures</h3>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
        </div>
        <a 
          href="https://github.com/aryanmali021" 
          target="_blank" 
          rel="noreferrer"
          className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 text-sm font-medium w-fit transition-colors"
        >
          View GitHub <ExternalLink className="w-4 h-4"/>
        </a>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsToDisplay.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="flex flex-col bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md rounded-2xl overflow-hidden group transition-all hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] h-full max-h-[500px]"
            >
              {/* Image Placeholder with Gradient */}
              <div className="h-40 w-full shrink-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-cyan-600)_0%,_transparent_70%)] dark:bg-[radial-gradient(circle_at_center,_var(--color-cyan-400)_0%,_transparent_70%)] group-hover:scale-150 transition-transform duration-700"/>
                <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  {project.metrics}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors capitalize line-clamp-1">{project.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 min-h-[3.5rem] transition-colors line-clamp-3 leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-[10px] sm:text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 rounded-md whitespace-nowrap">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 mt-auto">
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 hover:text-white bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 border border-black/10 dark:border-white/10 hover:border-transparent group/btn whitespace-nowrap"
                  >
                    <Github className="w-4 h-4 shrink-0 group-hover/btn:scale-110 transition-transform"/> Repository
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-cyan-500/25 group/live whitespace-nowrap"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5 transition-transform" /> View Live
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
