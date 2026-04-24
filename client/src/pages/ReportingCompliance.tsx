import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calculator, ChevronRight } from 'lucide-react';

// --- ASSET IMPORTS ---
// Replace these with the actual images you upload to your assets folder
import reportingHero from '@/assets/images/about-hero.jpg'; // Placeholder for desk/charts background
import esgHandsImg from '@/assets/images/Rep1.png'; // Placeholder for hands holding tree/globe
import pricingTableImg from '@/assets/images/Rep2.png'; // Placeholder for the pricing packages graphic

export default function ReportingCompliance() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${reportingHero})`, 
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
                Reporting and Compliance
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                RecyGlo offers reporting and compliance solutions to help businesses meet environmental regulations, track sustainability performance, and ensure corporate social responsibility (ESG) and climate reporting.
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all">
                  <Calculator size={18} className="text-gray-500" />
                  Calculate Carbon Footprint
                </Button>
                <Button className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md transition-all">
                  Our Solutions
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT SECTION */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-4xl">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/solutions" className="hover:text-gray-900 cursor-pointer transition-colors">Our Solutions</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">ESG REPORT</span>
          </div>

          {/* Section Header */}
          <div className="mb-8">
             <span className="text-sm font-bold text-[#E2552B] uppercase tracking-wider mb-2 block">Our Solution</span>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-8">ESG REPORT</h2>
             
             <div className="w-full h-auto md:h-[350px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
               <img 
                 src={esgHandsImg} 
                 alt="Hands holding tree and globe" 
                 className="w-full h-full object-cover"
               />
             </div>
          </div>

          {/* ESG Reporting */}
          <div className="mb-12">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">ESG Reporting</h3>
             <p className="text-gray-700 leading-relaxed mb-6">
               ESG reporting is the disclosure of environmental, social and corporate governance data. As with all disclosures, its purpose is to shed light on a company's ESG activities while improving investor transparency and inspiring others to do the same.
             </p>
             
             <h4 className="font-bold text-lg text-gray-900 mb-3">Benefits of ESG reporting</h4>
             <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20] text-gray-700">
               <li>Credibility and reputation</li>
               <li>Prevention of regulatory penalties</li>
               <li>Legal compliance & improved stakeholder disclosure</li>
             </ul>
          </div>

          {/* ESG Reporting Scopes */}
          <div className="mb-12">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">ESG Reporting Scopes</h3>
             <p className="text-gray-700 leading-relaxed mb-6">
               RecyGlo ESG reporting platform encompasses tracking and managing emissions across three main scopes:
             </p>
             
             <div className="space-y-6 text-gray-700">
               <div>
                 <span className="font-bold text-gray-900 block mb-2">Scope 1 (Emissions directly from company's activities):</span>
                 <ul className="space-y-1 pl-6 list-disc marker:text-gray-500">
                   <li>Stationary combustion</li>
                   <li>Mobile combustion</li>
                   <li>Fugitive emissions</li>
                   <li>Process emissions</li>
                 </ul>
               </div>
               
               <div>
                 <span className="font-bold text-gray-900 block mb-2">Scope 2 (Emissions from the generation of purchased electricity consumed by the company):</span>
                 <ul className="space-y-1 pl-6 list-disc marker:text-gray-500">
                   <li>Purchased electricity, steam, heating & cooling</li>
                 </ul>
               </div>

               <div>
                 <span className="font-bold text-gray-900 block mb-2">Scope 3 (All other indirect emissions that occur in a company's value chain, as defined by the GHG Protocol):</span>
                 <p className="pl-6 text-gray-600">Comprehensive value chain emissions tracking.</p>
               </div>
             </div>
          </div>

          {/* ESG Report Packages */}
          <div className="mb-12">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">ESG Report Packages</h3>
             <p className="text-gray-700 leading-relaxed mb-8">
               RecyGlo offers tailored ESG report packages designed to suit diverse business sizes and goals:
             </p>
             
             {/* Pricing Table Image */}
             <div className="w-full h-auto overflow-hidden rounded-2xl mb-12 shadow-md border border-gray-100">
               <img 
                 src={pricingTableImg} 
                 alt="ESG Report Packages" 
                 className="w-full h-full object-contain"
               />
             </div>

             {/* Package Details */}
             <div className="space-y-10 text-gray-700">
               
               {/* Basic Business */}
               <div>
                 <h4 className="text-xl font-bold text-[#1B5E20] mb-2">1. Basic Business</h4>
                 <p className="text-gray-600 font-medium mb-4 italic">For individual companies transitioning to a more sustainable operation</p>
                 <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20]">
                   <li>GRI standards, the most recognized frameworks</li>
                   <li>Scope 1 reporting with RecyGlo & GHG Protocol</li>
                   <li>Software Access for advanced data collection</li>
                   <li>Data center & included</li>
                   <li>20 hours of consulting and training per year</li>
                   <li>Independent reporting and certification by RecyGlo (ISO and ESG standards auditors)</li>
                   <li>Ideal for SMEs, Micro, Small & Medium Enterprises</li>
                 </ul>
               </div>

               {/* Professional Business */}
               <div>
                 <h4 className="text-xl font-bold text-[#1B5E20] mb-2">2. Professional Business</h4>
                 <p className="text-gray-600 font-medium mb-4 italic">For medium to large, building solid financial operations</p>
                 <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20]">
                   <li>Unprecedented reporting to invest and attract capital and clients</li>
                   <li>Sustainability team as a service</li>
                   <li>GRI standards, the most recognized frameworks</li>
                   <li>Scope 1 and 2 reporting with RecyGlo & GHG Protocol</li>
                   <li>40 hours of consulting and training per year</li>
                   <li>Certification by RecyGlo (ISO and ESG standards auditors)</li>
                   <li>Suitable for medium to large enterprises</li>
                 </ul>
               </div>

               {/* Enterprise Business */}
               <div>
                 <h4 className="text-xl font-bold text-[#1B5E20] mb-2">3. Enterprises Business</h4>
                 <p className="text-gray-600 font-medium mb-4 italic">For large global and MNCs</p>
                 <ul className="space-y-2 pl-6 list-disc marker:text-[#1B5E20]">
                   <li>Comprehensive ESG reporting with carbon reporting and real-time reporting</li>
                   <li>Full access to RecyGlo ESG features</li>
                   <li>Waste Management Platform and GHG disclosure reports</li>
                   <li>Scope 1, Scope 2, and Scope 3 with RecyGlo & GHG Protocol</li>
                   <li>60 hours of consulting and training per year</li>
                   <li>Assign and collect ESG data on entities</li>
                   <li>Certification by RecyGlo (ISO and ESG standards auditor)</li>
                   <li>Ideal for listed companies</li>
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