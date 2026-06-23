import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Quote, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter'; 
import { useTranslation } from 'react-i18next';

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
    galleryImages: [],
    partners: [],
    servicesHeader: { title: "", subtitle: "" }, 
    featuredServices: [],
    platformsHeader: { title: "", subtitle: "" },
    digitalPlatforms: [],
    // NEW DYNAMIC HEADERS FOR ALL SECTIONS
    partnersHeader: { title: "", description: "" },
    testimonialsHeader: { title: "", description: "" },
    valuesHeader: { title: "", description: "" },
    visionHeader: { title: "", description: "" },
    galleryHeader: { title: "", description: "" },
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
          galleryImages: data.galleryImages ? data.galleryImages.map((img: any) => img.preview) : [],
          partners: data.partners || [],
          servicesHeader: data.servicesHeader || { title: "", subtitle: "" },
          featuredServices: data.featuredServices || [],
          platformsHeader: data.platformsHeader || { title: "", subtitle: "" },
          digitalPlatforms: data.digitalPlatforms || [],
          // Map the new headers
          partnersHeader: data.partnersHeader || { title: "", description: "" },
          testimonialsHeader: data.testimonialsHeader || { title: "", description: "" },
          valuesHeader: data.valuesHeader || { title: "", description: "" },
          visionHeader: data.visionHeader || { title: "", description: "" },
          galleryHeader: data.galleryHeader || { title: "", description: "" },
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

  const blogPosts = [
    { id: 1, title: "RecyGlo Publishes Report on Thailand's Battle With Climate Change", image: blog1, tags: ["Sustainability"], excerpt: "In July 2024, RecyGlo published a report on Thailand’s battle with climate change...", date: "11 October 2024" },
    { id: 2, title: "Thailand's Sustainable Future: The Significance of Renewable Energy", image: blog2, tags: ["Circular Economy", "News", "Sustainability"], excerpt: "Thailand’s road to sustainability requires a robust strategy to reach its goal by 2030...", date: "11 October 2024" },
    { id: 3, title: "Understanding the importance of circular economy in Thailand", image: blog3, tags: ["Circular Economy"], excerpt: "The “Take-Make-Waste” system normally endorsed by Thailand’s linear economy has been reprimanded...", date: "11 October 2024" }
  ];

  // --- FEATURED SERVICES FALLBACK ---
  const displayServices = pageData.featuredServices.length > 0 
    ? pageData.featuredServices 
    : [
        { title: t('nav.wasteManagement', 'Waste Management Solutions'), imagePreview: service1, desc: t('home.service1Desc', 'RecyGlo offers comprehensive B2B waste management solutions...'), link: '/solutions/waste-management' },
        { title: t('home.service2', 'Waste Auditing'), imagePreview: service2, desc: t('home.service2Desc', 'RecyGlo provides comprehensive waste auditing services...'), link: '/solutions/waste-auditing' },
        { title: t('home.service3', 'Reporting and Compliance'), imagePreview: service3, desc: t('home.service3Desc', 'RecyGlo provides comprehensive reporting and compliance services...'), link: '/solutions/reporting' },
        { title: t('home.service4', 'Consulting and Training'), imagePreview: service4, desc: t('home.service4Desc', 'RecyGlo provides expert sustainability consulting and training...'), link: '/solutions/consulting' },
        { title: t('home.service5', 'ESG Data Analytics'), imagePreview: service5, desc: t('home.service5Desc', 'RecyGlo provides advanced ESG data analytics services...'), link: '/solutions/esg-data-analytics' },
        { title: t('home.service6', 'Circular Economy'), imagePreview: service6, desc: t('home.service6Desc', 'RecyGlo leads impactful Circular Economy projects to help businesses...'), link: '/solutions/circular-economy' }
      ];

 // --- DIGITAL PLATFORMS FALLBACK ---
  const displayPlatforms = pageData.digitalPlatforms.length > 0
    ? pageData.digitalPlatforms
    : [
        { title: t('nav.carbonAccounting', 'Carbon Accounting'), desc: t('nav.carbonDesc', 'Enterprise carbon footprint tracking and accounting platform.'), link: 'https://sanaterra.co', imagePreview: 'https://placehold.co/800x450/e2e8f0/64748b?text=SanaTerra+Platform' },
        { title: t('nav.wasteManagement', 'Waste Management'), desc: t('nav.wasteDesc', 'Manage your waste operations and compliance workflows.'), link: 'https://app.recyglo.net', imagePreview: 'https://placehold.co/800x450/e2e8f0/64748b?text=RecyGlo+App' },
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
                        <Button 
                          onClick={() => { 
                            const link = slide.button1Link || '/carbon-calculator';
                            if (link.startsWith('http')) window.open(link, '_blank');
                            else { setLocation(link); window.scrollTo(0, 0); }
                          }} 
                          className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all"
                        >
                          <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
                          {slide.button1Text || t('home.calcButton', 'Calculate Carbon Footprint')}
                        </Button>
                        <Button 
                          className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-10 py-6 rounded-md shadow-md flex items-center justify-center" 
                          onClick={() => { 
                            const link = slide.button2Link || '/solutions';
                            if (link.startsWith('http')) window.open(link, '_blank');
                            else { setLocation(link); window.scrollTo(0, 0); }
                          }}
                        >
                          {slide.button2Text || t('home.solutionsButton', 'Our Solutions')}
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
      {partners.length > 0 && (
        <section className="py-16 bg-white border-b border-gray-100 relative">
          <div className="container px-4 sm:px-8 lg:px-12">
            <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 text-center lg:text-left">
              {pageData.partnersHeader?.title || t('home.trustedBrands', 'Trusted by Global Brands & International Organizations')}
            </h3>
            {pageData.partnersHeader?.description && (
              <p className="text-gray-600 mb-10 text-center lg:text-left">{pageData.partnersHeader.description}</p>
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
                                    {partner.imagePreview ? (
                                      <img src={partner.imagePreview} alt="Partner Logo" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    ) : (
                                      <span className="text-gray-400 text-sm font-bold">Logo Placeholder</span>
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

      {/* Testimonials Section */}
      {pageData.testimonials.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-[#F8F9F7] -skew-x-12 origin-top-left -z-10" />
          <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 pr-8">
                   <h2 className="text-4xl font-bold text-[#1B5E20] mb-6 leading-tight">
                     {pageData.testimonialsHeader?.title || t('home.testimonialsTitle', 'What Our Clients Say Behind, We Deliver Professional')}
                   </h2>
                   <p className="text-gray-600 mb-8 text-lg">
                     {pageData.testimonialsHeader?.description || t('home.testimonialsDesc', 'Hear directly from industry leaders about how our solutions help them achieve sustainability goals.')}
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
      <section className="py-24 bg-[#F8F9F7]">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-3 block">
              {pageData.servicesHeader?.subtitle || 'Services'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B5E20] leading-tight">
              {pageData.servicesHeader?.title || 'Integrated Sustainability Services for Business'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayServices.map((service: any, idx: number) => {
               const serviceTitle = service[`title_${currentLang}`] || service.title_en || service.title;
               const serviceDesc = service[`desc_${currentLang}`] || service.desc_en || service.desc;
               
               return (
                 <Card 
                   key={idx} 
                   onClick={() => { setLocation(service.link || '/solutions'); window.scrollTo(0, 0); }} 
                   className="overflow-hidden border border-gray-300 rounded-xl group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-row h-full items-stretch"
                 >
                    <div className="w-2/5 sm:w-1/3 relative shrink-0 aspect-square sm:aspect-auto">
                       <img 
                         src={service.imagePreview || service.img} 
                         alt={serviceTitle} 
                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                       />
                       <div className="absolute inset-0 bg-[#1B5E20]/0 group-hover:bg-[#1B5E20]/10 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow justify-between w-3/5 sm:w-2/3">
                       <div>
                         <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#1B5E20] transition-colors leading-tight">
                           {serviceTitle}
                         </h3>
                         <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                           {serviceDesc}
                         </p>
                       </div>
                       <div className="flex items-center justify-end text-gray-900 font-medium text-sm mt-4 group-hover:text-[#E2552B] transition-colors">
                          Explore {serviceTitle}
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                       </div>
                    </CardContent>
                 </Card>
               );
            })}
          </div>
        </div>
      </section>

      {/* DIGITAL PLATFORMS SECTION */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-[#E2552B] font-bold tracking-wider uppercase text-sm mb-3 block">
              {pageData.platformsHeader?.subtitle || t('home.platformsSubtitle', 'Technology')}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B5E20] leading-tight">
              {pageData.platformsHeader?.title || t('home.platformsTitle', 'Digital Platforms')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {displayPlatforms.map((plat: any, idx: number) => {
              const platTitle = plat[`title_${currentLang}`] || plat.title_en || plat.title;
              const platDesc = plat[`desc_${currentLang}`] || plat.desc_en || plat.desc;

              return (
                <Card 
                  key={idx}
                  onClick={() => window.open(plat.link || '#', '_blank', 'noopener,noreferrer')} 
                  className="overflow-hidden border border-gray-300 rounded-xl group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 bg-[#F8F9F7] flex flex-col h-full"
                >
                  <div className="w-full relative shrink-0 aspect-[16/9] bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={plat.imagePreview} 
                      alt={platTitle} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-[#1B5E20]/0 group-hover:bg-[#1B5E20]/10 transition-colors duration-300" />
                  </div>
                  
                  <CardContent className="p-8 flex flex-col flex-grow bg-white">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1B5E20] transition-colors leading-tight">
                      {platTitle}
                    </h3>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed flex-grow">
                      {platDesc}
                    </p>
                    
                    <div className="mt-auto flex justify-end">
                      <Button 
                        variant="outline"
                        className="border-2 border-[#1B5E20] text-[#1B5E20] bg-transparent hover:bg-[#1B5E20] hover:text-white transition-all font-bold px-5 py-5 rounded-md flex items-center gap-2 group-hover:bg-[#1B5E20] group-hover:text-white"
                      >
                        {t('home.explorePlatform', 'Explore Platform')}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      {pageData.values.length > 0 && (
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="container px-4 sm:px-8 lg:px-12">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1B5E20] mb-4">
                {pageData.valuesHeader?.title || t('home.valuesTitle', 'Our Values')}
              </h2>
              {pageData.valuesHeader?.description && (
                <p className="text-gray-600 max-w-3xl">{pageData.valuesHeader.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageData.values.map((val: any, i: number) => (
                <div key={i} className="bg-[#F8F9F7] p-8 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                   <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border border-gray-200 overflow-hidden p-3 shadow-sm">
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
           <div className="mb-12">
             <h2 className="text-3xl font-bold text-[#76FF03] mb-4">
               {pageData.visionHeader?.title || t('home.visionTitle', 'Our Strategic Vision for a Sustainable Asia-Pacific')}
             </h2>
             {pageData.visionHeader?.description && (
               <p className="text-white/80 max-w-2xl">{pageData.visionHeader.description}</p>
             )}
           </div>

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
        <section className="py-24 bg-[#F8F9F7]">
          <div className="container px-4 sm:px-8 lg:px-12">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1B5E20] mb-4">
                {pageData.galleryHeader?.title || t('home.impactGalleryTitle', 'Impact in Action')}
              </h2>
              {pageData.galleryHeader?.description && (
                <p className="text-gray-600 max-w-3xl">{pageData.galleryHeader.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
               <div className="flex flex-col gap-6 h-full">
                  <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}>
                     <img src={getGalleryImg(0)} className="w-full h-full object-cover" alt="Impact" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white font-bold tracking-wider">RecyGlo Team</span>
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
      <section className="py-24 bg-white">
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