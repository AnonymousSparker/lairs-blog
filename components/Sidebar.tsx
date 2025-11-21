'use client'; // Needed for form interactions

import Link from 'next/link';
import { useState } from 'react';
import { blogPosts } from '@/lib/posts';
import { IoSparklesOutline } from "react-icons/io5";
import { db, APP_ID } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Sidebar() {
    const trending = blogPosts.slice(0, 3);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
            setName('');
            setEmail('');
            setMessage('');

            // Reset button after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);

        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-8">

            {/* RECOMMENDED WIDGET */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-stone-100 dark:border-dark-border shadow-sm transition-colors">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-stone-900 dark:text-white font-serif">
                    <IoSparklesOutline className="text-emerald-500" /> Recommended
                </h3>
                <div className="space-y-6">
                    {trending.map((post, index) => (
                        <Link key={post.id} href={`/post/${post.id}`} className="flex items-start gap-4 group cursor-pointer">
                            <span className="text-2xl font-bold text-stone-200 dark:text-stone-700 -mt-1 font-serif">
                                0{index + 1}
                            </span>
                            <div>
                                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                <span className="text-xs text-stone-400 font-sans">{post.author}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CONTACT WIDGET */}
            <div className="bg-stone-50 dark:bg-stone-900/50 p-6 rounded-xl border border-stone-100 dark:border-stone-800 transition-colors">
                <h3 className="text-lg font-bold mb-2 text-stone-900 dark:text-stone-200 font-sans">Get in touch</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 font-sans">Have a story to tell or a question to ask?</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-stone-200 dark:border-stone-700 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white transition-colors"
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-stone-200 dark:border-stone-700 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white transition-colors"
                    />
                    <textarea
                        placeholder="Message..."
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-stone-200 dark:border-stone-700 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white resize-none transition-colors"
                    ></textarea>

                    <button
                        type="submit"
                        disabled={status === 'sending' || status === 'success'}
                        className={`w-full text-white text-sm font-medium py-3 rounded-lg transition-all shadow-md transform active:scale-[0.98] ${status === 'success'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-stone-900 hover:bg-emerald-600 dark:bg-white dark:hover:bg-emerald-400 dark:text-black'
                            }`}
                    >
                        {status === 'idle' && 'Send Message'}
                        {status === 'sending' && 'Sending...'}
                        {status === 'success' && 'Sent!'}
                        {status === 'error' && 'Error - Try Again'}
                    </button>
                </form>
            </div>
        </aside>
    );
}