import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const defaultProjects = [
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

export default function Projects() {
  const [projectsToDisplay, setProjectsToDisplay] = useState(defaultProjects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/aryanmali021/repos?sort=updated&per_page=6')
      .then(res => {
         if (!res.ok) throw new Error("Failed to fetch from Github");
         return res.json();
      })
      .then((data: any[]) => {
        if(Array.isArray(data) && data.length > 0) {
           const formatted = data.map(repo => ({
             title: repo.name.replace(/[-_]/g, ' '),
             description: repo.description || "A dynamic project fetched from my GitHub.",
             tech: repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 3) : (repo.language ? [repo.language] : []),
             metrics: "GitHub Project",
             github: repo.html_url
           }));
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

                <div className="flex mt-auto">
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 hover:text-white bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-black/10 dark:border-white/10 hover:border-transparent group/btn"
                  >
                    <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform"/> Repository
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
