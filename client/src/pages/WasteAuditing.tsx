import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calculator, ChevronRight } from 'lucide-react';

// --- ASSET IMPORTS ---
// Replace these with the actual images you upload to your assets folder
import auditHero from '@/assets/images/about-hero.jpg'; // Placeholder for aerial tanks background
import auditRecycleImg from '@/assets/images/wa1.png'; // Placeholder for RECYCLE wall image
import auditBinsImg from '@/assets/images/wa2.png'; // Placeholder for the 4 colored bins
import auditFacilityImg from '@/assets/images/wa3.png'; // Placeholder for the indoor facility paper pile
import auditFactoryImg from '@/assets/images/wa4.png'; // Placeholder for the factory smokestack

export default function WasteAuditing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${auditHero})`, 
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
                Waste Auditing
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                RecyGlo provides waste auditing and management services that operate with efficiency, helping businesses lower their environmental impact, enhance operational efficiency, and meet sustainability standards.
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
            <span className="text-gray-900 font-bold">Waste Auditing and Management Platform with Consultation Services</span>
          </div>

          {/* Section Header */}
          <div className="mb-10">
             <span className="text-sm font-bold text-gray-500 mb-2 block">Start From 2024</span>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-8 leading-snug">
               Waste Auditing and Management Platform with Consultation Services
             </h2>
             
             <div className="w-full h-auto md:h-[350px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
               <img 
                 src={auditRecycleImg} 
                 alt="Recycle Wall" 
                 className="w-full h-full object-cover"
               />
             </div>
             
             <p className="text-gray-700 leading-relaxed mb-8">
               RecyGlo's Waste Auditing is a hardware-integrated smart digital solution that streamlines all operations. Utilizing advanced Waste Management Platform, businesses can monitor real-time data, optimize collection routes, and generate automated reports for smarter, more efficient waste management execution.
             </p>

             <div className="space-y-6 text-gray-700">
                <div>
                   <h4 className="font-bold text-lg text-gray-900 mb-1">Smart Digital Audit Solution</h4>
                   <p>Modern digital solutions streamline the auditing, compliance, and waste collection processes completely.</p>
                </div>
                <div>
                   <h4 className="font-bold text-lg text-gray-900 mb-1">Real-time, Data-Driven Decisions</h4>
                   <p>Transparent data insights and reports for accurate monitoring, resource efficiency, and advanced recycling metrics.</p>
                </div>
                <div>
                   <h4 className="font-bold text-lg text-gray-900 mb-1">Supply Chain Management</h4>
                   <p>Comprehensive framework that tracks waste logistics, ensuring compliance across the end-to-end supply chain.</p>
                </div>
             </div>
          </div>

          {/* Packages Section */}
          <div className="mt-16">
             <h3 className="text-2xl font-bold text-gray-900 mb-8">Waste Auditing and Consultation Service Packages</h3>
             
             <div className="space-y-16">
                
                {/* Basic Business */}
                <div>
                   <div className="w-full h-auto md:h-[350px] overflow-hidden rounded-2xl mb-8 shadow-sm border border-gray-100">
                     <img 
                       src={auditBinsImg} 
                       alt="Four Colored Recycling Bins" 
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <h4 className="text-xl font-bold text-gray-900 mb-4">Basic Business</h4>
                   <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20] text-gray-700 font-medium">
                     <li>Ideal for start-ups and SMEs, 100 to 500 employees.</li>
                     <li>GRI standards, GHG Protocol scope 1, 2, 3.</li>
                     <li>Waste Auditing Hardware and Smart scales to accurately identify volume & metrics.</li>
                     <li>Reporting features for sustainability compliance standards and accurate baseline data.</li>
                     <li>Certification from environmental auditing partners.</li>
                   </ul>
                </div>

                {/* Professional Business */}
                <div>
                   <div className="w-full h-auto md:h-[350px] overflow-hidden rounded-2xl mb-8 shadow-sm border border-gray-100">
                     <img 
                       src={auditFacilityImg} 
                       alt="Waste processing facility" 
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <h4 className="text-xl font-bold text-gray-900 mb-4">Professional Business</h4>
                   <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20] text-gray-700 font-medium">
                     <li>Ideal for growing enterprises that demand comprehensive and effective waste tracking strategies.</li>
                     <li>Unlimited users/logins to backend platform for team management processes.</li>
                     <li>Comprehensive waste diversion data and actionable efficiency recommendations.</li>
                     <li>Custom-designed bespoke solutions tailored to unique facilities, campuses, or industrial requirements.</li>
                   </ul>
                </div>

                {/* Enterprise Business */}
                <div>
                   <div className="w-full h-auto md:h-[350px] overflow-hidden rounded-2xl mb-8 shadow-sm border border-gray-100">
                     <img 
                       src={auditFactoryImg} 
                       alt="Industrial factory and smokestack" 
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <h4 className="text-xl font-bold text-gray-900 mb-4">Enterprise Business</h4>
                   <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20] text-gray-700 font-medium">
                     <li>Ideal for large-scale operations and complexes with heavy waste output.</li>
                     <li>Advanced API integration for automated reporting procedures.</li>
                     <li>Cost-optimization assessment features to reduce overhead and improve resource recovery.</li>
                   </ul>
                </div>

             </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}