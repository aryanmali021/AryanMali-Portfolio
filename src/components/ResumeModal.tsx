import { motion, AnimatePresence } from 'motion/react';
import { FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 py-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                <FileText className="w-5 h-5 text-cyan-500" />
                <span>Aryan Mali - Resume</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white dark:bg-slate-900 print:p-0 print:overflow-visible">
              <div className="max-w-3xl mx-auto space-y-8 print:space-y-6 text-slate-800 dark:text-slate-300 text-sm sm:text-base selection:bg-cyan-500/30">
                
                {/* Header Section */}
                <div className="text-center space-y-2 border-b-2 border-slate-800 dark:border-slate-200 pb-6 print:pb-4">
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-wide uppercase">Aryan Mali</h1>
                  <p className="text-cyan-600 dark:text-cyan-400 font-medium">B.Tech in Artificial Intelligence & Data Science | Aspiring AI Developer</p>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <a href="mailto:aryanmali021@gmail.com" className="hover:text-cyan-500">aryanmali021@gmail.com</a>
                    <span className="hidden sm:inline">•</span>
                    <a href="https://linkedin.com/in/aryan-mali-a14015374" target="_blank" rel="noreferrer" className="hover:text-cyan-500">linkedin.com/in/aryan-mali-a14015374</a>
                    <span className="hidden sm:inline">•</span>
                    <a href="https://github.com/aryanmali021" target="_blank" rel="noreferrer" className="hover:text-cyan-500">github.com/aryanmali021</a>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-slate-700 pb-1">Professional Summary</h2>
                  <p className="leading-relaxed text-justify">
                    Highly motivated 3rd-year B.Tech student specializing in Artificial Intelligence and Data Science. Proven track record in building AI-driven web applications, predictive classification models, automated chatbots, and integrated hardware systems. Demonstrates strong technical fundamentals alongside analytical problem-solving to design and deliver high impact engineering solutions. Seeking an impactful internship to leverage expertise in machine learning, system automation, and full-stack logic to drive real-world technical advancements.
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-slate-700 pb-1">Education</h2>
                  
                  <div>
                    <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                      <span>B.Tech in Artificial Intelligence & Data Science</span>
                      <span>Pursuing (3rd Year)</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 italic">Rajasthan Technical University (RTU) | CGPA: 8.24 | 3rd Semester SGPA: 8.6</div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                      <span>Class 12 (Rajasthan Board)</span>
                      <span>Percentage: 82%</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 italic">Specialization in Mathematics (Score: 92/100)</div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                      <span>Class 10 (Central Board)</span>
                      <span>Percentage: 70%</span>
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-slate-700 pb-1">Technical Skills</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">Programming:</span>
                    <span>Python, HTML, C++, JavaScript (Basic), Java</span>
                    
                    <span className="font-semibold text-slate-900 dark:text-white">AI / ML:</span>
                    <span>Machine Learning Fundamentals, LLMs, Chatbot Development, Predictive Modeling, Pattern Classification</span>
                    
                    <span className="font-semibold text-slate-900 dark:text-white">Tools & Tech:</span>
                    <span>Git, GitHub, VS Code, Linux Basics, API Integration</span>
                    
                    <span className="font-semibold text-slate-900 dark:text-white">Core Skills:</span>
                    <span>Problem Solving, Logical Thinking, System Automation, Object-Oriented Programming (OOP)</span>
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-slate-700 pb-1">Projects</h2>

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Tech Stack Recommender</span>
                      <a href="https://github.com/aryanmali021" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 font-normal hover:underline">[GitHub Link]</a>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      <li>Engineered a smart personalized recommendation framework engineered to suggest optimal frameworks, programming languages, and toolsets based on project constraints and specific domains.</li>
                      <li>Implemented matching logic rules using specialized algorithmic heuristics to align developer requirements directly with industry-standard technological stacks.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Iris Classification Model</span>
                      <a href="https://github.com/aryanmali021" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 font-normal hover:underline">[GitHub Link]</a>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      <li>Developed and validated a highly accurate predictive classification model to segment and categorize Iris plant varieties based on descriptive morphological feature matrices.</li>
                      <li>Utilized robust Python machine learning libraries to handle structured datasets, perform exploratory data analysis (EDA), and evaluate accuracy metrics.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Clone.AI Chatbot</span>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      <li>Engineered a highly responsive, context-aware chatbot solution utilizing advanced backend API integrations for real-time natural language query resolution.</li>
                      <li>Architected a secure data-handling flow featuring persistent conversational histories and rigorous authentication layers to significantly boost context-matching precision.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>AI Image Detector</span>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      <li>Designed and deployed a computer vision classification pipeline using custom machine learning algorithms to systematically identify and classify computer-generated artificial images versus genuine photographs.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Finance Management System</span>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      <li>Developed a comprehensive, data-driven financial application built to securely track operational expenses, formulate budget allocations, and output analytical indicators for optimized personal asset allocation.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Smart Irrigation System (Hardware Automation)</span>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      <li>Built an automated, IoT-inspired micro-controller hardware framework leveraging embedded sensor nodes to track soil conditions and dynamically regulate efficient, conservation-oriented water distribution workflows.</li>
                    </ul>
                  </div>
                </div>

                {/* Achievements & Extra-Curriculars */}
                <div className="space-y-3 pb-8">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-300 dark:border-slate-700 pb-1">Achievements & Extra-Curriculars</h2>
                  <ul className="list-disc list-outside ml-5 space-y-2">
                    <li><span className="font-bold text-slate-900 dark:text-white">Hackathons & Innovation:</span> Competed actively in high-pressure technical sprints including Hack Arya Verse 2.0, Projectathon, Robo Race, and Robo Soccer Competitions to prototype novel cross-functional architectures.</li>
                    <li><span className="font-bold text-slate-900 dark:text-white">Open Source Contribution:</span> Authored, tested, and publicly published multiple AI-focused software libraries, custom classification scripts, and hardware configuration repositories on GitHub to support collaborative peer development.</li>
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
