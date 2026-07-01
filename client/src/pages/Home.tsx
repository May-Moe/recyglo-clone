import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Quote, X, Target } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'wouter'; 
import { useTranslation } from 'react-i18next';

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot, collection, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [, setLocation] = useLocation();
  
  // --- TRANSLATION SETUP ---
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const tDb = (obj: any, field: string, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[`${field}_${currentLang}`] || obj[`${field}_en`] || obj[field] || fallback;
  };

  // --- LIVE DATABASE STATE ---
  const [pageData, setPageData] = useState({
    heroSlides: [],
    visionData: { mission: "", vision: "", goal: "" },
    testimonials: [],
    galleryImages: [],
    partners: [],
    servicesHeader: { title: "", subtitle: "" }, 
    featuredServices: [],
    platformsHeader: { title: "", subtitle: "" },
    digitalPlatforms: [],
    partnersHeader: { title: "", description: "" },
    testimonialsHeader: { title: "", description: "" },
    visionHeader: { title: "", description: "" },
    galleryHeader: { title: "", description: "" },
    blogHeader: { title: "" }, 
  });

  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- FETCH LIVE DATA FROM FIREBASE ---
  useEffect(() => {
    const docRef = doc(db, "website_content", "home_page");
    const unsubscribePage = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData({
          heroSlides: data.heroSlides || [],
          visionData: data.visionData || { mission: "", vision: "", goal: "" },
          testimonials: data.testimonials || [],
          galleryImages: data.galleryImages || [],
          partners: data.partners || [],
          servicesHeader: data.servicesHeader || { title: "", subtitle: "" },
          featuredServices: data.featuredServices || [],
          platformsHeader: data.platformsHeader || { title: "", subtitle: "" },
          digitalPlatforms: data.digitalPlatforms || [],
          partnersHeader: data.partnersHeader || { title: "", description: "" },
          testimonialsHeader: data.testimonialsHeader || { title: "", description: "" },
          visionHeader: data.visionHeader || { title: "", description: "" },
          galleryHeader: data.galleryHeader || { title: "", description: "" },
          blogHeader: data.blogHeader || { title: "Blog" },
        });
      }
    });

    const unsubscribeArticles = onSnapshot(query(collection(db, "articles")), (snapshot) => {
      const loaded: any[] = [];
      snapshot.forEach(doc => loaded.push({ id: doc.id, ...doc.data() }));
      setLatestArticles(loaded.reverse().slice(0, 3));
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 100); 
    });

    return () => {
      unsubscribePage();
      unsubscribeArticles();
    };
  }, []);

  // --- SLIDER LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    if (pageData.heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % pageData.heroSlides.length);
  }, [pageData.heroSlides.length]);

  const prevSlide = () => {
    if (pageData.heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + pageData.heroSlides.length) % pageData.heroSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => { nextSlide(); }, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // --- DYNAMIC PARTNERS LOGIC ---
  const partners = pageData.partners || [];
  const partnersPerPage = 15; 
  const totalPages = Math.max(1, Math.ceil(partners.length / partnersPerPage));
  const [partnerPageIndex, setPartnerPageIndex] = useState(0);
  
  const nextPartnerPage = () => setPartnerPageIndex((prev) => (prev + 1) % totalPages);
  const prevPartnerPage = () => setPartnerPageIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const nextTestimonial = useCallback(() => {
    if (pageData.testimonials.length === 0) return;
    setTestimonialIndex((prev) => (prev + 1) % pageData.testimonials.length);
  }, [pageData.testimonials.length]);
  
  const prevTestimonial = () => {
    if (pageData.testimonials.length === 0) return;
    setTestimonialIndex((prev) => (prev - 1 + pageData.testimonials.length) % pageData.testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => { nextTestimonial(); }, 8000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const nextGalleryImage = () => {
    if (pageData.galleryImages.length === 0) return;
    setGalleryIndex((prev) => (prev + 1) % pageData.galleryImages.length);
  };
  const prevGalleryImage = () => {
    if (pageData.galleryImages.length === 0) return;
    setGalleryIndex((prev) => (prev - 1 + pageData.galleryImages.length) % pageData.galleryImages.length);
  };

  const getGalleryImg = (index: number) => {
    if (pageData.galleryImages.length === 0) return ""; 
    return pageData.galleryImages[index % pageData.galleryImages.length]?.preview || "";
  };

  const getGalleryAlt = (index: number) => {
    if (pageData.galleryImages.length === 0) return "Impact Gallery Image"; 
    return pageData.galleryImages[index % pageData.galleryImages.length]?.altText || "Impact Gallery Image";
  };

  const displayServices = pageData.featuredServices.length > 0 ? pageData.featuredServices : [];
  const displayPlatforms = pageData.digitalPlatforms.length > 0 ? pageData.digitalPlatforms : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-wide">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8F9F7] transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header />

      {/* 1. ORIGINAL HERO SECTION (Restored Typography) */}
      {pageData.heroSlides.length > 0 && (
        <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden bg-[#1B5E20]">
          <div className="flex w-full h-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {pageData.heroSlides.map((slide: any, index: number) => {
              const isActive = index === currentSlide;
              return (
                <div key={index} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                  {slide.altText && slide.imagePreview && (
                    <img src={slide.imagePreview} alt={slide.altText} className="sr-only" />
                  )}

                  <div
                    className={`absolute inset-0 transition-transform duration-[15000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`} 
                    style={slide.imagePreview ? { backgroundImage: `url(${slide.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="container px-4 sm:px-8 lg:px-12 relative z-20 h-full flex items-center">
                    <div className="w-full max-w-4xl">
                       <h2 className={`text-lg md:text-xl font-semibold mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-snug text-[#76FF03] transition-all duration-700 transform ${isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8'}`}>
                          {tDb(slide, 'subtitle')}
                       </h2>
                       <h1 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold mb-5 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] leading-tight tracking-tight transition-all duration-700 transform ${isActive ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-8'}`}>
                          {tDb(slide, 'title')}
                       </h1>
                       <p className={`text-base md:text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] mb-10 leading-relaxed max-w-2xl font-light transition-all duration-700 transform ${isActive ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-8'}`}>
                          {tDb(slide, 'description')}
                       </p>
                       <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 transform ${isActive ? 'opacity-100 translate-y-0 delay-1000' : 'opacity-0 translate-y-8'}`}>
                          <Button onClick={() => { window.open(slide.button1Link || '/carbon-calculator', '_blank'); }} className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105">
                            <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span> {slide.button1Text || t('nav.carbonAccounting', 'Carbon Accounting')}
                          </Button>
                          <Button className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-10 py-6 rounded-md shadow-md flex items-center justify-center transition-all hover:scale-105" onClick={() => { setLocation(slide.button2Link || '/services'); window.scrollTo(0, 0); }}>
                            {slide.button2Text || t('nav.solutions', 'Our Solutions')}
                          </Button>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {pageData.heroSlides.map((_, idx) => (<button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 transition-all duration-500 rounded-full shadow-md ${idx === currentSlide ? 'w-10 bg-[#76FF03]' : 'w-3 bg-white/70 hover:bg-white'}`} />))}
          </div>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/20 hover:bg-black/40 transition-colors hidden md:block hover:scale-110"><ChevronLeft size={32} /></button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/20 hover:bg-black/40 transition-colors hidden md:block hover:scale-110"><ChevronRight size={32} /></button>
        </section>
      )}

      {/* 2. REFINED SERVICES GRID */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9F7] to-white h-1/2"></div>
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-3xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="text-[#E2552B] font-bold tracking-widest uppercase text-sm mb-3 block flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#E2552B]"></span>
              {tDb(pageData.servicesHeader, 'subtitle', t('nav.services', 'Services'))}
            </span>
            <h2 className="text-2xl md:text-2xl lg:text-4xl font-extrabold text-[#1B5E20] leading-[1.1] tracking-tight">
              {tDb(pageData.servicesHeader, 'title', t('nav.solutions', 'Integrated Sustainability Services'))}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayServices.map((service: any, idx: number) => {
               const serviceTitle = tDb(service, 'title');
               const serviceDesc = tDb(service, 'desc');
               
               return (
                 <Card 
                   key={idx} 
                   onClick={() => { setLocation(service.link || `/services/${service.slug}`); window.scrollTo(0, 0); }} 
                   className="overflow-hidden border border-gray-100 rounded-2xl group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 bg-white flex flex-row h-full items-stretch transform hover:-translate-y-1.5"
                 >
                    <div className="w-2/5 sm:w-1/3 relative shrink-0 aspect-square sm:aspect-auto overflow-hidden">
                       <img 
                         src={service.imagePreview || service.img} 
                         alt={serviceTitle} 
                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardContent className="p-8 flex flex-col flex-grow justify-between w-3/5 sm:w-2/3">
                       <div>
                         <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1B5E20] transition-colors leading-tight">{serviceTitle}</h3>
                         <p className="text-sm md:text-base text-gray-500 line-clamp-3 mb-4 leading-relaxed">{serviceDesc}</p>
                       </div>
                       <div className="flex items-center justify-end text-[#1B5E20] font-bold text-sm mt-4 group-hover:text-[#E2552B] transition-colors">
                         {t('nav.learnMore', 'Explore')} <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                       </div>
                    </CardContent>
                 </Card>
               );
            })}
          </div>
        </div>
      </section>

      {/* 3. DIGITAL PLATFORMS SECTION (Polished SaaS card style) */}
      <section className="py-24 bg-[#F8F9F7] border-t border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16 text-center mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="text-[#E2552B] font-bold tracking-widest uppercase text-sm mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#E2552B]"></span>
              {tDb(pageData.platformsHeader, 'subtitle', t('nav.platforms', 'Technology'))}
              <span className="w-8 h-[2px] bg-[#E2552B]"></span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B5E20] leading-tight tracking-tight">
              {tDb(pageData.platformsHeader, 'title', t('nav.softwarePlatforms', 'Digital Platforms'))}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {displayPlatforms.map((plat: any, idx: number) => {
              const platTitle = tDb(plat, 'title');
              const platDesc = tDb(plat, 'desc');

              return (
                <Card 
                  key={idx}
                  onClick={() => window.open(plat.link || '#', '_blank', 'noopener,noreferrer')} 
                  className="overflow-hidden border border-gray-200 rounded-[2rem] group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 bg-white flex flex-col h-full transform hover:-translate-y-2"
                >
                  <div className="w-full relative shrink-0 aspect-[16/9] bg-gray-100 flex items-center justify-center p-8 overflow-hidden">
                    <img 
                      src={plat.imagePreview} 
                      alt={platTitle} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-[#1B5E20]/0 group-hover:bg-[#1B5E20]/20 transition-colors duration-500" />
                  </div>
                  
                  <CardContent className="p-8 md:p-10 flex flex-col flex-grow bg-white border-t border-gray-100">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#1B5E20] transition-colors leading-tight">{platTitle}</h3>
                    <p className="text-base text-gray-500 mb-8 leading-relaxed flex-grow">{platDesc}</p>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full border-2 border-gray-200 text-gray-600 bg-transparent hover:bg-[#1B5E20] hover:text-white hover:border-[#1B5E20] transition-all duration-300 font-bold py-6 rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#1B5E20] group-hover:text-white group-hover:border-[#1B5E20]">
                        {t('nav.learnMore', 'Explore Platform')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. ORIGINAL TRUSTED BY / PARTNERS SECTION (Design Restored) */}
      {partners.length > 0 && (
        <section className="py-16 bg-white border-b border-gray-100 relative overflow-hidden">
          <div className="container px-4 sm:px-8 lg:px-12">
            <h3 className="text-2xl font-bold text-[#1B5E20] mb-8 text-center lg:text-left">
              {tDb(pageData.partnersHeader, 'title', t('nav.partnerships', 'Trusted by Global Brands & International Organizations'))}
            </h3>
            {tDb(pageData.partnersHeader, 'description') && (
              <p className="text-gray-600 mb-10 text-center lg:text-left">{tDb(pageData.partnersHeader, 'description')}</p>
            )}
            <div className="flex items-center justify-between gap-2 md:gap-6 relative mt-6">
               <button onClick={prevPartnerPage} className="p-3 text-gray-400 hover:text-[#1B5E20] z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"><ChevronLeft size={24} /></button>
               <div className="overflow-hidden w-full px-2">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${partnerPageIndex * 100}%)` }}>
                     {Array.from({ length: totalPages }).map((_, pageIndex) => (
                        <div key={pageIndex} className="w-full flex-shrink-0">
                           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                              {partners.slice(pageIndex * partnersPerPage, (pageIndex + 1) * partnersPerPage).map((partner: any, idx: number) => (
                                  <div key={partner.id || idx} className="h-24 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow p-4 overflow-hidden">
                                    {partner.imagePreview && (
                                      <img 
                                        src={partner.imagePreview} 
                                        alt={partner.altText || partner.fileName || "Partner Logo"} 
                                        title={partner.altText || partner.fileName || "Partner Logo"}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply" 
                                      />
                                    )}
                                  </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <button onClick={nextPartnerPage} className="p-3 text-gray-400 hover:text-[#1B5E20] z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"><ChevronRight size={24} /></button>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 relative">
                 <div className="w-8"></div> 
                 <div className="flex gap-2 justify-center absolute left-1/2 -translate-x-1/2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button key={idx} onClick={() => setPartnerPageIndex(idx)} className={`h-2 rounded-full transition-all ${partnerPageIndex === idx ? 'w-8 bg-[#1B5E20]' : 'w-2 bg-gray-300'}`} />
                    ))}
                 </div>
                 <div className="text-sm font-medium text-gray-500">{partnerPageIndex + 1} / {totalPages}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. ORIGINAL TESTIMONIALS SECTION (Design Restored) */}
      {pageData.testimonials.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-[#F8F9F7] -skew-x-12 origin-top-left -z-10" />
          <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 pr-8">
                   <h2 className="text-4xl font-bold text-[#1B5E20] mb-6 leading-tight">
                     {tDb(pageData.testimonialsHeader, 'title', 'What Our Clients Say')}
                   </h2>
                   <p className="text-gray-600 mb-8 text-lg">
                     {tDb(pageData.testimonialsHeader, 'description', '')}
                   </p>
                   <div className="inline-block p-4 border border-gray-200 rounded-2xl relative">
                      <Quote className="text-gray-300 w-12 h-12" />
                   </div>
                </div>
                
                <div className="lg:col-span-7">
                   <div className="bg-[#2A4B38] text-white rounded-3xl p-10 relative overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-center">
                      <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                         <Quote className="w-64 h-64" />
                      </div>
                      
                      {pageData.testimonials[testimonialIndex] && (
                        <div key={testimonialIndex} className="animate-in fade-in slide-in-from-right-8 duration-500">
                          <div className="mb-8">
                             <span className="text-[#76FF03] text-6xl font-serif leading-none">"</span>
                             <p className="text-xl leading-relaxed relative z-10 font-medium">
                               {tDb(pageData.testimonials[testimonialIndex], 'quote')}
                             </p>
                          </div>
                          <div className="flex items-center gap-4 border-t border-white/20 pt-6">
                             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10">
                                {pageData.testimonials[testimonialIndex].imagePreview && (
                                  <img src={pageData.testimonials[testimonialIndex].imagePreview} alt="Testimonial Author" className="w-full h-full object-cover" />
                                )}
                             </div>
                             <div>
                               <h4 className="font-bold text-[#76FF03] text-lg">
                                 {tDb(pageData.testimonials[testimonialIndex], 'author')}
                               </h4>
                               {tDb(pageData.testimonials[testimonialIndex], 'organization') && (
                                 <p className="text-white/70 text-sm">{tDb(pageData.testimonials[testimonialIndex], 'organization')}</p>
                               )}
                             </div>
                          </div>
                        </div>
                      )}
                   </div>
                   
                   <div className="flex justify-end gap-2 mt-6">
                      <button onClick={prevTestimonial} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1B5E20] hover:text-white transition-colors"><ChevronLeft size={20}/></button>
                      <button onClick={nextTestimonial} className="w-10 h-10 rounded-full border border-[#1B5E20] bg-[#1B5E20] text-white flex items-center justify-center hover:bg-[#2A4B38] transition-colors"><ChevronRight size={20}/></button>
                   </div>
                </div>
             </div>
          </div>
        </section>
      )}

      {/* 6. STRATEGIC VISION (Premium dark mode card effect) */}
      <section className="relative py-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/testimonial-bg-a4TBoBLbxws7biQWxPfE9Q.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
           <div className="mb-16 text-center max-w-3xl mx-auto">
             <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight">
               {tDb(pageData.visionHeader, 'title', 'Our Strategic Vision for a Sustainable Asia-Pacific')}
             </h2>
             {tDb(pageData.visionHeader, 'description') && (
               <p className="text-white/70 text-sm leading-relaxed">{tDb(pageData.visionHeader, 'description')}</p>
             )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 text-white hover:bg-white/10 transition-colors duration-300">
                 <div className="w-12 h-12 rounded-full bg-[#76FF03]/20 flex items-center justify-center mb-6">
                   <Target size={24} className="text-[#76FF03]" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
                 <p className="text-white/60 leading-relaxed text-sm">{tDb(pageData.visionData, 'mission')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 text-white hover:bg-white/10 transition-colors duration-300">
                 <div className="w-12 h-12 rounded-full bg-[#76FF03]/20 flex items-center justify-center mb-6">
                   <Play size={24} className="text-[#76FF03]" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
                 <p className="text-white/60 leading-relaxed text-sm">{tDb(pageData.visionData, 'vision')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 text-white hover:bg-white/10 transition-colors duration-300">
                 <div className="w-12 h-12 rounded-full bg-[#76FF03]/20 flex items-center justify-center mb-6">
                   <ArrowRight size={24} className="text-[#76FF03]" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-white">Our Goal</h3>
                 <p className="text-white/60 leading-relaxed text-sm whitespace-pre-line">{tDb(pageData.visionData, 'goal')}</p>
              </div>
           </div>
        </div>
      </section>

      {/* 7. IMPACT GALLERY (MASONRY) */}
      {pageData.galleryImages.length > 0 && (
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="container px-4 sm:px-8 lg:px-12">
            <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <span className="text-[#E2552B] font-bold tracking-widest uppercase text-xs mb-4 block flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#E2552B]"></span>
                {t('nav.impact', 'Impact')}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#1B5E20] mb-4 tracking-tight">
                {tDb(pageData.galleryHeader, 'title', t('nav.impact', 'Impact in Action'))}
              </h2>
              {tDb(pageData.galleryHeader, 'description') && (
                <p className="text-gray-500 max-w-2xl text-lg">{tDb(pageData.galleryHeader, 'description')}</p>
              )}
            </div>
            
            {/* Safe fallback for < 5 images */}
            {pageData.galleryImages.length < 5 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pageData.galleryImages.map((img: any, idx: number) => (
                  <div key={idx} className="rounded-2xl overflow-hidden bg-gray-100 aspect-square relative group cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => { setGalleryIndex(idx); setIsGalleryOpen(true); }}>
                    <img src={img.preview} alt={img.altText || 'Gallery Image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#1B5E20]/0 group-hover:bg-[#1B5E20]/60 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">View Image</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Original Masonry-like grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
                 <div className="flex flex-col gap-6 h-full">
                    <div className="rounded-2xl overflow-hidden bg-gray-100 h-1/2 relative group cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}>
                       <img src={getGalleryImg(0)} alt={getGalleryAlt(0)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-[#1B5E20]/0 group-hover:bg-[#1B5E20]/60 transition-colors duration-300 flex items-center justify-center">
                         <span className="text-white font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">View Gallery</span>
                       </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-gray-100 h-1/2 relative group cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => { setGalleryIndex(1); setIsGalleryOpen(true); }}>
                       <img src={getGalleryImg(1)} alt={getGalleryAlt(1)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                         <span className="text-white font-bold tracking-widest uppercase text-sm border border-white/50 px-6 py-2 rounded-full">View</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-6 h-full">
                    <div className="rounded-2xl overflow-hidden bg-gray-100 h-1/2 relative group cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => { setGalleryIndex(2); setIsGalleryOpen(true); }}>
                       <img src={getGalleryImg(2)} alt={getGalleryAlt(2)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                         <span className="text-white font-bold tracking-widest uppercase text-sm border border-white/50 px-6 py-2 rounded-full">View</span>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 h-1/2">
                       <div className="rounded-2xl overflow-hidden bg-gray-100 h-full relative group cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => { setGalleryIndex(3); setIsGalleryOpen(true); }}>
                         <img src={getGalleryImg(3)} alt={getGalleryAlt(3)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="text-white font-bold tracking-widest uppercase text-xs border border-white/50 px-4 py-2 rounded-full">View</span>
                         </div>
                       </div>
                       <div className="rounded-2xl overflow-hidden bg-gray-100 h-full relative group flex items-center justify-center cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => { setGalleryIndex(4); setIsGalleryOpen(true); }}>
                         <img src={getGalleryImg(4)} alt={getGalleryAlt(4)} className="absolute inset-0 w-full h-full object-cover blur-[3px] group-hover:blur-none group-hover:scale-105 transition-all duration-700 ease-out" />
                         <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                         <Button className="relative z-10 bg-white text-[#1B5E20] hover:bg-[#76FF03] hover:text-[#1B5E20] font-bold shadow-xl pointer-events-none transition-colors px-6 py-6 rounded-xl">See Gallery</Button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FULL SCREEN GALLERY OVERLAY */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
          <button className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-50 hidden sm:block hover:scale-110" onClick={prevGalleryImage}><ChevronLeft size={48} /></button>
          <div className="bg-transparent w-full max-w-6xl max-h-[95vh] flex flex-col relative mx-4">
             <div className="flex items-center justify-between p-4 absolute top-0 w-full z-50">
               <span className="font-bold text-sm text-white/50 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md tracking-wider">{galleryIndex + 1} / {pageData.galleryImages.length}</span>
               <button className="text-white/50 hover:text-white transition-colors bg-black/50 p-2.5 rounded-full backdrop-blur-md hover:bg-black/80" onClick={() => setIsGalleryOpen(false)}><X size={24} /></button>
             </div>
             
             <div className="flex-grow p-4 overflow-hidden flex items-center justify-center relative min-h-[60vh]">
               <button className="absolute left-2 bg-black/50 text-white rounded-full p-2 sm:hidden z-10" onClick={prevGalleryImage}><ChevronLeft size={24} /></button>
               <img key={galleryIndex} src={getGalleryImg(galleryIndex)} alt={getGalleryAlt(galleryIndex)} className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300 drop-shadow-2xl" />
               <button className="absolute right-2 bg-black/50 text-white rounded-full p-2 sm:hidden z-10" onClick={nextGalleryImage}><ChevronRight size={24} /></button>
             </div>
             
             <div className="p-4 overflow-x-auto mt-4">
               <div className="flex gap-3 justify-start sm:justify-center min-w-max pb-2">
                 {pageData.galleryImages.map((img: any, idx: number) => (
                   <button key={idx} onClick={() => setGalleryIndex(idx)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${galleryIndex === idx ? 'border-[#76FF03] opacity-100 scale-110 shadow-[0_0_15px_rgba(118,255,3,0.3)]' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                     <img src={img.preview} alt={img.altText || `Thumbnail ${idx}`} className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
             </div>
          </div>
          <button className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-50 hidden sm:block hover:scale-110" onClick={nextGalleryImage}><ChevronRight size={48} /></button>
        </div>
      )}

      {/* 8. DYNAMIC BLOG SECTION (Polished Cards) */}
      <section className="py-24 bg-[#F8F9F7] border-t border-gray-200">
         <div className="container px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="max-w-2xl">
                 <span className="text-[#E2552B] font-bold tracking-widest uppercase text-xs mb-4 flex items-center gap-2">
                   <span className="w-8 h-[2px] bg-[#E2552B]"></span>
                   {t('nav.articles', 'Articles')}
                 </span>
                 <h2 className="text-2xl md:text-4xl font-extrabold text-[#1B5E20] tracking-tight">
                   {tDb(pageData.blogHeader, 'title', t('nav.articles', 'Latest News & Insights'))}
                 </h2>
               </div>
               <Button onClick={() => { setLocation('/articles'); window.scrollTo(0, 0); }} variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-[#1B5E20] hover:text-[#1B5E20] bg-transparent font-bold py-6 px-8 rounded-full hidden sm:flex shrink-0 transition-all hover:shadow-md">
                 View All Articles
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {latestArticles.length === 0 && <p className="text-gray-400 col-span-3 text-center py-10">No blogs available.</p>}
               {latestArticles.map((post, idx) => {
                 const postTags = post.tags ? post.tags.split(',').map((t: string) => t.trim()) : [];
                 return (
                   <Card key={idx} onClick={() => { setLocation(`/articles/${post.slug}`); window.scrollTo(0, 0); }} className="group cursor-pointer overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 bg-white rounded-3xl transform hover:-translate-y-2 flex flex-col h-full">
                      <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                         {post.imagePreview && <img src={post.imagePreview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt={tDb(post, 'title')} />}
                         <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                            {postTags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="bg-white/95 backdrop-blur-md text-gray-900 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-100">{tag}</span>
                            ))}
                         </div>
                      </div>
                      <CardContent className="p-8 flex flex-col flex-grow bg-white">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-4 h-[1px] bg-gray-300"></span> {post.date}
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 group-hover:text-[#1B5E20] transition-colors leading-snug">
                          {tDb(post, 'title')}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 line-clamp-3 flex-grow leading-relaxed">
                          {tDb(post, 'excerpt')}
                        </p>
                        <div className="mt-auto flex items-center text-[#E2552B] font-bold text-sm group-hover:text-[#c94b26] transition-colors">
                          Read Full Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </CardContent>
                   </Card>
                 )
               })}
            </div>

            <div className="mt-10 sm:hidden">
              <Button onClick={() => { setLocation('/articles'); window.scrollTo(0, 0); }} variant="outline" className="w-full border-2 border-gray-300 text-gray-700 bg-transparent font-bold py-6 rounded-xl">
                 View All Articles
              </Button>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}