import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ChevronRight, ChevronDown, ChevronUp, Factory, Store, Hospital, School, MonitorSmartphone, Settings as SettingsIcon, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter'; 
import { useTranslation } from 'react-i18next'; // ✅ IMPORT TRANSLATION

// --- FIREBASE IMPORTS ---
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

// --- HELPER COMPONENT FOR EXPANDABLE CARDS ---
function SolutionCard({ title, desc, rawTitle, isDark }: { title: string, desc: string, rawTitle: string, isDark: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    const t = rawTitle.toLowerCase();
    if (t.includes('manufactur')) return Factory;
    if (t.includes('retail')) return Store;
    if (t.includes('health')) return Hospital;
    if (t.includes('educat')) return School;
    if (t.includes('platform')) return MonitorSmartphone;
    if (t.includes('service')) return SettingsIcon;
    return CheckCircle; // Fallback icon
  };
  const Icon = getIcon();
  
  return (
    <div className={`p-8 rounded-xl flex gap-5 shadow-sm transition-all border ${
      isDark ? 'bg-[#1C3B2B] border-transparent' : 'bg-white border-gray-200'
    }`}>
       <div className="shrink-0 mt-1">
         <Icon size={40} strokeWidth={1.5} className={isDark ? 'text-white' : 'text-gray-700'} />
       </div>
       <div className="flex flex-col w-full">
          <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-[#A3E635]' : 'text-gray-900'}`}>{title}</h3>
          <div className={`text-sm leading-relaxed mb-5 flex-grow transition-all ${isDark ? 'text-white/90' : 'text-gray-500'} ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {desc}
          </div>
          <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className={`font-bold text-sm flex items-center gap-1 transition-all mt-auto w-fit ${isDark ? 'text-[#A3E635] hover:text-[#BEF264]' : 'text-gray-900 hover:text-gray-600'}`}
          >
             {isExpanded ? <>Show Less <ChevronUp size={16} strokeWidth={3} /></> : <>Show More <ChevronDown size={16} strokeWidth={3} /></>}
          </button>
       </div>
    </div>
  );
}

export default function Solutions() {
  const [, setLocation] = useLocation(); 

  // --- TRANSLATION SETUP ---
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // ✅ MAGIC HELPER FUNCTION: Automatically pulls the correct language field from Firebase!
  const tDb = (obj: any, field: string, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[`${field}_${currentLang}`] || obj[`${field}_en`] || obj[field] || fallback;
  };

  // --- LIVE DATABASE STATE ---
  const [pageData, setPageData] = useState({
    heroData: { subtitle: "", title: "", description: "", imagePreview: "" },
    videoUrl: "",
    industrySolutions: [] as any[],
    techSolutions: [] as any[]
  });
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH LIVE DATA FROM FIREBASE ---
  useEffect(() => {
    const unsubscribePage = onSnapshot(doc(db, "website_content", "solutions_page"), (docSnap) => {
      if (docSnap.exists()) {
        setPageData(prev => ({ ...prev, ...docSnap.data() }));
      }
    });

    const unsubscribeServices = onSnapshot(collection(db, "services"), (snapshot) => {
      const loadedServices: any[] = [];
      snapshot.forEach((doc) => loadedServices.push({ id: doc.id, ...doc.data() }));
      
      loadedServices.sort((a, b) => {
        if (a.orderIndex !== undefined && b.orderIndex !== undefined) return a.orderIndex - b.orderIndex;
        return ((a.title_en || a.title) || "").localeCompare((b.title_en || b.title) || "");
      });
      
      setServicesList(loadedServices);
      setIsLoading(false);
    });

    return () => {
      unsubscribePage();
      unsubscribeServices();
    };
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-70 bg-black/40"
          style={pageData.heroData.imagePreview ? { backgroundImage: `url(${pageData.heroData.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20">
             
             {/* ✅ TRANSLATED SUBTITLE */}
             <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800 leading-snug">
               {tDb(pageData.heroData, 'subtitle')}
             </h2>
             
             {/* ✅ TRANSLATED TITLE */}
             <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 text-[#1B5E20] leading-tight tracking-tight">
               {tDb(pageData.heroData, 'title')}
             </h1>
             
             {/* ✅ TRANSLATED DESCRIPTION */}
             <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed font-light">
               {tDb(pageData.heroData, 'description')}
             </p>

             <div className="flex flex-col sm:flex-row gap-4 transition-all duration-700">
                <Button 
                  onClick={() => { setLocation('/carbon-calculator'); window.scrollTo(0, 0); }} 
                  className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span> {t('home.calcButton', 'Calculate Carbon Footprint')}
                </Button>
                <Button 
                  onClick={() => setLocation('/contact')}
                  className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-10 py-6 rounded-md shadow-md flex items-center justify-center transition-all hover:scale-105" 
                >
                  {t('nav.contact', 'Contact Us')}
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SERVICES LIST (Pulled from database!) */}
      <section className="py-20 bg-[#F8F9F7]">
        <div className="container px-4 sm:px-8 lg:px-12">
           <div className="mb-16 text-sm font-medium text-gray-500 flex items-center gap-2">
             <span>{t('nav.services', 'Services')}</span> <ChevronRight size={14} className="text-gray-300" /> <span className="text-gray-900 font-bold">{t('nav.allServices', 'All Services')}</span>
           </div>
           
           <div className="space-y-24">
             {servicesList.length === 0 && <p className="text-gray-500 text-center text-lg">No services published yet.</p>}
             
             {servicesList.map((service, index) => (
                <div key={service.id} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}>
                   <div className="w-full md:w-1/2">
                      <div 
                        className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 relative group cursor-pointer bg-gray-200"
                        onClick={() => { setLocation(`/services/${service.slug}`); window.scrollTo(0,0); }}
                      >
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                         {service.imagePreview && (
                           <img src={service.imagePreview} alt={tDb(service, 'title')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         )}
                      </div>
                   </div>
                   <div className="w-full md:w-1/2 flex flex-col items-start">
                      {/* ✅ TRANSLATED TITLE & DESC */}
                      <h3 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-6">{tDb(service, 'title')}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">{tDb(service, 'desc')}</p>
                      
                      <Button 
                        onClick={() => { setLocation(`/services/${service.slug}`); window.scrollTo(0,0); }}
                        className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white font-bold px-8 py-6 rounded-md shadow-md transition-transform hover:-translate-y-1"
                      >
                         {t('nav.learnMore', 'View More')}
                      </Button>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* 3. OUR PRODUCTS (YouTube Video) */}
      {pageData.videoUrl && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="container px-4 sm:px-8 lg:px-12">
             <h2 className="text-4xl font-bold text-[#1B5E20] mb-12">Our Products</h2>
             <div className="w-full max-w-5xl mx-auto rounded-3xl aspect-video shadow-2xl relative overflow-hidden bg-black border-4 border-gray-50">
                <iframe className="w-full h-full" src={pageData.videoUrl} frameBorder="0" allowFullScreen></iframe>
             </div>
          </div>
        </section>
      )}

      {/* 4. INDUSTRY & TECH SOLUTIONS */}
      <section className="py-24 bg-[#F5F7F5] border-t border-gray-100">
         <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
            <h2 className="text-4xl font-bold text-[#1C3B2B] mb-12">Our Solution</h2>
            
            {pageData.industrySolutions.length > 0 && (
              <div className="mb-12">
                 <h3 className="text-2xl font-bold text-gray-800 mb-6">Industry-Specific Solutions</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {pageData.industrySolutions.map((sol: any) => (
                      <SolutionCard 
                        key={sol.id} 
                        title={tDb(sol, 'title')} 
                        desc={tDb(sol, 'desc')} 
                        rawTitle={sol.title_en || sol.title || ""} 
                        isDark={true} 
                      />
                    ))}
                 </div>
              </div>
            )}

            {pageData.techSolutions.length > 0 && (
              <div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-6">Technology Solutions</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {pageData.techSolutions.map((sol: any) => (
                      <SolutionCard 
                        key={sol.id} 
                        title={tDb(sol, 'title')} 
                        desc={tDb(sol, 'desc')} 
                        rawTitle={sol.title_en || sol.title || ""} 
                        isDark={false} 
                      />
                    ))}
                 </div>
              </div>
            )}
         </div>
      </section>

      <Footer />
    </div>
  );
}