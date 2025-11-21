import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About | Lairs.bug",
  description: "Learn more about the developer behind Lairs.bug.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300">
      
      <Header />

      <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
        
        {/* LEFT COLUMN (Main Content) */}
        <main className="lg:col-span-8 min-h-[60vh]">
          
          {/* ABOUT CARD */}
          <div className="group relative overflow-hidden bg-white dark:bg-dark-card rounded-2xl p-8 border border-stone-100 dark:border-dark-border transition-all duration-300 hover:shadow-xl hover:border-stone-300 dark:hover:border-stone-700 select-none">
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-white dark:border-stone-700 shadow-md flex items-center justify-center overflow-hidden">
                        {/* Ensure you have avatar.jpg in public/asset/ folder */}
                        <img src="/asset/avatar.jpg" alt="Lairs.bug" className="w-full h-full object-cover" draggable={false} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 font-sans">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                            About Lairs.bug
                        </h2>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700">Developer</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700">Hustler</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700">Thinker</span>
                    </div>

                    {/* Bio Text */}
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4 text-sm sm:text-base">
                        I am currently a student, so I may not be the best at everything yet, but I try my best to learn every day.
                    </p>
                    
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm sm:text-base mb-6">
                        I post blogs because I find it fun and I am always open for <span className="text-stone-900 dark:text-white font-medium decoration-stone-400 underline decoration-dotted underline-offset-4 cursor-pointer hover:text-brand-500 transition-colors">healthy discussions</span>.
                    </p>
                    
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm sm:text-base font-mono bg-stone-50 dark:bg-stone-800/50 inline-block px-3 py-1 rounded border border-stone-100 dark:border-stone-800">
                        Email : lairs.bug@gmail.com    
                    </p>
                </div>
            </div>

          </div>
        </main>

        {/* RIGHT COLUMN (Sidebar) */}
        <Sidebar />

      </div>
    </div>
  );
}