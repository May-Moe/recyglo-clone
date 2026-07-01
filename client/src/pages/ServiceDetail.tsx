import { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next'; // ✅ IMPORT TRANSLATION

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

  // ✅ MAGIC HELPER FUNCTION: Automatically pulls the correct language field from Firebase!
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading service...</div>;

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Service Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the solution you were looking for.</p>
        <Link href="/services" className="px-6 py-3 bg-[#1B5E20] text-white rounded-md font-bold">Back to Services</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-black/40"
          style={(service.heroImage || service.imagePreview) ? { 
            backgroundImage: `url(${service.heroImage || service.imagePreview})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          } : {}}
        />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             
             {/* ✅ TRANSLATED SUBTITLE */}
             <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800 leading-snug">
                {tDb(service, 'heroSubtitle', 'Our Solution')}
             </h2>
             
             {/* ✅ TRANSLATED TITLE */}
             <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 text-[#1B5E20] leading-tight tracking-tight">
                {tDb(service, 'heroTitle', tDb(service, 'title'))}
             </h1>
             
             {/* ✅ TRANSLATED DESCRIPTION */}
             <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed font-light">
                {tDb(service, 'heroDescription', tDb(service, 'desc'))}
             </p>

             <div className="flex flex-col sm:flex-row gap-4 transition-all duration-700">
                <Button 
                  onClick={() => {
                    setLocation('/carbon-calculator');
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
                  {t('home.calcButton', 'Calculate Carbon Footprint')}
                </Button>
                
                <Button 
                  className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-10 py-6 rounded-md shadow-md flex items-center justify-center transition-all hover:scale-105"
                  onClick={() => setLocation('/services')}
                >
                  {t('nav.services', 'Our Services')}
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC CONTENT BLOCKS SECTION */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-4xl">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">{t('nav.home', 'Home')}</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/services" className="hover:text-gray-900 cursor-pointer transition-colors">{t('nav.services', 'Our Services')}</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">{tDb(service, 'title')}</span>
          </div>

          <div className="space-y-16">
            {(!service.contentBlocks || service.contentBlocks.length === 0) && (
              <p className="text-gray-500 text-lg">Detailed information for this service is being updated.</p>
            )}

            {/* DYNAMICALLY RENDER THE BLOCKS YOU BUILT IN THE CMS */}
            {service.contentBlocks?.map((block: any, index: number) => (
               <div key={block.id || index} className="flex flex-col">
                 
                 {/* TEXT BLOCK */}
                 {block.type === 'text' && (
                   <div>
                     {tDb(block, 'title') && <h3 className="text-2xl font-bold text-gray-900 mb-4">{tDb(block, 'title')}</h3>}
                     {tDb(block, 'text') && <p className="text-gray-600 leading-relaxed text-[15px] md:text-base whitespace-pre-line" dangerouslySetInnerHTML={{ __html: tDb(block, 'text') }}></p>}
                   </div>
                 )}

                 {/* IMAGE BLOCK */}
                 {block.type === 'image' && (
                   <div>
                     {tDb(block, 'title') && <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{tDb(block, 'title')}</h3>}
                     {block.imagePreview && (
                       <div className="w-full h-auto md:h-[400px] overflow-hidden rounded-2xl mb-6 shadow-sm border border-gray-100 bg-gray-100">
                         <img src={block.imagePreview} alt={tDb(block, 'title') || "Service Image"} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                       </div>
                     )}
                     {tDb(block, 'text') && <p className="text-gray-600 leading-relaxed text-[15px] md:text-base whitespace-pre-line" dangerouslySetInnerHTML={{ __html: tDb(block, 'text') }}></p>}
                   </div>
                 )}

                 {/* VIDEO BLOCK */}
                 {block.type === 'video' && (
                   <div>
                     {tDb(block, 'title') && <h3 className="text-2xl font-bold text-gray-900 mb-6">{tDb(block, 'title')}</h3>}
                     {block.videoUrl && (
                       <div className="w-full rounded-3xl aspect-video shadow-xl relative overflow-hidden bg-black border-2 border-gray-100 mb-6">
                         <iframe className="w-full h-full" src={block.videoUrl} frameBorder="0" allowFullScreen></iframe>
                       </div>
                     )}
                   </div>
                 )}

                 {/* LIST BLOCK */}
                 {block.type === 'list' && (
                   <div className="bg-[#F8F9F7] p-8 rounded-2xl border border-gray-100">
                     {tDb(block, 'title') && <h3 className="text-xl font-bold text-[#1B5E20] mb-4">{tDb(block, 'title')}</h3>}
                     {tDb(block, 'text') && (
                       <ul className="space-y-3 text-gray-700 list-disc pl-5">
                         {tDb(block, 'text').split('\n').filter((line: string) => line.trim() !== '').map((line: string, i: number) => (
                           <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/^[-•]\s*/, '') }}></li>
                         ))}
                       </ul>
                     )}
                   </div>
                 )}

                 {/* Separator line between blocks */}
                 {index !== service.contentBlocks.length - 1 && (
                   <hr className="mt-16 border-gray-200" />
                 )}
               </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}