import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getPost } from '@/lib/posts';
import Interactions from '@/components/Interactions';
import Sidebar from '@/components/Sidebar'; // <--- IMPORT SIDEBAR
import Header from '@/components/Header';   // <--- IMPORT HEADER
import Footer from '@/components/Footer';
import { GoHome } from "react-icons/go";
import type { Metadata } from 'next';

// 1. SEO Generator
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = getPost(id);
    if (!post) return {};
    return {
        title: `${post.title} | Lairs.bug`,
        description: post.excerpt,
        openGraph: { images: [post.thumbnail || '/asset/logo.png'] },
    };
}

// 2. Static Generator
export async function generateStaticParams() {
    return blogPosts.map((post) => ({ id: post.id }));
}

// 3. Page Content
export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = getPost(id);

    if (!post) notFound();

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300">
            
            <Header />

            <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
                
                {/* LEFT COLUMN: BLOG CONTENT (Span 8) */}
                <main className="lg:col-span-8 min-h-[60vh]">
                    <article className="article-card group fade-in transition-all duration-150
                  /* MOBILE STYLES (Default): Transparent bg, bottom border, tighter padding */
                  bg-transparent py-6 border-b border-stone-100 dark:border-stone-800
                  
                  /* DESKTOP STYLES (md:): White/Dark Card bg, rounded corners, shadow */
                  md:bg-white md:dark:bg-dark-card md:rounded-2xl md:p-8 md:border-none md:shadow-sm md:hover:shadow-md">

                        {/* Back Button */}
                        <div className="px-4 sm:px-0 pt-4 sm:pt-0">
                            <Link href="/" className="mb-6 text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors flex items-center gap-2 text-sm font-mono">
                                <GoHome /> Home
                            </Link>
                        </div>

                        {/* Post Header */}
                        <header className="mb-8 px-4 sm:px-0 pb-8 border-b border-stone-100 dark:border-white/10">
                            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white leading-tight mb-6 font-serif">
                                {post.title}
                            </h1>

                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img src="/asset/logo.png" alt="Lairs" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-stone-900 dark:text-stone-200">{post.author}</div>
                                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                        <span>{post.readTime} read</span>
                                        <span>•</span>
                                        <time>{post.date}</time>
                                    </div>
                                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 py-5">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span 
                                                key={tag} 
                                                className='text-[10px] font-mono uppercase tracking-wider text-brand-50 dark:text-dark-bg bg-stone-400 px-2.5 py-0.75 rounded-full'
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    </div>
                                </div>
                            </div>

                            {post.thumbnail && (
                                <div className="mb-8">
                                    <img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-[450px] object-cover rounded-xl shadow-sm" />
                                </div>
                            )}
                        </header>

                        {/* Post Body */}
                        <div
                            className="px-4 sm:px-0 prose prose-stone prose-lg max-w-none mb-12 dark:prose-invert font-serif"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Interactions */}
                        <div className="px-4 sm:px-0 border-stone-100 dark:border-white/10">
                            <Interactions postId={post.id} />
                        </div>

                    </article>
                </main>

                {/* RIGHT COLUMN: SIDEBAR (Span 4) */}
                <Sidebar />
                
            </div>
            <Footer />
        </div>
    );
}