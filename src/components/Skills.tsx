import { Code2, Bot, Server, BrainCircuit, Terminal, Database, Globe, Cpu, Cloud, Layout, Github, Figma } from 'lucide-react';
import { motion } from 'motion/react';

const skills = [
  { category: "Programming", icon: <Code2 />, items: [{ name: "Python", level: 55 }, { name: "JavaScript (Basic)", level: 45 }] },
  { category: "AI/ML", icon: <Bot />, items: [{ name: "Machine Learning Fundamentals", level: 50 }, { name: "LLMs", level: 60 }, { name: "Chatbot Development", level: 55 }, { name: "Prompt Engineering", level: 48 }] },
  { category: "Tools & Tech", icon: <Server />, items: [{ name: "Git", level: 45 }, { name: "GitHub", level: 50 }, { name: "VS Code", level: 60 }, { name: "Linux Basics", level: 40 }] },
  { category: "Core Capabilities", icon: <BrainCircuit />, items: [{ name: "Problem Solving", level: 55 }, { name: "Logical Thinking", level: 60 }, { name: "System Automation", level: 45 }] },
];

const floatingBadges = [
  { name: 'React', icon: <Globe className="w-5 h-5 text-blue-500" />, color: 'shadow-blue-500/20', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { name: 'Node.js', icon: <Server className="w-5 h-5 text-green-500" />, color: 'shadow-green-500/20', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { name: 'Python', icon: <Terminal className="w-5 h-5 text-yellow-500" />, color: 'shadow-yellow-500/20', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { name: 'SQL', icon: <Database className="w-5 h-5 text-indigo-500" />, color: 'shadow-indigo-500/20', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { name: 'AI Models', icon: <Cpu className="w-5 h-5 text-purple-500" />, color: 'shadow-purple-500/20', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { name: 'Docker', icon: <Cloud className="w-5 h-5 text-sky-500" />, color: 'shadow-sky-500/20', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  { name: 'Tailwind', icon: <Layout className="w-5 h-5 text-cyan-500" />, color: 'shadow-cyan-500/20', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { name: 'GitHub', icon: <Github className="w-5 h-5 text-slate-800 dark:text-white" />, color: 'shadow-slate-500/20', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  { name: 'Figma', icon: <Figma className="w-5 h-5 text-pink-500" />, color: 'shadow-pink-500/20', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

export default function Skills() {
  return (
    <motion.section 
      id="skills" 
      className="py-20 relative z-10 scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-12">
        <h3 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">Technical Arsenal</h3>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skillGroup, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group/card"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-black/10 dark:border-white/10 pb-4">
              <div className="text-cyan-600 dark:text-cyan-400 group-hover/card:-translate-y-1 group-hover/card:scale-110 transition-transform duration-300">{skillGroup.icon}</div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400">{skillGroup.category}</h4>
            </div>
            <div className="flex flex-col gap-4">
              {skillGroup.items.map((skill, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-slate-500 font-mono text-xs">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <h4 className="text-xl font-bold mb-8 text-center text-slate-900 dark:text-white transition-colors">Ecosystem & Tools</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {floatingBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: idx * 0.1,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3 + (idx % 3), 
                  ease: "easeInOut",
                  delay: idx * 0.2
                }}
                className="h-full"
              >
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${badge.border} ${badge.bg} ${badge.color} shadow-lg backdrop-blur-sm cursor-default hover:scale-105 hover:shadow-xl transition-all`}>
                  {badge.icon}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{badge.name}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
