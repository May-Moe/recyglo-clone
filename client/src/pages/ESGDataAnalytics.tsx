import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calculator, ChevronRight } from 'lucide-react';

// --- ASSET IMPORTS ---
import esgHero from '@/assets/images/about-hero.jpg'; 
import esgPlatformImg from '@/assets/images/ESG1.png'; 
import esgFactoryImg from '@/assets/images/ESG2.png'; 

export default function ESGDataAnalytics() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${esgHero})`, 
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
                ESG Data Analytics
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                RecyGlo offers an ESG Data Analytics platform to help businesses track, measure, and report their environmental, social, and governance impacts. Enhance sustainability performance and transparency with our tool.
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
            <span className="text-gray-900 font-bold">ESG Data Analytical Platform</span>
          </div>

          {/* Section Header & Image */}
          <div className="mb-12">
             <span className="text-sm font-bold text-[#E2552B] uppercase tracking-wider mb-2 block">Our Solutions</span>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-8">ESG Data Analytical Platform</h2>
             
             <div className="w-full h-auto md:h-[400px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
               <img 
                 src={esgPlatformImg} 
                 alt="ESG Data Analytical Platform" 
                 className="w-full h-full object-cover"
               />
             </div>

             <h3 className="text-2xl font-bold text-gray-900 mb-4">Data-Driven Decision-Making</h3>
             <p className="text-gray-700 leading-relaxed mb-8">
               At ESG Data Analytics Platform, we align with the strategic goals of our clients by integrating environmental, social, and governance (ESG) considerations into the heart of your organization. Here is how we can assist:
             </p>

             <ul className="space-y-5 pl-6 list-disc marker:text-gray-800 text-gray-700 mb-12">
               <li className="pl-2">
                 <span className="font-bold text-gray-900 block mb-1">Track Your Progress Towards</span>
                 <span className="text-gray-600 block">Monitor and evaluate your overall ESG roadmap.</span>
               </li>
               <li className="pl-2">
                 <span className="font-bold text-gray-900 block mb-1">Set Sustainable Milestones</span>
                 <span className="text-gray-600 block">Design and implement a personalized ESG framework.</span>
               </li>
               <li className="pl-2">
                 <span className="font-bold text-gray-900 block mb-1">Framework Recommendations</span>
                 <span className="text-gray-600 block">Get guidance on the frameworks best suited for your needs.</span>
               </li>
               <li className="pl-2">
                 <span className="font-bold text-gray-900 block mb-1">ESG GRI Center</span>
                 <span className="text-gray-600 block">Use the Global Reporting Initiative (GRI) to optimize report submissions.</span>
               </li>
               <li className="pl-2">
                 <span className="font-bold text-gray-900 block mb-1">Compiling Report Status</span>
                 <span className="text-gray-600 block">Ensure seamless capability tracking reports.</span>
               </li>
               <li className="pl-2">
                 <span className="font-bold text-gray-900 block mb-1">Collaborator Access</span>
                 <span className="text-gray-600 block">Enable access for relevant stakeholders.</span>
               </li>
             </ul>
          </div>

          {/* 3. VIDEO SECTION */}
          <div className="w-full aspect-video rounded-2xl shadow-lg relative overflow-hidden mb-12 bg-black border-4 border-gray-50">
             {/* THE YOUTUBE IFRAME */}
             <iframe 
               className="w-full h-full"
               src="https://www.youtube.com/embed/-eNZ-Tm7Yj0?si=RIUCVNUWK7BfS6eB" 
               title="YouTube video player" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               referrerPolicy="strict-origin-when-cross-origin" 
               allowFullScreen
             ></iframe>
          </div>

          {/* 4. HOW TO GET STARTED SECTION */}
          <div className="mb-12">
             <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Get Started on Our ESG Platform</h3>
             
             <div className="space-y-6 text-gray-700">
               <div>
                 <h4 className="font-bold text-lg mb-2">1. Access to learning</h4>
                 <ul className="list-disc pl-8 space-y-1 text-gray-600">
                   <li>Register an account on the RecyGlo support portal.</li>
                   <li>Dashboard log-in to access company insights.</li>
                   <li>Check roadmap for projected plans.</li>
                 </ul>
               </div>

               <div>
                 <h4 className="font-bold text-lg mb-2">2. Download ESG Framework</h4>
                 <ul className="list-disc pl-8 space-y-1 text-gray-600">
                   <li>Select the framework specific to your industry.</li>
                   <li>Download relevant Excel sheets.</li>
                 </ul>
               </div>

               <div>
                 <h4 className="font-bold text-lg mb-2">3. Create Custom Reporting Template</h4>
                 <ul className="list-disc pl-8 space-y-1 text-gray-600">
                   <li>Define key disclosures & metrics.</li>
                   <li>Format the custom PDF presentation.</li>
                 </ul>
               </div>

               <div>
                 <h4 className="font-bold text-lg mb-2">4. Consultation</h4>
                 <ul className="list-disc pl-8 space-y-1 text-gray-600">
                   <li>Get expert guidance for best practices and efficiency.</li>
                   <li>Training for effective platform usage.</li>
                 </ul>
               </div>
             </div>
          </div>

          {/* 5. SECOND IMAGE */}
          <div className="w-full h-auto md:h-[400px] overflow-hidden rounded-2xl mb-12 shadow-sm border border-gray-100">
            <img 
              src={esgFactoryImg} 
              alt="Sustainable Factory" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* 6. BENEFITS SECTION */}
          <div>
             <h3 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Using ESG Data Analytics</h3>
             
             <div className="space-y-4 text-gray-700 leading-relaxed">
               <div>
                 <span className="font-bold text-gray-900">1. Data Accuracy & Accessibility</span><br/>
                 <span className="text-gray-600">Automated data collection ensures high fidelity and immediate access to your environmental metrics.</span>
               </div>
               <div>
                 <span className="font-bold text-gray-900">2. Compliance & Regulations</span><br/>
                 <span className="text-gray-600">Ensure strict adherence to international disclosure mandates, keeping your organization safely within regulatory requirements (GRI, SASB, TCFD).</span>
               </div>
               <div>
                 <span className="font-bold text-gray-900">3. Target Determination</span><br/>
                 <span className="text-gray-600">Establish precise, science-based targets for carbon reduction, tracking progress visually over time.</span>
               </div>
               <div>
                 <span className="font-bold text-gray-900">4. Transparency</span><br/>
                 <span className="text-gray-600">Build trust with investors and stakeholders by offering clear, auditable performance data.</span>
               </div>
               <div>
                 <span className="font-bold text-gray-900">5. Green Financing</span><br/>
                 <span className="text-gray-600">Unlock competitive green financing options by demonstrating verifiable ESG leadership and risk management.</span>
               </div>
             </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}