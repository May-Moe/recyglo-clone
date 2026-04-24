import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Quote, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter'; 

// --- ASSET IMPORTS ---
import aboutHero from '@/assets/images/about-hero.jpg';
import circularDiagram from '@/assets/images/cycle.png';
import service1 from '@/assets/images/w1.webp';
import service2 from '@/assets/images/w2.webp';
import service3 from '@/assets/images/w3.webp';
import service4 from '@/assets/images/w4.webp';
import service5 from '@/assets/images/w5.webp';
import service6 from '@/assets/images/w6.webp';

// --- ADD CLIENT IMAGE IMPORTS HERE ---
import client1 from '@/assets/images/client1.jpeg';
import client2 from '@/assets/images/client2.jpg';
import client3 from '@/assets/images/client3.png';
import client4 from '@/assets/images/client4.png';

// --- NEW: VALUE IMAGE IMPORTS HERE ---
import value1 from '@/assets/images/value1.svg';
import value2 from '@/assets/images/value2.svg';
import value3 from '@/assets/images/value3.svg';
import value4 from '@/assets/images/value4.svg';
import value5 from '@/assets/images/value5.svg';
import value6 from '@/assets/images/value6.svg';
import value7 from '@/assets/images/value7.svg';
import value8 from '@/assets/images/value8.svg';

// --- NEW: GALLERY IMAGE IMPORTS HERE ---
import gallery1 from '@/assets/images/gallery1.jpeg';
import gallery2 from '@/assets/images/gallery2.jpg';
import gallery3 from '@/assets/images/gallery3.jpeg';
import gallery4 from '@/assets/images/gallery4.jpeg';
import gallery5 from '@/assets/images/gallery5.jpeg';
import gallery6 from '@/assets/images/gallery6.jpeg';
import gallery7 from '@/assets/images/gallery7.jpeg';
import gallery8 from '@/assets/images/gallery8.jpeg';

// --- NEW: BLOG IMAGE IMPORTS HERE ---
import blog1 from '@/assets/images/blog1.png';
import blog2 from '@/assets/images/blog2.png';
import blog3 from '@/assets/images/blog3.png';

export default function Home() {
  const [, setLocation] = useLocation();

  // Logic for the "Trusted By" slider (Grid Paging)
  const partners = Array.from({ length: 30 }, (_, i) => i + 1);
  const partnersPerPage = 15; 
  const totalPages = Math.ceil(partners.length / partnersPerPage);
  
  const [partnerPageIndex, setPartnerPageIndex] = useState(0);
  
  const nextPartnerPage = () => {
    setPartnerPageIndex((prev) => (prev + 1) % totalPages);
  };
  
  const prevPartnerPage = () => {
    setPartnerPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Logic for the Testimonials slider
  const testimonialsData = [
    {
      quote: "I was really impressed by the team’s passion and expertise. They weren’t just sharing knowledge; they genuinely cared about helping businesses and individuals make real, impactful changes.",
      author: "Ms.Janejira Anna Sugrivaka ",
      organization: "Partner",
      img: client1 
    },
    {
      quote: "This training was highly beneficial for all participants. We gained valuable knowledge and fresh perspectives from all keynote speakers. The information shared helped us identify new opportunities, strategies, and ways to move forward in the sustainable business landscape.",
      author: "Mr.Nitiwat Bangsen (Pom)",
      organization: "Participant",
      img: client2 
    },
    {
      quote: "The French Embassy commends RecyGlo for their on-time waste collection services and excellent communication with us. They're reliable and easy to work with, making our waste management hassle-free!",
      author: "Mr. Mickeal Paolucci",
      organization: "French Embassy",
      img: client3 
    },
    {
      quote: "I've learned more about recycling and waste sorting. In waste-heavy businesses, we must start reducing our own waste and make changes to help collectors.",
      author: "Trattoria Delina Employee",
      organization: "Trattoria Delina",
      img: client4 
    },
    {
      quote: "Starting with little knowledge, I now have a better understanding of how to work effectively in the kitchen, which plays a crucial role in managing food waste.",
      author: "Trattoria Delina Employee",
      organization: "Trattoria Delina",
      img: client4 
    }
  ];
  
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  
  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonialsData.length);
  };
  
  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- Gallery Logic ---
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const galleryImages = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
    gallery7,
    gallery8
  ];

  const nextGalleryImage = () => {
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevGalleryImage = () => {
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // --- Blog Post Data ---
  const blogPosts = [
    {
      id: 1,
      title: "RecyGlo Publishes Report on Thailand's Battle With Climate Change",
      image: blog1,
      tags: ["Sustainability"],
      excerpt: "In July 2024, RecyGlo published a report on Thailand’s battle with climate change that highlights about the significant challenges driven by the aftermath of climate change in Thailand. This report delves into how extreme levels of greenhouse gas emissions in Thailand have been a result of the growing population in Thailand with its rapid economic expansion. The report further highlights the urgent need for comprehensive mitigation and adaptation strategies.",
      date: "11 October 2024"
    },
    {
      id: 2,
      title: "Thailand's Sustainable Future: The Significance of Renewable Energy",
      image: blog2,
      tags: ["Circular Economy", "News", "Sustainability"],
      excerpt: "Thailand’s road to sustainability requires a robust strategy to reach its goal by 2030 and plan for a greener future ahead. The use of renewable energy hence is crucial in lowering carbon emissions, strengthing energy security, and ensuring a smooth transition to a circular economy with greener alternatives. The Thai government has a solid framework called the Power Development Plan (PDP) scheduled to be implemented for the period 2024 to 2037. According to this plan, the ideal target set covers that 30% of the total power generated in Thailand must be renewable energy by 2030. A swift adherence to this framework and target could guarantee better results for Thailand’s ambitious goal of reaching carbon neutrality by 2050 and a net-zero target by 2065.",
      date: "11 October 2024"
    },
    {
      id: 3,
      title: "Understanding the importance of circular economy in Thailand",
      image: blog3,
      tags: ["Circular Economy"],
      excerpt: "The “Take-Make-Waste” system normally endorsed by Thailand’s linear economy has been reprimanded recently due to its role in promoting climatic hazards. Under this production process, resources that are not utilized during the manufacturing period are discarded as waste and even after the product is manufactured, waste is produced from the packaging and eventually, the end of a product’s usable life signals its call to further become a waste. The Take-Make-Waste model has shown to be unsustainable as it has been exacerbating environmental and climate issues in today’s expanding economy of over-consumption where high waste generation and depletion of natural resources have significantly been contributing to climate change, and accelerating the scarcity of resources.",
      date: "11 October 2024"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url(${aboutHero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side Text & Buttons */}
            <div className="max-w-xl bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-lg md:text-xl font-medium mb-3 text-gray-800 leading-snug">
                Empowering businesses in Myanmar, Vietnam, Thailand, Malaysia, Singapore, and Korea with circular economy strategies and ISO-compliant reporting.
             </h2>
             <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1B5E20] leading-[1.1]">
                Welcome to RecyGlo
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                At RecyGlo, our mission is to foster a more sustainable future through innovative waste, energy, and carbon management and ESG data analytics solutions. We are dedicated to assisting businesses in minimizing their environmental footprint and reaching their sustainability objectives.
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

            {/* Circular Diagram Graphic */}
            <div className="hidden lg:flex justify-center items-center relative h-[500px]">
                <img 
                  src={circularDiagram} 
                  alt="Circular Process Diagram" 
                  className="w-full max-w-[500px] object-contain hover:scale-105 transition-transform duration-700" 
                />
            </div>
          </div>
        </div>
      </section>

      
      {/* Trusted By Section (Grid Slider) */}
      <section className="py-16 bg-white border-b border-gray-100 relative">
        <div className="container px-4 sm:px-8 lg:px-12">
          <h3 className="text-2xl font-bold text-[#1B5E20] mb-10 text-center lg:text-left">
            Trusted by Global Brands & International Organizations
          </h3>
          
          <div className="flex items-center justify-between gap-2 md:gap-6 relative">
             <button 
               onClick={prevPartnerPage} 
               className="p-3 text-gray-400 hover:text-[#1B5E20] z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"
               aria-label="Previous page"
             >
               <ChevronLeft size={24} />
             </button>
             
             <div className="overflow-hidden w-full px-2">
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${partnerPageIndex * 100}%)` }}
                >
                   {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <div key={pageIndex} className="w-full flex-shrink-0">
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {partners
                              .slice(pageIndex * partnersPerPage, (pageIndex + 1) * partnersPerPage)
                              .map((partnerNum) => (
                                <div key={partnerNum} className="h-24 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow p-4">
                                  <span className="text-gray-400 text-sm font-bold">Partner {partnerNum}</span>
                                </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <button 
               onClick={nextPartnerPage} 
               className="p-3 text-gray-400 hover:text-[#1B5E20] z-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0"
               aria-label="Next page"
             >
               <ChevronRight size={24} />
             </button>
          </div>
          
          <div className="flex items-center justify-between mt-8 relative">
             <div className="w-8"></div> 
             <div className="flex gap-2 justify-center absolute left-1/2 -translate-x-1/2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setPartnerPageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${partnerPageIndex === idx ? 'w-8 bg-[#1B5E20]' : 'w-2 bg-gray-300'}`} 
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
             </div>
             <div className="text-sm font-medium text-gray-500">
               {partnerPageIndex + 1} / {totalPages}
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-[#F8F9F7] -skew-x-12 origin-top-left -z-10" />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 pr-8">
                 <h2 className="text-4xl font-bold text-[#1B5E20] mb-6 leading-tight">
                   What Our Clients Say Behind, We Deliver Professional
                 </h2>
                 <p className="text-gray-600 mb-8 text-lg">
                   Hear directly from industry leaders about how our solutions help them achieve sustainability goals.
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
                    
                    <div key={testimonialIndex} className="animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="mb-8">
                         <span className="text-[#76FF03] text-6xl font-serif leading-none">"</span>
                         <p className="text-xl leading-relaxed relative z-10 font-medium">
                           {testimonialsData[testimonialIndex].quote}
                         </p>
                      </div>
                      <div className="flex items-center gap-4 border-t border-white/20 pt-6">
                         
                         {/* CLIENT IMAGE DISPLAY */}
                         <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10">
                            <img 
                              src={testimonialsData[testimonialIndex].img} 
                              alt={testimonialsData[testimonialIndex].author} 
                              className="w-full h-full object-cover" 
                            />
                         </div>

                         <div>
                           <h4 className="font-bold text-[#76FF03] text-lg">{testimonialsData[testimonialIndex].author}</h4>
                           {testimonialsData[testimonialIndex].organization && (
                             <p className="text-white/70 text-sm">{testimonialsData[testimonialIndex].organization}</p>
                           )}
                         </div>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex justify-end gap-2 mt-6">
                    <button onClick={prevTestimonial} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1B5E20] hover:text-white transition-colors">
                      <ChevronLeft size={20}/>
                    </button>
                    <button onClick={nextTestimonial} className="w-10 h-10 rounded-full border border-[#1B5E20] bg-[#1B5E20] text-white flex items-center justify-center hover:bg-[#2A4B38] transition-colors">
                      <ChevronRight size={20}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-[#1B5E20]">
        <div className="container px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-[#76FF03] mb-12">
            Comprehensive Waste & ESG Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Waste Management Solutions', 
                img: service1,
                desc: 'RecyGlo offers comprehensive B2B waste management solutions, specializing in general, hazardous, and e-waste disposal.',
                link: '/solutions/waste-management'
              },
              { 
                title: 'Waste Auditing', 
                img: service2,
                desc: 'RecyGlo provides comprehensive waste auditing services to help B2B facilities optimize waste management practices, identify cost reduction opportunities, and achieve Zero-Waste-to-Landfill goals.',
                link: '/solutions/waste-auditing'
              },
              { 
                title: 'Reporting and Compliance', 
                img: service3,
                desc: 'RecyGlo provides comprehensive reporting and compliance services to help businesses navigate environmental regulations. We deliver audit-ready sustainability reports and streamline ESG reporting, ensuring complete data transparency.',
                link: '/solutions/reporting'
              },
              { 
                title: 'Consulting and Training', 
                img: service4,
                desc: 'RecyGlo provides expert sustainability consulting and training services to help B2B organizations implement robust ESG strategies, optimize waste management, and achieve compliance with global environmental standards.',
                link: '/solutions/consulting'
              },
              { 
                title: 'ESG Data Analytics', 
                img: service5,
                desc: 'RecyGlo provides advanced ESG data analytics services to help businesses track and analyze Scope 1, 2, and 3 emissions. We transform environmental data into actionable insights, driving corporate sustainability and Net Zero goals.',
                link: '/solutions/esg-data-analytics'
              },
              { 
                title: 'Circular Economy', 
                img: service6,
                desc: 'RecyGlo leads impactful Circular Economy projects to help businesses implement closed-loop systems. Through plastic prevention and material reuse initiatives, we optimize resource efficiency and drive profitable zero-waste models.',
                link: '/solutions/circular-economy'
              }
            ].map((service, idx) => (
               <Card 
                 key={idx} 
                 onClick={() => {
                   setLocation(service.link);
                   window.scrollTo(0, 0); 
                 }}
                 className="overflow-hidden border-none rounded-xl group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
               >
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
      <section className="py-24 bg-[#F8F9F7]">
        <div className="container px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Environmental Stewardship',
                desc: 'Driving the transition to a Circular Economy by helping businesses conserve resources and achieve Zero-Waste targets.',
                icon: value1
              },
              {
                title: 'Tech-Driven Innovation',
                desc: 'Leveraging cutting-edge ESG data analytics and waste management software to provide smart, scalable solutions. ',
                icon: value2
              },
              {
                title: 'Integrity & Compliance',
                desc: 'Conducting business with absolute transparency, data privacy, and strict adherence to environmental regulations.',
                icon: value3
              },
              {
                title: 'Customer-Centric Focus',
                desc: 'Delivering tailored waste solutions that meet the specific operational needs of factories, hotels, and offices. ',
                icon: value4
              },
              {
                title: 'Strategic Collaboration',
                desc: 'Building strong ecosystems with partners and clients to create a lasting environmental impact across the supply chain. ',
                icon: value5
              },
              {
                title: 'Social Responsibility',
                desc: 'Going beyond business to create inclusive job opportunities and enhance community well-being through safe waste practices.',
                icon: value6
              },
              {
                title: 'Excellence/Quality commitment',
                desc: 'Pursuing continuous improvement and ISO-standard quality in every step of our collection and reporting process.',
                icon: value7
              },
              {
                title: 'Commitment to UN SDG Goals',
                desc: 'Aligning our strategies with UN Sustainable Development Goals (SDGs) to drive global sustainability and climate action. ',
                icon: value8
              }
            ].map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:shadow-md transition-shadow">
                 <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-200 overflow-hidden p-3">
                    <img src={val.icon} alt={val.title} className="w-full h-full object-contain" />
                 </div>
                 <h4 className="font-bold text-[#1B5E20] mb-3">{val.title}</h4>
                 <p className="text-sm text-gray-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Vision Overlay Section */}
      <section className="relative py-32 bg-gray-900">
        <div 
          className="absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/testimonial-bg-a4TBoBLbxws7biQWxPfE9Q.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
           <h2 className="text-3xl font-bold text-[#76FF03] mb-12">Our Strategic Vision for a Sustainable Asia-Pacific</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1B5E20]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white">
                 <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                 <p className="text-white/80 leading-relaxed text-sm">At RecyGlo, our mission is to foster a more sustainable future through innovative waste, energy, and carbon management and ESG data analytics solutions. We are dedicated to assisting businesses in minimizing their environmental footprint.</p>
              </div>
              <div className="bg-[#1B5E20]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white">
                 <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                 <p className="text-white/80 leading-relaxed text-sm">We aspire to be the leading provider of zero-waste and zero-carbon energy efficient management solutions, paired with a comprehensive ESG data analytics platform, across the Asia Pacific region. We are committed to supporting businesses in achieving their sustainability targets by offering services that include ESG data analytics, waste and energy management solutions, consulting, training, and ESG reporting and compliance.</p>
              </div>
              <div className="bg-[#1B5E20]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white">
                 <h3 className="text-2xl font-bold mb-4">Our Goal</h3>
                 <p className="text-white/80 leading-relaxed text-sm">Our goal is to implement ESG-driven waste management systems throughout the Asia Pacific, cultivating a robust waste management and recycling culture. Our focus areas include
                  • Sustainability
                  • Circular Economy and Smart City
                  • Waste and Energy Management
                  • Green Financing Facilitation
                  • Smart Agriculture
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Impact in Action Masonry-like Grid */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-12">Impact in Action</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
             <div className="flex flex-col gap-6 h-full">
                <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}>
                   <img src={galleryImages[0]} className="w-full h-full object-cover" alt="Impact" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-white font-bold tracking-wider">RecyGlo Team Thailand</span>
                   </div>
                </div>
                <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(1); setIsGalleryOpen(true); }}>
                   <img src={galleryImages[1]} className="w-full h-full object-cover" alt="Impact" />
                </div>
             </div>
             
             <div className="flex flex-col gap-6 h-full">
                <div className="rounded-xl overflow-hidden bg-gray-200 h-1/2 relative group cursor-pointer" onClick={() => { setGalleryIndex(2); setIsGalleryOpen(true); }}>
                   <img src={galleryImages[2]} className="w-full h-full object-cover" alt="Impact" />
                </div>
                <div className="grid grid-cols-2 gap-6 h-1/2">
                   <div className="rounded-xl overflow-hidden bg-gray-200 h-full relative group cursor-pointer" onClick={() => { setGalleryIndex(3); setIsGalleryOpen(true); }}>
                     <img src={galleryImages[3]} className="w-full h-full object-cover" alt="Impact" />
                   </div>
                   <div className="rounded-xl overflow-hidden bg-gray-200 h-full relative group flex items-center justify-center cursor-pointer" onClick={() => { setGalleryIndex(4); setIsGalleryOpen(true); }}>
                     <img src={galleryImages[4]} className="absolute inset-0 w-full h-full object-cover blur-[2px] hover:blur-none transition-all" alt="Impact" />
                     <Button className="relative z-10 bg-white text-[#1B5E20] hover:bg-gray-100 font-bold pointer-events-none">See Gallery</Button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FULL SCREEN GALLERY OVERLAY */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* External Left Arrow */}
          <button 
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-50 hidden sm:block" 
            onClick={prevGalleryImage}
          >
            <ChevronLeft size={48} />
          </button>

          {/* Main White Box Container */}
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative mx-4">
             {/* Header Section */}
             <div className="flex items-center justify-between p-4 border-b border-gray-100">
               <div className="w-8" /> {/* Spacer */}
               <span className="font-bold text-sm text-gray-500">
                 {galleryIndex + 1} / {galleryImages.length}
               </span>
               <button className="text-gray-400 hover:text-gray-800 transition-colors" onClick={() => setIsGalleryOpen(false)}>
                 <X size={24} />
               </button>
             </div>

             {/* Large Image Section */}
             <div className="flex-grow p-4 overflow-hidden flex items-center justify-center bg-gray-50 relative">
               {/* Mobile Arrows (inside the box) */}
               <button className="absolute left-2 bg-white/50 rounded-full p-1 sm:hidden z-10" onClick={prevGalleryImage}>
                 <ChevronLeft size={24} />
               </button>
               
               <img 
                 key={galleryIndex}
                 src={galleryImages[galleryIndex]} 
                 className="max-w-full max-h-full object-contain animate-in fade-in duration-300" 
                 alt="Gallery Focus" 
               />

               <button className="absolute right-2 bg-white/50 rounded-full p-1 sm:hidden z-10" onClick={nextGalleryImage}>
                 <ChevronRight size={24} />
               </button>
             </div>

             {/* Thumbnails Section */}
             <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl overflow-x-auto">
               <div className="flex gap-2 justify-start sm:justify-center min-w-max">
                 {galleryImages.map((img, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => setGalleryIndex(idx)} 
                     className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-all ${galleryIndex === idx ? 'border-[#E2552B] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                   >
                     <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                   </button>
                 ))}
               </div>
             </div>
          </div>

          {/* External Right Arrow */}
          <button 
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-50 hidden sm:block" 
            onClick={nextGalleryImage}
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}

      {/* Blog Section */}
      <section className="py-24 bg-[#F8F9F7]">
         <div className="container px-4 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-12">
               <h2 className="text-3xl font-bold text-[#1B5E20]">Blog</h2>
               <Button 
                 variant="link" 
                 className="text-[#E2552B] font-bold p-0 hidden sm:flex"
                 onClick={() => {
                   setLocation('/articles');
                   window.scrollTo(0, 0);
                 }}
               >
                 See All &gt;
               </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {blogPosts.map((post, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => {
                     setLocation(`/articles/${post.id}`); 
                     window.scrollTo(0, 0); 
                   }} 
                   className="group cursor-pointer flex flex-col"
                 >
                    {/* Image */}
                    <div className="rounded-2xl overflow-hidden mb-5 h-[200px] relative shrink-0">
                       <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-lg text-[#1B5E20] mb-3 line-clamp-2 group-hover:text-[#2E7D32] transition-colors leading-snug">
                       {post.title}
                    </h3>
                    
                    {/* Tags (Pill Badges) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="border border-gray-300 rounded-full px-3 py-1 text-xs font-medium text-gray-600 bg-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Excerpt */}
                    <p className="text-gray-500 text-sm mb-4 line-clamp-4 flex-grow leading-relaxed">
                       {post.excerpt}
                    </p>
                    
                    {/* Date */}
                    <div className="text-gray-400 text-xs mb-4">
                      {post.date}
                    </div>
                    
                    {/* CTA */}
                    <span className="text-[#E2552B] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Read More <ArrowRight size={14} />
                    </span>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 flex justify-center sm:hidden">
                <Button 
                  variant="outline" 
                  className="border-[#1B5E20] text-[#1B5E20]"
                  onClick={() => {
                    setLocation('/articles');
                    window.scrollTo(0, 0);
                  }}
                >
                  See All Articles
                </Button>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}