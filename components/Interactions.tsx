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
            <div className="mx-4 sm:mx-0 flex flex-wrap items-center justify-center gap-4 py-8 border-t border-b border-stone-100 dark:border-white/10 mb-12">

                <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${isLiked
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20 cursor-default'
                            : 'text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 hover:bg-red-50 hover:text-red-500'
                        }`}
                >
                    <span>{isLiked ? '❤️' : '🤍'}</span>
                    <span>{likes} Likes</span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-all text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"
                >
                    <span>📤</span> Share
                </button>

                <div className="flex items-center gap-2 px-6 py-2 text-stone-400">
                    <span>👁️</span> <span>{views} Views</span>
                </div>
            </div>

            {/* COMMENT SECTION */}
            <section className="px-4 sm:px-0 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Discussion</h3>
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">Community</span>
                </div>

                {/* Comment Form */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 mb-12 shadow-sm">
                    <form onSubmit={submitComment} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Display Name</label>
                            <input
                                type="text"
                                value={commentName}
                                onChange={(e) => setCommentName(e.target.value)}
                                placeholder="Anonymous"
                                className="w-full px-4 py-2 bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-700 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Your Message</label>
                            <textarea
                                rows={3}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                required
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-700 rounded-lg text-sm outline-none focus:border-emerald-500 dark:text-white resize-y min-h-[100px]"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-stone-900 hover:bg-emerald-600 dark:bg-stone-100 dark:hover:bg-emerald-400 text-white dark:text-stone-900 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'} 🚀
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
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex flex-shrink-0 items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm shadow-sm border border-white dark:border-stone-700">
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