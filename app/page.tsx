import Link from 'next/link';
import { blogPosts } from '@/lib/posts';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

// This works perfectly on Netlify (SSR)
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() || '';
  
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.excerpt.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg">
      <Header />

      <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
        
        <main className="lg:col-span-8 min-h-[60vh]">
          {/* Search Result Message */}
          {query ? (
            <div className="mb-8">
               <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Search Results</h2>
               <p className="text-sm text-stone-500">Found {filteredPosts.length} matches for "{query}"</p>
            </div>
          ) : (
            <div className="flex items-center gap-6 mb-8 border-b border-stone-100 dark:border-stone-800 pb-1">
               <span className="text-sm font-semibold border-b-2 border-black dark:border-white pb-4 -mb-1.5 cursor-pointer dark:text-white">Latest</span>
            </div>
          )}

          {/* BLOG POST LIST */}
          <div className="space-y-2">
            {filteredPosts.length > 0 ? filteredPosts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <article className="article-card group cursor-pointer fade-in py-6 border-b border-stone-100 dark:border-stone-800">
                  <div className="mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-50 dark:text-dark-bg bg-stone-400 px-2.5 py-0.75 rounded-4xl">
                      {post.tags[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden">
                      <img src="/asset/logo.png" alt="Lairs" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-stone-600 dark:text-stone-300">{post.author}</span>
                  </div>
                  <div className="flex flex-row justify-between gap-4 sm:gap-8">
                    <div className="flex-1 min-w-0"> 
                      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight group-hover:underline decoration-2 decoration-stone-300 underline-offset-4 font-serif">
                        {post.title}
                      </h2>
                      <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-3 font-sans leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-stone-400 font-sans">
                        <time>{post.date}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    {post.thumbnail && (
                      <div className="w-28 h-28 sm:w-36 sm:h-32 flex-shrink-0 rounded-md overflow-hidden order-last bg-stone-100 dark:bg-stone-800">
                        <img src={post.thumbnail} className="w-full h-full object-cover card-zoom-image transition-transform duration-500 group-hover:scale-105" alt={post.title} />
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            )) : (
              <div className="py-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-stone-500 dark:text-stone-400">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </main>

        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}