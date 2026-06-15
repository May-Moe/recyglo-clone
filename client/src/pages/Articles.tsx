import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { ArrowRight, ChevronRight, Play, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser'; 

// --- FIREBASE IMPORTS ---
import { collection, onSnapshot, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import newsletterImg from '@/assets/images/newsletter-img.png'; 

export default function Articles() {
  const [, setLocation] = useLocation();

  const [pageData, setPageData] = useState({
    heroData: { subtitle: "", title: "", description: "", imagePreview: "" }
  });
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const unsubscribePage = onSnapshot(doc(db, "website_content", "articles_page"), (docSnap) => {
      if (docSnap.exists()) setPageData(prev => ({ ...prev, ...docSnap.data() }));
    });

    const unsubscribeArticles = onSnapshot(collection(db, "articles"), (snapshot) => {
      const loadedArticles: any[] = [];
      snapshot.forEach((doc) => loadedArticles.push({ id: doc.id, ...doc.data() }));
      setArticlesList(loadedArticles.reverse()); 
      setIsLoading(false);
    });

    return () => { unsubscribePage(); unsubscribeArticles(); };
  }, []);

  // --- HANDLE NEWSLETTER SUBSCRIPTION ---
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      // 1. Save the email to Firebase Database
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: serverTimestamp(),
        status: "active"
      });

      const templateParams = {
        user_email: email, 
      };

      // 2. Email to USER (Using Account 1)
      await emailjs.send(
        'service_1tw0b8s',        // User Account Service ID
        'template_5ojmfbf',       // User Account Newsletter Template ID
        templateParams,
        'ni4KN7ecyorm5ah49'       // User Account Public Key
      );

      // 3. Email to ADMIN (Using Account 2)
      await emailjs.send(
        'service_k0mx018',        // Admin Account Service ID
        'template_k2a3jrq',       // Admin Account Subscribe Template ID
        templateParams,
        'fq_6mOEQTgoWyhYMp'       // Admin Account Public Key
      );
      
      alert('Thank you for subscribing! Check your email for a welcome message.');
      setEmail(''); 
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-90 bg-black/40"
          style={pageData.heroData.imagePreview ? { backgroundImage: `url(${pageData.heroData.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800">
                {pageData.heroData.subtitle}
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                {pageData.heroData.title}
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                {pageData.heroData.description}
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => { setLocation('/carbon-calculator'); window.scrollTo(0, 0); }} className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all">
                  <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span> Calculate Carbon Footprint
                </Button>
                <Button className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md" onClick={() => setLocation('/solutions')}>
                  Our Solutions
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. BLOG LISTING SECTION */}
      <section className="py-12">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">Articles</span>
          </div>

          <h2 className="text-4xl font-bold text-[#1B5E20] mb-8">Blogs</h2>

          <div className="flex flex-wrap gap-3 mb-10">
             <button className="bg-[#E2552B] text-white px-5 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-all">All Articles</button>
             <button className="bg-white border border-[#E2552B] text-[#E2552B] hover:bg-[#E2552B]/5 px-5 py-2.5 rounded-md text-sm font-semibold transition-all">Sustainability</button>
             <button className="bg-white border border-[#E2552B] text-[#E2552B] hover:bg-[#E2552B]/5 px-5 py-2.5 rounded-md text-sm font-semibold transition-all">Circular Economy</button>
             <button className="bg-white border border-[#E2552B] text-[#E2552B] hover:bg-[#E2552B]/5 px-5 py-2.5 rounded-md text-sm font-semibold transition-all">News</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesList.length === 0 && <p className="text-gray-500">No articles published yet.</p>}
            
            {articlesList.map((article) => {
              const tagsArray = article.tags ? article.tags.split(',').map((t: string) => t.trim()) : [];
              
              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border border-gray-100"
                >
                  <div className="relative h-56 w-full overflow-hidden mb-5 shrink-0 bg-gray-100">
                    {article.imagePreview && <img src={article.imagePreview} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>

                  <div className="p-6 pt-0 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#1B5E20] group-hover:text-[#2E7D32] transition-colors mb-4 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tagsArray.map((tag: string) => (
                        <span key={tag} className="border border-gray-300 rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 bg-white shadow-sm">{tag}</span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">{article.excerpt}</p>
                    <div className="text-gray-400 text-xs mb-4 font-medium">{article.date}</div>

                    <div className="flex items-center gap-1 text-[#E2552B] font-bold text-sm mt-auto group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
        </div>
      </section>

      {/* 3. NEWSLETTER SECTION */}
      <section className="py-20 bg-[#F4F6F4]">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
             <div className="w-full md:w-1/3 relative min-h-[250px] bg-gray-100">
                <img src={newsletterImg} alt="Recycling and Sustainability" className="w-full h-full object-cover absolute inset-0" />
             </div>
             <div className="w-full md:w-2/3 bg-[#1C3B2B] p-10 md:p-14 text-white flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#A3E635] mb-4">Subscribe to Our Newsletter</h2>
                <p className="text-white/80 mb-8 text-sm md:text-base leading-relaxed">Stay updated with the latest news, insights, and tips on sustainability and ESG reporting.</p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Your email address" 
                     required 
                     className="flex-grow px-5 py-4 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2552B]" 
                   />
                   <Button type="submit" disabled={isSubscribing} className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white font-bold px-8 py-4 h-auto rounded-md shadow-md transition-all">
                     {isSubscribing ? <><Loader2 className="animate-spin mr-2" size={18} /> Subscribing...</> : 'Subscribe'}
                   </Button>
                </form>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}