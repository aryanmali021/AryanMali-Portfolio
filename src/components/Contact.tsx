import { Mail, Linkedin, Github, Twitter, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const KaggleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4v16" />
    <path d="M16 4l-8 8" />
    <path d="M8 12l8 8" />
  </svg>
);

export default function Contact() {
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [githubData, setGithubData] = useState<any>(null);

  useEffect(() => {
    if (activeBadge === 'github' && !githubData) {
      fetch('https://api.github.com/users/aryanmali021')
        .then(res => res.json())
        .then(data => setGithubData(data))
        .catch(console.error);
    }
  }, [activeBadge, githubData]);

  const socialLinks = [
    { id: 'email', icon: <Mail />, color: 'bg-red-500', handle: 'aryanmali021@gmail.com', href: 'mailto:aryanmali021@gmail.com', label: 'Send Email' },
    { id: 'linkedin', icon: <Linkedin />, color: 'bg-[#0077b5]', handle: 'aryan-mali-a14015374', href: 'https://www.linkedin.com/in/aryan-mali-a14015374', label: 'View Profile' },
    { id: 'github', icon: <Github />, color: 'bg-[#333] dark:bg-slate-800', handle: '@aryanmali021', href: 'https://github.com/aryanmali021', label: 'View Profile' },
    { id: 'twitter', icon: <Twitter />, color: 'bg-[#1da1f2]', handle: '@Aryanmali021', href: 'https://x.com/Aryanmali021', label: 'View Profile' },
    { id: 'kaggle', icon: <KaggleIcon />, color: 'bg-[#20BEFF]', handle: 'aryanmali021', href: 'https://www.kaggle.com/aryanmali021', label: 'View Profile' },
  ];

  return (
    <section id="contact" className="py-20 mb-10 relative z-10 scroll-mt-20">
      <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden transition-colors">
         <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 dark:from-purple-500/10 to-transparent pointer-events-none" />
         
         <h3 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white relative z-10 transition-colors">Let's Connect</h3>
         <p className="text-slate-600 dark:text-slate-400 mb-8 relative z-10 transition-colors">
           Looking for an internship opportunity to contribute to impactful real-world projects and further enhance my technical expertise.
         </p>
         
         <div className="flex flex-wrap justify-center gap-6 relative z-10 mb-12">
            {socialLinks.map((social) => (
              <motion.button
                key={social.id}
                onClick={() => setActiveBadge(activeBadge === social.id ? null : social.id)}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-white/10 text-cyan-600 dark:text-cyan-400 transition-colors cursor-pointer shadow-sm dark:shadow-none ${activeBadge === social.id ? 'ring-2 ring-cyan-500/50' : ''}`}
              >
                {social.icon}
              </motion.button>
            ))}
         </div>

         <div className={`transition-all duration-500 ease-in-out flex flex-col items-center justify-center relative z-10 ${activeBadge ? 'opacity-100 max-h-[600px] mt-4' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'}`}>
           <button 
             onClick={() => setActiveBadge(null)}
             className="mb-6 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-full p-2 transition-colors border border-slate-200 dark:border-white/10"
             aria-label="Close badge"
           >
             <X size={20} />
           </button>
           
           {/* Custom Badges for email */}
           {socialLinks.filter(s => s.id === 'email').map((social) => (
             <div key={social.id} className={`w-[280px] bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg mx-auto transition-all ${activeBadge === social.id ? 'block' : 'hidden'}`}>
               <div className={`h-16 w-full ${social.color}`} />
               <div className="relative px-6 pb-6 -mt-8 flex flex-col items-center">
                 <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-[#0f1115] text-slate-900 dark:text-white">
                   {social.icon}
                 </div>
                 <h4 className="mt-3 font-bold text-lg text-slate-900 dark:text-white">Aryan Mali</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{social.handle}</p>
                 <a href={social.href} target="_blank" rel="noreferrer" className={`w-full py-2 text-white rounded-lg text-sm font-medium transition-colors hover:brightness-110 ${social.color}`}>
                   {social.label}
                 </a>
               </div>
             </div>
           ))}

           {/* Custom Badges for Twitter and Kaggle */}
           {socialLinks.filter(s => s.id === 'twitter' || s.id === 'kaggle').map((social) => (
             <div key={social.id} className={`w-[320px] sm:w-[350px] bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg mx-auto transition-all ${activeBadge === social.id ? 'block' : 'hidden'}`}>
               <div className={`h-20 w-full ${social.color} relative overflow-hidden`}>
                 <div className="absolute inset-0 opacity-20 bg-[url('https://github.githubassets.com/images/modules/profile/profile-city-bg.svg')] bg-cover bg-center"></div>
               </div>
               <div className="relative px-6 pb-6 -mt-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-white dark:bg-[#0f1115] rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-[#0f1115] overflow-hidden">
                   <img src={social.id === 'twitter' ? "https://unavatar.io/twitter/Aryanmali021" : "https://github.com/aryanmali021.png"} alt="Aryan Mali Profile" className="w-full h-full object-cover" />
                 </div>
                 <h4 className="mt-3 font-bold text-lg text-slate-900 dark:text-white">Aryan Mali</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{social.handle}</p>
                 <a href={social.href} target="_blank" rel="noreferrer" className={`w-full py-2 flex items-center justify-center gap-2 text-white rounded-lg text-sm font-medium transition-colors hover:brightness-110 ${social.color}`}>
                   <span className="opacity-90">{social.icon}</span>
                   {social.label}
                 </a>
               </div>
             </div>
           ))}

           {/* GitHub Profile Badge */}
           <div className={`w-[320px] sm:w-[350px] bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-lg mx-auto transition-all ${activeBadge === 'github' ? 'block' : 'hidden'}`}>
             <div className="h-20 w-full bg-[#24292e] dark:bg-slate-800 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://github.githubassets.com/images/modules/profile/profile-city-bg.svg')] bg-cover bg-center"></div>
             </div>
             <div className="relative px-6 pb-6 -mt-10 flex flex-col items-center">
               <div className="w-20 h-20 bg-white dark:bg-[#0f1115] rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-[#0f1115] overflow-hidden">
                 <img src={githubData?.avatar_url || "https://github.com/aryanmali021.png"} alt="Aryan Mali GitHub" className="w-full h-full object-cover" />
               </div>
               <h4 className="mt-3 font-bold text-lg text-slate-900 dark:text-white">{githubData?.name || "Aryan Mali"}</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">@{githubData?.login || "aryanmali021"}</p>
               
               {githubData && (
                 <div className="flex gap-6 mb-4 text-sm text-slate-600 dark:text-slate-300">
                   <div className="flex flex-col items-center">
                     <span className="font-bold text-slate-900 dark:text-white">{githubData.followers}</span>
                     <span className="text-xs">Followers</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="font-bold text-slate-900 dark:text-white">{githubData.following}</span>
                     <span className="text-xs">Following</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="font-bold text-slate-900 dark:text-white">{githubData.public_repos}</span>
                     <span className="text-xs">Repos</span>
                   </div>
                 </div>
               )}
               
               <a href="https://github.com/aryanmali021" target="_blank" rel="noreferrer" className="w-full py-2 flex items-center justify-center gap-2 text-white rounded-lg text-sm font-medium transition-colors hover:brightness-110 bg-[#24292e] dark:bg-slate-800">
                 <Github className="w-4 h-4" />
                 View GitHub Profile
               </a>
             </div>
           </div>

           {/* Native LinkedIn Badge - Hidden if not active */}
           <div className={activeBadge === 'linkedin' ? 'block' : 'hidden'}>
             <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="aryan-mali-aryanmali021" data-version="v1">
               <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/aryan-mali-aryanmali021?trk=profile-badge">Aryan Mali</a>
             </div>
           </div>

         </div>
      </div>
    </section>
  );
}
