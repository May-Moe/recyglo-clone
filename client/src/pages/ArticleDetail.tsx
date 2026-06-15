import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, ArrowRight } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ArticleDetail() {
  const [match, params] = useRoute('/articles/:slug');
  const slug = params?.slug;

  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [otherBlogs, setOtherBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!slug) return;
      try {
        // 1. Fetch the specific article by slug
        const q = query(collection(db, "articles"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedArticle = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          setCurrentArticle(fetchedArticle);
        }

        // 2. Fetch all other articles for the sidebar / related section
        const allArticlesSnapshot = await getDocs(collection(db, "articles"));
        const allArticles = allArticlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter out the current article
        setOtherBlogs(allArticles.filter((a: any) => a.slug !== slug));

      } catch (error) {
        console.error("Error fetching article detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [slug]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading article...</div>;

  if (!currentArticle) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the blog post you were looking for.</p>
        <Link href="/articles" className="px-6 py-3 bg-[#1B5E20] text-white rounded-md font-bold">Back to Articles</Link>
      </div>
      <Footer />
    </div>
  );

  const tagsArray = currentArticle.tags ? currentArticle.tags.split(',').map((t: string) => t.trim()) : [];
  const popularBlogs = otherBlogs.slice(0, 2); // Sidebar
  const relatedBlogs = otherBlogs.slice(0, 2); // Bottom grid

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-12">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-7xl">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/articles" className="hover:text-gray-900 cursor-pointer transition-colors">Articles</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">{currentArticle.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
             
             {/* LEFT COLUMN: ARTICLE CONTENT */}
             <div className="lg:col-span-8">
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B5E20] mb-6 leading-tight">
                  {currentArticle.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                   {tagsArray.map((tag: string) => (
                     <span key={tag} className="inline-block border border-gray-300 rounded-full px-4 py-1 text-xs font-semibold text-gray-700 bg-white">
                       {tag}
                     </span>
                   ))}
                </div>
                
                <div className="text-gray-500 text-sm mb-8 font-medium">
                  {currentArticle.date}
                </div>

                <hr className="border-gray-200 mb-12" />

                {/* Main Thumbnail Image */}
                {currentArticle.imagePreview && (
                  <div className="w-full h-auto md:h-[450px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100 bg-gray-100">
                    <img src={currentArticle.imagePreview} alt={currentArticle.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* ARTICLE BODY (MODULAR BLOCKS) */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
                  {(!currentArticle.contentBlocks || currentArticle.contentBlocks.length === 0) && (
                    <p className="italic text-gray-400">Content coming soon...</p>
                  )}

                  {currentArticle.contentBlocks?.map((block: any, index: number) => (
                    <div key={block.id || index}>
                      {block.type === 'text' && (
                        <div>
                          {block.title && <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{block.title}</h3>}
                          {block.text && <p className="whitespace-pre-line">{block.text}</p>}
                        </div>
                      )}
                      
                      {block.type === 'list' && (
                        <div>
                          {block.title && <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">{block.title}</h3>}
                          {block.text && (
                            <ul className="list-decimal pl-6 space-y-2">
                              {block.text.split('\n').filter((line: string) => line.trim() !== '').map((line: string, i: number) => (
                                <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="my-8">
                          {block.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{block.title}</h3>}
                          {block.imagePreview && <img src={block.imagePreview} alt="Blog Asset" className="rounded-xl shadow-sm w-full" />}
                          {block.text && <p className="text-sm text-gray-500 italic mt-3">{block.text}</p>}
                        </div>
                      )}

                      {block.type === 'video' && block.videoUrl && (
                        <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-md">
                          <iframe className="w-full h-full" src={block.videoUrl} frameBorder="0" allowFullScreen></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Related Blogs Section */}
                {relatedBlogs.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-gray-100">
                     <h2 className="text-2xl font-bold text-[#1B5E20] mb-8">Related Blogs</h2>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedBlogs.map((blog) => {
                          const blogTags = blog.tags ? blog.tags.split(',').map((t: string) => t.trim()) : [];
                          return (
                            <Link key={blog.id} href={`/articles/${blog.slug}`} onClick={() => window.scrollTo(0, 0)} className="group cursor-pointer flex flex-col">
                              <div className="rounded-2xl overflow-hidden mb-5 h-[220px] relative shrink-0 shadow-sm bg-gray-100">
                                 {blog.imagePreview && <img src={blog.imagePreview} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={blog.title} />}
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B5E20] transition-colors leading-snug">{blog.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-4">
                                 {blogTags.map((tag: string) => (
                                   <span key={tag} className="border border-gray-300 rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 bg-white">{tag}</span>
                                 ))}
                              </div>
                              <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                              <div className="text-gray-400 text-xs mb-4">{blog.date}</div>
                              <span className="text-[#E2552B] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read More <ArrowRight size={14} />
                              </span>
                            </Link>
                          )
                        })}
                     </div>
                  </div>
                )}
             </div>

             {/* RIGHT COLUMN: SIDEBAR */}
             <div className="lg:col-span-4">
                <div className="sticky top-24">
                   <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Blogs</h2>
                   
                   <div className="flex flex-col gap-6">
                      {popularBlogs.length === 0 && <p className="text-gray-400">No other blogs available.</p>}
                      {popularBlogs.map((blog) => {
                        const blogTags = blog.tags ? blog.tags.split(',').map((t: string) => t.trim()) : [];
                        return (
                          <Link key={blog.id} href={`/articles/${blog.slug}`} onClick={() => window.scrollTo(0, 0)} className="group flex gap-4 cursor-pointer items-start">
                             <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                               {blog.imagePreview && <img src={blog.imagePreview} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                             </div>
                             <div className="flex flex-col">
                               <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1B5E20] transition-colors mb-2 line-clamp-2 leading-tight">{blog.title}</h4>
                               <div className="flex flex-wrap gap-1.5 mb-2">
                                 {blogTags.slice(0, 2).map((tag: string) => (
                                   <span key={tag} className="border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-white">{tag}</span>
                                 ))}
                               </div>
                               <span className="text-xs text-gray-400">{blog.date}</span>
                             </div>
                          </Link>
                        )
                      })}
                   </div>
                </div>
             </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}