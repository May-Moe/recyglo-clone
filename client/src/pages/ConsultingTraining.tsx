import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calculator, ChevronRight } from 'lucide-react';

// --- ASSET IMPORTS ---
// Replace these with the actual images you upload to your assets folder
import consultingHero from '@/assets/images/about-hero.jpg'; // Placeholder for the 'S G' hands background
import trainingTeamImg from '@/assets/images/consult1.png'; // Placeholder for the warehouse training image
import trainingPackagesImg from '@/assets/images/consult2.png'; // Placeholder for the dark green packages table graphic

export default function ConsultingTraining() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${consultingHero})`, 
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
                Consulting and Training
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                RecyGlo provides expert consulting and training services to help businesses enhance their sustainability practices, improve waste management strategies, and ensure compliance with environmental standards.
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
            <span className="text-gray-900 font-bold">Sustainable Waste Management Training</span>
          </div>

          {/* Section Header */}
          <div className="mb-8">
             <span className="text-sm font-bold text-gray-500 mb-2 block">Start From 2024</span>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-8">
               Sustainable Waste Management Training
             </h2>
             
             <div className="w-full h-auto md:h-[400px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
               <img 
                 src={trainingTeamImg} 
                 alt="Team undergoing waste management training" 
                 className="w-full h-full object-cover"
               />
             </div>
          </div>

          {/* Intro Text */}
          <div className="mb-12">
             <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
               Transform your business's sustainability vision with RecyGlo's Expert Training Programs
             </h3>
             <p className="text-gray-700 leading-relaxed">
               We offer three comprehensive training packages encompass core sustainability modules, on-site auditing, certification, and driving towards integrating ESG and CE principles.
             </p>
          </div>

          {/* Packages Details */}
          <div className="space-y-12 text-gray-800 mb-16">
             
             {/* Package A */}
             <div>
               <h4 className="text-xl font-bold text-gray-900 mb-4">Package A</h4>
               <ul className="space-y-2 pl-6 mb-6 list-disc marker:text-[#1B5E20] font-medium">
                 <li>Overview of waste types and classifications</li>
                 <li>Certification by RecyGlo (ISO-accredited auditor)</li>
                 <li>Training on integrating ESG into waste management and best recycling practices</li>
                 <li>Engaging team-building games</li>
               </ul>
               <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm space-y-1">
                 <p className="font-bold text-gray-900 mb-2">Details:</p>
                 <p><span className="font-semibold">Duration:</span> 2 Hours</p>
                 <p><span className="font-semibold">Language:</span> Thai/English</p>
                 <p><span className="font-semibold">Participants:</span> Up to 15 people</p>
                 <p><span className="font-semibold">Price:</span> 15,000 Baht</p>
               </div>
             </div>

             {/* Package B */}
             <div className="border-t border-gray-100 pt-10">
               <h4 className="text-xl font-bold text-gray-900 mb-2">Package B</h4>
               <p className="text-gray-600 font-medium mb-4 italic">Includes everything in Package A plus:</p>
               <ul className="space-y-2 pl-6 mb-6 list-disc marker:text-[#1B5E20] font-medium">
                 <li>Initial Audit with In-depth Audit Report</li>
                 <li>Training on practical sorting and recycling techniques</li>
                 <li>Implementation of ISO 14001:2015 standards in waste management</li>
                 <li>Expanded team-building games</li>
               </ul>
               <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm space-y-1">
                 <p className="font-bold text-gray-900 mb-2">Details:</p>
                 <p><span className="font-semibold">Duration:</span> 3 Hours</p>
                 <p><span className="font-semibold">Language:</span> Thai/English</p>
                 <p><span className="font-semibold">Participants:</span> Up to 30 people</p>
                 <p><span className="font-semibold">Price:</span> 25,000 Baht</p>
               </div>
             </div>

             {/* Package C */}
             <div className="border-t border-gray-100 pt-10">
               <h4 className="text-xl font-bold text-gray-900 mb-2">Package C</h4>
               <p className="text-gray-600 font-medium mb-4 italic">Includes everything in Packages A and B plus:</p>
               <ul className="space-y-2 pl-6 mb-6 list-disc marker:text-[#1B5E20] font-medium">
                 <li>Complete in-depth audit reports and customized solutions</li>
                 <li>Advanced strategies for integrating sustainable practices</li>
               </ul>
               <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm space-y-1">
                 <p className="font-bold text-gray-900 mb-2">Details:</p>
                 <p><span className="font-semibold">Duration:</span> 4 Hours</p>
                 <p><span className="font-semibold">Participants:</span> Up to 45 people</p>
                 <p><span className="font-semibold">Price:</span> 35,000 Baht</p>
               </div>
             </div>

          </div>

          {/* Pricing Graphic / Table */}
          <div className="w-full h-auto overflow-hidden rounded-2xl shadow-md border border-gray-100">
            <img 
              src={trainingPackagesImg} 
              alt="Sustainable Waste Management Training Packages Breakdown" 
              className="w-full h-full object-contain"
            />
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}