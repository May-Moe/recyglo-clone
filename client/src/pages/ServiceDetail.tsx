import { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next'; 

// --- FIREBASE IMPORTS ---
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ServiceDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/services/:slug');
  const slug = params?.slug;

  // --- TRANSLATION SETUP ---
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const tDb = (obj: any, field: string, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[`${field}_${currentLang}`] || obj[`${field}_en`] || obj[field] || fallback;
  };

  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, "services"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setService({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        } else {
          setService(null); 
        }
      } catch (error) {
        console.error("Error fetching service detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!service) return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h1>
        <p className="text-sm text-gray-500 mb-8">We couldn't find the solution you were looking for.</p>
        <Button onClick={() => { setLocation('/services'); window.scrollTo(0, 0); }} className="bg-[#1B5E20] text-white hover:bg-[#1B5E20]/90 font-bold px-6 py-4 rounded-lg flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to Services
        </Button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* COMPACT EDITORIAL LAYOUT (No Hero Banner, No Main Hero Image, Cleansed White Space) */}
      <main className="flex-1 pt-32 pb-24">
        <article className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 1. BREADCRUMB */}
          <nav className="mb-8 flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Link href="/" className="hover:text-[#1B5E20] cursor-pointer transition-colors">{t('nav.home', 'Home')}</Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:text-[#1B5E20] cursor-pointer transition-colors">{t('nav.services', 'Our Services')}</Link>
            <ChevronRight size={14} />
            <span className="text-[#E2552B]">{tDb(service, 'title')}</span>
          </nav>

          {/* 2. TITLE & LEAD DESCRIPTION */}
          <header className="mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              {tDb(service, 'title')}
            </h1>
            {tDb(service, 'desc') && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal border-l-[3px] border-[#1B5E20] pl-5 py-1">
                {tDb(service, 'desc')}
              </p>
            )}
          </header>

          {/* 3. DYNAMIC CONTENT BLOCKS */}
          <div className="space-y-12 text-gray-700">
            {(!service.contentBlocks || service.contentBlocks.length === 0) && (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 font-medium text-sm">Detailed information for this service is currently being updated.</p>
              </div>
            )}

            {service.contentBlocks?.map((block: any, index: number) => (
               <div key={block.id || index} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                 
                 {/* TEXT BLOCK */}
                 {block.type === 'text' && (
                   <div className="max-w-4xl">
                     {tDb(block, 'title') && <h3 className="text-xl md:text-2xl font-bold text-[#1B5E20] mb-4 tracking-tight">{tDb(block, 'title')}</h3>}
                     {tDb(block, 'text') && <div className="leading-relaxed text-sm md:text-base whitespace-pre-line text-gray-600" dangerouslySetInnerHTML={{ __html: tDb(block, 'text') }}></div>}
                   </div>
                 )}

                 {/* IMAGE BLOCK */}
                 {block.type === 'image' && (
                   <div className="w-full">
                     {tDb(block, 'title') && <h3 className="text-xl md:text-2xl font-bold text-[#1B5E20] mb-4 tracking-tight max-w-4xl">{tDb(block, 'title')}</h3>}
                     {block.imagePreview && (
                       <figure className="w-full rounded-2xl overflow-hidden mb-5 shadow-sm border border-gray-100 bg-gray-50">
                         <img src={block.imagePreview} alt={tDb(block, 'title') || "Service Concept"} className="w-full h-auto max-h-[500px] object-cover" />
                       </figure>
                     )}
                     {tDb(block, 'text') && <figcaption className="text-gray-500 text-sm leading-relaxed whitespace-pre-line max-w-4xl" dangerouslySetInnerHTML={{ __html: tDb(block, 'text') }}></figcaption>}
                   </div>
                 )}

                 {/* VIDEO BLOCK */}
                 {block.type === 'video' && (
                   <div className="w-full">
                     {tDb(block, 'title') && <h3 className="text-xl md:text-2xl font-bold text-[#1B5E20] mb-4 tracking-tight max-w-4xl">{tDb(block, 'title')}</h3>}
                     {block.videoUrl && (
                       <div className="w-full rounded-2xl aspect-video shadow-md relative overflow-hidden bg-black border border-gray-100">
                         <iframe className="w-full h-full" src={block.videoUrl} frameBorder="0" allowFullScreen></iframe>
                       </div>
                     )}
                   </div>
                 )}

                 {/* LIST BLOCK */}
                 {block.type === 'list' && (
                   <div className="bg-[#F8F9F7] p-8 md:p-10 lg:p-12 rounded-[2rem] border border-gray-100 w-full shadow-sm">
                     {tDb(block, 'title') && <h3 className="text-xl md:text-2xl font-bold text-[#1B5E20] mb-6">{tDb(block, 'title')}</h3>}
                     {tDb(block, 'text') && (
                       <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
                         {tDb(block, 'text').split('\n').filter((line: string) => line.trim() !== '').map((line: string, i: number) => (
                           <li key={i} className="flex items-start gap-3 text-sm md:text-[15px] leading-relaxed bg-white p-5 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                             <div className="mt-1.5 min-w-[6px] w-[6px] h-[6px] rounded-full bg-[#E2552B] shrink-0"></div>
                             <span className="text-gray-600" dangerouslySetInnerHTML={{ __html: line.replace(/^[-•]\s*/, '') }}></span>
                           </li>
                         ))}
                       </ul>
                     )}
                   </div>
                 )}
                 
               </div>
            ))}
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}