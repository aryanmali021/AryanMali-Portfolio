import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300 overflow-hidden">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
          AM<span className="text-cyan-500">.</span>
        </a>

        {/* Controls Container */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <LanguageSwitcher />

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
