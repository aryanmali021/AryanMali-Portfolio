import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#0f1115]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider">INITIALIZING</p>
      </motion.div>
    </div>
  );
}
