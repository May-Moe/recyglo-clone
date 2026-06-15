import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter'; 

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export default function About() {
  const [, setLocation] = useLocation();

  // --- LIVE DATABASE STATE ---
  const [pageData, setPageData] = useState({
    heroData: { subtitle: "", title: "", description: "", imagePreview: "" },
    introData: { title: "", description: "", address: "", email: "", phone: "", lineId: "", imagePreview: "" },
    storyData: { title: "", paragraph1: "", paragraph2: "", paragraph3: "", ceoName: "", ceoTitle: "", ceoImagePreview: "" },
    teamMembers: [] as any[],
    awards: [] as any[],
    partners: [] as any[] // NEW
  });

  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH LIVE DATA FROM FIREBASE ---
  useEffect(() => {
    const docRef = doc(db, "website_content", "about_page");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData({
          heroData: data.heroData || { subtitle: "", title: "", description: "", imagePreview: "" },
          introData: data.introData || { title: "", description: "", address: "", email: "", phone: "", lineId: "", imagePreview: "" },
          storyData: data.storyData || { title: "", paragraph1: "", paragraph2: "", paragraph3: "", ceoName: "", ceoTitle: "", ceoImagePreview: "" },
          teamMembers: data.teamMembers || [],
          awards: data.awards || [],
          partners: data.partners || [] // NEW
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Awards Carousel Logic
  const [awardIndex, setAwardIndex] = useState(0);
  const awardsPerPage = 4;
  const maxIndex = Math.max(0, pageData.awards.length - awardsPerPage);

  const nextAward = () => setAwardIndex(prev => Math.min(prev + 1, maxIndex));
  const prevAward = () => setAwardIndex(prev => Math.max(prev - 1, 0));

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9F7]">Loading content...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80 bg-black/30" 
          style={pageData.heroData.imagePreview ? {
            backgroundImage: `url(${pageData.heroData.imagePreview})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-lg md:text-xl font-medium mb-3 text-gray-800 leading-snug">
               {pageData.heroData.subtitle}
             </h2>
             <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1B5E20] leading-[1.1]">
               {pageData.heroData.title}
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
               {pageData.heroData.description}
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => {
                    setLocation('/carbon-calculator');
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all"
                >
                  <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
                  Calculate Carbon Footprint
                </Button>
                <Button 
                  className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md"
                  onClick={() => setLocation('/solutions')}
                >
                  Our Solutions
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCING SECTION */}
      <section id="introducing" className="py-24 bg-white scroll-mt-24">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">About Us</span>
               <h2 className="text-4xl md:text-5xl font-bold text-[#1B5E20] mb-8 leading-tight">
                 {pageData.introData.title}
               </h2>
               
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h3>
               <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base whitespace-pre-line">
                 {pageData.introData.description}
               </p>
               
               <h4 className="font-bold text-lg text-gray-900 mb-4">Our Coverage</h4>
               <ul className="grid grid-cols-2 gap-y-3 mb-10 text-sm text-gray-700">
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500"></span> Myanmar</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Thailand</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Malaysia</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-600"></span> Singapore</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500"></span> Vietnam</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-800"></span> South Korea</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-700"></span> Indonesia</li>
               </ul>

               <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-6 rounded-xl border border-gray-100">
                 <p className="font-bold text-gray-900 mb-2">Get in touch:</p>
                 <p>{pageData.introData.address}</p>
                 <p>Email: {pageData.introData.email}</p>
                 <p>Phone: {pageData.introData.phone}</p>
                 <p>Line Official: {pageData.introData.lineId}</p>
               </div>
            </div>

            {/* Right Content (Image) */}
            <div className="relative">
               <div className="absolute -inset-4 bg-[#F8F9F7] rounded-3xl -z-10 transform rotate-3"></div>
               {pageData.introData.imagePreview ? (
                 <img 
                   src={pageData.introData.imagePreview} 
                   alt="RecyGlo Team" 
                   className="rounded-2xl w-full object-cover shadow-xl border-4 border-white aspect-[4/3]" 
                 />
               ) : (
                 <div className="rounded-2xl w-full bg-gray-200 shadow-xl border-4 border-white aspect-[4/3] flex items-center justify-center text-gray-400">Image not uploaded</div>
               )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="py-24 bg-[#F8F9F7] border-t border-gray-100">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
             
             {/* CEO Photo with Organic Shape */}
             <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative mb-6">
                   <div 
                     className="absolute inset-0 bg-[#1B5E20] translate-x-4 -translate-y-4 -z-10 transition-transform hover:translate-x-6 hover:-translate-y-6 duration-500" 
                     style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
                   ></div>
                   {pageData.storyData.ceoImagePreview ? (
                     <img 
                       src={pageData.storyData.ceoImagePreview} 
                       alt={pageData.storyData.ceoName} 
                       className="w-56 h-56 rounded-full object-cover border-8 border-white shadow-md bg-white" 
                     />
                   ) : (
                     <div className="w-56 h-56 rounded-full border-8 border-white shadow-md bg-gray-200"></div>
                   )}
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-1">{pageData.storyData.ceoName}</h4>
                <p className="text-sm font-semibold text-[#E2552B] uppercase tracking-wide">{pageData.storyData.ceoTitle}</p>
             </div>
             
             {/* Story Text */}
             <div className="lg:col-span-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-8 relative">
                  <span className="text-[#76FF03] text-6xl font-serif absolute -top-4 -left-6 opacity-50">"</span>
                  {pageData.storyData.title}
                  <span className="text-[#76FF03] text-6xl font-serif absolute -top-4 -ml-2 opacity-50">"</span>
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  {pageData.storyData.paragraph1 && <p>{pageData.storyData.paragraph1}</p>}
                  {pageData.storyData.paragraph2 && <p>{pageData.storyData.paragraph2}</p>}
                  {pageData.storyData.paragraph3 && <p>{pageData.storyData.paragraph3}</p>}
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 4. MISSION / VISION / GOAL CARDS */}
      <section className="bg-[#F8F9F7] pb-24">
         <div className="container px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
               <div className="bg-[#173F26] text-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-[#76FF03]">Our Mission</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    At RecyGlo, our mission is to foster a more sustainable future through innovative waste, energy, and carbon management and ESG data analytics solutions. We are dedicated to assisting businesses in minimizing their environmental footprint.
                  </p>
               </div>
               <div className="bg-[#173F26] text-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-[#76FF03]">Our Vision</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    We aspire to be the leading provider of zero-waste and zero-carbon energy efficient management solutions, paired with a comprehensive ESG data analytics platform, across the Asia Pacific region. We are committed to supporting businesses in achieving their sustainability targets.
                  </p>
               </div>
               <div className="bg-[#173F26] text-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-[#76FF03]">Our Goal</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Our goal is to implement ESG-driven waste management systems throughout the Asia Pacific, cultivating a robust waste management and recycling culture. Our focus areas include Sustainability, Circular Economy, Waste and Energy Management, and Green Financing.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. OUR TEAM */}
      {pageData.teamMembers.length > 0 && (
        <section id="team" className="py-24 bg-white border-t border-gray-100 scroll-mt-24">
           <div className="container px-4 sm:px-8 lg:px-12">
              <h2 className="text-4xl font-bold text-[#1B5E20] mb-20 text-center">Our Team</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-20 gap-x-8 max-w-5xl mx-auto">
                 {pageData.teamMembers.map((member: any, idx: number) => (
                    <div key={member.id || idx} className="flex flex-col items-center text-center group cursor-pointer">
                       <div className="relative mb-6">
                         <div 
                           className="absolute inset-0 bg-[#1B5E20] translate-x-3 -translate-y-3 -z-10 opacity-10 group-hover:opacity-100 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-300" 
                           style={{ borderRadius: idx % 2 === 0 ? '60% 40% 30% 70% / 60% 30% 70% 40%' : '40% 60% 70% 30% / 40% 50% 60% 50%' }}
                         ></div>
                         {member.imagePreview ? (
                           <img 
                             src={member.imagePreview} 
                             alt={member.name}
                             className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-md group-hover:shadow-xl transition-shadow bg-white" 
                           />
                         ) : (
                           <div className="w-44 h-44 rounded-full border-4 border-white shadow-md bg-gray-200"></div>
                         )}
                       </div>
                       <h4 className="font-bold text-xl text-gray-900 mb-1">{member.name}</h4>
                       <p className="text-sm font-medium text-gray-500">{member.title}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* 6. SEE OUR IMPACT (YOUTUBE VIDEO SECTION) */}
      <section id="impact" className="py-24 bg-[#F8F9F7] scroll-mt-24">
        <div className="container px-4 sm:px-8 lg:px-12 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-12">
             See Our Impact: Pioneering Sustainability In Action
           </h2>
           <div className="w-full max-w-5xl mx-auto rounded-3xl aspect-video shadow-2xl flex items-center justify-center relative overflow-hidden bg-black">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/OEwDwHcl8kY?si=hMttULggZ-bkTeTq" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      </section>

      {/* 7. AWARDS & RECOGNITION CAROUSEL */}
      {pageData.awards.length > 0 && (
        <section id="awards" className="py-24 bg-white border-t border-gray-100 scroll-mt-24">
          <div className="container px-4 sm:px-8 lg:px-12">
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-12 text-center md:text-left">
                Award-Winning Excellence & Global Recognition
             </h2>
             
             <div className="relative">
                <button 
                  onClick={prevAward} 
                  disabled={awardIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md disabled:opacity-30 z-10"
                >
                  <ChevronLeft size={24} className="text-gray-600" />
                </button>

                <div className="overflow-hidden px-2">
                   <div 
                     className="flex transition-transform duration-500 ease-in-out gap-6"
                     style={{ transform: `translateX(calc(-${(awardIndex * 100) / awardsPerPage}% - ${awardIndex * 1.5}rem))` }}
                   >
                      {pageData.awards.map((award: any, i: number) => (
                        <div key={award.id || i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] flex-shrink-0">
                           <div className="bg-white border border-gray-100 rounded-2xl p-6 h-48 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                              {award.imagePreview ? (
                                <img src={award.imagePreview} alt={award.title} className="max-w-full max-h-full object-contain z-10" />
                              ) : (
                                <div className="text-center text-gray-400 z-10">
                                   <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3"></div>
                                   <p className="font-bold text-sm text-gray-800">{award.title}</p>
                                   <p className="text-xs">{award.year}</p>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={nextAward} 
                  disabled={awardIndex >= maxIndex}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md disabled:opacity-30 z-10"
                >
                  <ChevronRight size={24} className="text-gray-600" />
                </button>
             </div>
          </div>
        </section>
      )}

      {/* 8. STRATEGIC PARTNERSHIPS (DYNAMIC) */}
      {pageData.partners.length > 0 && (
        <section id="partnerships" className="py-24 bg-[#F8F9F7] border-t border-gray-100 scroll-mt-24">
          <div className="container px-4 sm:px-8 lg:px-12 text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-12">
               Strategic Partnerships & Industry Memberships
             </h2>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {pageData.partners.map((partner: any, idx: number) => (
                  <div key={partner.id || idx} className="h-20 w-40 flex items-center justify-center">
                    {partner.imagePreview ? (
                      <img 
                        src={partner.imagePreview} 
                        alt="Partner Logo" 
                        className="max-w-full max-h-full object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity" 
                      />
                    ) : (
                      <div className="h-16 w-32 bg-gray-300 rounded-md opacity-60"></div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}