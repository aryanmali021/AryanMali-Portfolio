import { Code2, LineChart, Database, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const calculateAcademicYear = () => {
  const today = new Date();
  const march1_2027 = new Date('2027-03-01');
  const march1_2026 = new Date('2026-03-01');
  const march1_2025 = new Date('2025-03-01');
  
  if (today >= march1_2027) return "4th";
  if (today >= march1_2026) return "3rd";
  if (today >= march1_2025) return "2nd";
  return "1st";
};

export default function About() {
  const [academicYear, setAcademicYear] = useState("...");

  useEffect(() => {
    setAcademicYear(calculateAcademicYear());
  }, []);

  const stats = [
    { label: "CGPA", value: "8.24+", icon: <Code2 className="text-cyan-500 dark:text-cyan-400"/> },
    { label: "Hackathons", value: "4+", icon: <LineChart className="text-purple-500 dark:text-purple-400"/> },
    { label: "Current Year", value: academicYear, icon: <img src="https://img.icons8.com/color/48/000000/student-male--v1.png" alt="Student" className="w-5 h-5"/> },
    { label: "Open Source", value: "Active", icon: <Database className="text-emerald-500 dark:text-emerald-400"/> }
  ];

  return (
    <motion.section 
      id="experience" 
      className="py-20 scroll-mt-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="grid md:grid-cols-4 gap-6 relative z-10">
        <div className="md:col-span-4 mb-8">
          <h3 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">Experience & Education</h3>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
        </div>

        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 group transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <div className="p-3 bg-white border border-slate-200 dark:border-none dark:bg-white/5 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform flex items-center justify-center shadow-sm">
              {stat.icon}
            </div>
            <h4 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">{stat.value}</h4>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
