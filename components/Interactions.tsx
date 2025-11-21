'use client';

import { useState, useEffect } from 'react';
import { db, APP_ID } from '@/lib/firebase';
import {
    doc,
    setDoc,
    increment,
    onSnapshot,
    serverTimestamp,
    collection,
    addDoc,
    query,
    orderBy,
    limit
} from 'firebase/firestore';

import { IoIosSend } from "react-icons/io";
import { IoPersonOutline,IoThumbsUp, IoThumbsUpOutline, IoShareSocialOutline, IoEyeOutline } from "react-icons/io5"; // Add this for the name input
// Define the shape of a comment for TypeScript
interface Comment {
    id: string;
    name: string;
    text: string;
    timestamp: any;
}

export default function Interactions({ postId }: { postId: string }) {
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    // Form State
    const [commentName, setCommentName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- 1. INITIALIZATION & REAL-TIME UPDATES ---
    useEffect(() => {
        // A. Check local storage for "Liked" status
        const likeKey = `liked_${postId}`;
        if (localStorage.getItem(likeKey) === 'true') {
            setIsLiked(true);
        }

        // B. Increment Views (Once per session)
        const viewKey = `viewed_${postId}`;
        if (!sessionStorage.getItem(viewKey)) {
            const statsRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'stats', postId);
            setDoc(statsRef, {
                views: increment(1),
                lastViewed: serverTimestamp()
            }, { merge: true }).catch(console.error);
            sessionStorage.setItem(viewKey, 'true');
        }

        // C. Listen for Likes/Views updates
        const statsRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'stats', postId);
        const unsubStats = onSnapshot(statsRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setLikes(data.likes || 0);
                setViews(data.views || 0);
            }
        });

        // D. Listen for Comments
        const commentsRef = collection(db, 'artifacts', APP_ID, 'public', 'data', `comments_${postId}`);
        const q = query(commentsRef, orderBy('timestamp', 'desc'), limit(20));
        const unsubComments = onSnapshot(q, (snapshot) => {
            const loadedComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Comment));
            setComments(loadedComments);
        });

        return () => {
            unsubStats();
            unsubComments();
        };
    }, [postId]);

    // --- 2. HANDLERS ---

    const handleLike = async () => {
        if (isLiked) return; // Prevent double liking

        // Optimistic UI update (make it red immediately)
        setIsLiked(true);
        localStorage.setItem(`liked_${postId}`, 'true');

        const statsRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'stats', postId);
        await setDoc(statsRef, { likes: increment(1) }, { merge: true });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            const commentsRef = collection(db, 'artifacts', APP_ID, 'public', 'data', `comments_${postId}`);
            await addDoc(commentsRef, {
                name: commentName || 'Anonymous',
                text: commentText,
                timestamp: serverTimestamp()
            });
            setCommentText(''); // Clear box
        } catch (err) {
            console.error("Error posting comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- 3. RENDER ---
    return (
        <div className="max-w-4xl mx-auto">

                    {/* LIKE / SHARE / VIEW BAR */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-6 border-y border-stone-100 dark:border-white/5 my-12">
            
            {/* LIKE BUTTON */}
            <button
                onClick={handleLike}
                disabled={isLiked}
                className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-300 active:scale-95 ${
                    isLiked
                        ? 'bg-red-50/50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900/30 cursor-default'
                        : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/10'
                }`}
            >
                <span className={`text-xl transition-transform duration-300 ${isLiked ? 'scale-110' : 'group-hover:scale-110 group-active:scale-90'}`}>
                    {isLiked ? <IoThumbsUp /> : <IoThumbsUpOutline />}
                </span>
                <span className="font-medium text-sm">
                    {likes} <span className="hidden sm:inline">Likes</span>
                </span>
            </button>

            {/* SHARE BUTTON */}
            <button
                onClick={handleShare}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 transition-all duration-300 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-lg hover:shadow-brand-500/10 active:scale-95"
            >
                <IoShareSocialOutline className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium text-sm">Share</span>
            </button>

            {/* VERTICAL SEPARATOR (Desktop Only) */}
            <div className="hidden sm:block h-8 w-px bg-stone-200 dark:bg-stone-800 mx-2"></div>

            {/* VIEWS COUNTER */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 dark:bg-stone-800/50 text-stone-400 dark:text-stone-500 border border-transparent dark:border-white/5 select-none">
                <IoEyeOutline className="text-lg" />
                <span className="text-sm font-medium">{views} Views</span>
            </div>

        </div>

            {/* COMMENT SECTION */}
            <section className="px-4 sm:px-0 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Discussion</h3>
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">Community</span>
                </div>

                {/* Comment Form Container */}
                <div className="bg-stone-50/50 dark:bg-stone-900/30 border border-stone-100 dark:border-white/5 rounded-2xl p-6 sm:p-8 mb-12 backdrop-blur-sm transition-colors">
                            
                            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6 font-serif">
                                Join the conversation
                            </h3>

                            <form onSubmit={submitComment} className="space-y-4">
                                
                                {/* Name Input with Icon */}
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-500 transition-colors duration-300">
                                                <IoPersonOutline className="text-lg" />
                                            </div>
                                            <input
                                                type="text"
                                                value={commentName}
                                                onChange={(e) => setCommentName(e.target.value)}
                                                placeholder="Name (Optional)"
                                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-xl outline-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all duration-300"
                                            />
                                        </div>

                                        {/* Message Input */}
                                        <div className="relative">
                                            <textarea
                                                rows={3}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                required
                                                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-xl outline-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all duration-300 resize-none min-h-[120px]"
                                            ></textarea>
                                        </div>

                                {/* Modern Action Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-stone-900 hover:bg-brand-600 dark:bg-white dark:text-black dark:hover:bg-brand-400 dark:hover:text-white text-white text-sm font-medium rounded-xl shadow-lg shadow-stone-200 dark:shadow-none hover:shadow-brand-500/20 active:scale-95 transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'} 
                                        <IoIosSend className="text-xl" />
                                    </button>
                                </div>
                            </form>
                </div>

                {/* Comments List */}
                <div className="space-y-8 pb-12">
                    {comments.length === 0 ? (
                        <div className="text-center py-8 bg-stone-50 dark:bg-stone-800/30 rounded-xl border border-stone-100 dark:border-stone-800/50">
                            <p className="text-stone-400 text-sm italic">No comments yet. Be the first to share your thoughts.</p>
                        </div>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="flex gap-4 fade-in group">
                                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex flex-shrink-0 items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-sm shadow-sm border border-white dark:border-stone-700">
                                    {c.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 bg-stone-50 dark:bg-stone-800/30 p-4 rounded-r-2xl rounded-bl-2xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm text-stone-900 dark:text-stone-200">{c.name}</span>
                                        <span className="text-xs text-stone-400 font-mono">
                                            {c.timestamp?.seconds ? new Date(c.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </span>
                                    </div>
                                    <p className="text-stone-700 dark:text-stone-300 text-base leading-relaxed font-serif">{c.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}