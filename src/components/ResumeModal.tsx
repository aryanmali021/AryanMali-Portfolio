import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { jsPDF } from 'jspdf';

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 16;
      }
    };

    const addSectionHeading = (title: string) => {
      ensureSpace(11);
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(title.toUpperCase(), margin, y);
      y += 1.8;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4.8;
    };

    const addParagraph = (text: string, size = 9.5, lineHeight = 4.4) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(size);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        ensureSpace(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      });
    };

    const addBullet = (text: string, boldPrefix?: string) => {
      const bulletX = margin + 2.5;
      const textX = margin + 6;
      const maxW = contentWidth - 6;
      const lineHeight = 4.3;

      doc.setFontSize(9.2);
      doc.setTextColor(51, 65, 85);

      if (boldPrefix) {
        const fullText = `${boldPrefix} ${text}`;
        const lines: string[] = doc.splitTextToSize(fullText, maxW);
        ensureSpace(lines.length * lineHeight);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('•', bulletX, y);

        lines.forEach((line, idx) => {
          if (idx === 0 && line.startsWith(boldPrefix)) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text(boldPrefix, textX, y);
            const prefixW = doc.getTextWidth(boldPrefix);
            const rest = line.slice(boldPrefix.length);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            doc.text(rest, textX + prefixW, y);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            doc.text(line, textX, y);
          }
          y += lineHeight;
        });
      } else {
        const lines: string[] = doc.splitTextToSize(text, maxW);
        ensureSpace(lines.length * lineHeight);
        doc.setFont('helvetica', 'normal');
        doc.text('•', bulletX, y);
        lines.forEach((line) => {
          doc.text(line, textX, y);
          y += lineHeight;
        });
      }
      y += 0.8;
    };

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(21);
    doc.setTextColor(15, 23, 42);
    doc.text('ARYAN MALI', pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(8, 145, 178);
    doc.text('B.Tech in Artificial Intelligence & Data Science | Aspiring AI Developer', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(71, 85, 105);
    doc.text(
      'aryanmali021@gmail.com  •  linkedin.com/in/aryan-mali-a14015374  •  github.com/aryanmali021',
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 4;

    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Professional Summary
    addSectionHeading('Professional Summary');
    addParagraph(
      'Highly motivated 3rd-year B.Tech student specializing in Artificial Intelligence and Data Science. Proven track record in building AI-driven web applications, predictive classification models, automated chatbots, and integrated hardware systems. Demonstrates strong technical fundamentals alongside analytical problem-solving to design and deliver high impact engineering solutions. Seeking an impactful internship to leverage expertise in machine learning, system automation, and full-stack logic to drive real-world technical advancements.'
    );
    y += 2;

    // Education
    addSectionHeading('Education');
    const eduItems = [
      {
        title: 'B.Tech in Artificial Intelligence & Data Science',
        right: 'Pursuing (3rd Year)',
        sub: 'Rajasthan Technical University (RTU) | CGPA: 8.24',
      },
      {
        title: 'Class 12 (Rajasthan Board)',
        right: 'Percentage: 82%',
        sub: 'Specialization in Mathematics (Score: 92/100)',
      },
      {
        title: 'Class 10 (Central Board)',
        right: 'Percentage: 70%',
      },
    ];

    eduItems.forEach((item) => {
      ensureSpace(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(item.title, margin, y);
      doc.text(item.right, pageWidth - margin, y, { align: 'right' });
      y += 4.3;
      if (item.sub) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(item.sub, margin, y);
        y += 4.5;
      }
      y += 1.2;
    });

    // Technical Skills
    addSectionHeading('Technical Skills');
    const skillRows = [
      ['Programming:', 'Python, HTML, C++, JavaScript (Basic), Java'],
      ['AI / ML:', 'Machine Learning Fundamentals, LLMs, Chatbot Development, Predictive Modeling, Pattern Classification'],
      ['Tools & Tech:', 'Git, GitHub, VS Code, Linux Basics, API Integration, NumPy, Pandas'],
      ['Core Skills:', 'Problem Solving, Logical Thinking, System Automation, Object-Oriented Programming (OOP)'],
    ];
    const labelColW = 30;
    skillRows.forEach(([label, val]) => {
      const valLines: string[] = doc.splitTextToSize(val, contentWidth - labelColW);
      ensureSpace(valLines.length * 4.3 + 1.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.3);
      doc.setTextColor(15, 23, 42);
      doc.text(label, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      valLines.forEach((line, idx) => {
        doc.text(line, margin + labelColW, y + idx * 4.3);
      });
      y += valLines.length * 4.3 + 1.4;
    });
    y += 1;

    // Projects
    addSectionHeading('Projects');
    const projects = [
      {
        title: 'Tech Stack Recommender',
        hasLink: true,
        bullets: [
          'Engineered a smart personalized recommendation framework engineered to suggest optimal frameworks, programming languages, and toolsets based on project constraints and specific domains.',
          'Implemented matching logic rules using specialized algorithmic heuristics to align developer requirements directly with industry-standard technological stacks.',
        ],
      },
      {
        title: 'Iris Classification Model',
        hasLink: true,
        bullets: [
          'Developed and validated a highly accurate predictive classification model to segment and categorize Iris plant varieties based on descriptive morphological feature matrices.',
          'Utilized robust Python machine learning libraries to handle structured datasets, perform exploratory data analysis (EDA), and evaluate accuracy metrics.',
        ],
      },
      {
        title: 'Clone.AI Chatbot',
        hasLink: false,
        bullets: [
          'Engineered a highly responsive, context-aware chatbot solution utilizing advanced backend API integrations for real-time natural language query resolution.',
          'Architected a secure data-handling flow featuring persistent conversational histories and rigorous authentication layers to significantly boost context-matching precision.',
        ],
      },
      {
        title: 'AI Image Detector',
        hasLink: false,
        bullets: [
          'Designed and deployed a computer vision classification pipeline using custom machine learning algorithms to systematically identify and classify computer-generated artificial images versus genuine photographs.',
        ],
      },
      {
        title: 'Finance Management System',
        hasLink: false,
        bullets: [
          'Developed a comprehensive, data-driven financial application built to securely track operational expenses, formulate budget allocations, and output analytical indicators for optimized personal asset allocation.',
        ],
      },
      {
        title: 'Smart Irrigation System (Hardware Automation)',
        hasLink: false,
        bullets: [
          'Built an automated, IoT-inspired micro-controller hardware framework leveraging embedded sensor nodes to track soil conditions and dynamically regulate efficient, conservation-oriented water distribution workflows.',
        ],
      },
    ];

    projects.forEach((proj) => {
      ensureSpace(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.title, margin, y);
      if (proj.hasLink) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(8, 145, 178);
        doc.textWithLink('[GitHub Link]', pageWidth - margin, y, {
          align: 'right',
          url: 'https://github.com/aryanmali021',
        });
      }
      y += 4.5;
      proj.bullets.forEach((b) => addBullet(b));
      y += 1.5;
    });

    // Achievements & Extra-Curriculars
    addSectionHeading('Achievements & Extra-Curriculars');
    addBullet(
      'Competed actively in high-pressure technical sprints including Amihack 1.0, Hack Arya Verse 2.0, Projectathon, Robo Race, and Robo Soccer Competitions to prototype novel cross-functional architectures.',
      'Hackathons & Innovation:'
    );
    addBullet(
      'Authored, tested, and publicly published multiple AI-focused software libraries, custom classification scripts, and hardware configuration repositories on GitHub to support collaborative peer development.',
      'Open Source Contribution:'
    );

    doc.save('Aryan_Mali_Resume.pdf');
  };

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
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Download Resume as PDF"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
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
                    <div className="text-slate-600 dark:text-slate-400 italic">Rajasthan Technical University (RTU) | CGPA: 8.24</div>
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
                    <span>Git, GitHub, VS Code, Linux Basics, API Integration, NumPy, Pandas</span>
                    
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
                    <li><span className="font-bold text-slate-900 dark:text-white">Hackathons & Innovation:</span> Competed actively in high-pressure technical sprints including Amihack 1.0, Hack Arya Verse 2.0, Projectathon, Robo Race, and Robo Soccer Competitions to prototype novel cross-functional architectures.</li>
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
