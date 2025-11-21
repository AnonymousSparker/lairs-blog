'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoSearchOutline, IoMoonOutline, IoSunnyOutline, IoMenuOutline } from "react-icons/io5";

export default function Header() {
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);

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
        }
    };

    // Prevent hydration mismatch by waiting for mount
    if (!mounted) return <div className="h-16"></div>;

    return (
        <header className="w-full bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-100 dark:border-stone-800 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="group flex items-center gap-3 z-50" onClick={() => setSearchQuery('')}>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black dark:bg-white rounded-full group-hover:bg-emerald-500 transition-colors"></div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors font-mono">
                        Lairs.bug
                    </h1>
                </Link>

                <div className="flex items-center gap-2 sm:gap-6">

                    {/* SEARCH BAR */}
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

                    {/* NAVIGATION */}
                    <nav className="hidden sm:flex gap-6 text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">
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

                    {/* Mobile Menu Icon (Visual only for now) */}
                    <button className="sm:hidden p-2 rounded-md text-stone-800 dark:text-stone-200">
                        <IoMenuOutline className="text-2xl" />
                    </button>
                </div>
            </div>
        </header>
    );
}