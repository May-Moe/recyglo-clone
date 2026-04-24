import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calculator, ChevronRight, MessageSquareCode } from 'lucide-react';

// --- ASSET IMPORTS ---
// Replace these with the actual images you upload to your assets folder
import wmHero from '@/assets/images/about-hero.jpg'; // Placeholder for wind turbines background
import wmWorkers from '@/assets/images/wm1.png'; // Placeholder for workers at facility
import wmDashboard from '@/assets/images/w2.webp'; // Placeholder for laptop/dashboard
import wmFactory from '@/assets/images/wm3.png'; // Placeholder for smoke stacks
import wmTruck from '@/assets/images/wm4.png'; // Placeholder for garbage truck
import wmFly from '@/assets/images/wm5.png'; // Placeholder for Black Soldier Fly

export default function WasteManagement() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${wmHero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-sm md:text-base font-bold mb-2 text-gray-800 uppercase tracking-wide">
                Making the world a cleaner place
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                Waste Management Solutions
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                RecyGlo offers end-to-end waste management solutions, specializing in general, hazardous, and e-waste disposal to help your business minimize its environmental footprint while maintaining operational efficiency.
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all">
                  <Calculator size={18} className="text-gray-500" />
                  Calculate Carbon Footprint
                </Button>
                <Button className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md transition-all">
                  Contact Us
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT SECTION */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-4xl">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/solutions" className="hover:text-gray-900 cursor-pointer transition-colors">Our Solutions</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">Comprehensive Waste Management</span>
          </div>

          {/* Section Header */}
          <div className="mb-10">
             <span className="text-sm font-bold text-gray-500 mb-2 block">Our Services</span>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-8">
               One-Stop Service Waste Management
             </h2>
             
             <div className="w-full h-auto md:h-[350px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
               <img 
                 src={wmWorkers} 
                 alt="Waste Management Workers" 
                 className="w-full h-full object-cover"
               />
             </div>
          </div>

          {/* Content Blocks */}
          <div className="space-y-12">
             
             {/* Intro */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Make waste management plug-and-play with us</h3>
               <p className="text-gray-700 leading-relaxed">
                 RecyGlo provides end-to-end waste management solutions tailored to your business needs, ensuring environmental compliance and maximum operational efficiency.
               </p>
             </div>

             {/* Waste Management List */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Waste Management</h3>
               <p className="text-gray-700 leading-relaxed mb-6">
                 RecyGlo offers comprehensive waste management solutions, categorizing and disposing of various materials safely. Our solutions cover the entire process from collection to recycling.
               </p>
               <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20] text-gray-700 font-medium">
                 <li>Hazardous (Dry and Contaminated)</li>
                 <li>General and Dry Waste bin</li>
                 <li>General waste removal and recycling</li>
                 <li>E-waste and IT asset recycling</li>
                 <li>On & Off-Site secure destruction</li>
                 <li>On-Demand Waste Collection Logistics</li>
               </ul>
             </div>

             {/* Hardware and Systems */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Hardware and Secure Operating Systems</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 We provide detailed environmental audits and action plans integrated with smart hardware. Our data-driven platforms track waste generation in real-time, providing transparency across your supply chain.
               </p>
               <div className="w-full h-auto md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                 <img 
                   src={wmDashboard} 
                   alt="Hardware and Secure Operating Systems Dashboard" 
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>

             {/* Sustainability Education */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainability Education</h3>
               <p className="text-gray-700 leading-relaxed">
                 Organize in-house awareness events, zero-waste days, and training programs to engage your staff and communities. Our experts help build a culture of sustainability inside your organization to drive long-term environmental impact.
               </p>
             </div>

             {/* Waste to Energy */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Waste to Energy Services</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 RecyGlo works with leading partners to seamlessly divert waste into solid recovered fuels (SRF), ensuring materials that cannot be recycled are converted into clean, usable energy.
               </p>
               <div className="w-full h-auto md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                 <img 
                   src={wmFactory} 
                   alt="Waste to Energy Factory" 
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>

             {/* Sub-services Group */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Low Value Plastic Recycling</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 We help to recycle low-value plastic waste materials, divert them from landfills, and process them into usable secondary raw materials.
               </p>

               <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Destruction and Recycling</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 We secure data, documents, and other sensitive materials and safely destroy them to ensure confidential brand protection and corporate data security.
               </p>

               <h3 className="text-2xl font-bold text-gray-900 mb-2">On-Demand Waste Collection</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 We offer on-demand waste pickup plans tailored to your business needs, enabling flexible scheduling and rapid response to variable waste volumes.
               </p>
               <div className="w-full h-auto md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                 <img 
                   src={wmTruck} 
                   alt="On-Demand Waste Collection Truck" 
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>

             {/* Black Soldier Fly */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Black Soldier Fly (BSF) Organic Waste Management</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 RecyGlo utilizes Black Soldier Fly larvae to process organic waste efficiently, converting it into high-protein animal feed and rich organic fertilizer.
               </p>
               <div className="w-full h-auto md:h-[300px] overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                 <img 
                   src={wmFly} 
                   alt="Black Soldier Fly on Leaf" 
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>

             {/* Hazardous Waste & CTA */}
             <div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Hazardous Waste Management</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 We have specialized solutions for safely managing and disposing of hazardous waste to ensure compliance with strict environmental laws and protect community health.
               </p>

               <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
               <p className="text-gray-700 leading-relaxed mb-8">
                 Ready to start making a positive environmental impact? Contact us today to discuss your sustainability needs and discover how our solutions can work for you.
               </p>
               
               <div className="flex justify-center mt-4">
                 <Button 
                   onClick={() => window.location.href = '/contact'}
                   className="bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white font-bold px-8 py-6 rounded-full shadow-lg flex items-center gap-3 transition-transform hover:-translate-y-1 text-lg"
                 >
                   Contact Us Now!
                 </Button>
               </div>
             </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}