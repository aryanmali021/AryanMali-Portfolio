import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import CustomCursor from './components/CustomCursor';
import NeuralBackground from './components/NeuralBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import AIAvatar from './components/AIAvatar';
import BackToTop from './components/BackToTop';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate resource loading or just a delightful delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>
      <div className="relative min-h-screen font-sans">
      <CustomCursor />
      <NeuralBackground />
      <Header />

      {/* Floating Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-500/10 dark:bg-cyan-600/20 rounded-full blur-[150px]" />
      </div>

      <main className="max-w-6xl mx-auto px-6 relative pt-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AIAvatar />
      <BackToTop />
    </div>
    </>
  );
}
