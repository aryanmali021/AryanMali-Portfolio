import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/10 backdrop-blur-md relative z-10 transition-colors duration-300 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-white/70 dark:bg-[#050505]/70 z-[-2]"></div>
      
      {/* Animated Gradient Background */}
      <motion.div 
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ 
          duration: 15, 
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute inset-0 z-[-1] opacity-20 dark:opacity-10"
        style={{
          backgroundImage: 'linear-gradient(270deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
          backgroundSize: '400% 400%'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            AM<span className="text-cyan-500">.</span>
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Aryan Mali. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <motion.a 
            href="https://github.com/aryanmali021" 
            target="_blank" 
            rel="noreferrer" 
            className="text-slate-400 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="w-5 h-5" />
          </motion.a>
          <motion.a 
            href="https://www.linkedin.com/in/aryan-mali-a14015374" 
            target="_blank" 
            rel="noreferrer" 
            className="text-slate-400 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
          <motion.a 
            href="https://x.com/Aryanmali021" 
            target="_blank" 
            rel="noreferrer" 
            className="text-slate-400 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Twitter className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
