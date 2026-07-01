import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Heart, Globe, Users, MapPin, TrendingUp, CheckCircle, Target, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

// --- ASSET IMPORTS ---
import impactHero from '@/assets/images/about-hero.jpg';
import impactFacility from '@/assets/images/wa2.png';
import impactOcean from '@/assets/images/wa3.png';

// --- NEW WOMEN & YOUTH IMAGES ---
import impactHtet from '@/assets/images/ceo.png';
import impactWoman1 from '@/assets/images/team5.png';
import impactWoman2 from '@/assets/images/team6.png';
import impactWoman3 from '@/assets/images/team4.png';

export default function Impact() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const currentLang = i18n.language || 'en';

  // ✅ MAGIC HELPER FUNCTION: Automatically pulls the correct language field from Firebase
  const tDb = (obj: any, field: string, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[`${field}_${currentLang}`] || obj[`${field}_en`] || obj[field] || fallback;
  };

  // --- DEFAULT DATA (Matches your original hardcoded design exactly) ---
  const defaultData = {
    hero: { subtitle_en: "Where waste ends and life begins", title_en: "Our Impact", desc_en: "Ocean Bound Plastic • Informal Worker Uplift • Women Empowerment Training", imagePreview: "" },
    bigNumbers: [
      { value_en: "1M+", label_en: "Lives Impacted" },
      { value_en: "100K+", label_en: "Tonnes Recycled" },
      { value_en: "$2M+", label_en: "Invested in Communities" }
    ],
    regional: { title_en: "ESG Operations in 8 Countries", desc_en: "With our headquarters in Singapore, our regional scale spans across the APAC region, allowing us to replicate our verified impact model alongside 400+ partners.", countries_en: "Singapore (HQ), Thailand, Myanmar, Vietnam, Malaysia, Indonesia, South Korea, Australia" },
    lever2: { label_en: "Lever 2: Economic Access", title_en: "Informal Worker Formalization", desc_en: "In Thailand, 1.5 million informal collectors contribute to ~60% of collection, generating over 500M THB in economic value, yet have zero recognition in current systems. We are changing that.", highlight_en: "Through our Wongpanit partnership (2000+ outlets), verified collectors see a <strong>20% income uplift</strong>.", steps: [
      { num: "01", title_en: "A digital identity is created", desc_en: "KYC mapped to collections logged by weight, date, and material—a verifiable income record." },
      { num: "02", title_en: "EPR value flows directly to them", desc_en: "Brands paying for compliance generate payments traceable directly to the specific collector." },
      { num: "03", title_en: "Financial access unlocks", desc_en: "Income records act as a precondition for micro-credit and bank account eligibility." }
    ]},
    lever3: { label_en: "Lever 3: Market Access", title_en: "Ocean Bound Plastic", desc1_en: "When Maya Bay closed for 3.5 years, the local tourism economy lost 555M THB per season. Meanwhile, local Moken collectors earned just ~200 THB selling plastic for scraps.", desc2_en: "Today, RecyGlo x Second Life operate an Ocean Bound Plastic (OBP) interception network across 50km of Thailand's coastline.", note_en: "*5% of program revenue is committed directly back to community development and training.", stats: [
      { value_en: "1,436", label_en: "Active Collectors" },
      { value_en: "52%", label_en: "Are Women" },
      { value_en: "~30%", label_en: "Income Uplift" },
      { value_en: "11K+", label_en: "People Impacted" }
    ]},
    lever1: { label_en: "Lever 1: Skill Access", title_en: "Women & Youth Empowerment", featureTitle_en: "Her name is Htet Htet Hlwan Moe.", featureDesc_en: "She was 15 when conflict closed her school in Myanmar. No credentials. No income pathway. No way forward. Through <strong class=\"text-[#1B5E20]\">SheWorks</strong>, she graduated and was placed. Her classmates are now training others.", checklist: [
      { text_en: "240+ Women & Youth Placed" },
      { text_en: "964 Trained & Tracking" },
      { text_en: "UNESCO TVET Certified Pathway" }
    ], women: [
      { name_en: "Ma Thin Htet Htet San", role_en: "Myanmar Jewelry", desc_en: "Now training war-affected civilians in four cities—one graduate who became a trainer." },
      { name_en: "Ma Mi Zin Tun", role_en: "Mushroom Cultivation", desc_en: "Built a micro-farm at home; supporting her family through a self-sustaining income stream." },
      { name_en: "Ms. Klinthoop Arunchokthaworn", role_en: "Chiang Mai Green Roots", desc_en: "Transforming her guesthouse into a sustainable tourism operation." }
    ]},
    goals: { title_en: "Our Goals for Future Expansion", items: [
      { value_en: "10,000 Tonnes", desc_en: "Of Ocean Bound Plastic intercepted via coastal corridor expansion." },
      { value_en: "10,000 Collectors", desc_en: "Formalized into digital income and EPR systems." },
      { value_en: "3,500 Graduates", desc_en: "Certified and empowered through SheWorks cohorts." }
    ]},
    sdgs: { title_en: "Aligned with UN Sustainable Development Goals", items: [
      { num: "8", name_en: "Decent Work" },
      { num: "12", name_en: "Responsible Production" },
      { num: "13", name_en: "Climate Action" },
      { num: "14", name_en: "Life Below Water" },
      { num: "5", name_en: "Gender Equality" },
      { num: "11", name_en: "Sustainable Cities" }
    ]}
  };

  const [pageData, setPageData] = useState<any>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH LIVE DATA FROM FIREBASE ---
  useEffect(() => {
    const docRef = doc(db, "website_content", "impact_page");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
        const dbData = docSnap.data();
        // Safe check for checklist arrays
        if (dbData.lever1 && Array.isArray(dbData.lever1.checklist) && typeof dbData.lever1.checklist[0] === 'string') {
          dbData.lever1.checklist = dbData.lever1.checklist.map((item: string) => ({ text_en: item }));
        }
        setPageData({ ...defaultData, ...dbData });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  // Icons & Fallbacks
  const icons = [Users, Globe, Heart];
  const localWomenImages = [impactWoman1, impactWoman2, impactWoman3];
  
  // Parse Countries
  const rawCountriesStr = tDb(pageData.regional, 'countries', 'Singapore (HQ), Thailand, Myanmar, Vietnam, Malaysia, Indonesia, South Korea, Australia');
  const countriesTags = rawCountriesStr.split(',').map((c: string) => c.trim()).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-30 bg-black"
          style={{
            backgroundImage: `url(${pageData.hero?.imagePreview || impactHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-sm md:text-base font-bold mb-4 text-[#76FF03] tracking-widest uppercase">
            {tDb(pageData.hero, 'subtitle')}
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            {tDb(pageData.hero, 'title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light tracking-wide">
            {tDb(pageData.hero, 'desc')}
          </p>
        </div>
      </section>

      {/* 2. THE BIG NUMBERS & REGIONAL SCALE (Corporate Bar Layout) */}
      <section className="relative -mt-12 z-20 pb-16">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          <div className="bg-white shadow-xl border border-gray-100 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 mb-12">
            {pageData.bigNumbers.map((stat: any, idx: number) => {
              const Icon = icons[idx % icons.length];
              return (
                <div key={idx} className="p-10 flex-1 text-center group hover:bg-gray-50 transition-colors">
                  <Icon size={32} className={`mx-auto mb-4 ${idx === 2 ? 'text-[#E2552B]' : 'text-[#1B5E20]'}`} />
                  <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{tDb(stat, 'value')}</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{tDb(stat, 'label')}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-10 md:p-12 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-[#1B5E20] mb-4">{tDb(pageData.regional, 'title')}</h3>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-4xl">
              {tDb(pageData.regional, 'desc')}
            </p>
            <div className="flex flex-wrap gap-4">
              {countriesTags.map((country: string) => (
                <div key={country} className="flex items-center gap-2 border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700">
                  <MapPin size={16} className="text-[#E2552B]"/> {country}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. LEVER 2: INFORMAL WORKERS */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-4 block">
                {tDb(pageData.lever2, 'label')}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1B5E20] mb-6">
                {tDb(pageData.lever2, 'title')}
              </h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                {tDb(pageData.lever2, 'desc')}
              </p>
              
              <div className="space-y-8">
                {pageData.lever2.steps.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-6">
                    <div className="text-[#E2552B] font-serif text-4xl font-bold shrink-0">{step.num}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{tDb(step, 'title')}</h4>
                      <p className="text-gray-600">{tDb(step, 'desc')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-[#F8F9F7] border-l-4 border-[#1B5E20] flex items-center gap-4">
                <TrendingUp className="text-[#1B5E20] shrink-0" size={24} />
                <p className="text-gray-800 font-medium" dangerouslySetInnerHTML={{ __html: tDb(pageData.lever2, 'highlight') }} />
              </div>
            </div>
            
            <div className="aspect-[4/3] bg-gray-200 relative">
               <div className="absolute inset-0 bg-[#1B5E20] translate-x-4 translate-y-4 z-0"></div>
               <img src={pageData.lever2.imagePreview || impactFacility} alt="Waste Sorting Facility" className="w-full h-full object-cover relative z-10 border border-gray-100" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEVER 3: OCEAN PROTECTION */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1 aspect-[4/3] bg-gray-200 relative">
               <div className="absolute inset-0 bg-[#1B5E20] -translate-x-4 translate-y-4 z-0"></div>
               <img src={pageData.lever3.imagePreview || impactOcean} alt="Coastal Cleanup" className="w-full h-full object-cover relative z-10 border border-gray-100" />
            </div>
            
            <div className="order-1 lg:order-2">
              <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-4 block">
                {tDb(pageData.lever3, 'label')}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1B5E20] mb-6">
                {tDb(pageData.lever3, 'title')}
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {tDb(pageData.lever3, 'desc1')}
              </p>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                {tDb(pageData.lever3, 'desc2')}
              </p>

              <div className="grid grid-cols-2 gap-8">
                {pageData.lever3.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="border-t-2 border-[#1B5E20] pt-4">
                    <h4 className="text-3xl font-bold text-gray-900 mb-1">{tDb(stat, 'value')}</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{tDb(stat, 'label')}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 italic mt-8 border-l-2 border-gray-300 pl-4">
                {tDb(pageData.lever3, 'note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEVER 1: SHEWORKS (Corporate Editorial Layout) */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          <div className="max-w-3xl mb-16">
            <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-4 block">
              {tDb(pageData.lever1, 'label')}
            </span>
            <div className="w-12 h-1 bg-[#E2552B] mb-6"></div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1B5E20]">
              {tDb(pageData.lever1, 'title')}
            </h2>
          </div>

          {/* Htet Htet Feature Box */}
          <div className="bg-[#F8F9F7] border border-gray-200 p-8 md:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h3 className="text-3xl font-bold mb-6 text-gray-900 leading-tight">
                  {tDb(pageData.lever1, 'featureTitle')}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: tDb(pageData.lever1, 'featureDesc') }} />
                
                <div className="flex flex-col gap-4">
                  {pageData.lever1.checklist.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-[#E2552B]" size={20}/> 
                      <span className="text-gray-800 font-bold">{tDb(item, 'text')}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-5 aspect-[4/3] relative">
                <img src={pageData.lever1.featureImage || impactHtet} alt={tDb(pageData.lever1, 'featureTitle')} className="w-full h-full object-cover border border-gray-200 shadow-sm" />
              </div>
            </div>
          </div>

          {/* 3 Women Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-16">
            {pageData.lever1.women.map((woman: any, idx: number) => (
              <div key={idx} className={`text-center group ${idx > 0 ? 'border-t border-gray-200 pt-8 md:pt-0 md:border-t-0 md:border-l' : ''}`}>
                <img src={woman.imagePreview || localWomenImages[idx % localWomenImages.length]} alt={tDb(woman, 'name')} className="w-32 h-32 rounded-full object-cover mx-auto mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 border border-gray-200" />
                <h4 className="font-bold text-xl text-gray-900 mb-2">{tDb(woman, 'name')}</h4>
                <p className="text-xs font-bold text-[#E2552B] uppercase tracking-wider mb-4">{tDb(woman, 'role')}</p>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">{tDb(woman, 'desc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EXPANSION GOALS */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">{tDb(pageData.goals, 'title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pageData.goals.items.map((goal: any, idx: number) => (
              <div key={idx} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-center">
                <Target className="text-[#1B5E20] mb-6" size={32} />
                <h4 className="font-bold text-2xl text-gray-900 mb-3">{tDb(goal, 'value')}</h4>
                <p className="text-gray-600 text-sm">{tDb(goal, 'desc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SDG ALIGNMENT */}
      <section className="py-24 bg-[#1B5E20] text-white">
        <div className="container px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-16">{tDb(pageData.sdgs, 'title')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {pageData.sdgs.items.map((sdg: any, idx: number) => (
              <div key={idx} className="border border-white/30 p-6 flex flex-col items-center justify-center hover:bg-white hover:text-[#1B5E20] transition-colors group">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#1B5E20]">SDG {sdg.num}</h3>
                <p className="text-xs uppercase tracking-wider group-hover:text-gray-600 text-white/80">{tDb(sdg, 'name')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}