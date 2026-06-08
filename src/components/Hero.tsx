import { FileText, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import Typewriter from './Typewriter';
import ResumeModal from './ResumeModal';

const roles = [
  "Aspiring AI Developer", 
  "Machine Learning Enthusiast", 
  "Chatbot Developer", 
  "Hardware Maker", 
  "B.Tech AI & DS Student"
];

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <section className="min-h-[80vh] flex flex-col justify-center relative translate-y-10">
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-4 transition-colors">
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          B.Tech Artificial Intelligence & Data Science (3rd Year)
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
          Hi, I'm <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
            Aryan Mali
          </span>
        </h1>
        
        <h2 className="text-2xl md:text-4xl text-slate-600 dark:text-slate-400 h-10 transition-colors">
          <Typewriter words={roles} />
        </h2>
        
        <p className="max-w-xl text-slate-600 dark:text-slate-400 text-lg leading-relaxed mt-4 transition-colors">
          Motivated 3rd-year B.Tech student specializing in Artificial Intelligence and Data Science. Experienced in building AI-driven applications, chatbots, and hardware systems.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button onClick={() => setIsResumeOpen(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.3)] dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <FileText className="w-5 h-5" /> View Resume
          </button>
          <a href="#contact" className="flex items-center justify-center gap-2 bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 backdrop-blur-md hover:bg-black/10 dark:hover:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold transition-all">
            Contact Me <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
