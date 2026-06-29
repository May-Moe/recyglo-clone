import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, ChevronRight, Play, X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export default function Resources() {
  const [, setLocation] = useLocation();

  // --- LIVE DATABASE STATE ---
  const [pageData, setPageData] = useState({
    heroData: { subtitle: "", title: "", description: "", imagePreview: "" },
    caseStudies: [] as any[],
    annualReports: [] as any[]
  });

  const [isLoading, setIsLoading] = useState(true);
  
  // State to track which file is currently being previewed
  const [previewFile, setPreviewFile] = useState<{ url: string, title: string } | null>(null);
  
  // State to track if a download is in progress (for the loading spinner)
  const [isDownloading, setIsDownloading] = useState(false);

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

  // --- FORCE DOWNLOAD LOGIC ---
  // This physically fetches the file so the browser is forced to download it
  // instead of just opening it in a new tab.
  const handleForceDownload = async (url: string, title: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      
      // Clean up the title to make a nice filename
      const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${safeTitle}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download fetch failed, falling back to new tab:', error);
      // Fallback: If fetch fails (e.g. CORS issues), open it normally
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

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
     
     {/* Subtitle - Matched to Home: text-lg md:text-xl font-semibold */}
     <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800 leading-snug">
        {pageData.heroData.subtitle}
     </h2>
     
     {/* Title - Matched to Home: text-3xl md:text-4xl lg:text-5xl font-extrabold */}
     <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 text-[#1B5E20] leading-tight tracking-tight">
        {pageData.heroData.title}
     </h1>
     
     {/* Description - Matched to Home: text-base md:text-lg font-light */}
     <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed font-light">
        {pageData.heroData.description}
     </p>

     {/* Buttons - Matched to Home (added hover:scale-105 and adjusted padding) */}
     <div className="flex flex-col sm:flex-row gap-4 transition-all duration-700">
        <Button 
          onClick={() => {
            setLocation('/carbon-calculator');
            window.scrollTo(0, 0);
          }}
          className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
          Calculate Carbon Footprint
        </Button>
        
        {/* Note: I updated this link to '/services' to match your recent route changes! */}
        <Button 
          className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-10 py-6 rounded-md shadow-md flex items-center justify-center transition-all hover:scale-105"
          onClick={() => setLocation('/services')}
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
                        className="border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 transition-colors rounded-lg"
                      >
                        {item.fileUrl ? (
                          <button 
                            onClick={() => setPreviewFile({ url: item.fileUrl, title: item.title })}
                            className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                          >
                            <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#E2552B] transition-colors">
                              {item.title}
                            </span>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#E2552B] transition-colors shrink-0" />
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-4 py-5">
                            <span className="text-[15px] font-medium text-gray-500">{item.title}</span>
                            <span className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded shrink-0">Missing PDF</span>
                          </div>
                        )}
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
                        className="border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 transition-colors rounded-lg"
                      >
                        {item.fileUrl ? (
                          <button 
                            onClick={() => setPreviewFile({ url: item.fileUrl, title: item.title })}
                            className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                          >
                            <span className="text-[15px] font-medium text-gray-800 group-hover:text-[#E2552B] transition-colors">
                              {item.title}
                            </span>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#E2552B] transition-colors shrink-0" />
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-4 py-5">
                            <span className="text-[15px] font-medium text-gray-500">{item.title}</span>
                            <span className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded shrink-0">Missing PDF</span>
                          </div>
                        )}
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
                
                {/* FORCED DOWNLOAD BUTTON */}
                <button 
                  onClick={() => handleForceDownload(previewFile.url, previewFile.title)}
                  disabled={isDownloading}
                  className="flex items-center gap-2 text-sm font-bold text-white bg-[#1B5E20] hover:bg-[#2A4B38] px-4 py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                  {isDownloading ? 'Downloading...' : 'Download File'}
                </button>

                <button 
                  onClick={() => setPreviewFile(null)} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors ml-2"
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