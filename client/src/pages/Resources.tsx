import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, ChevronRight, Calculator, Play } from 'lucide-react';
import { Link } from 'wouter';
import { useLocation } from 'wouter';

// --- ASSET IMPORTS ---
// Save an image for the hero section (like the recycling lightbulb) into your assets folder
import aboutHero from '@/assets/images/about-hero.jpg';

export default function Resources() {
  const [, setLocation] = useLocation();
  
  // Data for Case Studies
  // Ensure the 'fileUrl' matches the exact file name you put in your /public/reports folder
  const caseStudies = [
    { title: "Thailand's Battle with Climate Change", fileUrl: "/reports/Thailands-Battle-with-Climate-Change.pdf" },
    { title: "Steel in Thailand", fileUrl: "/reports/STEEL-IN-THAILANd.pdf" },
    { title: "Digital Transformation & ESG", fileUrl: "/reports/Digital-Transformation-and-ESG-1.pdf" },
    { title: "PM2.5 Pollution and Waste Management in Northern Thailand", fileUrl: "/reports/PM2.5-report.pdf" },
    { title: "Greening Indonesia", fileUrl: "/reports/Greening-Indonesia.pdf" },
    { title: "The Role of Digital Technologies (AI, IoT) in Optimizing Waste Management in South Korea", fileUrl: "/reports/The-Role-of-Digital-Technologies-AI-IoT-in-Optimizing-Waste-Management-and-Resource-Efficiency-in-South-Korea_Hsuwai.pdf" },
    { title: "Malaysia Report: Beyond Compliance - Profitability in Malaysia's CE", fileUrl: "/reports/Malaysia-Report-Beyond-Compliance_Profitability-in-Malaysias-CE.pdf" },
    { title: "Solar Panel Waste: Is Australia Ready for the Coming Recycling Wave", fileUrl: "/reports/Solar-Panel-Waste-Is-Australia-Ready-for-the-Coming-Recycling-Wave-1.pdf" },
    { title: "Extended Producer Responsibility in Vietnam: Risks, Opportunities, and What Businesses Need to Know in 2025", fileUrl: "/reports/Extended-Producer-Responsibility-in-Vietnam-Risks-Opportunities-and-What-Businesses-Need-to-Know-in-2025_Hsuwai.pdf" },
    { title: "Strategic Imperative in Biomedical Waste Management in UAE", fileUrl: "/reports/FinalBiomedical-Waste-Research-Paper.pdf" },
  ];

  // Data for Annual Reports
  const annualReports = [
    { title: "RecyGlo ESG 2024 Report", fileUrl: "/reports/RecyGlos-ESG-Report_2024.pdf" },
    { title: "RecyGlo Carbon Footprint 2022-2023 Report", fileUrl: "/reports/Carbon-Footprint-Report.pdf" },
    { title: "RecyGlo 2023 Annual Report", fileUrl: "/reports/RecyGlo-2023-Annual-Report-Presentation-1_compressed-1_compressed.pdf" },
    { title: "RecyGlo 2022 Annual Report", fileUrl: "/reports/2022_Annual_Report.pdf" },
    { title: "RecyGlo 2021 Annual Report", fileUrl: "/reports/RecyGlo_AR_2021_compressed.pdf" },
    { title: "RecyGlo 2020 Annual Report", fileUrl: "/reports/RecyGlo_In_2020-1_compressed-2_compressed_compressed-1.pdf" },
    { title: "RecyGlo 2019 Annual Report", fileUrl: "/reports/AR_2019_compressed-2_compressed.pdf" },
    { title: "RecyGlo 2018 Annual Report", fileUrl: "/reports/2018_Annual_Report.pdf" },
    { title: "RecyGlo 2017 Annual Report", fileUrl: "/reports/2017_Annual_Report.pdf" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-90"
          style={{
            backgroundImage: `url(${aboutHero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800">
                Making the World a Cleaner Place
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                RecyGlo Resources & Knowledge Hub
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Tailored waste management strategies to help businesses reduce, reuse, and recycle efficiently.
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

      {/* 2. MAIN RESOURCES LISTS */}
      <section className="py-16">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
           
           {/* Breadcrumb */}
           <div className="mb-8 text-sm font-medium text-gray-500 flex items-center gap-2">
             <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
             <ChevronRight size={14} className="text-gray-300" />
             <span className="text-gray-900 font-bold">Resources</span>
           </div>

           {/* Page Title */}
           <h2 className="text-4xl font-bold text-[#1B5E20] mb-12">Resources</h2>

           {/* Case Studies Section */}
           <div className="mb-20">
              <h3 className="text-2xl font-bold text-[#1C3B2B] mb-6">Case studies and Research Papers</h3>
              <div className="flex flex-col border-t border-gray-200">
                 {caseStudies.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 transition-colors rounded-lg"
                    >
                       <span className="text-[15px] text-gray-700 pr-4">{item.title}</span>
                       
                       {/* AUTOMATIC DOWNLOAD BUTTON */}
                       <a 
                         href={item.fileUrl} 
                         download
                         className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900 hover:text-[#E2552B] transition-colors shrink-0 bg-white sm:bg-transparent border sm:border-transparent border-gray-200 py-2 sm:py-0 px-4 sm:px-0 rounded-md"
                       >
                          <Download size={16} strokeWidth={2.5} />
                          Download
                       </a>
                    </div>
                 ))}
              </div>
           </div>

           {/* Annual Reports Section */}
           <div className="mb-12">
              <h3 className="text-2xl font-bold text-[#1C3B2B] mb-6">Annual Reports</h3>
              <div className="flex flex-col border-t border-gray-200">
                 {annualReports.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 transition-colors rounded-lg"
                    >
                       <span className="text-[15px] text-gray-700 pr-4">{item.title}</span>
                       
                       {/* AUTOMATIC DOWNLOAD BUTTON */}
                       <a 
                         href={item.fileUrl} 
                         download
                         className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900 hover:text-[#E2552B] transition-colors shrink-0 bg-white sm:bg-transparent border sm:border-transparent border-gray-200 py-2 sm:py-0 px-4 sm:px-0 rounded-md"
                       >
                          <Download size={16} strokeWidth={2.5} />
                          Download
                       </a>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}