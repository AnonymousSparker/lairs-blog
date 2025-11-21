'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { blogPosts } from '@/lib/posts';
import { db, APP_ID } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
    IoSparklesOutline, 
    IoPersonOutline, 
    IoMailOutline, 
    IoSend, 
    IoCheckmarkCircleOutline, 
    IoTimeOutline 
} from "react-icons/io5";

export default function Sidebar() {
    const trending = blogPosts.slice(0, 3);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [countdown, setCountdown] = useState(0);

    // Handle Countdown Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'success' && countdown > 0) {
            timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        } else if (status === 'success' && countdown === 0) {
            setStatus('idle'); 
            setName('');
            setEmail('');
            setMessage('');
        }
        return () => clearTimeout(timer);
    }, [status, countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'contact_messages'), {
                name,
                email,
                message,
                timestamp: serverTimestamp()
            });

            setStatus('success');
            setCountdown(30); 

        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-8">

            {/* RECOMMENDED WIDGET */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-stone-100 dark:border-dark-border shadow-sm transition-colors">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-stone-900 dark:text-white font-serif">
                    <IoSparklesOutline className="text-brand-500" /> Recommended
                </h3>
                <div className="space-y-6">
                    {trending.map((post, index) => (
                        <Link key={post.id} href={`/post/${post.id}`} className="flex items-start gap-4 group cursor-pointer">
                            <span className="text-2xl font-bold text-stone-200 dark:text-stone-700 -mt-1 font-serif">
                                0{index + 1}
                            </span>
                            <div>
                                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                <span className="text-xs text-stone-400 font-sans">{post.author}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CONTACT WIDGET (FIXED) */}
            {/* Added min-h-[420px] to prevent layout shift/collapse */}
            <div className="relative overflow-hidden bg-stone-50/50 dark:bg-stone-900/30 rounded-2xl border border-stone-100 dark:border-stone-800 backdrop-blur-sm transition-colors min-h-[420px] flex flex-col justify-center">
                
                {status === 'success' ? (
                    /* SUCCESS STATE (Relative Position + Centered) */
                    <div className="flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-300 w-full">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                            <IoCheckmarkCircleOutline className="text-4xl" />
                        </div>
                        <h4 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Message Sent!</h4>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-[250px] mx-auto">
                            Thanks for reaching out. We'll get back to you shortly.
                        </p>
                        
                        <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-mono text-stone-500">
                            <IoTimeOutline />
                            <span>Reset in 00:{countdown.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                ) : (
                    /* FORM STATE */
                    <div className="p-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-stone-900 dark:text-white font-sans">Get in touch</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400 font-sans">Have a story or a question?</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative group">
                                <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700/50 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:text-white transition-all"
                                />
                            </div>

                            <div className="relative group">
                                <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700/50 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:text-white transition-all"
                                />
                            </div>

                            <textarea
                                placeholder="Write your message here..."
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700/50 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:text-white resize-none transition-all"
                            ></textarea>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full group relative overflow-hidden bg-stone-900 hover:bg-brand-600 dark:bg-white dark:hover:bg-brand-400 text-white dark:text-stone-900 text-sm font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-brand-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="flex items-center justify-center gap-2 relative z-10">
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    {status !== 'sending' && <IoSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </span>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </aside>
    );
}