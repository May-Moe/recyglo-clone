import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Quote, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter'; 
import { useTranslation } from 'react-i18next'; // <-- NEW IMPORT

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- ASSET IMPORTS ---
import service1 from '@/assets/images/w1.webp';
import service2 from '@/assets/images/w2.webp';
import service3 from '@/assets/images/w3.webp';
import service4 from '@/assets/images/w4.webp';
import service5 from '@/assets/images/w5.webp';
import service6 from '@/assets/images/w6.webp';
import blog1 from '@/assets/images/blog1.png';
import blog2 from '@/assets/images/blog2.png';
import blog3 from '@/assets/images/blog3.png';

export default function Home() {
  const [, setLocation] = useLocation();
  
  // --- TRANSLATION SETUP ---
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // --- LIVE DATABASE STATE ---
  const [pageData, setPageData] = useState({
    heroSlides: [],
    visionData: { mission: "", vision: "", goal: "" },
    values: [],
    testimonials: [],
    galleryImages: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH LIVE DATA FROM FIREBASE ---
  useEffect(() => {
    const docRef = doc(db, "website_content", "home_page");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData({
          heroSlides: data.heroSlides || [],
          visionData: data.visionData || { mission: "", vision: "", goal: "" },
          values: data.values || [],
          testimonials: data.testimonials || [],
          galleryImages: data.galleryImages ? data.galleryImages.map((img: any) => img.preview) : []
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
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

  const partners = Array.from({ length: 30 }, (_, i) => i + 1);
  const partnersPerPage = 15; 
  const totalPages = Math.ceil(partners.length / partnersPerPage);
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
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
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
    return pageData.galleryImages[index % pageData.galleryImages.length];
  };

  // Static Blog Posts (Translated directly using t() where possible, or waiting for CMS)
  const blogPosts = [
    { id: 1, title: "RecyGlo Publishes Report on Thailand's Battle With Climate Change", image: blog1, tags: ["Sustainability"], excerpt: "In July 2024, RecyGlo published a report on Thailand’s battle with climate change...", date: "11 October 2024" },
    { id: 2, title: "Thailand's Sustainable Future: The Significance of Renewable Energy", image: blog2, tags: ["Circular Economy", "News", "Sustainability"], excerpt: "Thailand’s road to sustainability requires a robust strategy to reach its goal by 2030...", date: "11 October 2024" },
    { id: 3, title: "Understanding the importance of circular economy in Thailand", image: blog3, tags: ["Circular Economy"], excerpt: "The “Take-Make-Waste” system normally endorsed by Thailand’s linear economy has been reprimanded...", date: "11 October 2024" }
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]">Loading content...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* HERO SECTION */}
      {pageData.heroSlides.length > 0 && (
        <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden bg-[#1B5E20]">
          <div 
            className="flex w-full h-full transition-transform duration-[1500ms] ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {pageData.heroSlides.map((slide: any, index: number) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <div
                  className="absolute inset-0 bg-black/40" 
                  style={slide.imagePreview ? {
                    backgroundImage: `url(${slide.imagePreview})`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : {}}
                />
                <div className="container px-4 sm:px-8 lg:px-12 relative z-20 h-full flex items-center">
                  <div className="w-full max-w-3xl">
                     <h2 className="text-lg md:text-xl font-medium mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] leading-snug">
                        {slide[`subtitle_${currentLang}`] || slide.subtitle_en || slide.subtitle}
                     </h2>
                     <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] leading-[1.1]">
                        {slide[`title_${currentLang}`] || slide.title_en || slide.title}
                     </h1>
                     <p className="text-base md:text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] mb-10 leading-relaxed max-w-2xl">
                        {slide[`description_${currentLang}`] || slide.description_en || slide.description}
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => { setLocation('/carbon-calculator'); window.scrollTo(0, 0); }} className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all">
                          <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
                          {t('home.calcButton', 'Calculate Carbon Footprint')}
                        </Button>
                        <Button className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-10 py-6 rounded-md shadow-md flex items-center justify-center" onClick={() => setLocation('/solutions')}>
                          {t('home.solutionsButton', 'Our Solutions')}
                        </Button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {pageData.heroSlides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 transition-all duration-500 rounded-full shadow-md ${idx === currentSlide ? 'w-10 bg-[#76FF03]' : 'w-3 bg-white/70 hover:bg-white'}`} />
            ))}
          </div>

          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/20 hover:bg-black/40 transition-colors hidden md:block"><ChevronLeft size={32} /></button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/20 hover:bg-black/40 transition-colors hidden md:block"><ChevronRight size={32} /></button>
        </section>
      )}

      {/* Trusted By Section */}
      <section className="py-16 bg-white border-b border-gray-100 relative">
        <div className="container px-4 sm:px-8 lg:px-12">
          <h3 className="text-2xl font-bold text-[#1B5E20] mb-10 text-center lg:text-left">
            {t('home.trustedBrands', 'Trusted by Global Brands & International Organizations')}
          </h3>
          <div className="flex items-center justify-between gap-2 md:gap-6 relative">
             <button onClick={prevPartnerPage} className="p-3 text-gray-400 hover:text-[#1B5E20] z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"><ChevronLeft size={24} /></button>
             <div className="overflow-hidden w-full px-2">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${partnerPageIndex * 100}%)` }}>
                   {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <div key={pageIndex} className="w-full flex-shrink-0">
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {partners.slice(pageIndex * partnersPerPage, (pageIndex + 1) * partnersPerPage).map((partnerNum) => (
                                <div key={partnerNum} className="h-24 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow p-4">
                                  <span className="text-gray-400 text-sm font-bold">Partner {partnerNum}</span>
                                </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             <button onClick={nextPartnerPage} className="p-3 text-gray-400 hover:text-[#1B5E20] z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"><ChevronRight size={24} /></button>
          </div>
          <div className="flex items-center justify-between mt-8 relative">
             <div className="w-8"></div> 
             <div className="flex gap-2 justify-center absolute left-1/2 -translate-x-1/2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button key={idx} onClick={() => setPartnerPageIndex(idx)} className={`h-2 rounded-full transition-all ${partnerPageIndex === idx ? 'w-8 bg-[#1B5E20]' : 'w-2 bg-gray-300'}`} />
                ))}
             </div>
             <div className="text-sm font-medium text-gray-500">{partnerPageIndex + 1} / {totalPages}</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {pageData.testimonials.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-[#F8F9F7] -skew-x-12 origin-top-left -z-10" />
          <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 pr-8">
                   <h2 className="text-4xl font-bold text-[#1B5E20] mb-6 leading-tight">
                     {t('home.testimonialsTitle', 'What Our Clients Say Behind, We Deliver Professional')}
                   </h2>
                   <p className="text-gray-600 mb-8 text-lg">
                     {t('home.testimonialsDesc', 'Hear directly from industry leaders about how our solutions help them achieve sustainability goals.')}
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
                               {pageData.testimonials[testimonialIndex][`quote_${currentLang}`] || pageData.testimonials[testimonialIndex].quote_en || pageData.testimonials[testimonialIndex].quote}
                             </p>
                          </div>
                          <div className="flex items-center gap-4 border-t border-white/20 pt-6">
                             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10">
                                {pageData.testimonials[testimonialIndex].imagePreview && (
                                  <img src={pageData.testimonials[testimonialIndex].imagePreview} alt={pageData.testimonials[testimonialIndex].author} className="w-full h-full object-cover" />
                                )}
                             </div>
                             <div>
                               <h4 className="font-bold text-[#76FF03] text-lg">{pageData.testimonials[testimonialIndex].author}</h4>
                               {pageData.testimonials[testimonialIndex].organization && (
                                 <p className="text-white/70 text-sm">{pageData.testimonials[testimonialIndex].organization}</p>
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

      {/* Services Grid */}
      <section className="py-24 bg-[#1B5E20]">
        <div className="container px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-[#76FF03] mb-12">
            {t('home.servicesTitle', 'Comprehensive Waste & ESG Services')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t('nav.wasteManagement', 'Waste Management Solutions'), img: service1, desc: t('home.service1Desc', 'RecyGlo offers comprehensive B2B waste management solutions...'), link: '/solutions/waste-management' },
              { title: t('home.service2', 'Waste Auditing'), img: service2, desc: t('home.service2Desc', 'RecyGlo provides comprehensive waste auditing services...'), link: '/solutions/waste-auditing' },
              { title: t('home.service3', 'Reporting and Compliance'), img: service3, desc: t('home.service3Desc', 'RecyGlo provides comprehensive reporting and compliance services...'), link: '/solutions/reporting' },
              { title: t('home.service4', 'Consulting and Training'), img: service4, desc: t('home.service4Desc', 'RecyGlo provides expert sustainability consulting and training...'), link: '/solutions/consulting' },
              { title: t('home.service5', 'ESG Data Analytics'), img: service5, desc: t('home.service5Desc', 'RecyGlo provides advanced ESG data analytics services...'), link: '/solutions/esg-data-analytics' },
              { title: t('home.service6', 'Circular Economy'), img: service6, desc: t('home.service6Desc', 'RecyGlo leads impactful Circular Economy projects to help businesses...'), link: '/solutions/circular-economy' }
            ].map((service, idx) => (
               <Card key={idx} onClick={() => { setLocation(service.link); window.scrollTo(0, 0); }} className="overflow-hidden border-none rounded-xl group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="h-48 overflow-hidden relative">
                     <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <CardContent className="p-6 bg-white flex flex-col h-40">
                     <h3 className="text-xl font-bold text-[#1B5E20] mb-2">{service.title}</h3>
                     <p className="text-sm text-gray-500 line-clamp-2 flex-grow">{service.desc}</p>
                     <div className="flex justify-end mt-auto">
                        <ArrowRight className="text-[#E2552B] group-hover:translate-x-2 transition-transform" />
                     </div>
                  </CardContent>
               </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      {pageData.values.length > 0 && (
        <section className="py-24 bg-[#F8F9F7]">
          <div className="container px-4 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-[#1B5E20] mb-12">{t('home.valuesTitle', 'Our Values')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageData.values.map((val: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                   <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-200 overflow-hidden p-3">
                      {val.iconPreview && <img src={val.iconPreview} alt={val.title} className="w-full h-full object-contain" />}
                   </div>
                   <h4 className="font-bold text-[#1B5E20] mb-3">{val[`title_${currentLang}`] || val.title_en || val.title}</h4>
                   <p className="text-sm text-gray-500">{val[`desc_${currentLang}`] || val.desc_en || val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Strategic Vision Overlay Section */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 z-0 opacity-60" style={{ backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/testimonial-bg-a4TBoBLbxws7biQWxPfE9Q.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
           <h2 className="text-3xl font-bold text-[#76FF03] mb-12">{t('home.visionTitle', 'Our Strategic Vision for a Sustainable Asia-Pacific')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1B5E20]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white">
                 <h3 className="text-2xl font-bold mb-4">{t('home.mission', 'Our Mission')}</h3>
                 <p className="text-white/80 leading-relaxed text-sm">{pageData.visionData[`mission_${currentLang}`] || pageData.visionData.mission_en || pageData.visionData.mission}</p>
              </div>
              <div className="bg-[#1B5E20]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white">
                 <h3 className="text-2xl font-bold mb-4">{t('home.vision', 'Our Vision')}</h3>
                 <p className="text-white/80 leading-relaxed text-sm">{pageData.visionData[`vision_${currentLang}`] || pageData.visionData.vision_en || pageData.visionData.vision}</p>
              </div>
              <div className="bg-[#1B5E20]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white">
                 <h3 className="text-2xl font-bold mb-4">{t('home.goal', 'Our Goal')}</h3>
                 <p className="text-white/80 leading-relaxed text-sm whitespace-pre-line">{pageData.visionData[`goal_${currentLang}`] || pageData.visionData.goal_en || pageData.visionData.goal}</p>
              </div>
           </div>
        </div>
      </section>

      {/* Impact in Action Masonry-like Grid */}
      {pageData.galleryImages.length > 4 && (
        <section className="py-24 bg-white">
          <div className="container px-4 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-[#1B5E20] mb-12">{t('home.impactTitle', 'Impact in Action')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
               <div className="flex flex-col gap-6 h-full">
                  <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}>
                     <img src={getGalleryImg(0)} className="w-full h-full object-cover" alt="Impact" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white font-bold tracking-wider">RecyGlo Team Thailand</span>
                     </div>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(1); setIsGalleryOpen(true); }}>
                     <img src={getGalleryImg(1)} className="w-full h-full object-cover" alt="Impact" />
                  </div>
               </div>
               <div className="flex flex-col gap-6 h-full">
                  <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(2); setIsGalleryOpen(true); }}>
                     <img src={getGalleryImg(2)} className="w-full h-full object-cover" alt="Impact" />
                  </div>
                  <div className="grid grid-cols-2 gap-6 h-1/2">
                     <div className="rounded-xl overflow-hidden bg-gray-200 h-full relative group cursor-pointer" onClick={() => { setGalleryIndex(3); setIsGalleryOpen(true); }}>
                       <img src={getGalleryImg(3)} className="w-full h-full object-cover" alt="Impact" />
                     </div>
                     <div className="rounded-xl overflow-hidden bg-gray-200 h-full relative group flex items-center justify-center cursor-pointer" onClick={() => { setGalleryIndex(4); setIsGalleryOpen(true); }}>
                       <img src={getGalleryImg(4)} className="absolute inset-0 w-full h-full object-cover blur-[2px] hover:blur-none transition-all" alt="Impact" />
                       <Button className="relative z-10 bg-white text-[#1B5E20] hover:bg-gray-100 font-bold pointer-events-none">{t('home.seeGallery', 'See Gallery')}</Button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* FULL SCREEN GALLERY OVERLAY */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-50 hidden sm:block" onClick={prevGalleryImage}><ChevronLeft size={48} /></button>
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative mx-4">
             <div className="flex items-center justify-between p-4 border-b border-gray-100">
               <div className="w-8" />
               <span className="font-bold text-sm text-gray-500">{galleryIndex + 1} / {pageData.galleryImages.length}</span>
               <button className="text-gray-400 hover:text-gray-800 transition-colors" onClick={() => setIsGalleryOpen(false)}><X size={24} /></button>
             </div>
             <div className="flex-grow p-4 overflow-hidden flex items-center justify-center bg-gray-50 relative">
               <button className="absolute left-2 bg-white/50 rounded-full p-1 sm:hidden z-10" onClick={prevGalleryImage}><ChevronLeft size={24} /></button>
               <img key={galleryIndex} src={getGalleryImg(galleryIndex)} className="max-w-full max-h-full object-contain animate-in fade-in duration-300" alt="Gallery Focus" />
               <button className="absolute right-2 bg-white/50 rounded-full p-1 sm:hidden z-10" onClick={nextGalleryImage}><ChevronRight size={24} /></button>
             </div>
             <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl overflow-x-auto">
               <div className="flex gap-2 justify-start sm:justify-center min-w-max">
                 {pageData.galleryImages.map((img: any, idx: number) => (
                   <button key={idx} onClick={() => setGalleryIndex(idx)} className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-all ${galleryIndex === idx ? 'border-[#E2552B] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                     <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                   </button>
                 ))}
               </div>
             </div>
          </div>
          <button className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-50 hidden sm:block" onClick={nextGalleryImage}><ChevronRight size={48} /></button>
        </div>
      )}

      {/* Blog Section */}
      <section className="py-24 bg-[#F8F9F7]">
         <div className="container px-4 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-12">
               <h2 className="text-3xl font-bold text-[#1B5E20]">{t('home.blogTitle', 'Blog')}</h2>
               <Button variant="link" className="text-[#E2552B] font-bold p-0 hidden sm:flex" onClick={() => { setLocation('/articles'); window.scrollTo(0, 0); }}>{t('home.seeAll', 'See All >')}</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {blogPosts.map((post, idx) => (
                 <div key={idx} onClick={() => { setLocation(`/articles/${post.id}`); window.scrollTo(0, 0); }} className="group cursor-pointer flex flex-col">
                    <div className="rounded-2xl overflow-hidden mb-5 h-[200px] relative shrink-0">
                       <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                    </div>
                    <h3 className="font-bold text-lg text-[#1B5E20] mb-3 line-clamp-2 group-hover:text-[#2E7D32] transition-colors leading-snug">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="border border-gray-300 rounded-full px-3 py-1 text-xs font-medium text-gray-600 bg-white">{tag}</span>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-4 flex-grow leading-relaxed">{post.excerpt}</p>
                    <div className="text-gray-400 text-xs mb-4">{post.date}</div>
                    <span className="text-[#E2552B] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">{t('home.readMore', 'Read More')} <ArrowRight size={14} /></span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}