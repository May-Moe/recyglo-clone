import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Layout, Briefcase, Video, Factory, MonitorSmartphone, Plus, Trash2, Edit, X, Loader2, UploadCloud, Image as ImageIcon, GripVertical, List, Type } from "lucide-react";
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; 

// --- ASSET IMPORTS FROM YOUR ORIGINAL PAGE ---
import heroBg from '@/assets/images/about-hero.jpg'; 
import service1 from '@/assets/images/w1.webp';
import service2 from '@/assets/images/w2.webp';
import service3 from '@/assets/images/w3.webp';
import service4 from '@/assets/images/w4.webp';
import service5 from '@/assets/images/w5.webp';
import service6 from '@/assets/images/w6.webp';

export default function AdminSolutions() {
  const [activeTab, setActiveTab] = useState('services');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. STATE FOR THE MAIN LANDING PAGE (Pre-loaded with defaults) ---
  const [pageData, setPageData] = useState({
    heroData: { 
      subtitle: "End-to-End Solutions for Businesses, Emissions, and Corporates in Asia-Pacific.", 
      title: "Services", 
      description: "At RecyGlo, our mission is to foster a more sustainable future through innovative waste, energy, and carbon management and ESG data analytics solutions. We are dedicated to assisting businesses in minimizing their environmental footprint and reaching their sustainability objectives.", 
      imagePreview: heroBg 
    },
    videoUrl: "https://www.youtube.com/embed/-eNZ-Tm7Yj0?si=4xnXJNbNLJy9Z3M_",
    industrySolutions: [
      { id: 'ind-1', title: 'Manufacturing', desc: 'In the manufacturing sector, production process management can lead to a massive waste reduction. To be precise, reducing the waste at the source through recycling, and sustainable sourcing can be one of the many solutions. The first solution is waste reduction in the supply chain process attainable when businesses implement lean manufacturing techniques in their system. For cases when waste cannot be reduced, recycling the used material serves as a great alternative solution.' },
      { id: 'ind-2', title: 'Retail', desc: 'The global retail sector produces 2.12 billion tons of waste yearly significantly contributing to land degradation, water pollution, and disruption of the eco-system. The improvement of supply chain sustainability and the implementation of an efficient recycling system are the best solutions to minimize the environmental impact of this industry.' },
      { id: 'ind-3', title: 'Healthcare', desc: 'Waste produced in the healthcare field can be toxic and filled with radioactive components. Medical equipment such as needles and syringes which are used over 16 billion times a year needs to be discarded properly.' },
      { id: 'ind-4', title: 'Education', desc: 'The education sector has a significant potential to accelerate proper waste management by promoting sustainability initiatives and reduction of waste in educational institutions. Perhaps the most impactful solution would be to conduct awareness campaigns by educating students and the staff.' }
    ] as any[],
    techSolutions: [
      { id: 'tech-1', title: 'Sustainability Platform', desc: "At RecyGlo, we offer technology-driven solutions to help you on your sustainability journey. Here's how we can assist: by providing a centralized dashboard that tracks your real-time carbon emissions, waste generation, and energy consumption across all your facilities." },
      { id: 'tech-2', title: 'Services', desc: 'We streamline your sustainability management with dependable tools and services to help you achieve your objectives. At RecyGlo we offer a comprehensive range of additional services to support your sustainability efforts, including: • Standard Reporting Service • Annual report • Energy Auditing • Sustainability report' }
    ] as any[]
  });

  // --- 2. STATE FOR DYNAMIC SERVICE PAGES (Collection) ---
  const [services, setServices] = useState<any[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null); 

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "website_content", "solutions_page");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
          const data = docSnap.data();
          setPageData(prev => ({ 
            heroData: data.heroData || prev.heroData,
            videoUrl: data.videoUrl || prev.videoUrl,
            industrySolutions: data.industrySolutions?.length > 0 ? data.industrySolutions : prev.industrySolutions,
            techSolutions: data.techSolutions?.length > 0 ? data.techSolutions : prev.techSolutions
          }));
        }

        const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
          const loadedServices: any[] = [];
          snapshot.forEach((doc) => loadedServices.push({ id: doc.id, ...doc.data() }));
          setServices(loadedServices);
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching solutions data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- SAVE STATIC PAGE DATA ---
  const handleSavePageData = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "website_content", "solutions_page"), pageData, { merge: true });
      alert("Solutions Landing Page updated successfully!");
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- MAGIC MIGRATION BUTTON WITH HERO SECTION DATA & FULL BLOCKS ---
  const migrateDefaultServices = async () => {
    setIsSaving(true);
    const defaultServices = [
      { 
        title: 'Reporting and Compliance', 
        slug: 'reporting', 
        imagePreview: service3, 
        desc: 'Navigate complex environmental regulations easily. We deliver audit-ready sustainability reports and streamline ESG reporting.', 
        heroSubtitle: 'END-TO-END SOLUTIONS FOR BUSINESSES',
        heroTitle: 'Reporting and Compliance',
        heroDescription: 'Navigate complex environmental regulations easily. We deliver audit-ready sustainability reports and streamline ESG reporting, ensuring complete data transparency across your organization.',
        heroImage: '',
        contentBlocks: [
          { id: 'b1', type: 'image', title: 'ESG REPORT', text: '', imagePreview: '' },
          { id: 'b2', type: 'text', title: 'ESG Reporting', text: "ESG reporting is the disclosure of a company's environmental, social, and corporate governance data..." },
          { id: 'b3', type: 'list', title: 'Benefits of ESG Reporting', text: 'Credibility and reputation\nAttracts equity investors\nLeading to sustainable future for your business' }
        ] 
      },
      { 
        title: 'Consulting and Training', 
        slug: 'consulting', 
        imagePreview: service4, 
        desc: 'Expert sustainability consulting and training services to help B2B organizations implement robust ESG strategies.', 
        heroSubtitle: 'MAKING THE WORLD A CLEANER PLACE',
        heroTitle: 'Consulting and Training',
        heroDescription: 'Expert sustainability consulting and training services to help B2B organizations implement robust ESG strategies, optimize waste management, and achieve compliance with global standards.',
        heroImage: '',
        contentBlocks: [
          { id: 'b1', type: 'text', title: 'Sustainable Waste Management Training', text: 'Transform your business\'s sustainability vision with RecyGlo\'s Expert Training Programs.' },
          { id: 'b2', type: 'list', title: 'Package A', text: 'Environmental system audit and advice\nCertificate by RecyGlo\nDuration: 2 Hours\nPrice: 15,000 THB' },
        ] 
      },
      { 
        title: 'ESG Data Analytics', 
        slug: 'esg-data-analytics', 
        imagePreview: service5, 
        desc: 'Advanced ESG data analytics services to help businesses track and analyze Scope 1, 2, and 3 emissions.', 
        heroSubtitle: 'END-TO-END SOLUTIONS FOR BUSINESSES',
        heroTitle: 'ESG Data Analytics',
        heroDescription: 'Advanced ESG data analytics services to help businesses track and analyze Scope 1, 2, and 3 emissions. We transform raw environmental data into clear, actionable insights.',
        heroImage: '',
        contentBlocks: [
          { id: 'b1', type: 'image', title: 'ESG Data Analytical Platform', text: 'Data-Driven Decision-Making. At RecyGlo, we offer technology-driven solutions...', imagePreview: '' },
          { id: 'b2', type: 'list', title: 'Platform Features', text: 'Track Your Progress Accurately\nSet Realistic Milestones\nPromote Data Transparency' },
        ] 
      },
      { 
        title: 'Waste Auditing', 
        slug: 'waste-auditing', 
        imagePreview: service2, 
        desc: 'We provide comprehensive waste auditing services to help B2B facilities optimize waste management practices.', 
        heroSubtitle: 'OPTIMIZE YOUR WASTE PRACTICES',
        heroTitle: 'Waste Auditing',
        heroDescription: 'We provide comprehensive waste auditing services to help B2B facilities optimize waste management practices, identify cost reduction opportunities, and achieve Zero-Waste-to-Landfill goals safely.',
        heroImage: '',
        contentBlocks: [
          { id: 'b1', type: 'text', title: 'In-Depth Waste Audits', text: 'Our experts conduct thorough on-site audits to analyze your current waste streams.' },
        ] 
      },
      { 
        title: 'Waste Management Solutions', 
        slug: 'waste-management', 
        imagePreview: service1, 
        desc: 'RecyGlo offers comprehensive B2B waste management solutions, specializing in general, hazardous, and e-waste disposal.', 
        heroSubtitle: 'RELIABLE COLLECTION SERVICES',
        heroTitle: 'Waste Management Solutions',
        heroDescription: 'RecyGlo offers comprehensive B2B waste management solutions, specializing in general, hazardous, and e-waste disposal. Our approach guarantees environmental compliance and operational efficiency.',
        heroImage: '',
        contentBlocks: [
          { id: 'b1', type: 'text', title: 'Comprehensive Waste Collection', text: 'We provide end-to-end waste collection and processing tailored to your facility’s needs.' },
        ] 
      },
      { 
        title: 'Circular Economy', 
        slug: 'circular-economy', 
        imagePreview: service6, 
        desc: 'RecyGlo promotes the transition from linear to circular models by helping businesses recover, recycle, and repurpose materials.', 
        heroSubtitle: 'WORKING FOR A CLEANER WORLD',
        heroTitle: 'Circular Economy',
        heroDescription: 'RecyGlo promotes the transition from linear to circular models by helping businesses recover, recycle, and repurpose materials. We guide organizations in closing the loop, minimizing waste, and creating sustainable value chains.',
        heroImage: '',
        contentBlocks: [
          { id: 'b1', type: 'text', title: 'Waste Material Types', text: 'At RecyGlo, we specialize in handling a wide variety of waste streams...' },
        ] 
      }
    ];

    try {
      for (const service of defaultServices) {
        await addDoc(collection(db, "services"), service);
      }
      alert("Original 6 services migrated successfully!");
    } catch (error) {
      console.error("Error migrating services:", error);
      alert("Failed to migrate services.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- SAVE DYNAMIC SERVICE PAGE ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // ✅ FIX: Keep the old slug if it exists, only generate a new one if it's a brand new page
      const slug = editingService.slug || editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const serviceDataToSave = { ...editingService, slug };

      if (editingService.id) {
        await updateDoc(doc(db, "services", editingService.id), serviceDataToSave);
      } else {
        await addDoc(collection(db, "services"), serviceDataToSave);
      }
      setIsServiceModalOpen(false);
    } catch (error) {
// ... rest of the code
      console.error("Error saving service: ", error);
      alert("Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entire service page? This cannot be undone.")) {
      await deleteDoc(doc(db, "services", id));
    }
  };

  // --- HANDLERS FOR INDUSTRY & TECH LISTS ---
  const addIndustry = () => setPageData(prev => ({...prev, industrySolutions: [...prev.industrySolutions, { id: `ind-${Date.now()}`, title: "", desc: "" }]}));
  const removeIndustry = (id: string) => setPageData(prev => ({...prev, industrySolutions: prev.industrySolutions.filter((i:any) => i.id !== id)}));
  const updateIndustry = (id: string, field: string, value: string) => setPageData(prev => ({...prev, industrySolutions: prev.industrySolutions.map((i:any) => i.id === id ? { ...i, [field]: value } : i)}));

  const addTech = () => setPageData(prev => ({...prev, techSolutions: [...prev.techSolutions, { id: `tech-${Date.now()}`, title: "", desc: "" }]}));
  const removeTech = (id: string) => setPageData(prev => ({...prev, techSolutions: prev.techSolutions.filter((t:any) => t.id !== id)}));
  const updateTech = (id: string, field: string, value: string) => setPageData(prev => ({...prev, techSolutions: prev.techSolutions.map((t:any) => t.id === id ? { ...t, [field]: value } : t)}));

  // --- HANDLERS FOR MODULAR CONTENT BLOCKS INSIDE THE MODAL ---
  const addContentBlock = (type: 'text' | 'image' | 'video' | 'list') => {
    const newBlock = { id: `block-${Date.now()}`, type, title: "", text: "", imagePreview: "", videoUrl: "" };
    setEditingService((prev: any) => ({ ...prev, contentBlocks: [...(prev.contentBlocks || []), newBlock] }));
  };

  const removeContentBlock = (blockId: string) => {
    setEditingService((prev: any) => ({
      ...prev, contentBlocks: prev.contentBlocks.filter((b: any) => b.id !== blockId)
    }));
  };

  const updateContentBlock = (blockId: string, field: string, value: string) => {
    setEditingService((prev: any) => ({
      ...prev, contentBlocks: prev.contentBlocks.map((b: any) => b.id === blockId ? { ...b, [field]: value } : b)
    }));
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20] w-8 h-8" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Solutions & Services</h1>
          <p className="text-gray-500 text-sm">Add new service pages and edit the main Solutions landing page.</p>
        </div>
        <Button onClick={handleSavePageData} disabled={isSaving} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2 px-6">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />} Save Landing Page
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: Tab Navigation (ALL 5 TABS ARE HERE) */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <TabButton id="services" label="Service Pages" icon={<Briefcase size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="hero" label="Main Hero Banner" icon={<Layout size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="video" label="Product Video" icon={<Video size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="industry" label="Industry Solutions" icon={<Factory size={18} />} activeTab={activeTab} onClick={setActiveTab} />
          <TabButton id="tech" label="Tech Solutions" icon={<MonitorSmartphone size={18} />} activeTab={activeTab} onClick={setActiveTab} />
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          
          {/* TAB 1: DYNAMIC SERVICE PAGES */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Manage Service Pages</h2>
                  <p className="text-sm text-gray-500 mt-1">Create new services. These automatically generate new URLs.</p>
                </div>
                <Button onClick={() => { 
                    setEditingService({ 
                      title: "", desc: "", imagePreview: "", 
                      heroSubtitle: "Our Solution", heroTitle: "", heroDescription: "", heroImage: "", 
                      contentBlocks: [] 
                    }); 
                    setIsServiceModalOpen(true); 
                  }} 
                  className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white"
                >
                  <Plus size={16} className="mr-2" /> Create New Page
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-xl border-gray-200 bg-gray-50">
                    <p className="text-gray-500 mb-4">No services found in the database.</p>
                    <Button onClick={migrateDefaultServices} disabled={isSaving} className="bg-[#1B5E20] text-white hover:bg-[#2A4B38]">
                      {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Briefcase size={16} className="mr-2" />}
                      Migrate Original 6 Services
                    </Button>
                  </div>
                )}
                
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {service.imagePreview ? <img src={service.imagePreview} className="w-full h-full object-cover" /> : <Briefcase className="w-full h-full p-4 text-gray-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-500 font-mono">/solutions/{service.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }} variant="outline" size="sm" className="text-[#1B5E20]">
                        <Edit size={16} className="mr-2" /> Edit Page
                      </Button>
                      <Button onClick={() => handleDeleteService(service.id)} variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MAIN HERO BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Main Landing Hero Banner</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Background Image</label>
                  <ImageUploader folder="solutions-page" preview={pageData.heroData?.imagePreview} onUploadSuccess={(url: string) => setPageData({...pageData, heroData: {...pageData.heroData, imagePreview: url}})} />
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Small Subtitle</label>
                    <input type="text" value={pageData.heroData?.subtitle} onChange={(e) => setPageData({...pageData, heroData: {...pageData.heroData, subtitle: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input type="text" value={pageData.heroData?.title} onChange={(e) => setPageData({...pageData, heroData: {...pageData.heroData, title: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={4} value={pageData.heroData?.description} onChange={(e) => setPageData({...pageData, heroData: {...pageData.heroData, description: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIDEO */}
          {activeTab === 'video' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Our Products Video</h2>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">YouTube Embed URL</label>
                <input type="text" value={pageData.videoUrl} onChange={(e) => setPageData({...pageData, videoUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="https://www.youtube.com/embed/..." />
              </div>
              {pageData.videoUrl && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden mt-4 border-4 border-gray-100">
                  <iframe className="w-full h-full" src={pageData.videoUrl} frameBorder="0" allowFullScreen></iframe>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INDUSTRY SOLUTIONS */}
          {activeTab === 'industry' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Industry-Specific Solutions</h2>
                <Button onClick={addIndustry} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Industry</Button>
              </div>
              <div className="space-y-4">
                {pageData.industrySolutions?.map((item: any, idx: number) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                    <button onClick={() => removeIndustry(item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    <input type="text" value={item.title} onChange={(e) => updateIndustry(item.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold mb-2 focus:outline-none focus:border-[#1B5E20]" placeholder="Industry Name (e.g. Retail)" />
                    <textarea rows={4} value={item.desc} onChange={(e) => updateIndustry(item.id, 'desc', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Description..." />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TECH SOLUTIONS */}
          {activeTab === 'tech' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Technology Solutions</h2>
                <Button onClick={addTech} variant="outline" className="text-[#1B5E20] border-[#1B5E20] hover:bg-[#1B5E20]/10"><Plus size={16} className="mr-2" /> Add Tech Solution</Button>
              </div>
              <div className="space-y-4">
                {pageData.techSolutions?.map((item: any, idx: number) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                    <button onClick={() => removeTech(item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    <input type="text" value={item.title} onChange={(e) => updateTech(item.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold mb-2 focus:outline-none focus:border-[#1B5E20]" placeholder="Solution Name (e.g. Dashboard)" />
                    <textarea rows={4} value={item.desc} onChange={(e) => updateTech(item.id, 'desc', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1B5E20]" placeholder="Description..." />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- MODULAR SERVICE PAGE EDITOR MODAL --- */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editingService.id ? 'Edit Service Page' : 'Create New Service Page'}</h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 flex-1 bg-gray-50/50 custom-scrollbar">
              
              {/* SECTION 1: MENU CARD SETTINGS */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <h3 className="font-bold text-lg text-[#1B5E20] border-b pb-2">1. Menu Card Settings</h3>
                  <p className="text-xs text-gray-500 mt-1">This controls how the service looks on the main Solutions grid.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Square Card Image</label>
                  <ImageUploader folder="service-covers" preview={editingService.imagePreview} onUploadSuccess={(url: string) => setEditingService({...editingService, imagePreview: url})} />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Service Title</label>
                    <input type="text" value={editingService.title} onChange={(e) => setEditingService({...editingService, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold text-lg" placeholder="e.g. Consulting & Training" required />
                    <p className="text-xs text-gray-400 mt-1">URL will be: /solutions/{editingService.title ? editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '...'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Short Summary</label>
                    <textarea rows={3} value={editingService.desc} onChange={(e) => setEditingService({...editingService, desc: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="A brief summary shown on the main solutions landing page." />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PAGE HERO SETTINGS */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <h3 className="font-bold text-lg text-[#1B5E20] border-b pb-2">2. Page Hero Section</h3>
                  <p className="text-xs text-gray-500 mt-1">This controls the big banner at the very top of the specific service page.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Wide Hero Image</label>
                  <ImageUploader folder="service-heroes" preview={editingService.heroImage} onUploadSuccess={(url: string) => setEditingService({...editingService, heroImage: url})} />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Hero Subtitle</label>
                      <input type="text" value={editingService.heroSubtitle} onChange={(e) => setEditingService({...editingService, heroSubtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="e.g. Our Solution" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Hero Title</label>
                      <input type="text" value={editingService.heroTitle} onChange={(e) => setEditingService({...editingService, heroTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hero Description</label>
                    <textarea rows={3} value={editingService.heroDescription} onChange={(e) => setEditingService({...editingService, heroDescription: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20]" placeholder="The long text paragraph over the hero image." />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MODULAR PAGE BUILDER */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1B5E20]">3. Modular Page Builder</h3>
                    <p className="text-xs text-gray-500">Add text, images, videos, or lists for the main content body.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => addContentBlock('text')} size="sm" variant="outline"><Type size={14} className="mr-1"/> Text</Button>
                    <Button onClick={() => addContentBlock('image')} size="sm" variant="outline"><ImageIcon size={14} className="mr-1"/> Image</Button>
                    <Button onClick={() => addContentBlock('video')} size="sm" variant="outline"><Video size={14} className="mr-1"/> Video</Button>
                    <Button onClick={() => addContentBlock('list')} size="sm" variant="outline"><List size={14} className="mr-1"/> List</Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {(!editingService.contentBlocks || editingService.contentBlocks.length === 0) && (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">Page is empty. Click a button above to add a block.</div>
                  )}

                  {editingService.contentBlocks?.map((block: any, index: number) => (
                    <div key={block.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                        <span className="font-bold text-gray-500 flex items-center gap-2 uppercase text-xs tracking-wider">
                          <GripVertical size={14}/> {block.type} Block
                        </span>
                        <button type="button" onClick={() => removeContentBlock(block.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                      
                      {/* DYNAMIC RENDER BASED ON BLOCK TYPE */}
                      {block.type === 'text' && (
                        <div className="space-y-3">
                          <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="Optional Heading..." />
                          <textarea rows={4} value={block.text} onChange={(e) => updateContentBlock(block.id, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none" placeholder="Write paragraph text here..." />
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-1"><ImageUploader folder="service-blocks" preview={block.imagePreview} small onUploadSuccess={(url: string) => updateContentBlock(block.id, 'imagePreview', url)} /></div>
                          <div className="md:col-span-3 space-y-3">
                            <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="Image Title (Optional)..." />
                            <textarea rows={2} value={block.text} onChange={(e) => updateContentBlock(block.id, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none" placeholder="Image Caption/Description..." />
                          </div>
                        </div>
                      )}

                      {block.type === 'video' && (
                        <div className="space-y-3">
                          <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="Video Title..." />
                          <input type="text" value={block.videoUrl} onChange={(e) => updateContentBlock(block.id, 'videoUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none text-[#E2552B]" placeholder="YouTube Embed URL (https://youtube.com/embed/...)" />
                        </div>
                      )}

                      {block.type === 'list' && (
                        <div className="space-y-3">
                          <input type="text" value={block.title} onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-bold focus:outline-none" placeholder="List Title (e.g. Package A)..." />
                          <textarea rows={5} value={block.text} onChange={(e) => updateContentBlock(block.id, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none" placeholder="Type bullet points here. Put each point on a new line." />
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
              <Button type="button" variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveService} disabled={isSaving || !editingService.title} className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white">
                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                {editingService.id ? 'Save Changes' : 'Publish Page'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---
function TabButton({ id, label, icon, activeTab, onClick }: any) {
  const isActive = activeTab === id;
  return (
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${isActive ? 'bg-[#1B5E20] text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}>
      <span className={isActive ? 'text-[#76FF03]' : 'text-gray-400'}>{icon}</span>
      {label}
    </button>
  );
}

function ImageUploader({ preview, small, onUploadSuccess, folder = "misc" }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center relative overflow-hidden group/upload cursor-pointer hover:border-[#1B5E20] transition-colors rounded-xl h-full w-full ${small ? 'min-h-[100px]' : 'min-h-[160px]'}`}>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {isUploading ? <Loader2 className="animate-spin text-[#1B5E20]" size={24} /> : preview ? (
        <><img src={preview} className="w-full h-full object-cover opacity-80 group-hover/upload:opacity-40 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity"><UploadCloud className="text-[#1B5E20]" size={24} /></div></>
      ) : <UploadCloud className="text-gray-400" size={small ? 24 : 32} />}
    </div>
  );
}