'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoSearchOutline, IoMoonOutline, IoSunnyOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export default function Header() {
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    
    // NEW: State for mobile interactions
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // 1. Handle Dark Mode Logic
    useEffect(() => {
        setMounted(true);
        const theme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (theme === 'dark' || (!theme && systemDark)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.push(`/?q=${searchQuery}`);
            setIsMobileSearchOpen(false); // Close mobile search on submit
        }
    };

    // Prevent hydration mismatch by waiting for mount
    if (!mounted) return <div className="h-16"></div>;

    return (
        <header className="w-full bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-100 dark:border-stone-800 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                
                {/* MAIN HEADER ROW */}
                <div className="flex justify-between items-center">
                    {/* LOGO */}
                    <Link href="/" className="group flex items-center gap-3 z-50" style={{userSelect:"none"}} onClick={() => {setSearchQuery(''); setIsMenuOpen(false);}}>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black dark:bg-white rounded-full group-hover:bg-brand-500 transition-colors"></div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-stone-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors font-logo">
                            Lairs.bug
                        </h1>
                        
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-6">

                        {/* DESKTOP SEARCH BAR (Hidden on mobile) */}
                        <div className="hidden sm:block relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-48 focus:w-64 transition-all duration-300 bg-stone-100 dark:bg-stone-800/50 border border-transparent focus:border-stone-300 dark:focus:border-stone-600 rounded-full py-1.5 px-4 pl-10 text-sm outline-none dark:text-white"
                            />
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg" />
                        </div>

                        {/* MOBILE SEARCH TOGGLE (Visible only on mobile) */}
                        <button 
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className="sm:hidden p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                        >
                            <IoSearchOutline className="text-xl" />
                        </button>

                        {/* DESKTOP NAVIGATION */}
                        <nav className="hidden sm:flex gap-6 text-sm font-medium text-stone-500 dark:text-stone-400 font-sans" style={{userSelect:"none"}}>
                            <Link href="/" className="hover:text-stone-900 dark:hover:text-white transition-colors">Blogs</Link>
                            <Link href="/about" className="hover:text-stone-900 dark:hover:text-white transition-colors">About</Link>
                        </nav>

                        {/* DARK MODE TOGGLE */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors active:scale-95 transform"
                        >
                            {isDark ? <IoSunnyOutline className="text-xl" /> : <IoMoonOutline className="text-xl" />}
                        </button>

                        {/* MOBILE MENU TOGGLE */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="sm:hidden p-2 rounded-md text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                            {isMenuOpen ? <IoCloseOutline className="text-2xl" /> : <IoMenuOutline className="text-2xl" />}
                        </button>
                    </div>
                </div>

                {/* MOBILE SEARCH BAR EXPANDABLE AREA */}
                {isMobileSearchOpen && (
                    <div className="sm:hidden mt-4 pb-2 animate-in fade-in slide-in-from-top-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                autoFocus
                                className="w-full bg-stone-100 dark:bg-stone-800/50 border border-transparent focus:border-brand-500 rounded-lg py-2 px-4 pl-10 text-base outline-none dark:text-white"
                            />
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        </div>
                    </div>
                )}

                {/* MOBILE MENU DROPDOWN */}
                {isMenuOpen && (
                    <div className="sm:hidden mt-4 py-4 border-t border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-4 text-base font-medium text-stone-600 dark:text-stone-300">
                            <Link 
                                href="/" 
                                className="hover:text-brand-600 dark:hover:text-brand-400 px-2 py-1 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Blogs
                            </Link>
                            <Link 
                                href="/about" 
                                className="hover:text-brand-600 dark:hover:text-brand-400 px-2 py-1 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}