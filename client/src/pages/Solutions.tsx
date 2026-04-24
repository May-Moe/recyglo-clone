import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ChevronRight, ChevronDown, ChevronUp, Factory, Store, Hospital, School, MonitorSmartphone, Settings } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter'; // <-- NEW: Imported for navigation

// --- ASSET IMPORTS ---
import heroBg from '@/assets/images/about-hero.jpg'; 
import service1 from '@/assets/images/w1.webp';
import service2 from '@/assets/images/w2.webp';
import service3 from '@/assets/images/w3.webp';
import service4 from '@/assets/images/w4.webp';
import service5 from '@/assets/images/w5.webp';
import service6 from '@/assets/images/w6.webp';

// --- HELPER COMPONENT FOR EXPANDABLE CARDS ---
function SolutionCard({ title, desc, icon: Icon, isDark }: { title: string, desc: string, icon: any, isDark: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`p-8 rounded-xl flex gap-5 shadow-sm transition-all border ${
      isDark ? 'bg-[#1C3B2B] border-transparent' : 'bg-white border-gray-200'
    }`}>
       {/* Icon Container */}
       <div className="shrink-0 mt-1">
         <Icon size={40} strokeWidth={1.5} className={isDark ? 'text-white' : 'text-gray-700'} />
       </div>
       
       <div className="flex flex-col w-full">
          <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-[#A3E635]' : 'text-gray-900'}`}>
            {title}
          </h3>
          <div className={`text-sm leading-relaxed mb-5 flex-grow transition-all ${isDark ? 'text-white/90' : 'text-gray-500'} ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {desc}
          </div>
          
          <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className={`font-bold text-sm flex items-center gap-1 transition-all mt-auto w-fit ${
               isDark ? 'text-[#A3E635] hover:text-[#BEF264]' : 'text-gray-900 hover:text-gray-600'
             }`}
          >
             {isExpanded ? (
               <>Show Less <ChevronUp size={16} strokeWidth={3} /></>
             ) : (
               <>Show More <ChevronDown size={16} strokeWidth={3} /></>
             )}
          </button>
       </div>
    </div>
  );
}


export default function Solutions() {
  const [, setLocation] = useLocation(); // <-- NEW: Hook for routing

  // Data for the alternating services list (UPDATED WITH LINKS)
  const servicesData = [
    { 
      title: 'Waste Management Solutions', 
      img: service1,
      desc: 'RecyGlo offers comprehensive B2B waste management solutions, specializing in general, hazardous, and e-waste disposal. Our approach guarantees environmental compliance and operational efficiency.',
      link: '/solutions/waste-management'
    },
    { 
      title: 'Waste Auditing', 
      img: service2,
      desc: 'We provide comprehensive waste auditing services to help B2B facilities optimize waste management practices, identify cost reduction opportunities, and achieve Zero-Waste-to-Landfill goals safely.',
      link: '/solutions/waste-auditing'
    },
    { 
      title: 'Reporting and Compliance', 
      img: service3,
      desc: 'Navigate complex environmental regulations easily. We deliver audit-ready sustainability reports and streamline ESG reporting, ensuring complete data transparency across your organization.',
      link: '/solutions/reporting'
    },
    { 
      title: 'Consulting and Training', 
      img: service4,
      desc: 'Expert sustainability consulting and training services to help B2B organizations implement robust ESG strategies, optimize waste management, and achieve compliance with global standards.',
      link: '/solutions/consulting'
    },
    { 
      title: 'ESG Data Analytics', 
      img: service5,
      desc: 'Advanced ESG data analytics services to help businesses track and analyze Scope 1, 2, and 3 emissions. We transform raw environmental data into clear, actionable insights.',
      link: '/solutions/esg-data-analytics'
    },
    { 
      title: 'Circular Economy', 
      img: service6,
      desc: 'RecyGlo leads impactful Circular Economy projects to help businesses implement closed-loop systems. Through plastic prevention and material reuse initiatives, we drive zero-waste models.',
      link: '/solutions/circular-economy'
    }
  ];

  // Data for Industry-Specific Solutions
  const industrySolutions = [
    {
      title: 'Manufacturing',
      desc: 'In the manufacturing sector, production process management can lead to a massive waste reduction. To be precise, reducing the waste at the source through recycling, and sustainable sourcing can be one of the many solutions. The first solution is waste reduction in the supply chain process attainable when businesses implement lean manufacturing techniques in their system. For cases when waste cannot be reduced, recycling the used material serves as a great alternative solution. Manufacturing companies can establish standard recycling programs for scrap materials, packaging, and other by-products, and added to that, sustainable sourcing of recyclable and biodegradable materials can be used to reduce overall waste production.',
      icon: Factory
    },
    {
      title: 'Retail',
      desc: 'The global retail sector produces 2.12 billion tons of waste yearly significantly contributing to land degradation, water pollution, and disruption of the eco-system. The improvement of supply chain sustainability and the implementation of an efficient recycling system are the best solutions to minimize the environmental impact of this industry. The retail sector should emphasize more on sustainability packaging made with minimal, recyclable, or biodegradable packaging materials to reduce the use of plastic. Another solution can be the implementation of product take-back programs which essentially means encouraging customers to return used products for recycling or proper disposal purposes, promoting the circular economy. Big companies such as Uniqlo offer such programs to save cost on raw materials which creates a greater impact on the environment. Likewise, fast fashion has been a big contributor to the over-production of clothing items globally as clothes are made in large bulks and discarded as quickly as they were made. Hence,  efficient inventory systems are required to reduce overstock and waste from unsold products. Added to this, the industry can prioritize improving supplier partnerships through the development of sustainable and waste-reducing practices throughout the supply chain.',
      icon: Store
    },
    {
      title: 'Healthcare',
      desc: 'Waste produced in the healthcare field can be toxic and filled with radioactive components. Medical equipment such as needles and syringes which are used over 16 billion times a year needs to be discarded properly. To prevent the unintentional release of chemical hazards into the environment, waste management is extremely important. If waste is not properly managed in the healthcare industry it can be infectious and affect both our health and the environment. The way forward to minimize waste mismanagement is starting with reducing waste and then developing strategies to properly allocate resources and handle the disposal of waste. ',
      icon: Hospital
    },
    {
      title: 'Education',
      desc: 'The education sector has a significant potential to accelerate proper waste management by promoting sustainability initiatives and reduction of waste in educational institutions. Perhaps the most impactful solution would be to conduct awareness campaigns by educating students and the staff on waste reduction practices and the importance, and of sustainability. Utilizing digital resources to reduce any sort of waste can foster a sustainable environment. Likewise, implementing recycling programs such as setting up recycling bins across campuses for paper, plastics, and electronics and introducing composting programs for organic waste from cafeterias and landscaping activities can be other solutions. ',
      icon: School
    }
  ];

  // Data for Technology Solutions
  const techSolutions = [
    {
      title: 'Sustainability Platform',
      desc: "At RecyGlo, we offer technology-driven solutions to help you on your sustainability journey. Here's how we can assist: by providing a centralized dashboard that tracks your real-time carbon emissions, waste generation, and energy consumption across all your facilities.",
      icon: MonitorSmartphone
    },
    {
      title: 'Services',
      desc: 'We streamline your sustainability management with dependable tools and services to help you achieve your objectives. At RecyGlo we offer a comprehensive range of additional services to support your sustainability efforts, including: • Standard Reporting Service • Annual report • Energy Auditing • Sustainability report  • CSR project • Carbon off-setting and footprint reporting • SDG REPORTING • Standard and certification from credible and reputable credentials such as LEED, ISO, UN GLOBAL IMPACT, FairTrade, FREE TRADE, Forest Stewardship Council (FSC), B Corporation, Energy Star ',
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-70"
          style={{
            backgroundImage: `url(${heroBg})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20">
             <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-gray-500">
                End-to-End Solutions for Businesses, Emissions, and Corporates in Asia-Pacific.
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                Services
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
        </div>
      </section>

      {/* 2. ALTERNATING SERVICES LIST (WITH WORKING LINKS) */}
      <section className="py-20 bg-[#F8F9F7]">
        <div className="container px-4 sm:px-8 lg:px-12">
           
           <div className="mb-16 text-sm font-medium text-gray-500 flex items-center gap-2">
             <span>Solutions</span>
             <ChevronRight size={14} className="text-gray-300" />
             <span className="text-gray-900 font-bold">All Services</span>
           </div>
           
           <div className="space-y-24">
             {servicesData.map((service, index) => (
                <div key={index} className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}>
                   
                   <div className="w-full md:w-1/2">
                      <div 
                        className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 relative group cursor-pointer"
                        onClick={() => { setLocation(service.link); window.scrollTo(0,0); }}
                      >
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                         <img 
                           src={service.img} 
                           alt={service.title} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                         />
                      </div>
                   </div>
                   
                   <div className="w-full md:w-1/2 flex flex-col items-start">
                      <h3 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-6">{service.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {service.desc}
                      </p>
                      <Button 
                        onClick={() => { setLocation(service.link); window.scrollTo(0,0); }}
                        className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white font-bold px-8 py-6 rounded-md shadow-md transition-transform hover:-translate-y-1"
                      >
                         View More
                      </Button>
                   </div>
                   
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* 3. OUR PRODUCTS (YouTube Video) */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container px-4 sm:px-8 lg:px-12">
           <h2 className="text-4xl font-bold text-[#1B5E20] mb-12">Our Products</h2>
           
           <div className="w-full max-w-5xl mx-auto rounded-3xl aspect-video shadow-2xl relative overflow-hidden bg-black border-4 border-gray-50">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/-eNZ-Tm7Yj0?si=4xnXJNbNLJy9Z3M_" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      </section>

      {/* 4. OUR SOLUTION (EXPANDABLE CARDS GRID) */}
      <section className="py-24 bg-[#F5F7F5] border-t border-gray-100">
         <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
            
            <h2 className="text-4xl font-bold text-[#1C3B2B] mb-12">Our Solution</h2>
            
            {/* Industry-Specific Solutions */}
            <div className="mb-12">
               <h3 className="text-2xl font-bold text-gray-800 mb-6">Industry-Specific Solutions</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {industrySolutions.map((sol, idx) => (
                    <SolutionCard 
                      key={idx} 
                      title={sol.title} 
                      desc={sol.desc} 
                      icon={sol.icon} 
                      isDark={true} 
                    />
                  ))}
               </div>
            </div>

            {/* Technology Solutions */}
            <div>
               <h3 className="text-2xl font-bold text-gray-800 mb-6">Technology Solutions</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {techSolutions.map((sol, idx) => (
                    <SolutionCard 
                      key={idx} 
                      title={sol.title} 
                      desc={sol.desc} 
                      icon={sol.icon} 
                      isDark={false} 
                    />
                  ))}
               </div>
            </div>

         </div>
      </section>

      <Footer />
    </div>
  );
}