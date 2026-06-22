import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, ChevronRight, Play, Eye, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path if needed

export default function Resources() {
  const [, setLocation] = useLocation();

  // --- LIVE DATABASE STATE ---
  const [pageData, setPageData] = useState({
    heroData: { subtitle: "", title: "", description: "", imagePreview: "" },
    caseStudies: [] as any[],
    annualReports: [] as any[]
  });

  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: State to track which file is currently being previewed
  const [previewFile, setPreviewFile] = useState<{ url: string, title: string } | null>(null);

  // --- FETCH LIVE DATA FROM FIREBASE ---
  useEffect(() => {
    const docRef = doc(db, "website_content", "resources_page");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData({
          heroData: data.heroData || { subtitle: "", title: "", description: "", imagePreview: "" },
          caseStudies: data.caseStudies || [],
          annualReports: data.annualReports || []
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">Loading resources...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-90 bg-black/40"
          style={pageData.heroData.imagePreview ? {
            backgroundImage: `url(${pageData.heroData.imagePreview})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800">
               {pageData.heroData.subtitle}
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
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

      {/* 2. MAIN RESOURCES LISTS */}
      <section className="py-16">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
           
           {/* Breadcrumb */}
           <div className="mb-8 text-sm font-medium text-gray-500 flex items-center gap-2">
             <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
             <ChevronRight size={14} className="text-gray-300" />
             <span className="text-gray-900 font-bold">Resources</span>
           </div>

           <h2 className="text-4xl font-bold text-[#1B5E20] mb-12">Resources</h2>

           {/* Case Studies Section */}
           {pageData.caseStudies.length > 0 && (
             <div className="mb-20">
                <h3 className="text-2xl font-bold text-[#1C3B2B] mb-6">Case studies and Research Papers</h3>
                <div className="flex flex-col border-t border-gray-200">
                   {pageData.caseStudies.map((item: any, idx: number) => (
                      <div 
                        key={item.id || idx} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 transition-colors rounded-lg"
                      >
                         <span className="text-[15px] font-medium text-gray-800 pr-4">{item.title}</span>
                         
                         <div className="flex flex-wrap items-center gap-3 shrink-0">
                           {item.fileUrl ? (
                             <>
                               {/* NEW PREVIEW BUTTON */}
                               <button 
                                 onClick={() => setPreviewFile({ url: item.fileUrl, title: item.title })}
                                 className="flex items-center justify-center gap-2 text-sm font-bold text-[#1B5E20] hover:text-[#2A4B38] transition-colors bg-white sm:bg-transparent border sm:border-transparent border-gray-200 py-2 sm:py-0 px-4 sm:px-0 rounded-md"
                               >
                                  <Eye size={16} strokeWidth={2.5} />
                                  Preview
                               </button>

                               {/* DOWNLOAD BUTTON */}
                               <a 
                                 href={item.fileUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 download
                                 className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900 hover:text-[#E2552B] transition-colors bg-white sm:bg-transparent border sm:border-transparent border-gray-200 py-2 sm:py-0 px-4 sm:px-0 rounded-md"
                               >
                                  <Download size={16} strokeWidth={2.5} />
                                  Download
                               </a>
                             </>
                           ) : (
                             <span className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded">Missing PDF</span>
                           )}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* Annual Reports Section */}
           {pageData.annualReports.length > 0 && (
             <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#1C3B2B] mb-6">Annual Reports</h3>
                <div className="flex flex-col border-t border-gray-200">
                   {pageData.annualReports.map((item: any, idx: number) => (
                      <div 
                        key={item.id || idx} 
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 transition-colors rounded-lg"
                      >
                         <span className="text-[15px] font-medium text-gray-800 pr-4">{item.title}</span>
                         
                         <div className="flex flex-wrap items-center gap-3 shrink-0">
                           {item.fileUrl ? (
                             <>
                               {/* NEW PREVIEW BUTTON */}
                               <button 
                                 onClick={() => setPreviewFile({ url: item.fileUrl, title: item.title })}
                                 className="flex items-center justify-center gap-2 text-sm font-bold text-[#1B5E20] hover:text-[#2A4B38] transition-colors bg-white sm:bg-transparent border sm:border-transparent border-gray-200 py-2 sm:py-0 px-4 sm:px-0 rounded-md"
                               >
                                  <Eye size={16} strokeWidth={2.5} />
                                  Preview
                               </button>

                               {/* DOWNLOAD BUTTON */}
                               <a 
                                 href={item.fileUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 download
                                 className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900 hover:text-[#E2552B] transition-colors bg-white sm:bg-transparent border sm:border-transparent border-gray-200 py-2 sm:py-0 px-4 sm:px-0 rounded-md"
                               >
                                  <Download size={16} strokeWidth={2.5} />
                                  Download
                               </a>
                             </>
                           ) : (
                             <span className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded">Missing PDF</span>
                           )}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

        </div>
      </section>

      {/* 3. PDF PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 shrink-0">
              <h3 className="font-bold text-gray-900 truncate pr-4 text-lg">{previewFile.title}</h3>
              <div className="flex items-center gap-2">
                <a 
                  href={previewFile.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-white bg-[#1B5E20] hover:bg-[#2A4B38] px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={16} /> Download
                </a>
                <button 
                  onClick={() => setPreviewFile(null)} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body - PDF iFrame */}
            <div className="flex-1 bg-gray-200 relative">
              <iframe 
                src={previewFile.url} 
                className="absolute inset-0 w-full h-full border-0" 
                title="PDF Preview" 
              />
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}