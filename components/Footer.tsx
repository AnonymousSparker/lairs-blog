'use client';

import Link from 'next/link';
import { IoLogoGithub, IoLogoTwitter, IoLogoLinkedin, IoMailOutline } from "react-icons/io5";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-dark-bg transition-colors mt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    
                    {/* Left: Copyright */}
                    <div className="text-sm text-stone-500 dark:text-stone-400 font-sans">
                        © {currentYear} Lairs.bug. <span className="hidden sm:inline">All rights reserved.</span>
                    </div>

                    {/* Right: Social Links */}
                    {/* <div className="flex items-center gap-6">
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-stone-400 hover:text-black dark:hover:text-white transition-colors transform hover:-translate-y-0.5 duration-200"
                            aria-label="GitHub"
                        >
                            <IoLogoGithub className="text-xl" />
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-stone-400 hover:text-black dark:hover:text-white transition-colors transform hover:-translate-y-0.5 duration-200"
                            aria-label="Twitter"
                        >
                            <IoLogoTwitter className="text-xl" />
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-stone-400 hover:text-black dark:hover:text-white transition-colors transform hover:-translate-y-0.5 duration-200"
                            aria-label="LinkedIn"
                        >
                            <IoLogoLinkedin className="text-xl" />
                        </a>
                        <a 
                            href="mailto:hello@example.com" 
                            className="text-stone-400 hover:text-black dark:hover:text-white transition-colors transform hover:-translate-y-0.5 duration-200"
                            aria-label="Email"
                        >
                            <IoMailOutline className="text-xl" />
                        </a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}